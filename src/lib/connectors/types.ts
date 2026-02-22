import { SearchInput, ReviewCandidate } from '../types';

export interface Connector {
  name: string;
  domain: string;
  supports(input: SearchInput): boolean;
  search(input: SearchInput): Promise<ReviewCandidate[]>;
}
