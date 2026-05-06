// =============================================================================
// CustomEventsResource Tests (Phase 9A.7c)
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpClient } from '../http';
import { EventsResource, CustomEventsResource } from '../resources/events';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function ok(data: unknown, status = 200) {
  return {
    ok: true,
    status,
    json: () => Promise.resolve({ success: true, data }),
    headers: new Headers(),
  };
}

describe('CustomEventsResource', () => {
  let resource: CustomEventsResource;

  beforeEach(() => {
    mockFetch.mockReset();
    const http = new HttpClient({
      apiKey: 'pxk_test_xxx',
      baseUrl: 'https://platformxe.test',
      timeout: 5000,
      retries: 0,
      retryDelay: 0,
    });
    resource = new CustomEventsResource(http);
  });

  it('register POSTs to /api/v1/events/custom', async () => {
    mockFetch.mockResolvedValueOnce(
      ok({
        id: 'cer_1',
        organizationId: 'org_1',
        canonicalName: 'TENANT_CUSTOM:org_1:lettings.foo@1.0.0',
        namespace: 'lettings',
        name: 'foo',
        version: '1.0.0',
        status: 'published',
        description: null,
        registeredBy: 'lettings',
        schemaHash: 'a'.repeat(64),
        schemaFlavour: 'json-schema-2020-12',
        semverBump: 'initial',
        createdAt: '2026-05-05T00:00:00Z',
        updatedAt: '2026-05-05T00:00:00Z',
      }),
    );

    const r = await resource.register({
      namespace: 'lettings',
      name: 'foo',
      version: '1.0.0',
      payloadSchema: { type: 'object' },
    });

    expect(r.id).toBe('cer_1');
    expect(r.semverBump).toBe('initial');
    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, init] = mockFetch.mock.calls[0];
    expect(String(url)).toMatch(/\/api\/v1\/events\/custom$/);
    expect((init as RequestInit).method).toBe('POST');
  });

  it('list GETs /api/v1/events/custom with params', async () => {
    mockFetch.mockResolvedValueOnce(ok({ events: [] }));

    await resource.list({ namespace: 'lettings', status: 'published' });

    const [url] = mockFetch.mock.calls[0];
    expect(String(url)).toContain('namespace=lettings');
    expect(String(url)).toContain('status=published');
  });

  it('archive DELETEs /api/v1/events/custom/:id', async () => {
    mockFetch.mockResolvedValueOnce(
      ok({ id: 'cer_1', status: 'archived', archivedAt: '2026-05-05T00:00:00Z' }),
    );

    const r = await resource.archive('cer_1');
    expect(r.status).toBe('archived');

    const [url, init] = mockFetch.mock.calls[0];
    expect(String(url)).toMatch(/\/events\/custom\/cer_1$/);
    expect((init as RequestInit).method).toBe('DELETE');
  });

  it('emit POSTs to /api/v1/events/custom/emit', async () => {
    mockFetch.mockResolvedValueOnce(
      ok(
        {
          emitId: 'cee_1',
          canonicalName: 'TENANT_CUSTOM:org_1:lettings.foo@1.0.0',
          status: 'queued',
        },
        202,
      ),
    );

    const r = await resource.emit({
      name: 'lettings.foo',
      version: '1.0.0',
      payload: { id: 1 },
    });
    expect(r.status).toBe('queued');
  });

  it('subscribe POSTs to /api/v1/events/custom/subscribe', async () => {
    mockFetch.mockResolvedValueOnce(
      ok({
        subscriptionId: 'evs_1',
        canonicalName: 'TENANT_CUSTOM:org_1:lettings.foo@1.0.0',
        secret: 'whsec_xxx',
        webhookUrl: 'https://example.com/hook',
      }),
    );
    const r = await resource.subscribe({
      name: 'lettings.foo',
      version: '1.0.0',
      webhookUrl: 'https://example.com/hook',
    });
    expect(r.subscriptionId).toBe('evs_1');
    expect(r.secret).toMatch(/^whsec_/);
  });

  it('health GETs /api/v1/events/custom/health', async () => {
    mockFetch.mockResolvedValueOnce(
      ok({
        plan: 'BASIC',
        registrations: { used: 1, limit: 5 },
        emits: { thisMonth: 0, monthlyLimit: 10000 },
        capabilities: {
          canRegister: true,
          schemaVersioning: false,
          marketplacePublish: false,
          marketplaceFork: false,
          federationPush: false,
        },
        recentFailures: [],
      }),
    );
    const h = await resource.health();
    expect(h.plan).toBe('BASIC');
  });

  it('dryRun POSTs to /api/v1/events/custom/dry-run', async () => {
    mockFetch.mockResolvedValueOnce(
      ok({
        valid: true,
        schemaHash: 'a'.repeat(64),
        schemaFlavour: 'json-schema-2020-12',
        semverBump: 'initial',
        schemaDepth: 1,
        schemaPropertyCount: 2,
      }),
    );
    const r = await resource.dryRun({
      namespace: 'lettings',
      name: 'foo',
      version: '1.0.0',
      payloadSchema: { type: 'object' },
    });
    expect(r.valid).toBe(true);
  });
});

describe('EventsResource.custom is mounted', () => {
  it('exposes a CustomEventsResource instance at .custom', () => {
    const http = new HttpClient({
      apiKey: 'pxk_test_xxx',
      baseUrl: 'https://platformxe.test',
      timeout: 5000,
      retries: 0,
      retryDelay: 0,
    });
    const events = new EventsResource(http);
    expect(events.custom).toBeInstanceOf(CustomEventsResource);
  });
});
