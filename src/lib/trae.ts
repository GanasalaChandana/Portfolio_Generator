import { PortfolioContent, Project, SkillBucket } from '@/types/portfolio';
import { fetchGitHubProjects } from './github-with-token';

// ---------- Types ----------
export type TraeConfig = {
  enabled: boolean;
  useGitHubAPI?: boolean;
  githubToken?: string;
};

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
}

// ---------- Public helpers ----------
export function configFromEnv(): TraeConfig {
  // server-only env; DO NOT expose NEXT_PUBLIC_ token
  const token = process.env.GITHUB_TOKEN;
  return {
    enabled: true,
    useGitHubAPI: Boolean(token),
    githubToken: token,
  };
}

export function validateGitHubToken(token: string): { valid: boolean; message: string } {
  if (!token?.trim()) return { valid: false, message: 'Token is empty' };
  // Be permissive: just check a known prefix; lengths vary.
  const ok = /^(gh[pous]_|github_pat_)/.test(token);
  return ok ? { valid: true, message: 'Token prefix OK' } :
              { valid: false, message: 'Unexpected token prefix' };
}

// ---------- Mapping helpers ----------
function formatStarCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return String(n);
}

function extractTechStack(language: string | null, topics: string[]): string[] {
  const techMap: Record<string, string[]> = {
    JavaScript: ['React', 'Node.js', 'Express', 'MongoDB'],
    TypeScript: ['Next.js', 'React', 'Prisma', 'tRPC'],
    Python: ['FastAPI', 'Django', 'PostgreSQL', 'Redis'],
    Go: ['Gin', 'GORM', 'Docker', 'Kubernetes'],
    Rust: ['Actix', 'Tokio', 'Diesel', 'WASM'],
    Java: ['Spring Boot', 'Hibernate', 'Maven', 'MySQL'],
    'C#': ['.NET', 'EF Core', 'Azure', 'SQL Server'],
    PHP: ['Laravel', 'Symfony', 'MySQL', 'Redis'],
    Ruby: ['Rails', 'Sidekiq', 'PostgreSQL', 'Heroku'],
    Swift: ['SwiftUI', 'UIKit', 'Core Data', 'Alamofire'],
    Kotlin: ['Android', 'Ktor', 'Room', 'Coroutines'],
    'C++': ['Qt', 'Boost', 'CMake', 'OpenCV'],
  };
  const topicTech = topics
    .filter(t => ['react','vue','angular','django','flask','spring','express','fastapi','nextjs','svelte'].includes(t.toLowerCase()))
    .map(t => t[0].toUpperCase() + t.slice(1));
  const lang = language ? (techMap[language] || ['Modern stack']) : ['Clean architecture'];
  return [...topicTech, ...lang].slice(0, 3);
}

function simplifyRepoName(name: string): string {
  return name.replace(/[-_.]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).slice(0, 35);
}

function getProjectEmoji(language: string | null, topics: string[]): string {
  const topicEmojis: Record<string,string> = {
    'machine-learning':'🤖','deep-learning':'🧠','ai':'🤖','web':'🌐','mobile':'📱','ios':'🍎','android':'🤖',
    'react-native':'📱','flutter':'💙','game':'🎮','blockchain':'⛓️','cryptocurrency':'₿','devops':'🚀',
    'docker':'🐳','kubernetes':'☸️','api':'🔌','rest-api':'🔌','graphql':'🔗','database':'🗄️','security':'🔐',
    'cli':'⚡','bot':'🤖','scraper':'🕷️','crawler':'🕷️','monitoring':'📊','dashboard':'📈','analytics':'📊',
    'data-science':'📊','visualization':'📈','frontend':'🎨','backend':'⚙️','fullstack':'🧱','webapp':'🌐',
  };
  for (const t of topics) {
    const k = t.toLowerCase();
    if (topicEmojis[k]) return topicEmojis[k];
  }
  const langEmojis: Record<string,string> = {
    Python:'🐍', JavaScript:'⚡', TypeScript:'💙', Go:'🔷', Rust:'🦀', Java:'☕', 'C#':'🔷', PHP:'🐘',
    Ruby:'💎', Swift:'🍎', Kotlin:'📱', 'C++':'⚙️', C:'⚙️', HTML:'🌐', CSS:'🎨', Shell:'⚡', Dockerfile:'🐳',
  };
  return language ? (langEmojis[language] || '🚀') : '🚀';
}

