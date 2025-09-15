import { NextResponse } from 'next/server';
import type { PortfolioContent, Project } from '@/types/portfolio';
import { generatePortfolioSafely } from '@/lib/trae'; // <- token-aware wrapper
import { Octokit } from '@octokit/rest';

export async function fetchGitHubProjects(role: string, token: string, maxResults: number = 5) {
  const octokit = new Octokit({ auth: token });

  // Map roles to relevant GitHub search terms
  const searchTerms: Record<string, string[]> = {
    'ml engineer': ['machine-learning', 'deep-learning', 'data-science'],
    'frontend engineer': ['frontend', 'react', 'vue', 'web-app'],
    'backend engineer': ['backend', 'api', 'microservices'],
    'fullstack engineer': ['fullstack', 'webapp', 'saas'],
    'data scientist': ['data-science', 'analytics', 'visualization'],
    'devops engineer': ['devops', 'infrastructure', 'kubernetes'],
    'mobile developer': ['mobile', 'ios', 'android'],
    'blockchain developer': ['blockchain', 'smart-contracts', 'web3'],
  };

  const terms = searchTerms[role.toLowerCase()] || ['software'];
  const query = terms.map(t => `topic:${t}`).join(' ');

  try {
    const { data } = await octokit.search.repos({
      q: `${query} sort:stars`,
      per_page: maxResults,
    });

    return data.items.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      language: repo.language,
      topics: repo.topics || [],
      created_at: repo.created_at,
      updated_at: repo.updated_at,
    }));
  } catch (error) {
    console.error('GitHub API error:', error);
    return [];
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { name, role, bio, theme = 'bold', projects } = await req.json();

  const { success, portfolio, error } = await generatePortfolioSafely(
    {
      enabled: true,
      useGitHubAPI: Boolean(process.env.GITHUB_TOKEN),
      githubToken: process.env.GITHUB_TOKEN, // must be set in .env.local
    },
    { name, role, bio, theme }
  );

  // Prefer client-provided projects only if you intentionally send them
  const base: PortfolioContent = portfolio!;
  if (Array.isArray(projects) && projects.length) {
    base.projects = (projects as Project[]).slice(0, 3);
  }

  return NextResponse.json({ ...base, _note: success ? undefined : error });
}



