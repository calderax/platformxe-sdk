// =============================================================================
// UsageResource — Usage summary & quota information
// =============================================================================

import type { HttpClient } from '../http';
import type { UsageSummary } from '@caldera/platformxe-types';

/** Parameters for usage summary query */
export interface UsageSummaryParams {
  month?: string;
}

export class UsageResource {
  constructor(private http: HttpClient) {}

  /** Get usage summary for the current or specified billing month */
  async summary(params?: UsageSummaryParams): Promise<UsageSummary> {
    return this.http.get<UsageSummary>(
      '/api/v1/usage/summary',
      params as Record<string, string | number | boolean | undefined>,
    );
  }
}