function generateProjectFromRepo(repo: GitHubRepo, role: string): Project {
  const techStack = extractTechStack(repo.language, repo.topics || []);
  const desc = repo.description || `${role} project using ${repo.language || 'modern tech'}`;
  const bullets = [
    `Built with ${repo.language || 'JavaScript'}${techStack[0] ? ` + ${techStack[0]}` : ''}`,
    repo.stargazers_count ? `⭐ ${formatStarCount(repo.stargazers_count)} stars` : 'Open source project',
    repo.topics?.length ? `#${repo.topics.slice(0, 2).join(' #')}` : 'Production ready',
  ];
  return {
    title: simplifyRepoName(repo.name),
    summary: desc.length > 80 ? desc.slice(0, 80) + '…' : desc,
    bullets: bullets.filter(Boolean),
    image: getProjectEmoji(repo.language, repo.topics || []),
    link: repo.html_url,
  };
}

// ---------- Curated fallbacks & skills ----------
function getCuratedProjects(role: string): Project[] {
  const r = role.toLowerCase();
  const libs: Record<string, Project[]> = {
    'ml engineer': [
      { title: 'ML Model Monitor', summary: 'Realtime performance with drift detection.', bullets: ['AUC tracking','Alerts','A/B tests'], image: '📈' },
      { title: 'AutoML Pipeline', summary: 'No-code training + tuning.', bullets: ['Features','HParams','MLflow'], image: '🤖' },
      { title: 'Vector Search', summary: 'Semantic search with embeddings.', bullets: ['FAISS','Realtime','API'], image: '🔍' },
    ],
    'frontend engineer': [
      { title: 'Component Library', summary: 'Type-safe React system with Storybook.', bullets: ['TS','Tests','Themes'], image: '🎨' },
      { title: 'Perf Dashboard', summary: 'Realtime web vitals visualization.', bullets: ['WS','Canvas','Mobile'], image: '📊' },
      { title: 'A11y Toolkit', summary: 'WCAG checker and reporter.', bullets: ['SR','Contrast','Keyboard'], image: '♿' },
    ],
    'backend engineer': [
      { title: 'API Gateway', summary: 'Routing + auth for microservices.', bullets: ['Rate limit','JWT','LB'], image: '🔐' },
      { title: 'Event Streaming', summary: 'Kafka + CQRS processing.', bullets: ['Sourcing','DLQ','Replay'], image: '⚡' },
      { title: 'Cache Engine', summary: 'Distributed Redis cluster.', bullets: ['TTL','Pub/Sub','Consistent hashing'], image: '🚀' },
    ],
    'fullstack engineer': [
      { title: 'SaaS Starter', summary: 'Auth + billing + teams.', bullets: ['NextAuth','Stripe','Tenancy'], image: '🧱' },
      { title: 'Collab Editor', summary: 'Live document editing.', bullets: ['WS','OT','Offline'], image: '📝' },
      { title: 'Analytics Platform', summary: 'Custom events + dashboards.', bullets: ['ETL','Realtime','Export'], image: '📈' },
    ],
    'data scientist': [
      { title: 'Data Pipeline', summary: 'Automated ETL with quality checks.', bullets: ['Airflow','Validation','Alerts'], image: '🔄' },
      { title: 'Interactive Viz', summary: 'Dashboards with streaming data.', bullets: ['Plotly/Dash','Live','Export'], image: '📊' },
    ],
    'devops engineer': [
      { title: 'IaC Modules', summary: 'Multi-cloud Terraform packs.', bullets: ['AWS/GCP/Azure','Envs','Cost'], image: '☁️' },
      { title: 'CI/CD Pipeline', summary: 'Build, test, scan, deploy.', bullets: ['Actions','Docker','Security'], image: '🔄' },
    ],
    'mobile developer': [
      { title: 'RN Starter', summary: 'Expo app with auth + API.', bullets: ['TypeScript','Offline','Theming'], image: '📱' },
      { title: 'Flutter Kit', summary: 'Clean arch + DI + tests.', bullets: ['Riverpod','Navigator 2','CI'], image: '💙' },
      { title: 'Compose Demo', summary: 'Modern Android sample.', bullets: ['Compose','Kotlin','Room'], image: '📱' },
    ],
    'blockchain developer': [
      { title: 'DeFi Simulator', summary: 'AMM/lending strategy lab.', bullets: ['Solidity models','Backtests','Charts'], image: '⛓️' },
      { title: 'Smart-Contract Kit', summary: 'Hardhat/Foundry templates.', bullets: ['Ethers.js','Coverage','Gas reports'], image: '🧰' },
      { title: 'NFT Marketplace', summary: 'ERC-721 + React dApp.', bullets: ['Royalties','Auctions','Subgraph'], image: '🖼️' },
    ],
  };
  return libs[r] || libs['fullstack engineer'];
}

