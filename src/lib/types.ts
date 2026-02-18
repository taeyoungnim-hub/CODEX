export type Category = 'place' | 'product';

export interface SearchInput {
  q: string;
  locale?: string;
  region?: string;
  from?: string;
  to?: string;
}

export interface ReviewCandidate {
  sourceName: string;
  sourceDomain: string;
  url: string;
  title?: string;
  author?: string;
  publishedAt?: string;
  rating?: number;
  rawText: string;
  language: 'ko' | 'en';
}

export interface ReviewItemDTO {
  sourceName: string;
  sourceDomain: string;
  url: string;
  title?: string;
  author?: string;
  publishedAt?: string;
  rating?: number;
  snippet: string;
  reviewProbability: number;
  sentimentScore: number;
  keywords: string[];
}

export interface SummaryDTO {
  conclusion: string;
  pros: string[];
  cons: string[];
  keywords: string[];
  sentiment: number;
  confidence: number;
  recommendFor: string[];
  notRecommendFor: string[];
}
