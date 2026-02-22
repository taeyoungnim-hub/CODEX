import { describe, expect, it } from 'vitest';
import { sentimentScore, toSnippet } from '@/lib/summarizer/summarizer';

describe('summarizer util', () => {
  it('clips snippet length', () => {
    const long = 'a'.repeat(500);
    expect(toSnippet(long, 100).length).toBe(100);
  });

  it('computes sentiment with positive tokens', () => {
    expect(sentimentScore('great clean good')).toBeGreaterThan(0);
  });
});
