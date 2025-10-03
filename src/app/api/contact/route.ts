// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ContactPayload = {
  email: string;
  msg: string;
  website?: string; // honeypot
};

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

function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

function cleanseText(s: string, max = 5000) {
  return String(s ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .slice(0, max)
    .trim();
}

export async function POST(req: Request) {
  try {
    // Basic same-origin check (relaxed enough for Vercel previews/subdomains)
    const origin = req.headers.get('origin') || '';
    const host = req.headers.get('host') || '';
    if (origin && host && !origin.includes(host)) {
      return NextResponse.json({ status: 'Forbidden: invalid origin' }, { status: 403 });
    }

    // Rate limit
    const ip =
      req.headers.get('x-real-ip') ||
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
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

    // Honeypot caught → silently succeed
    if (honeypot) {
      return NextResponse.json({ status: 'Thanks! I’ll reply soon.' });
    }

    if (!email || !msg) {
      return NextResponse.json({ status: 'Please fill in all fields' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ status: 'Please enter a valid email' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const TO = process.env.CONTACT_TO_EMAIL;
    const FROM =
      process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

    // If not configured, do not throw during build/import — just skip sending.
    if (!apiKey || !TO) {
      console.warn('Email disabled: missing RESEND_API_KEY or CONTACT_TO_EMAIL');
      return NextResponse.json({ status: 'Thanks! I’ll reply soon.', skipped: true });
    }

    const resend = new Resend(apiKey); // instantiate lazily (inside handler)

    const subject = `Portfolio contact from ${email}`;
    const safeMsg = msg.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const html = `
      <h3>New Portfolio Contact</h3>
      <p><strong>From:</strong> ${email.replace(/</g, '&lt;')}</p>
      <p><strong>Message:</strong></p>
      <pre style="white-space:pre-wrap;font-family:system-ui,Segoe UI,Arial,sans-serif">${safeMsg}</pre>
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
      replyTo: email,
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
