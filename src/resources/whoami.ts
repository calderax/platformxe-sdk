// =============================================================================
// WhoamiResource — API key verification + caller identity
// =============================================================================

import type { HttpClient } from '../http';
import type { WhoamiResponse } from '@caldera/platformxe-types';

export class WhoamiResource {
  constructor(private http: HttpClient) {}

  /**
   * Verify the calling API key and return caller identity.
   *
   * Designed for boot-time self-checks in consumer services. The response
   * includes grace-period + expiry warnings, plus platform-side env hints
   * so consumers can detect environment drift (dev consumer accidentally
   * pointed at prod, etc).
   */
  async get(): Promise<WhoamiResponse> {
    return this.http.get<WhoamiResponse>('/api/v1/whoami');
  }
}
