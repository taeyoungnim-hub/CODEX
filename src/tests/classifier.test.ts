import { describe, expect, it } from 'vitest';
import { reviewProbability } from '@/lib/classifier/review-classifier';

describe('review classifier', () => {
  it('gives higher score to real usage review', () => {
    const score = reviewProbability('실제 방문 후기입니다. 장점 단점 모두 적고 재방문 의사 있습니다.');
    expect(score).toBeGreaterThan(0.45);
  });

  it('penalizes ad-like text', () => {
    const score = reviewProbability('buy now 할인코드 쿠폰 최저가 구매링크 클릭');
    expect(score).toBeLessThan(0.45);
  });
});
