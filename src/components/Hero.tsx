'use client';

interface HeroProps {
  name: string;
  role: string;
  tagline?: string;
  bio?: string;
}

export default function Hero({ name, role, tagline, bio }: HeroProps) {
  // Use bio if provided, otherwise fall back to tagline
  const displayText = bio || tagline || '';
  
  return (
    <div className="relative rounded-2xl p-8 md:p-10 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 border overflow-visible">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{name}</h1>
      <p className="mt-2 text-lg text-gray-400">{role}</p>
      <p className="mt-4 text-lg md:text-xl leading-relaxed text-gray-200 max-w-2xl whitespace-normal break-words pr-1 min-h-[3rem]">
        {displayText}
      </p>
      <div className="mt-6 flex gap-3 flex-wrap">
        <a href="#projects" className="px-4 py-2 rounded-xl border hover:bg-white/5 transition-colors">View Projects</a>
        <a href="#contact" className="px-4 py-2 rounded-xl border hover:bg-white/5 transition-colors">Get in Touch</a>
      </div>
    </div>
  );
}