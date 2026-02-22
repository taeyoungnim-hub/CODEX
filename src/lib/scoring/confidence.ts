import { ReviewItemDTO } from '../types';

export function computeTrustScore(items: ReviewItemDTO[]): number {
  if (items.length === 0) return 0;
  const domains = new Set(items.map((i) => i.sourceDomain));
  const diversity = Math.min(1, domains.size / 5);
  const countFactor = Math.min(1, items.length / 30);
  const freshness = items.filter((item) => {
    if (!item.publishedAt) return false;
    const days = (Date.now() - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    return days <= 120;
  }).length / items.length;
  const reviewProb = items.reduce((acc, cur) => acc + cur.reviewProbability, 0) / items.length;
  return Math.round((diversity * 0.3 + countFactor * 0.25 + freshness * 0.2 + reviewProb * 0.25) * 100);
}
