import { NaverBlogConnector } from './connectors/naver-blog.connector';
import { PublicRssConnector } from './connectors/rss.connector';
import { isReviewLike, reviewProbability } from './classifier/review-classifier';
import { detectLanguage, estimateCategory, normalizeQuery } from './search-input';
import { computeTrustScore } from './scoring/confidence';
import { sentimentScore, summarizeReviews, toSnippet } from './summarizer/summarizer';
import { SearchInput, ReviewCandidate, ReviewItemDTO } from './types';
import { isDomainAllowed } from './pipeline/source-policy';

const connectors = [new NaverBlogConnector(), new PublicRssConnector()];

function extractKeywords(text: string): string[] {
  const tokens = text
    .toLowerCase()
    .replace(/[^\w가-힣\s]/g, ' ')
    .split(/\s+/)
    .filter((v) => v.length >= 2);

  const map = new Map<string, number>();
  tokens.forEach((token) => map.set(token, (map.get(token) ?? 0) + 1));
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([k]) => k);
}

function mapToReviewItem(candidate: ReviewCandidate): ReviewItemDTO {
  const probability = reviewProbability(candidate.rawText);
  return {
    sourceName: candidate.sourceName,
    sourceDomain: candidate.sourceDomain,
    url: candidate.url,
    title: candidate.title,
    author: candidate.author,
    publishedAt: candidate.publishedAt,
    rating: candidate.rating,
    snippet: toSnippet(candidate.rawText),
    reviewProbability: probability,
    sentimentScore: sentimentScore(candidate.rawText),
    keywords: extractKeywords(candidate.rawText)
  };
}

export async function searchReviews(input: SearchInput) {
  const normalized = normalizeQuery(input.q);
  const locale = input.locale ?? detectLanguage(input.q);
  const category = estimateCategory(input.q);

  const results = await Promise.all(
    connectors
      .filter((connector) => connector.supports(input) && isDomainAllowed(connector.domain))
      .map((connector) => connector.search(input))
  );

  const dedupedByUrl = new Map<string, ReviewCandidate>();
  results.flat().forEach((item) => dedupedByUrl.set(item.url, item));

  const reviewItems = [...dedupedByUrl.values()].map(mapToReviewItem).filter((item) => isReviewLike(item.snippet));

  const summary = summarizeReviews(reviewItems);
  const trustScore = computeTrustScore(reviewItems);

  return {
    meta: {
      query: input.q,
      normalized,
      locale,
      category,
      totalReviews: reviewItems.length,
      trustScore
    },
    summary: {
      ...summary,
      confidence: Math.round((summary.confidence + trustScore) / 2)
    },
    sources: reviewItems
      .sort((a, b) => (new Date(b.publishedAt ?? 0).getTime() || 0) - (new Date(a.publishedAt ?? 0).getTime() || 0))
      .slice(0, 50)
  };
}
