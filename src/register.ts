// =============================================================================
// register — Standalone developer self-registration
// =============================================================================
//
// `POST /api/v1/register` is the unauthenticated bootstrap endpoint for new
// developers. It can't sit on `PlatformXeClient` because constructing the
// client requires an API key; this function gets you the key in the first
// place.
//
// Usage:
//   import { register, PlatformXeClient } from '@caldera/platformxe-sdk';
//   const r = await register({ name: 'Acme', email: 'dev@acme.test' });
//   const client = new PlatformXeClient({ apiKey: r.apiKey });
//
// Save `r.apiKey` immediately — it can never be retrieved again.
// =============================================================================

import type { RegisterRequest, RegisterResponse } from '@caldera/platformxe-types';
import { PlatformXeError, ValidationError } from './errors';

export interface RegisterOptions {
  /** Override the platform base URL. Defaults to 'https://platformxe.com'. */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to 10000. */
  timeout?: number;
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiError {
  success: false;
  error: { code: string; message: string };
}

/**
 * Self-register a developer tenant and receive an API key.
 *
 * Creates a FREE-tier tenant with a slug suffixed `-dev` and returns a
 * `pxk_dev_…` API key that must be saved by the caller — the platform
 * does not retain a way to retrieve it.
 */
export async function register(
  input: RegisterRequest,
  options: RegisterOptions = {},
): Promise<RegisterResponse> {
  const baseUrl = options.baseUrl ?? 'https://platformxe.com';
  const timeout = options.timeout ?? 10000;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${baseUrl}/api/v1/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    const json = (await response.json()) as ApiSuccess<RegisterResponse> | ApiError;

    if (!json.success) {
      if (response.status === 400) throw new ValidationError(json.error.message);
      throw new PlatformXeError(json.error.message, json.error.code, response.status);
    }

    return json.data;
  } finally {
    clearTimeout(timeoutId);
  }
}
