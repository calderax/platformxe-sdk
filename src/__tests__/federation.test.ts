// =============================================================================
// FederationResource Tests (Phase 9D — SDK 1.4.0)
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpClient } from '../http';
import { EventsResource, FederationResource } from '../resources/events';

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

const baseGroup = {
  id: 'cefg_1',
  ownerOrganizationId: 'org_owner',
  name: 'Partners',
  description: null,
  createdBy: 'usr',
  createdAt: '2026-05-05T10:00:00Z',
  updatedAt: '2026-05-05T10:00:00Z',
  archivedAt: null,
  callerRole: 'owner' as const,
  memberCount: 0,
  pushCount: 0,
};

const baseMember = {
  id: 'cefm_1',
  groupId: 'cefg_1',
  memberOrganizationId: 'org_peer',
  status: 'pending' as const,
  invitedBy: 'usr',
  invitedAt: '2026-05-05T10:00:00Z',
  acceptedBy: null,
  acceptedAt: null,
  pausedBy: null,
  pausedAt: null,
  removedBy: null,
  removedAt: null,
};

const basePush = {
  id: 'cefp_1',
  groupId: 'cefg_1',
  sourceRegistrationId: 'cer_1',
  sourceOrganizationId: 'org_owner',
  namespace: 'lettings',
  name: 'property.favorited',
  version: '1.0.0',
  sourceCanonicalName: 'TENANT_CUSTOM:org_owner:lettings.property.favorited@1.0.0',
  pushedBy: 'usr',
  pushedAt: '2026-05-05T10:00:00Z',
  unpushedBy: null,
  unpushedAt: null,
  isActive: true,
};

describe('FederationResource', () => {
  let resource: FederationResource;

  beforeEach(() => {
    mockFetch.mockReset();
    const http = new HttpClient({
      apiKey: 'pxk_test_xxx',
      baseUrl: 'https://platformxe.test',
      timeout: 5000,
      retries: 0,
      retryDelay: 0,
    });
    resource = new FederationResource(http);
  });

  it('createGroup POSTs to /federation/groups', async () => {
    mockFetch.mockResolvedValueOnce(ok(baseGroup, 201));
    const r = await resource.createGroup({ name: 'Partners' });
    expect(r.id).toBe('cefg_1');
    const [url, init] = mockFetch.mock.calls[0];
    expect(String(url)).toMatch(/\/federation\/groups$/);
    expect((init as RequestInit).method).toBe('POST');
  });

  it('listGroups GETs /federation/groups (passing includeArchived through)', async () => {
    mockFetch.mockResolvedValueOnce(ok({ groups: [baseGroup] }));
    await resource.listGroups({ includeArchived: true });
    const [url] = mockFetch.mock.calls[0];
    expect(String(url)).toContain('/federation/groups');
    expect(String(url)).toContain('includeArchived=true');
  });

  it('getGroup GETs /federation/groups/:id', async () => {
    mockFetch.mockResolvedValueOnce(
      ok({ ...baseGroup, members: [], pushes: [] }),
    );
    const r = await resource.getGroup('cefg_1');
    expect(r.id).toBe('cefg_1');
    const [url] = mockFetch.mock.calls[0];
    expect(String(url)).toMatch(/\/federation\/groups\/cefg_1$/);
  });

  it('archiveGroup DELETEs /federation/groups/:id', async () => {
    mockFetch.mockResolvedValueOnce(ok({ ...baseGroup, archivedAt: '2026-05-05T11:00:00Z' }));
    await resource.archiveGroup('cefg_1');
    const [url, init] = mockFetch.mock.calls[0];
    expect(String(url)).toMatch(/\/federation\/groups\/cefg_1$/);
    expect((init as RequestInit).method).toBe('DELETE');
  });

  it('invite POSTs to /federation/groups/:id/invite with the body', async () => {
    mockFetch.mockResolvedValueOnce(ok(baseMember, 201));
    await resource.invite('cefg_1', { memberOrganizationId: 'org_peer' });
    const [url, init] = mockFetch.mock.calls[0];
    expect(String(url)).toMatch(/\/federation\/groups\/cefg_1\/invite$/);
    expect((init as RequestInit).method).toBe('POST');
    expect(JSON.parse(((init as RequestInit).body as string) ?? '{}')).toEqual({
      memberOrganizationId: 'org_peer',
    });
  });

  it('accept POSTs to /federation/groups/:id/accept', async () => {
    mockFetch.mockResolvedValueOnce(ok({ ...baseMember, status: 'accepted' }));
    await resource.accept('cefg_1');
    const [url, init] = mockFetch.mock.calls[0];
    expect(String(url)).toMatch(/\/federation\/groups\/cefg_1\/accept$/);
    expect((init as RequestInit).method).toBe('POST');
  });

  it('leave POSTs to /federation/groups/:id/leave', async () => {
    mockFetch.mockResolvedValueOnce(ok({ ...baseMember, status: 'removed' }));
    await resource.leave('cefg_1');
    const [url, init] = mockFetch.mock.calls[0];
    expect(String(url)).toMatch(/\/federation\/groups\/cefg_1\/leave$/);
    expect((init as RequestInit).method).toBe('POST');
  });

  it('declarePush POSTs to /federation/groups/:id/pushes with the body', async () => {
    mockFetch.mockResolvedValueOnce(ok(basePush, 201));
    await resource.declarePush('cefg_1', { registrationId: 'cer_1' });
    const [url, init] = mockFetch.mock.calls[0];
    expect(String(url)).toMatch(/\/federation\/groups\/cefg_1\/pushes$/);
    expect((init as RequestInit).method).toBe('POST');
    expect(JSON.parse(((init as RequestInit).body as string) ?? '{}')).toEqual({
      registrationId: 'cer_1',
    });
  });

  it('listPushes GETs /federation/groups/:id/pushes (passing includeInactive through)', async () => {
    mockFetch.mockResolvedValueOnce(ok({ pushes: [basePush] }));
    await resource.listPushes('cefg_1', { includeInactive: true });
    const [url] = mockFetch.mock.calls[0];
    expect(String(url)).toContain('/federation/groups/cefg_1/pushes');
    expect(String(url)).toContain('includeInactive=true');
  });

  it('undeclarePush DELETEs /federation/pushes/:id', async () => {
    mockFetch.mockResolvedValueOnce(ok({ ...basePush, isActive: false, unpushedAt: '2026-05-05T11:00:00Z' }));
    await resource.undeclarePush('cefp_1');
    const [url, init] = mockFetch.mock.calls[0];
    expect(String(url)).toMatch(/\/federation\/pushes\/cefp_1$/);
    expect((init as RequestInit).method).toBe('DELETE');
  });
});

describe('EventsResource.custom.federation is mounted', () => {
  it('exposes a FederationResource at .federation', () => {
    const http = new HttpClient({
      apiKey: 'pxk_test_xxx',
      baseUrl: 'https://platformxe.test',
      timeout: 5000,
      retries: 0,
      retryDelay: 0,
    });
    const events = new EventsResource(http);
    expect(events.custom.federation).toBeInstanceOf(FederationResource);
  });
});
