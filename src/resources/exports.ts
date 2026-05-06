// =============================================================================
// ExportsResource — Data export creation & retrieval
// =============================================================================

import type { HttpClient } from '../http';
import type {
  CreateExportInput,
  ExportRecord,
  ProcessorConfig,
  UpdateProcessorRequest,
} from '@caldera/platformxe-types';

export class ExportsResource {
  constructor(private http: HttpClient) {}

  /** Create a new data export */
  async create(input: CreateExportInput): Promise<ExportRecord> {
    return this.http.post<ExportRecord>('/api/v1/exports', input);
  }

  /** Get an export by ID (check status / download URL) */
  async get(exportId: string): Promise<ExportRecord> {
    return this.http.get<ExportRecord>(`/api/v1/exports/${exportId}`);
  }

  /** Get the exports processor configuration */
  async getProcessor(): Promise<ProcessorConfig> {
    return this.http.get<ProcessorConfig>('/api/v1/exports/processor');
  }

  /** Update the exports processor configuration */
  async updateProcessor(input: UpdateProcessorRequest): Promise<ProcessorConfig> {
    return this.http.put<ProcessorConfig>('/api/v1/exports/processor', input);
  }
}
