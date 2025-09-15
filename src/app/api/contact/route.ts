import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Ensure this runs in a Node runtime (Resend needs Node APIs)
export const runtime = 'nodejs';

// ENV you should set in Vercel dashboard
// RESEND_API_KEY = ****
// CONTACT_TO_EMAIL = your@email.com
// CONTACT_FROM_EMAIL = contact@yourdomain.com (a verified domain in Resend)
const resend = new Resend(process.env.RESEND_API_KEY);

type ContactPayload = {
  email: string;
  msg: string;
  // honeypot field to catch bots (should be empty)
  website?: string;
};

function isValidEmail(email: string) {
  // Basic but OK; keep server-side
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

function cleanseText(s: string, max = 5000) {
  // Trim, limit length, and very basic strip of control chars
  return String(s ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .slice(0, max)
    .trim();
}

// Very small rate-limit (IP based) without external deps.
// For higher traffic, use Upstash Ratelimit.
const WINDOW_MS = 60_000;
const MAX_REQS = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (rec.count >= MAX_REQS) return false;
  rec.count += 1;
  return true;
}

export async function POST(req: Request) {
  try {
    // Simple same-origin check (helps if someone tries to post from other sites)
    const origin = req.headers.get('origin') || '';
    const host = req.headers.get('host') || '';
    if (origin && !origin.includes(host)) {
      return NextResponse.json(
        { status: 'Forbidden: invalid origin' },
        { status: 403 }
      );
    }

    // Rate limit
    const ip =
      // Vercel / proxies
      (req.headers.get('x-forwarded-for')?.split(',')[0] ?? '') ||
      // Fallback (may be empty in serverless)
      'unknown';
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { status: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const body = (await req.json()) as ContactPayload;
    const email = cleanseText(body.email, 254);
    const msg = cleanseText(body.msg, 5000);
    const honeypot = cleanseText(body.website || '');

    // Honeypot caught → silently accept but do nothing
    if (honeypot) {
      return NextResponse.json({ status: 'Thanks! I’ll reply soon.' });
    }

    if (!email || !msg) {
      return NextResponse.json(
        { status: 'Please fill in all fields' },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { status: 'Please enter a valid email' },
        { status: 400 }
      );
    }

    const TO = process.env.CONTACT_TO_EMAIL;
    const FROM = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';
    if (!process.env.RESEND_API_KEY || !TO) {
      console.error('Missing env: RESEND_API_KEY or CONTACT_TO_EMAIL');
      return NextResponse.json(
        { status: 'Server not configured for email.' },
        { status: 500 }
      );
    }

    // Prefer a verified from domain in Resend (replace onboarding@resend.dev in production)
    const subject = `Portfolio contact from ${email}`;

    // Minimal safe HTML; your message is inserted as text via <pre>
    const html = `
      <h3>New Portfolio Contact</h3>
      <p><strong>From:</strong> ${email.replace(/</g, '&lt;')}</p>
      <p><strong>Message:</strong></p>
      <pre style="white-space:pre-wrap;font-family:system-ui,Segoe UI,Arial,sans-serif">${msg
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')}</pre>
      <hr>
      <p><em>Sent from your portfolio contact form</em></p>
    `;

    const text = `New Portfolio Contact

From: ${email}

Message:
${msg}
`;

    await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email, // so you can reply straight to the sender
      subject,
      html,
      text,
    });

    return NextResponse.json({ status: 'Thanks! I’ll reply soon.' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { status: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
