// =============================================================================
// DocumentsResource Tests
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpClient } from '../http';
import { DocumentsResource } from '../resources/documents';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function ok(data: unknown) {
  return {
    status: 200,
    json: () => Promise.resolve({ success: true, data }),
    headers: new Headers(),
  };
}

describe('DocumentsResource', () => {
  let resource: DocumentsResource;

  beforeEach(() => {
    mockFetch.mockReset();
    const http = new HttpClient({
      apiKey: 'test-key',
      baseUrl: 'https://platformx.calderasuite.com',
      timeout: 5000,
      retries: 0,
      retryDelay: 0,
    });
    resource = new DocumentsResource(http);
  });

  // ── create ────────────────────────────────────────────────────────────

  it('create calls POST /api/v1/storage/fixed/documents', async () => {
    const responseData = { id: 'doc_1', title: 'Test Doc' };
    mockFetch.mockResolvedValue(ok(responseData));

    const result = await resource.create({
      title: 'Test Doc',
      category: 'CONTRACT',
      fileType: 'PDF',
      space: 'INTERNAL',
    });

    expect(result).toEqual(responseData);

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://platformx.calderasuite.com/api/v1/storage/fixed/documents');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toMatchObject({ title: 'Test Doc', category: 'CONTRACT' });
  });

  // ── list ──────────────────────────────────────────────────────────────

  it('list calls GET /api/v1/storage/fixed/documents with filters', async () => {
    const responseData = { documents: [], total: 0, page: 1, limit: 20, totalPages: 0 };
    mockFetch.mockResolvedValue(ok(responseData));

    await resource.list({ space: 'INTERNAL', category: 'CONTRACT', page: 1, limit: 20 });

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain('/api/v1/storage/fixed/documents');
    expect(url).toContain('space=INTERNAL');
    expect(url).toContain('category=CONTRACT');
    expect(init.method).toBe('GET');
  });

  // ── get ───────────────────────────────────────────────────────────────

  it('get calls GET /api/v1/storage/fixed/documents/:id', async () => {
    const responseData = { id: 'doc_1', title: 'My Doc' };
    mockFetch.mockResolvedValue(ok(responseData));

    const result = await resource.get('doc_1');

    expect(result).toEqual(responseData);

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://platformx.calderasuite.com/api/v1/storage/fixed/documents/doc_1');
    expect(init.method).toBe('GET');
  });

  // ── update ────────────────────────────────────────────────────────────

  it('update calls PATCH /api/v1/storage/fixed/documents/:id', async () => {
    const responseData = { id: 'doc_1', title: 'Updated Title' };
    mockFetch.mockResolvedValue(ok(responseData));

    const result = await resource.update('doc_1', { title: 'Updated Title' });

    expect(result).toEqual(responseData);

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://platformx.calderasuite.com/api/v1/storage/fixed/documents/doc_1');
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body)).toMatchObject({ title: 'Updated Title' });
  });

  // ── delete ────────────────────────────────────────────────────────────

  it('delete calls DELETE /api/v1/storage/fixed/documents/:id', async () => {
    mockFetch.mockResolvedValue(ok(null));

    await resource.delete('doc_1');

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://platformx.calderasuite.com/api/v1/storage/fixed/documents/doc_1');
    expect(init.method).toBe('DELETE');
  });
});
