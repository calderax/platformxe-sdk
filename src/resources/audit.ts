// =============================================================================
// AuditResource — Federated audit log dispatch
// =============================================================================

import type { HttpClient } from '../http';
import type { AuditLogRequest, AuditLogAcceptedResponse } from '@caldera/platformxe-types';

export class AuditResource {
  constructor(private http: HttpClient) {}

  /**
   * Dispatch an audit event into the trace pipeline. Accepted asynchronously
   * (HTTP 202) — the event is durably recorded by the inngest worker.
   */
  async log(input: AuditLogRequest): Promise<AuditLogAcceptedResponse> {
    return this.http.post<AuditLogAcceptedResponse>('/api/v1/audit/log', input);
  }
}
