'use client';
export default function ProjectCard({ 
  title, 
  summary, 
  bullets, 
  image, 
  link 
}: {
  title: string;
  summary: string;
  bullets: string[];
  image: string;
  link?: string;
}) {
  return (
    <div className="rounded-2xl border p-5 hover:shadow-md transition">
      <div className="text-3xl">{image}</div>
      <h3 className="mt-2 font-semibold text-xl">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{summary}</p>
      <ul className="mt-2 list-disc list-inside text-sm space-y-1">
        {bullets.map((bullet, i) => (
          <li key={i}>{bullet}</li>
        ))}
      </ul>
      {link && (
        <a className="mt-3 inline-block underline" href={link} target="_blank">
          Demo
        </a>
      )}
    </div>
  );
}