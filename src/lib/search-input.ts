import { Category } from './types';

const placeHints = ['호텔', '카페', '식당', '파스타', 'restaurant', 'hotel', 'cafe', '여행', '숙소'];

export function detectLanguage(text: string): 'ko' | 'en' {
  return /[가-힣]/.test(text) ? 'ko' : 'en';
}

export function normalizeQuery(q: string): string {
  return q.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function estimateCategory(q: string): Category {
  const normalized = normalizeQuery(q);
  return placeHints.some((hint) => normalized.includes(hint)) ? 'place' : 'product';
}
