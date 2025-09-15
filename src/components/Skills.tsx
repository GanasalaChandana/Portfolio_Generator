'use client';
import { SkillBucket } from '@/types/portfolio';

export default function Skills({ buckets }: { buckets: SkillBucket[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {buckets.map((bucket, i) => (
        <div key={i} className="rounded-2xl border p-4">
          <h4 className="font-semibold mb-2">{bucket.group}</h4>
          <div className="flex flex-wrap gap-2">
            {bucket.items.map((item, j) => (
              <span key={j} className="px-2 py-1 text-xs rounded-full border">
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}