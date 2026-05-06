// =============================================================================
// MarketplaceResource Tests (Phase 9C — SDK 1.3.0)
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpClient } from '../http';
import { EventsResource, MarketplaceResource } from '../resources/events';

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

describe('MarketplaceResource', () => {
  let resource: MarketplaceResource;

  beforeEach(() => {
    mockFetch.mockReset();
    const http = new HttpClient({
      apiKey: 'pxk_test_xxx',
      baseUrl: 'https://platformxe.test',
      timeout: 5000,
      retries: 0,
      retryDelay: 0,
    });
    resource = new MarketplaceResource(http);
  });

  it('publish POSTs to /api/v1/events/custom/marketplace/publish', async () => {
    mockFetch.mockResolvedValueOnce(
      ok(
        {
          id: 'mkl_1',
          publisherOrganizationId: 'org_pub',
          namespace: 'lettings',
          name: 'property.favorited',
          version: '1.0.0',
          sourceCanonicalName: 'TENANT_CUSTOM:org_pub:lettings.property.favorited@1.0.0',
          title: 'Property favorited',
          description: null,
          tags: [],
          status: 'published',
          forkCount: 0,
          publishedBy: 'usr',
          publishedAt: '2026-05-05T10:00:00Z',
          unpublishedAt: null,
          createdAt: '2026-05-05T10:00:00Z',
          updatedAt: '2026-05-05T10:00:00Z',
        },
        201,
      ),
    );
    const r = await resource.publish({
      registrationId: 'cer_1',
      title: 'Property favorited',
    });
    expect(r.id).toBe('mkl_1');
    const [url, init] = mockFetch.mock.calls[0];
    expect(String(url)).toMatch(/\/marketplace\/publish$/);
    expect((init as RequestInit).method).toBe('POST');
  });

  it('list GETs with filters', async () => {
    mockFetch.mockResolvedValueOnce(ok({ listings: [], total: 0, limit: 25, offset: 0 }));
    await resource.list({ namespace: 'lettings', status: 'published', search: 'foo', limit: 10 });
    const [url] = mockFetch.mock.calls[0];
    expect(String(url)).toContain('namespace=lettings');
    expect(String(url)).toContain('status=published');
    expect(String(url)).toContain('search=foo');
    expect(String(url)).toContain('limit=10');
  });

  it('get returns the detail shape', async () => {
    mockFetch.mockResolvedValueOnce(
      ok({
        id: 'mkl_1',
        publisherOrganizationId: 'org_pub',
        namespace: 'lettings',
        name: 'property.favorited',
        version: '1.0.0',
        sourceCanonicalName: 'TENANT_CUSTOM:org_pub:lettings.property.favorited@1.0.0',
        title: 'Property favorited',
        description: 'desc',
        tags: ['lettings'],
        status: 'published',
        forkCount: 3,
        publishedBy: 'usr',
        publishedAt: '2026-05-05T10:00:00Z',
        unpublishedAt: null,
        createdAt: '2026-05-05T10:00:00Z',
        updatedAt: '2026-05-05T10:00:00Z',
        payloadSchema: { type: 'object' },
        payloadExample: null,
      }),
    );
    const r = await resource.get('mkl_1');
    expect(r.payloadSchema).toEqual({ type: 'object' });
    expect(r.forkCount).toBe(3);
  });

  it('unpublish DELETEs the listing', async () => {
    mockFetch.mockResolvedValueOnce(
      ok({ id: 'mkl_1', status: 'unpublished', unpublishedAt: '2026-05-05T11:00:00Z' }),
    );
    const r = await resource.unpublish('mkl_1');
    expect(r.status).toBe('unpublished');
    const [url, init] = mockFetch.mock.calls[0];
    expect(String(url)).toMatch(/\/marketplace\/mkl_1$/);
    expect((init as RequestInit).method).toBe('DELETE');
  });

  it('republish POSTs to /:id/republish', async () => {
    mockFetch.mockResolvedValueOnce(
      ok({
        id: 'mkl_1',
        publisherOrganizationId: 'org_pub',
        namespace: 'lettings',
        name: 'property.favorited',
        version: '1.0.0',
        sourceCanonicalName: 'TENANT_CUSTOM:org_pub:lettings.property.favorited@1.0.0',
        title: 'Property favorited',
        description: null,
        tags: [],
        status: 'published',
        forkCount: 0,
        publishedBy: 'usr',
        publishedAt: '2026-05-05T10:00:00Z',
        unpublishedAt: null,
        createdAt: '2026-05-05T10:00:00Z',
        updatedAt: '2026-05-05T11:00:00Z',
      }),
    );
    const r = await resource.republish('mkl_1');
    expect(r.status).toBe('published');
    const [url] = mockFetch.mock.calls[0];
    expect(String(url)).toMatch(/\/marketplace\/mkl_1\/republish$/);
  });

  it('fork POSTs to /:id/fork with the body', async () => {
    mockFetch.mockResolvedValueOnce(
      ok(
        {
          forkId: 'mkf_1',
          forkRegistrationId: 'cer_fork',
          forkCanonicalName: 'TENANT_CUSTOM:org_consumer:consumer.lead.favorited@1.0.0',
          sourceCanonicalName: 'TENANT_CUSTOM:org_pub:lettings.property.favorited@1.0.0',
        },
        201,
      ),
    );
    const r = await resource.fork('mkl_1', {
      namespace: 'consumer',
      name: 'lead.favorited',
    });
    expect(r.forkId).toBe('mkf_1');
    const [url, init] = mockFetch.mock.calls[0];
    expect(String(url)).toMatch(/\/marketplace\/mkl_1\/fork$/);
    expect((init as RequestInit).method).toBe('POST');
  });
});

describe('EventsResource.custom.marketplace is mounted', () => {
  it('exposes a MarketplaceResource at .marketplace', () => {
    const http = new HttpClient({
      apiKey: 'pxk_test_xxx',
      baseUrl: 'https://platformxe.test',
      timeout: 5000,
      retries: 0,
      retryDelay: 0,
    });
    const events = new EventsResource(http);
    expect(events.custom.marketplace).toBeInstanceOf(MarketplaceResource);
  });
});
