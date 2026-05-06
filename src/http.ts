// =============================================================================
// @caldera/platformxe-sdk — HTTP Transport Layer
// =============================================================================

import {
  PlatformXeError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  TimeoutError,
} from './errors';

export interface HttpClientOptions {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
}

interface ApiErrorResponse {
  success: false;
  error: { code: string; message: string };
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export class HttpClient {
  private readonly opts: HttpClientOptions;

  constructor(opts: HttpClientOptions) {
    this.opts = opts;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, params, headers } = options;

    let url = `${this.opts.baseUrl}${path}`;
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) searchParams.set(key, String(value));
      }
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.opts.retries; attempt++) {
      if (attempt > 0) {
        const delay = this.opts.retryDelay * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, delay));
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.opts.timeout);

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.opts.apiKey,
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Don't retry auth errors or validation errors
        if (response.status === 401) throw new AuthenticationError();
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('retry-after') ?? '', 10) || undefined;
          throw new RateLimitError('Rate limit exceeded', retryAfter);
        }

        const json = (await response.json()) as ApiResponse<T>;

        if (!json.success) {
          const err = json as ApiErrorResponse;
          if (response.status === 400) throw new ValidationError(err.error.message);
          if (response.status === 404) throw new NotFoundError(err.error.message);

          // 5xx errors are retryable
          if (response.status >= 500) {
            lastError = new PlatformXeError(err.error.message, err.error.code, response.status);
            continue; // retry
          }

          throw new PlatformXeError(err.error.message, err.error.code, response.status);
        }

        return (json as ApiSuccessResponse<T>).data;
      } catch (err) {
        if (err instanceof PlatformXeError) {
          // Don't retry client errors (4xx) except rate limits
          if (err.status > 0 && err.status < 500 && !(err instanceof RateLimitError)) throw err;
          lastError = err;
        } else if (err instanceof DOMException && err.name === 'AbortError') {
          lastError = new TimeoutError(this.opts.timeout);
        } else {
          lastError = err instanceof Error ? err : new Error(String(err));
        }
      }
    }

    throw lastError ?? new PlatformXeError('Request failed after retries', 'UNKNOWN', 0);
  }

  get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(path, { method: 'GET', params });
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'POST', body });
  }

  patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'PATCH', body });
  }

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'PUT', body });
  }

  del<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }
}
