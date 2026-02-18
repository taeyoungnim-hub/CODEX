import { Connector } from './types';
import { SearchInput, ReviewCandidate } from '../types';

export class PublicRssConnector implements Connector {
  name = 'Public RSS';
  domain = 'example.com';

  supports(input: SearchInput): boolean {
    return input.q.length > 1;
  }

  async search(input: SearchInput): Promise<ReviewCandidate[]> {
    return [
      {
        sourceName: this.name,
        sourceDomain: this.domain,
        url: `https://example.com/posts/${encodeURIComponent(input.q)}`,
        title: `${input.q} honest review roundup`,
        author: 'editor',
        publishedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
        rating: 4.1,
        rawText: `I used ${input.q} for two weeks. Good value, but shipping was slow and customer support was average.`,
        language: 'en'
      }
    ];
  }
}
