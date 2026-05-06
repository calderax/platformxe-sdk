// =============================================================================
// HttpClient Tests
// =============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpClient } from '../http';
import {
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  TimeoutError,
  PlatformXeError,
} from '../errors';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function createClient(overrides?: Partial<ConstructorParameters<typeof HttpClient>[0]>) {
  return new HttpClient({
    apiKey: 'test-key-123',
    baseUrl: 'https://platformx.calderasuite.com',
    timeout: 5000,
    retries: 2,
    retryDelay: 1, // instant retries for tests
    ...overrides,
  });
}

function jsonResponse(status: number, body: unknown, headers?: Record<string, string>) {
  return {
    status,
    json: () => Promise.resolve(body),
    headers: new Headers(headers),
  };
}

describe('HttpClient', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  // ── Headers ─────────────────────────────────────────────────────────────

  it('sends correct headers (x-api-key, Content-Type)', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(200, { success: true, data: { id: '1' } }),
    );

    const client = createClient();
    const promise = client.get('/api/v1/test');

    await promise;

    expect(mockFetch).toHaveBeenCalledOnce();
    const [, init] = mockFetch.mock.calls[0];
    expect(init.headers).toMatchObject({
      'Content-Type': 'application/json',
      'x-api-key': 'test-key-123',
    });
  });

  // ── Retry on 500 ───────────────────────────────────────────────────────

  it('retries on 500 errors', async () => {
    mockFetch
      .mockResolvedValueOnce(
        jsonResponse(500, { success: false, error: { code: 'SERVER_ERROR', message: 'Internal' } }),
      )
      .mockResolvedValueOnce(
        jsonResponse(500, { success: false, error: { code: 'SERVER_ERROR', message: 'Internal' } }),
      )
      .mockResolvedValueOnce(
        jsonResponse(200, { success: true, data: { ok: true } }),
      );

    const client = createClient();
    const promise = client.get('/api/v1/test');

    const result = await promise;

    expect(result).toEqual({ ok: true });
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  // ── 401 → AuthenticationError ─────────────────────────────────────────

  it('throws AuthenticationError on 401', async () => {
    mockFetch.mockResolvedValue(jsonResponse(401, {}));

    const client = createClient();
    const promise = client.get('/api/v1/test');


    await expect(promise).rejects.toThrow(AuthenticationError);
  });

  // ── 429 → RateLimitError ──────────────────────────────────────────────

  it('throws RateLimitError on 429', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(429, {}, { 'retry-after': '30' }),
    );

    const client = createClient({ retries: 0 });
    const promise = client.get('/api/v1/test');


    await expect(promise).rejects.toThrow(RateLimitError);
  });

  // ── 400 → ValidationError ────────────────────────────────────────────

  it('throws ValidationError on 400', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(400, {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid email' },
      }),
    );

    const client = createClient();
    const promise = client.get('/api/v1/test');


    await expect(promise).rejects.toThrow(ValidationError);
    await expect(promise).rejects.toThrow('Invalid email');
  });

  // ── 404 → NotFoundError ──────────────────────────────────────────────

  it('throws NotFoundError on 404', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(404, {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Resource not found' },
      }),
    );

    const client = createClient();
    const promise = client.get('/api/v1/test');


    await expect(promise).rejects.toThrow(NotFoundError);
  });

  // ── Timeout → TimeoutError ───────────────────────────────────────────

  it('throws TimeoutError on abort', async () => {
    mockFetch.mockImplementation((_url: string, init: RequestInit) => {
      return new Promise((_resolve, reject) => {
        const signal = init.signal!;
        signal.addEventListener('abort', () => {
          const err = new DOMException('The operation was aborted.', 'AbortError');
          reject(err);
        });
      });
    });

    const client = createClient({ timeout: 10, retries: 0 });
    await expect(client.get('/api/v1/test')).rejects.toThrow(TimeoutError);
  });

  // ── Query params ─────────────────────────────────────────────────────

  it('appends query params for GET', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(200, { success: true, data: [] }),
    );

    const client = createClient();
    const promise = client.get('/api/v1/items', { page: 2, limit: 10, active: true });

    await promise;

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('page=2');
    expect(url).toContain('limit=10');
    expect(url).toContain('active=true');
  });

  // ── No retry on 4xx (except 429) ─────────────────────────────────────

  it('does not retry 4xx errors (except 429)', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(400, {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Bad request' },
      }),
    );

    const client = createClient({ retries: 3 });
    const promise = client.get('/api/v1/test');


    await expect(promise).rejects.toThrow(ValidationError);
    expect(mockFetch).toHaveBeenCalledTimes(1); // no retries
  });

  // ── POST sends body ──────────────────────────────────────────────────

  it('sends JSON body for POST requests', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(200, { success: true, data: { id: 'abc' } }),
    );

    const client = createClient();
    const body = { name: 'Test', value: 42 };
    const promise = client.post('/api/v1/items', body);

    await promise;

    const [, init] = mockFetch.mock.calls[0];
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify(body));
  });

  // ── Exhausted retries throws last error ──────────────────────────────

  it('throws after exhausting retries on 500', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(500, {
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Down' },
      }),
    );

    const client = createClient({ retries: 1 });
    const promise = client.get('/api/v1/test');


    await expect(promise).rejects.toThrow(PlatformXeError);
    expect(mockFetch).toHaveBeenCalledTimes(2); // initial + 1 retry
  });
});