function generateRoleSpecificSkills(role: string): SkillBucket[] {
  const r = role.toLowerCase();
  const sets: Record<string, SkillBucket[]> = {
    'ml engineer': [
      { group: 'ML', items: ['PyTorch','TensorFlow','Sklearn','HuggingFace','XGBoost'] },
      { group: 'MLOps', items: ['MLflow','Kubeflow','DVC','W&B'] },
      { group: 'Data', items: ['Python','SQL','DuckDB','Pandas'] },
      { group: 'Cloud', items: ['SageMaker','GCP AI','Azure ML'] },
    ],
    'frontend engineer': [
      { group: 'Frameworks', items: ['React','Vue','Svelte','Next.js'] },
      { group: 'Styling', items: ['Tailwind','CSS Modules','Sass'] },
      { group: 'Testing', items: ['Playwright','Jest','Storybook'] },
      { group: 'Build', items: ['Vite','Webpack','esbuild'] },
    ],
    'backend engineer': [
      { group: 'Langs', items: ['Node.js','Python','Go','Java'] },
      { group: 'DB', items: ['Postgres','MongoDB','Redis','Elastic'] },
      { group: 'Infra', items: ['Docker','Kubernetes','AWS','Terraform'] },
      { group: 'Messaging', items: ['Kafka','RabbitMQ','NATS'] },
    ],
    'fullstack engineer': [
      { group: 'Frontend', items: ['React','TypeScript','Next.js','Tailwind'] },
      { group: 'Backend', items: ['Node.js','Python','Postgres','Redis'] },
      { group: 'DevOps', items: ['Docker','Vercel','GitHub Actions'] },
      { group: 'Tools', items: ['Prisma','Playwright','Figma'] },
    ],
    'data scientist': [
      { group: 'Analysis', items: ['Pandas','NumPy','Matplotlib','Seaborn'] },
      { group: 'ML', items: ['Sklearn','PyTorch','TensorFlow','XGBoost'] },
      { group: 'Big Data', items: ['Spark','Airflow','Kafka'] },
      { group: 'Viz', items: ['Plotly','Dash','Tableau'] },
    ],
    'devops engineer': [
      { group: 'Orchestration', items: ['Kubernetes','Nomad','ECS'] },
      { group: 'IaC', items: ['Terraform','Pulumi','CloudFormation'] },
      { group: 'Monitoring', items: ['Prometheus','Grafana','ELK'] },
      { group: 'CI/CD', items: ['Actions','GitLab CI','Jenkins'] },
    ],
    'mobile developer': [
      { group: 'Frameworks', items: ['React Native','Flutter','SwiftUI','Compose'] },
      { group: 'Languages', items: ['TypeScript','Swift','Kotlin'] },
      { group: 'Tools', items: ['Expo','Xcode','Android Studio'] },
      { group: 'Backend', items: ['Firebase','Supabase','GraphQL'] },
    ],
    'blockchain developer': [
      { group: 'Smart Contracts', items: ['Solidity','Foundry','Hardhat'] },
      { group: 'dApp', items: ['Ethers.js','Web3.js','The Graph'] },
      { group: 'Security', items: ['Slither','Mythril','OpenZeppelin'] },
      { group: 'Infra', items: ['IPFS','Alchemy/Infura','Moralis'] },
    ],
  };
  return sets[r] || sets['fullstack engineer'];
}

