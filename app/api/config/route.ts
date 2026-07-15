import { NextResponse } from 'next/server';
import { listCollection } from '@/lib/firebaseServer';
import { EngagementConfig } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const configs = await listCollection<EngagementConfig>('config');
    return NextResponse.json({ config: configs[0] || null });
  } catch (error) {
    console.error('Public config read failed:', error);
    return NextResponse.json({ config: null }, { status: 200 });
  }
}
