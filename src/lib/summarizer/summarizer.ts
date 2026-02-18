import { ReviewItemDTO, SummaryDTO } from '../types';

const positiveWords = ['좋', '만족', '추천', '깔끔', '편함', 'great', 'good', 'clean', 'comfortable'];
const negativeWords = ['아쉽', '불편', '별로', '느림', '비싸', 'bad', 'slow', 'expensive'];

export function sentimentScore(text: string): number {
  const lower = text.toLowerCase();
  const pos = positiveWords.filter((w) => lower.includes(w)).length;
  const neg = negativeWords.filter((w) => lower.includes(w)).length;
  if (pos === 0 && neg === 0) return 0;
  return (pos - neg) / (pos + neg);
}

export function toSnippet(text: string, maxLen = 260): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  return cleaned.length <= maxLen ? cleaned : `${cleaned.slice(0, maxLen - 1)}…`;
}

export function summarizeReviews(items: ReviewItemDTO[]): SummaryDTO {
  const sentiments = items.map((item) => item.sentimentScore);
  const avgSentiment = sentiments.length ? sentiments.reduce((a, b) => a + b, 0) / sentiments.length : 0;

  const pros = ['사용/방문 경험 기반 후기가 많음', '출처가 다양함', '최신 후기 비중이 높음'];
  const cons = ['광고성 문구 일부 존재', '출처별 평점 기준이 상이함', '표본 수가 적은 출처가 있음'];

  const keywordMap = new Map<string, number>();
  items.forEach((item) => item.keywords.forEach((k) => keywordMap.set(k, (keywordMap.get(k) ?? 0) + 1)));
  const keywords = [...keywordMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([k]) => k);

  return {
    conclusion: avgSentiment >= 0 ? '전반적으로 긍정 후기 비율이 높습니다.' : '호불호가 갈리며 단점 확인이 필요합니다.',
    pros,
    cons,
    keywords,
    sentiment: Number(avgSentiment.toFixed(2)),
    confidence: Math.min(100, 40 + items.length * 5),
    recommendFor: ['실사용 후기 기반으로 비교하고 싶은 사용자'],
    notRecommendFor: ['공식 스펙만 빠르게 확인하려는 사용자']
  };
}
