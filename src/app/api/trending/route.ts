import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const trends = await prisma.searchTrend.findMany({ orderBy: { count: 'desc' }, take: 10 });
    return NextResponse.json({ keywords: trends.map((t) => t.keyword) });
  } catch {
    return NextResponse.json({ keywords: ['성수 파스타', '다이슨 v15', '오사카 호텔'] });
  }
}
