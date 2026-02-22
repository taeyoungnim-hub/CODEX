import { SearchInput } from '../types';

export interface SearchResultLink {
  url: string;
  title: string;
  snippet?: string;
  publishedAt?: string;
}

export interface SearchProvider {
  name: string;
  search(input: SearchInput): Promise<SearchResultLink[]>;
}

export class MockSearchProvider implements SearchProvider {
  name = 'mock-provider';

  async search(input: SearchInput): Promise<SearchResultLink[]> {
    const q = encodeURIComponent(input.q);
    return [
      {
        url: `https://example.com/review/${q}-1`,
        title: `${input.q} detailed review`,
        snippet: '실사용 위주의 블로그 후기',
        publishedAt: new Date().toISOString()
      },
      {
        url: `https://example.com/review/${q}-2`,
        title: `${input.q} user feedback`,
        snippet: '장단점이 함께 정리된 리뷰',
        publishedAt: new Date(Date.now() - 86400000 * 8).toISOString()
      }
    ];
  }
}
