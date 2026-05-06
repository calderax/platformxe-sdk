// =============================================================================
// IssuesResource — Federated bug / support ticket workflow
// =============================================================================

import type { HttpClient } from '../http';
import type {
  ListIssuesParams,
  ListIssuesResponse,
  IssueRecord,
  CreateIssueRequest,
  CreateIssueResponse,
} from '@caldera/platformxe-types';

export class IssuesResource {
  constructor(private http: HttpClient) {}

  /** List federated issues for the calling organisation. */
  async list(params?: ListIssuesParams): Promise<IssueRecord[]> {
    const res = await this.http.get<ListIssuesResponse>(
      '/api/v1/issues',
      params as Record<string, string | number | boolean | undefined>,
    );
    return res.issues;
  }

  /** Create a federated issue (bug / support ticket). */
  async create(input: CreateIssueRequest): Promise<CreateIssueResponse> {
    return this.http.post<CreateIssueResponse>('/api/v1/issues', input);
  }
}
