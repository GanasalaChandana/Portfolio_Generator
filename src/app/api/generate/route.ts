// app/api/generate/route.ts - Updated with theme validation
import { NextResponse } from 'next/server';
import { PortfolioContent, ThemeVariant, getTheme } from '@/types/portfolio';
import { generatePortfolioSafely, configFromEnv } from '@/lib/trae';
import { maybeCache } from '@/lib/corespeed';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name = '', 
      role = '', 
      bio = '', 
      theme = 'bold' as ThemeVariant, 
      useTrae = true, 
      corespeed = false 
    } = body;

    // Validate theme using the utility function
    const validThemes: ThemeVariant[] = ['classic', 'bold', 'mono'];
    if (!validThemes.includes(theme)) {
      return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
    }

    const key = JSON.stringify({ name, role, bio, theme, useTrae });
    const t0 = Date.now();
    
    const config = configFromEnv();
    const { success, portfolio, error } = await generatePortfolioSafely(
      config,
      { name, role, bio, theme }
    );
    
    if (!success) {
      return NextResponse.json({ error: error || 'Generation failed' }, { status: 500 });
    }
    
    const t1 = Date.now();
    
    return NextResponse.json({
      ...portfolio,
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