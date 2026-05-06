// =============================================================================
// IdentityResource — Identity resolution, verification & lookup
// =============================================================================

import type { HttpClient } from '../http';
import type {
  IdentityResolveRequest,
  IdentityResolveResponse,
  IdentityVerifyRequest,
  IdentityVerifyResponse,
  IdentityLookupResponse,
  IdentityProviderStatus,
  ProcessorConfig,
  UpdateProcessorRequest,
} from '@caldera/platformxe-types';

export class IdentityResource {
  constructor(private http: HttpClient) {}

  /** Resolve an identity with consent */
  async resolve(input: IdentityResolveRequest): Promise<IdentityResolveResponse> {
    return this.http.post<IdentityResolveResponse>('/api/v1/identity/resolve', input);
  }

  /** Verify identity against known data */
  async verify(input: IdentityVerifyRequest): Promise<IdentityVerifyResponse> {
    return this.http.post<IdentityVerifyResponse>('/api/v1/identity/verify', input);
  }

  /** Look up an identity by type and value */
  async lookup(type: string, value: string): Promise<IdentityLookupResponse> {
    return this.http.get<IdentityLookupResponse>('/api/v1/identity/lookup', { type, value });
  }

  /** List identity provider statuses */
  async providers(): Promise<{ providers: IdentityProviderStatus[] }> {
    return this.http.get<{ providers: IdentityProviderStatus[] }>('/api/v1/identity/providers');
  }

  /** Get the identity processor configuration */
  async getProcessor(): Promise<ProcessorConfig> {
    return this.http.get<ProcessorConfig>('/api/v1/identity/processor');
  }

  /** Update the identity processor configuration */
  async updateProcessor(input: UpdateProcessorRequest): Promise<ProcessorConfig> {
    return this.http.put<ProcessorConfig>('/api/v1/identity/processor', input);
  }
}
