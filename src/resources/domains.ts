// =============================================================================
// DomainsResource — Sending domain registration & verification
// =============================================================================

import type { HttpClient } from '../http';
import type {
  RegisterDomainInput,
  VerifyDomainResult,
  SendingDomain,
} from '@caldera/platformxe-types';

export class DomainsResource {
  constructor(private http: HttpClient) {}

  /** Register a new sending domain */
  async register(input: RegisterDomainInput): Promise<SendingDomain> {
    return this.http.post<SendingDomain>('/api/v1/domains', input);
  }

  /** List all sending domains */
  async list(): Promise<SendingDomain[]> {
    return this.http.get<SendingDomain[]>('/api/v1/domains');
  }

  /** Get a domain by ID */
  async get(domainId: string): Promise<SendingDomain> {
    return this.http.get<SendingDomain>(`/api/v1/domains/${domainId}`);
  }

  /** Delete a domain */
  async delete(domainId: string): Promise<void> {
    return this.http.del<void>(`/api/v1/domains/${domainId}`);
  }

  /** Verify DNS records for a domain */
  async verify(domainId: string): Promise<VerifyDomainResult> {
    return this.http.post<VerifyDomainResult>(`/api/v1/domains/${domainId}/verify`);
  }
}
