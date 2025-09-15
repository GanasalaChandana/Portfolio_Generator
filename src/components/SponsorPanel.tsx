'use client';
import { useState } from 'react';
import { TRAE_GRAPH } from '@/lib/trae';

export default function SponsorPanel({ 
  onRunTests, 
  onGenerate 
}: {
  onRunTests: () => Promise<void>;
  onGenerate: (opts: { useTrae: boolean; corespeed: boolean }) => Promise<void>;
}) {
  const [useTrae, setUseTrae] = useState(true);
  const [corespeed, setCorespeed] = useState(false);

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <h4 className="font-semibold">Sponsor Features</h4>
      
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={useTrae}
          onChange={e => setUseTrae(e.target.checked)}
        />
        <span>Use Trae workflow</span>
      </label>
      
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={corespeed}
          onChange={e => setCorespeed(e.target.checked)}
        />
        <span>CoreSpeed: Speed Boost</span>
      </label>
      
      <div className="flex gap-2">
        <button
          onClick={() => onGenerate({ useTrae, corespeed })}
          className="px-3 py-2 rounded-xl border"
        >
          Generate (with toggles)
        </button>
        <button onClick={onRunTests} className="px-3 py-2 rounded-xl border">
          Run Auto-Tests
        </button>
      </div>
      
      <div className="mt-3 text-sm text-gray-500">
        <p className="font-medium">Trae Graph</p>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {TRAE_GRAPH.nodes.map(node => (
            <div key={node.id} className="border rounded-xl p-2 text-center">
              {node.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}