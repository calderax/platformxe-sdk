// =============================================================================
// StorageResource Tests
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpClient } from '../http';
import { StorageResource } from '../resources/storage';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function ok(data: unknown) {
  return {
    status: 200,
    json: () => Promise.resolve({ success: true, data }),
    headers: new Headers(),
  };
}

describe('StorageResource', () => {
  let resource: StorageResource;

  beforeEach(() => {
    mockFetch.mockReset();
    const http = new HttpClient({
      apiKey: 'test-key',
      baseUrl: 'https://platformx.calderasuite.com',
      timeout: 5000,
      retries: 0,
      retryDelay: 0,
    });
    resource = new StorageResource(http);
  });

  // ── upload ────────────────────────────────────────────────────────────

  it('upload calls POST /api/v1/storage/media/upload', async () => {
    const responseData = { id: 'file_1', url: 'https://cdn.example.com/file.png' };
    mockFetch.mockResolvedValue(ok(responseData));

    const result = await resource.upload({
      module: 'properties',
      entityId: 'prop_1',
      filename: 'photo.png',
      mimeType: 'image/png',
      content: 'base64data==',
    });

    expect(result).toEqual(responseData);

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://platformx.calderasuite.com/api/v1/storage/media/upload');
    expect(init.method).toBe('POST');
  });

  // ── list ──────────────────────────────────────────────────────────────

  it('list calls GET /api/v1/storage/media/files with params', async () => {
    mockFetch.mockResolvedValue(ok([]));

    await resource.list({ module: 'properties', entityId: 'prop_1' });

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain('/api/v1/storage/media/files');
    expect(url).toContain('module=properties');
    expect(url).toContain('entityId=prop_1');
    expect(init.method).toBe('GET');
  });

  // ── get ───────────────────────────────────────────────────────────────

  it('get calls GET /api/v1/storage/media/files/:id', async () => {
    const responseData = { id: 'file_1', originalFilename: 'photo.png' };
    mockFetch.mockResolvedValue(ok(responseData));

    const result = await resource.get('file_1');

    expect(result).toEqual(responseData);

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://platformx.calderasuite.com/api/v1/storage/media/files/file_1');
    expect(init.method).toBe('GET');
  });

  // ── delete ────────────────────────────────────────────────────────────

  it('delete calls DELETE /api/v1/storage/media/files/:id', async () => {
    mockFetch.mockResolvedValue(ok(null));

    await resource.delete('file_1');

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://platformx.calderasuite.com/api/v1/storage/media/files/file_1');
    expect(init.method).toBe('DELETE');
  });
});
