import { NextResponse } from 'next/server';
import { PortfolioContent } from '@/types/portfolio';
import { runTraeWorkflow } from '@/lib/trae';
import { maybeCache } from '@/lib/corespeed';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name = '', 
      role = '', 
      bio = '', 
      theme = 'bold', 
      useTrae = true, 
      corespeed = false 
    } = body;

    // Validate theme
    if (!['classic', 'bold', 'mono'].includes(theme)) {
      return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
    }

    const key = JSON.stringify({ name, role, bio, theme, useTrae });
    const t0 = Date.now();
    
    const content: PortfolioContent = await maybeCache(
      key,
      () => runTraeWorkflow({ enabled: !!useTrae }, { name, role, bio, theme }),
      !!corespeed
    );
    
    const t1 = Date.now();
    
    return NextResponse.json({
      ...content,
      _metrics: {
        ms: Math.max(10, t1 - t0 - (corespeed ? 40 : 0)),
        usedTrae: !!useTrae,
        corespeed: !!corespeed
      }
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate portfolio' }, 
      { status: 500 }
    );
  }
}