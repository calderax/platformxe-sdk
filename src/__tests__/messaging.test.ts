// =============================================================================
// MessagingResource Tests
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpClient } from '../http';
import { MessagingResource } from '../resources/messaging';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function ok(data: unknown) {
  return {
    status: 200,
    json: () => Promise.resolve({ success: true, data }),
    headers: new Headers(),
  };
}

describe('MessagingResource', () => {
  let resource: MessagingResource;

  beforeEach(() => {
    mockFetch.mockReset();
    const http = new HttpClient({
      apiKey: 'test-key',
      baseUrl: 'https://platformx.calderasuite.com',
      timeout: 5000,
      retries: 0,
      retryDelay: 0,
    });
    resource = new MessagingResource(http);
  });

  // ── sendEmail ─────────────────────────────────────────────────────────

  it('sendEmail calls POST /api/v1/messaging/email/send', async () => {
    const responseData = { messageId: 'msg_1', provider: 'resend', queued: false };
    mockFetch.mockResolvedValue(ok(responseData));

    const result = await resource.sendEmail({
      from: 'Caldera <noreply@calderasuite.com>',
      to: ['user@example.com'],
      subject: 'Hello',
      html: '<p>Hi</p>',
    });

    expect(result).toEqual(responseData);

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://platformx.calderasuite.com/api/v1/messaging/email/send');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toMatchObject({
      from: 'Caldera <noreply@calderasuite.com>',
      to: ['user@example.com'],
      subject: 'Hello',
    });
  });

  // ── sendSms ───────────────────────────────────────────────────────────

  it('sendSms calls POST /api/v1/messaging/sms', async () => {
    const responseData = { success: true, messageId: 'sms_1', provider: 'termii' };
    mockFetch.mockResolvedValue(ok(responseData));

    const result = await resource.sendSms({
      to: '+2348012345678',
      message: 'Your OTP is 123456',
    });

    expect(result).toEqual(responseData);

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://platformx.calderasuite.com/api/v1/messaging/sms');
    expect(init.method).toBe('POST');
  });

  // ── sendWhatsApp ──────────────────────────────────────────────────────

  it('sendWhatsApp calls POST /api/v1/messaging/whatsapp', async () => {
    const responseData = { success: true, messageId: 'wa_1', provider: 'meta' };
    mockFetch.mockResolvedValue(ok(responseData));

    const result = await resource.sendWhatsApp({
      to: '+2348012345678',
      templateName: 'order_confirmation',
      templateParams: ['ORD-001'],
    });

    expect(result).toEqual(responseData);

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://platformx.calderasuite.com/api/v1/messaging/whatsapp');
    expect(init.method).toBe('POST');
  });

  // ── emailHealth ───────────────────────────────────────────────────────

  it('emailHealth calls GET /api/v1/messaging/email/health', async () => {
    const responseData = {
      providerOrder: ['resend', 'sendgrid'],
      providers: [],
      queue: { pending: 0, processing: 0, sent: 100, deadLetter: 0, total: 100 },
    };
    mockFetch.mockResolvedValue(ok(responseData));

    const result = await resource.emailHealth();

    expect(result).toEqual(responseData);

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://platformx.calderasuite.com/api/v1/messaging/email/health');
    expect(init.method).toBe('GET');
  });
});
