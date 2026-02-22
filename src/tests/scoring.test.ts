import { describe, expect, it } from 'vitest';
import { computeTrustScore } from '@/lib/scoring/confidence';

describe('trust score', () => {
  it('increases with more diverse/recent review items', () => {
    const now = new Date().toISOString();
    const score = computeTrustScore([
      { sourceDomain: 'a.com', sourceName: 'A', url: '1', snippet: 'good', reviewProbability: 0.8, sentimentScore: 0.2, keywords: [], publishedAt: now },
      { sourceDomain: 'b.com', sourceName: 'B', url: '2', snippet: 'good', reviewProbability: 0.8, sentimentScore: 0.3, keywords: [], publishedAt: now },
      { sourceDomain: 'c.com', sourceName: 'C', url: '3', snippet: 'good', reviewProbability: 0.8, sentimentScore: 0.1, keywords: [], publishedAt: now }
    ]);
    expect(score).toBeGreaterThan(40);
  });
});
