// =============================================================================
// @caldera/platformxe-sdk — Error Classes
// =============================================================================

export class PlatformXeError extends Error {
  readonly code: string;
  readonly status: number;
  readonly requestId?: string;

  constructor(message: string, code: string, status: number, requestId?: string) {
    super(message);
    this.name = 'PlatformXeError';
    this.code = code;
    this.status = status;
    this.requestId = requestId;
  }
}

export class AuthenticationError extends PlatformXeError {
  constructor(message = 'Invalid or missing API key') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends PlatformXeError {
  readonly retryAfter?: number;

  constructor(message = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 'RATE_LIMITED', 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class ValidationError extends PlatformXeError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends PlatformXeError {
  constructor(message = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class TimeoutError extends PlatformXeError {
  constructor(timeoutMs: number) {
    super(`Request timed out after ${timeoutMs}ms`, 'TIMEOUT', 0);
    this.name = 'TimeoutError';
  }
}
