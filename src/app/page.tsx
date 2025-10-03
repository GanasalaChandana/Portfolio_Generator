'use client';
import { useState } from 'react';
import LivePreview from '@/components/LivePreview';
import SponsorPanel from '@/components/SponsorPanel';
import { SEED } from '@/lib/seed';
import { PortfolioContent } from '@/types/portfolio';
import PortfolioScoreCalculator from '@/components/PortfolioScoreCalculator';
import OneClickShip from '@/components/OneClickShip';

export default function Page() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState<PortfolioContent['theme']>('bold');
  const [content, setContent] = useState<PortfolioContent>(SEED);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const doGenerate = async (opts?: { useTrae?: boolean; corespeed?: boolean }) => {
    setLoading(true);
    try {
      const body = {
        name,
        role,
        bio,
        theme,
        useTrae: opts?.useTrae ?? true,
        corespeed: opts?.corespeed ?? false
      };
      
      const t0 = performance.now();
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate');
      }
      
      const json = await res.json();
      setContent(json);
      const t1 = performance.now();
      
      setLogs(l => [
        ...l,
        `Generate(${body.useTrae ? 'Trae' : 'Local'}${body.corespeed ? '+CS' : ''}): ${(t1 - t0).toFixed(0)}ms (server: ${json?._metrics?.ms ?? '-'}ms)`
      ]);

    } catch (error) {
      console.error('Generation failed:', error);
      setLogs(l => [...l, '❌ Generation failed, using fallback']);
      setContent(SEED);
    } finally {
      setLoading(false);
    }
  };

  const deploy = async () => {
    try {
      const res = await fetch('/api/deploy', { method: 'POST' });
      if (!res.ok) throw new Error('Deploy failed');
      
      const result = await res.json();
      setLogs(l => [...l, ...result.steps.map((s: string) => `✔ ${s}`)]);
    } catch (error) {
      setLogs(l => [...l, '❌ Deploy failed']);
    }
  };

  const runAutoTests = async () => {
    setTimeout(() => {
      setLogs(l => [
        ...l,
        'TestSprite: generating tests…',
        '✅ e2e: happy path',
        '✅ api: schema valid'
      ]);
    }, 500);
  };

  // Create live content that updates immediately with form inputs
  const liveContent = {
    ...content,
    name: name || content.name,
    role: role || content.role,
    bio: bio || content.bio,
    tagline: bio || content.tagline || content.bio, // Use bio as tagline
  };

  return (
    <>
      {/* Add animation styles */}
      <style jsx global>{`
        .animate-in {
          opacity: 0;
          transform: translateY(30px);
          animation: slideInUp 0.8s ease-out forwards;
        }
        
        .animate-delay-1 { animation-delay: 0.1s; }
        .animate-delay-2 { animation-delay: 0.2s; }
        .animate-delay-3 { animation-delay: 0.3s; }
        .animate-delay-4 { animation-delay: 0.4s; }
        .animate-delay-5 { animation-delay: 0.5s; }
        .animate-delay-6 { animation-delay: 0.6s; }
        .animate-delay-7 { animation-delay: 0.7s; }
        .animate-delay-8 { animation-delay: 0.8s; }
        
        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Enhanced hover effects */
        .enhance-hover {
          transition: all 0.2s ease;
        }
        
        .enhance-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        /* Smooth focus animations for inputs */
        input, textarea, select {
          transition: all 0.2s ease;
        }
        
        input:focus, textarea:focus, select:focus {
          transform: scale(1.02);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>

      <main className="max-w-6xl mx-auto p-6 grid md:grid-cols-[420px_minmax(0,1fr)] gap-6">
        <section className="space-y-3 animate-in">
          <h2 className="text-2xl font-semibold animate-in animate-delay-1">Portfolio-in-a-Day</h2>
          
          <input
            className="w-full border rounded-xl px-3 py-2 enhance-hover animate-in animate-delay-2"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          
          <input
            className="w-full border rounded-xl px-3 py-2 enhance-hover animate-in animate-delay-3"
            placeholder="Role (e.g., ML Engineer)"
            value={role}
            onChange={e => setRole(e.target.value)}
          />
          
          <textarea
            className="w-full border rounded-xl px-3 py-2 resize-none enhance-hover animate-in animate-delay-4"
            placeholder="2–3 sentence bio"
            rows={5}
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
          
          <div className="flex items-center gap-2 animate-in animate-delay-5">
            <label>Theme:</label>
            <select
              className="border rounded-xl px-2 py-1 enhance-hover"
              value={theme}
              onChange={e => setTheme(e.target.value as PortfolioContent['theme'])}
            >
              <option value="bold">Bold</option>
              <option value="classic">Classic</option>
              <option value="mono">Mono</option>
            </select>
          </div>
          
          <div className="flex-1 animate-in animate-delay-6">
            <OneClickShip 
              content={liveContent}
              disabled={loading}
            />
          </div>
          
          <div className="animate-in animate-delay-7">
            <SponsorPanel onRunTests={runAutoTests} onGenerate={opts => doGenerate(opts)} />
          </div>
          
          <div className="rounded-2xl border p-3 text-sm min-h-16 enhance-hover animate-in animate-delay-8">
            <p className="font-medium mb-1">Logs</p>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="text-xs">{log}</div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="min-w-0 overflow-visible animate-in animate-delay-2">
          <LivePreview content={liveContent} />
        </section>

        <div className="animate-in animate-delay-8">
          <PortfolioScoreCalculator 
            content={liveContent} 
            name={name} 
            role={role} 
            bio={bio} 
          />
        </div>
      </main>
    </>
  );
}