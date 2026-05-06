// =============================================================================
// OcrResource — Identity document verification via OCR
// =============================================================================

import type { HttpClient } from '../http';
import type {
  VerifyIdentityInput,
  VerifyIdentityResult,
  ProcessorConfig,
  UpdateProcessorRequest,
} from '@caldera/platformxe-types';

export class OcrResource {
  constructor(private http: HttpClient) {}

  /** Verify an identity document against a profile name */
  async verifyIdentity(input: VerifyIdentityInput): Promise<VerifyIdentityResult> {
    return this.http.post<VerifyIdentityResult>('/api/v1/ocr/verify-identity', input);
  }

  /** Get the OCR processor configuration */
  async getProcessor(): Promise<ProcessorConfig> {
    return this.http.get<ProcessorConfig>('/api/v1/ocr/processor');
  }

  /** Update the OCR processor configuration */
  async updateProcessor(input: UpdateProcessorRequest): Promise<ProcessorConfig> {
    return this.http.put<ProcessorConfig>('/api/v1/ocr/processor', input);
  }
}
