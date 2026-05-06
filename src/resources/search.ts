// =============================================================================
// SearchResource — Federated search index + query
// =============================================================================

import type { HttpClient } from '../http';
import type {
  SearchIndexRequest,
  SearchIndexAcceptedResponse,
  SearchQueryParams,
  SearchResult,
  SearchQueryResponse,
} from '@caldera/platformxe-types';

export class SearchResource {
  constructor(private http: HttpClient) {}

  /**
   * Upsert a resource into the federated search index. Accepted asynchronously
   * (HTTP 202) — the upsert is performed by the inngest worker.
   */
  async index(input: SearchIndexRequest): Promise<SearchIndexAcceptedResponse> {
    return this.http.post<SearchIndexAcceptedResponse>('/api/v1/search/index', input);
  }

  /**
   * Query the federated search index. Returns at most 20 results. The
   * platform performs an ILIKE search across `title` + `keywords`.
   * Queries shorter than 2 characters return an empty array.
   */
  async query(params: SearchQueryParams): Promise<SearchResult[]> {
    const res = await this.http.get<SearchQueryResponse>(
      '/api/v1/search/query',
      params as unknown as Record<string, string | number | boolean | undefined>,
    );
    return res.results;
  }
}
