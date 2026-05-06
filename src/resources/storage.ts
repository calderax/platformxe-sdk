// =============================================================================
// StorageResource — Media file upload, listing, and management
// =============================================================================

import type { HttpClient } from '../http';
import type {
  UploadFileRequest,
  UploadResult,
  BatchUploadRequest,
  BatchUploadResult,
  SignUploadRequest,
  SignUploadResult,
  RegisterFileRequest,
  RegisterFileResult,
  StorageFile,
  ProcessorConfig,
  UpdateProcessorRequest,
} from '@caldera/platformxe-types';

/** Parameters for listing media files */
export interface ListMediaParams {
  module?: string;
  entityId?: string;
  category?: string;
  page?: number;
  limit?: number;
}

/** Reorder request body */
export interface ReorderFilesInput {
  fileIds: string[];
}

/** Reorder response */
export interface ReorderFilesResult {
  updated: number;
}

export class StorageResource {
  constructor(private http: HttpClient) {}

  /** Upload a single file (base64-encoded) */
  async upload(input: UploadFileRequest): Promise<UploadResult> {
    return this.http.post<UploadResult>('/api/v1/storage/media/upload', input);
  }

  /** Upload multiple files in a single request */
  async batchUpload(input: BatchUploadRequest): Promise<BatchUploadResult> {
    return this.http.post<BatchUploadResult>('/api/v1/storage/media/upload/batch', input);
  }

  /** Get a presigned upload URL for direct browser uploads */
  async signUpload(input: SignUploadRequest): Promise<SignUploadResult> {
    return this.http.post<SignUploadResult>('/api/v1/storage/media/sign-upload', input);
  }

  /** Register a file after a presigned upload completes */
  async register(input: RegisterFileRequest): Promise<RegisterFileResult> {
    return this.http.post<RegisterFileResult>('/api/v1/storage/media/register', input);
  }

  /** List media files for an entity */
  async list(params?: ListMediaParams): Promise<StorageFile[]> {
    return this.http.get<StorageFile[]>('/api/v1/storage/media/files', params as Record<string, string | number | boolean | undefined>);
  }

  /** Get a single file by ID */
  async get(fileId: string): Promise<StorageFile> {
    return this.http.get<StorageFile>(`/api/v1/storage/media/files/${fileId}`);
  }

  /** Delete a file by ID */
  async delete(fileId: string): Promise<void> {
    return this.http.del<void>(`/api/v1/storage/media/files/${fileId}`);
  }

  /** Reorder files (set display order) */
  async reorder(input: ReorderFilesInput): Promise<ReorderFilesResult> {
    return this.http.post<ReorderFilesResult>('/api/v1/storage/media/reorder', input);
  }

  /** Get the storage processor configuration */
  async getProcessor(): Promise<ProcessorConfig> {
    return this.http.get<ProcessorConfig>('/api/v1/storage/processor');
  }

  /** Update the storage processor configuration */
  async updateProcessor(input: UpdateProcessorRequest): Promise<ProcessorConfig> {
    return this.http.put<ProcessorConfig>('/api/v1/storage/processor', input);
  }
}
