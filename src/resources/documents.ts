// =============================================================================
// DocumentsResource — Fixed storage (documents & folders, deletion overrides)
// =============================================================================

import type { HttpClient } from '../http';
import type {
  CreateDocumentInput,
  DocumentWithMeta,
  UpdateDocumentInput,
  ListDocumentsOptions,
  DocumentListResult,
  RequestDeletionOverrideInput,
  ApproveDeletionOverrideInput,
  DeletionOverrideWithMeta,
} from '@caldera/platformxe-types';

/** Folder creation input */
export interface CreateFolderInput {
  name: string;
  parentId?: string;
  description?: string;
}

/** Folder record */
export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  description: string | null;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
}

export class DocumentsResource {
  constructor(private http: HttpClient) {}

  /** Create a new document */
  async create(input: CreateDocumentInput): Promise<DocumentWithMeta> {
    return this.http.post<DocumentWithMeta>('/api/v1/storage/fixed/documents', input);
  }

  /** List documents with optional filters */
  async list(options?: ListDocumentsOptions): Promise<DocumentListResult> {
    return this.http.get<DocumentListResult>(
      '/api/v1/storage/fixed/documents',
      options as Record<string, string | number | boolean | undefined>,
    );
  }

  /** Get a document by ID */
  async get(documentId: string): Promise<DocumentWithMeta> {
    return this.http.get<DocumentWithMeta>(`/api/v1/storage/fixed/documents/${documentId}`);
  }

  /** Update a document */
  async update(documentId: string, input: UpdateDocumentInput): Promise<DocumentWithMeta> {
    return this.http.patch<DocumentWithMeta>(`/api/v1/storage/fixed/documents/${documentId}`, input);
  }

  /** Delete a document (may require override if protected) */
  async delete(documentId: string): Promise<void> {
    return this.http.del<void>(`/api/v1/storage/fixed/documents/${documentId}`);
  }

  // ── Folders ──────────────────────────────────────────────────────────────

  /** Create a folder */
  async createFolder(input: CreateFolderInput): Promise<Folder> {
    return this.http.post<Folder>('/api/v1/storage/fixed/folders', input);
  }

  /** Get a folder by ID (includes child documents) */
  async getFolder(folderId: string): Promise<Folder> {
    return this.http.get<Folder>(`/api/v1/storage/fixed/folders/${folderId}`);
  }

  // ── Deletion Overrides ───────────────────────────────────────────────────

  /** Request a deletion override for a protected document */
  async requestOverride(input: RequestDeletionOverrideInput): Promise<DeletionOverrideWithMeta> {
    return this.http.post<DeletionOverrideWithMeta>('/api/v1/storage/fixed/overrides', input);
  }

  /** Approve or reject a deletion override request */
  async processOverride(overrideId: string, input: ApproveDeletionOverrideInput): Promise<DeletionOverrideWithMeta> {
    return this.http.patch<DeletionOverrideWithMeta>(`/api/v1/storage/fixed/overrides/${overrideId}`, input);
  }
}
