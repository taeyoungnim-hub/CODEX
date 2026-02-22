import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchReviews } from '@/lib/search-service';
import { prisma } from '@/lib/db';
import { summaryQueue } from '@/lib/queue';

const querySchema = z.object({
  q: z.string().min(2),
  locale: z.string().optional(),
  region: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional()
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
  }

  const input = parsed.data;
  const result = await searchReviews(input);

  try {
    await prisma.searchTrend.upsert({
      where: { keyword: result.meta.normalized },
      update: { count: { increment: 1 } },
      create: { keyword: result.meta.normalized }
    });

    if (summaryQueue) {
      await summaryQueue.add('refresh-summary', { query: input.q, at: new Date().toISOString() }, { removeOnComplete: 30 });
    }
  } catch {
    // non-blocking analytics persistence
  }

  return NextResponse.json(result);
}