// ---------- Local synthesis ----------
function localSynthesis(name: string, role: string, bio: string, theme: PortfolioContent['theme']): PortfolioContent {
  return {
    name: name || 'Your Name',
    role: role || 'Software Engineer',
    bio: bio || '',
    tagline: (bio?.length ? bio : `Building innovative ${role || 'software'} solutions`).slice(0, 90),
    projects: getCuratedProjects(role),
    skills: generateRoleSpecificSkills(role),
    contact: { cta: 'Get in touch' },
    theme,
  };
}

// ---------- Main workflow ----------
export async function runTraeWorkflow(
  cfg: TraeConfig,
  { name, role, bio, theme }: { name: string; role: string; bio: string; theme: PortfolioContent['theme'] }
): Promise<PortfolioContent> {
  if (!cfg.enabled) return localSynthesis(name, role, bio, theme);

  let projects: Project[] = [];
  let githubRepos: GitHubRepo[] = [];

if (cfg.useGitHubAPI && cfg.githubToken) {
  const tokenCheck = validateGitHubToken(cfg.githubToken);
  if (tokenCheck.valid) {
    try {
      // Directly fetch repos for the role using the token
      githubRepos = await fetchGitHubProjects(role, cfg.githubToken, 5 /* maxResults */);
      if (githubRepos.length) {
        projects = githubRepos.slice(0, 3).map(r => generateProjectFromRepo(r, role));
      }
    } catch (e) {
      console.warn('GitHub fetch failed, using curated:', e);
    }
  } else {
    console.warn('Token validation failed:', tokenCheck.message);
  }
}


  if (projects.length < 3) {
    projects.push(...getCuratedProjects(role).slice(0, 3 - projects.length));
  }

  const content = localSynthesis(name || 'Your Name', role || 'Software Engineer', bio, theme);
  content.projects = projects.slice(0, 3);
  return content;
}

// ---------- Safe wrapper ----------
export async function generatePortfolioSafely(
  cfg: TraeConfig,
  params: { name: string; role: string; bio: string; theme: PortfolioContent['theme'] }
): Promise<{ success: boolean; portfolio?: PortfolioContent; error?: string }> {
  try {
    const portfolio = await runTraeWorkflow(cfg, params);
    return { success: true, portfolio };
  } catch (err: any) {
    const msg = err?.message || 'Unknown error';
    try {
      const fb = await runTraeWorkflow({ ...cfg, useGitHubAPI: false }, params);
      return { success: true, portfolio: fb, error: `GitHub path failed: ${msg}` };
    } catch {
      return { success: false, error: msg };
    }
  }
}

// ---------- Trae Workflow Graph ----------
export const TRAE_GRAPH = {
  nodes: [
    { id: 'config', label: 'Configuration' },
    { id: 'github', label: 'GitHub Fetch' },
    { id: 'projects', label: 'Project Generation' },
    { id: 'skills', label: 'Skill Generation' },
    { id: 'synthesis', label: 'Portfolio Synthesis' },
  ]
};
