import { NextResponse } from 'next/server';

export async function POST() {
  const steps = ['Build', 'Optimize', 'Export', 'Upload', 'Live'];
  return NextResponse.json({ ok: true, steps });
}