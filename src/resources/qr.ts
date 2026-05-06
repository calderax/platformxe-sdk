// =============================================================================
// QrResource — QR code generation (single & batch)
// =============================================================================

import type { HttpClient } from '../http';
import type {
  PolymorphicQRInput,
  QRGenerationResult,
  ProcessorConfig,
  UpdateProcessorRequest,
} from '@caldera/platformxe-types';

/** Batch QR generation input */
export interface BatchQRInput {
  items: PolymorphicQRInput[];
}

/** Batch QR generation result */
export interface BatchQRResult {
  results: QRGenerationResult[];
  totalGenerated: number;
  errors: string[];
}

export class QrResource {
  constructor(private http: HttpClient) {}

  /** Generate a single QR code */
  async generate(input: PolymorphicQRInput): Promise<QRGenerationResult> {
    return this.http.post<QRGenerationResult>('/api/v1/qr', input);
  }

  /** Generate QR codes in batch */
  async generateBatch(input: BatchQRInput): Promise<BatchQRResult> {
    return this.http.post<BatchQRResult>('/api/v1/qr/batch', input);
  }

  /** Get the QR processor configuration */
  async getProcessor(): Promise<ProcessorConfig> {
    return this.http.get<ProcessorConfig>('/api/v1/qr/processor');
  }

  /** Update the QR processor configuration */
  async updateProcessor(input: UpdateProcessorRequest): Promise<ProcessorConfig> {
    return this.http.put<ProcessorConfig>('/api/v1/qr/processor', input);
  }
}
