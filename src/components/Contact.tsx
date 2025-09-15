'use client';
import { useState } from 'react';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, msg, website }),
      });
      const result = await res.json();
      setStatus(result.status || (res.ok ? 'Message sent!' : 'Something went wrong.'));
      if (res.ok) {
        setEmail('');
        setMsg('');
        setWebsite('');
      }
    } catch {
      setStatus('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form id="contact" onSubmit={handleSubmit} className="rounded-2xl border p-4">
      <h4 className="font-semibold mb-2">Contact</h4>

      {/* Honeypot: keep hidden from humans; bots often fill it */}
      <div className="hidden" aria-hidden>
        <label>
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <input
        required
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="w-full border rounded-xl px-3 py-2 mb-2"
      />
      <textarea
        required
        value={msg}
        onChange={e => setMsg(e.target.value)}
        placeholder="Say hi…"
        className="w-full border rounded-xl px-3 py-2 mb-2"
        rows={4}
      />
      <button
        className="px-4 py-2 rounded-xl border disabled:opacity-60"
        disabled={sending}
      >
        {sending ? 'Sending…' : 'Send'}
      </button>
      {status && <p className="text-sm mt-2">{status}</p>}
    </form>
  );
}
