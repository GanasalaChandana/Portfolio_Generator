import { PortfolioContent } from '@/types/portfolio';

export const SEED: PortfolioContent = {
  name: 'Avery Kim',
  role: 'Full-Stack Engineer',
  bio: '',
  tagline: 'Shipping fast, learning faster.',
  projects: [
    {
      title: 'Realtime Kanban',
      summary: 'Collaborative board with optimistic updates and offline cache.',
      bullets: ['WebSockets + IndexedDB', 'Role-based access', 'Dark mode'],
      image: '🗂️'
    },
    {
      title: 'ML Notes',
      summary: 'AI-assisted study notes with vector search.',
      bullets: ['Embeddings', 'Markdown + citations'],
      image: '🧠'
    },
    {
      title: 'Deploy Buddy',
      summary: 'One-click preview deployments and status checks.',
      bullets: ['GitHub app', 'Zero-config'],
      image: '🚀'
    }
  ],
  skills: [
    { group: 'Frameworks', items: ['Next.js', 'React', 'Node.js', 'Express'] },
    { group: 'Languages', items: ['TypeScript', 'Python', 'SQL', 'Go'] },
    { group: 'Tooling', items: ['pnpm', 'Playwright', 'Vitest', 'Docker'] },
    { group: 'Platforms', items: ['Vercel', 'Fly.io', 'Cloudflare'] }
  ],
  contact: { cta: 'Get in touch', note: 'Open to collabs and roles' },
  theme: 'bold'
};
