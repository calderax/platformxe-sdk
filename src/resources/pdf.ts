// =============================================================================
// PdfResource — PDF generation (offer letters, property flyers)
// =============================================================================

import type { HttpClient } from '../http';
import type {
  OfferLetterPdfRequest,
  OfferLetterPdfResponse,
  FlyerGenerationInput,
  FlyerGenerationResult,
  ProcessorConfig,
  UpdateProcessorRequest,
} from '@caldera/platformxe-types';

export class PdfResource {
  constructor(private http: HttpClient) {}

  /** Generate an offer letter PDF */
  async offerLetter(input: OfferLetterPdfRequest): Promise<OfferLetterPdfResponse> {
    return this.http.post<OfferLetterPdfResponse>('/api/v1/pdf/offer-letter', input);
  }

  /** Generate a property flyer PDF */
  async propertyFlyer(input: FlyerGenerationInput): Promise<FlyerGenerationResult> {
    return this.http.post<FlyerGenerationResult>('/api/v1/pdf/property-flyer', input);
  }

  /** Get the PDF processor configuration */
  async getProcessor(): Promise<ProcessorConfig> {
    return this.http.get<ProcessorConfig>('/api/v1/pdf/processor');
  }

  /** Update the PDF processor configuration */
  async updateProcessor(input: UpdateProcessorRequest): Promise<ProcessorConfig> {
    return this.http.put<ProcessorConfig>('/api/v1/pdf/processor', input);
  }
}
