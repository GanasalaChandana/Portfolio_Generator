// app/api/ship/route.ts
import { NextResponse } from 'next/server';
import { PortfolioContent } from '@/types/portfolio';
import { oneClickShip, ShipConfig } from '@/lib/one-click-ship';


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, platform = 'vercel' }: { 
      content: PortfolioContent; 
      platform: 'vercel' | 'netlify' | 'github-pages' 
    } = body;

    if (!content) {
      return NextResponse.json({ error: 'Portfolio content is required' }, { status: 400 });
    }

    // Get deployment tokens from environment
    const config: ShipConfig = {
      platform,
      githubToken: process.env.GITHUB_TOKEN,
      deployToken: process.env.VERCEL_TOKEN, // Add this to your .env.local
    };

    // Validate required tokens
    if (platform === 'vercel' && !config.deployToken) {
      return NextResponse.json({ 
        error: 'Vercel token not configured. Please add VERCEL_TOKEN to environment variables.' 
      }, { status: 400 });
    }

    if (platform === 'github-pages' && !config.githubToken) {
      return NextResponse.json({ 
        error: 'GitHub token not configured. Please add GITHUB_TOKEN to environment variables.' 
      }, { status: 400 });
    }

    const result = await oneClickShip(content, config);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        url: result.url,
        deploymentId: result.deploymentId,
        platform
      });
    } else {
      return NextResponse.json({ 
        error: result.error || 'Deployment failed' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Ship error:', error);
    return NextResponse.json(
      { error: 'Failed to deploy portfolio' }, 
      { status: 500 }
    );
  }
}