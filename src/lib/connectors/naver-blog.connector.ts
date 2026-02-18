import { Connector } from './types';
import { SearchInput, ReviewCandidate } from '../types';

export class NaverBlogConnector implements Connector {
  name = 'Naver Blog';
  domain = 'blog.naver.com';

  supports(): boolean {
    return true;
  }

  async search(input: SearchInput): Promise<ReviewCandidate[]> {
    return [
      {
        sourceName: this.name,
        sourceDomain: this.domain,
        url: `https://blog.naver.com/mock/${encodeURIComponent(input.q)}`,
        title: `${input.q} 방문 후기`,
        author: 'user123',
        publishedAt: new Date().toISOString(),
        rating: 4.5,
        rawText: `${input.q} 실제 방문 후기를 남깁니다. 장점은 접근성과 맛, 단점은 대기시간입니다.`,
        language: 'ko'
      }
    ];
  }
}
