const positiveSignals = ['방문', '사용', '착용', '재구매', '별점', '장점', '단점', '후기', '리뷰', 'i used', 'visited'];
const negativeSignals = ['할인코드', '쿠폰', '최저가', '구매링크', 'sponsored', 'ad', 'buy now'];

export function reviewProbability(text: string): number {
  const lower = text.toLowerCase();
  const pos = positiveSignals.filter((token) => lower.includes(token)).length;
  const neg = negativeSignals.filter((token) => lower.includes(token)).length;
  const lenFactor = Math.min(1, lower.length / 500);
  const raw = 0.25 + pos * 0.15 - neg * 0.2 + lenFactor * 0.2;
  return Math.max(0, Math.min(1, raw));
}

export function isReviewLike(text: string): boolean {
  return reviewProbability(text) >= 0.45;
}
