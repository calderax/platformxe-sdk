// =============================================================================
// EventsResource — Event ingestion, log & subscriptions
// (nested .custom — tenant-defined event surface, Phase 9A.7c)
// =============================================================================

import type { HttpClient } from '../http';
import type {
  CreateEventSubscriptionInput,
  UpdateEventSubscriptionInput,
  EventSubscription,
  EventLogItem,
  ReplayInput,
  RegisterCustomEventRequest,
  RegisterCustomEventResponse,
  EmitCustomEventRequest,
  EmitCustomEventResponse,
  ListCustomEventsParams,
  ListCustomEventsResponse,
  CustomEventDetail,
  CustomEventStatus,
  ArchiveCustomEventResponse,
  DryRunCustomEventRequest,
  DryRunCustomEventResponse,
  CustomEventHealthResponse,
  SubscribeCustomEventRequest,
  SubscribeCustomEventResponse,
  // Marketplace (Phase 9C — types 2.5.0)
  PublishMarketplaceRequest,
  PublishMarketplaceResponse,
  ListMarketplaceParams,
  ListMarketplaceResponse,
  MarketplaceListingDetail,
  ForkMarketplaceRequest,
  ForkMarketplaceResponse,
  UnpublishMarketplaceResponse,
  RepublishMarketplaceResponse,
  // Federation push (Phase 9D — types 2.6.0)
  CreateFederationGroupRequest,
  FederationGroupSummary,
  FederationGroupDetail,
  FederationMemberSummary,
  FederationPushSummary,
  ListFederationGroupsResponse,
  ListFederationPushesResponse,
  InviteFederationMemberRequest,
  DeclareFederationPushRequest,
} from '@caldera/platformxe-types';

/** Event ingestion input */
export interface IngestEventInput {
  eventType: string;
  entityType?: string;
  entityId?: string;
  payload: Record<string, unknown>;
}

/** Event ingestion result */
export interface IngestEventResult {
  eventId: string;
  subscriptionsNotified: number;
}

/** Parameters for querying the event log */
export interface EventLogParams {
  eventType?: string;
  entityType?: string;
  entityId?: string;
  sourceApp?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

/** Replay result */
export interface ReplayResult {
  replayed: number;
  failed: number;
}

// =============================================================================
// Tenant Custom Events sub-resource (Phase 9A.7c)
// =============================================================================
//
// Mirrors the Python SDK's `client.events.custom.*` and the Go SDK's
// `client.Events.Custom.*` surface. Tenants register a typed event,
// emit payloads, and subscribe webhooks without hand-constructing
// canonical names.
//
// Endpoints map 1:1 to caldera-platformxe `feature/tenant-custom-events`
// (commits 9f97cd8 → d81fad3). Wire shapes come from
// @caldera/platformxe-types@^2.4.0.
// =============================================================================

export class CustomEventsResource {
  /**
   * Marketplace surface — publish + browse + fork. Available on PRO+
   * plans for publish/fork; browsing is open to all plans.
   *
   * Mirrors the Python SDK's `client.events.custom.marketplace` and the
   * Go SDK's `client.Events.Custom.Marketplace`.
   */
  readonly marketplace: MarketplaceResource;

  /**
   * Federation push surface — group-based event federation. ENTERPRISE-only
   * on both sides (owner and member). Owners create groups, invite peer
   * orgs, and declare per-version pushes; relays fan out automatically.
   *
   * Mirrors the Python SDK's `client.events.custom.federation` and the
   * Go SDK's `client.Events.Custom.Federation`.
   */
  readonly federation: FederationResource;

  constructor(private http: HttpClient) {
    this.marketplace = new MarketplaceResource(http);
    this.federation = new FederationResource(http);
  }

  /** Register a new custom event (or a new version of an existing one). */
  async register(input: RegisterCustomEventRequest): Promise<RegisterCustomEventResponse> {
    return this.http.post<RegisterCustomEventResponse>('/api/v1/events/custom', input);
  }

  /** List registrations belonging to the caller's organisation. */
  async list(params?: ListCustomEventsParams): Promise<ListCustomEventsResponse> {
    const query: Record<string, string | undefined> = {};
    if (params?.namespace) query.namespace = params.namespace;
    if (params?.status) query.status = params.status as CustomEventStatus;
    return this.http.get<ListCustomEventsResponse>('/api/v1/events/custom', query);
  }

  /** Fetch the full detail for a single registration. */
  async get(registrationId: string): Promise<CustomEventDetail> {
    return this.http.get<CustomEventDetail>(`/api/v1/events/custom/${registrationId}`);
  }

  /** Soft-delete a registration. The platform-seeded generic event is protected. */
  async archive(registrationId: string): Promise<ArchiveCustomEventResponse> {
    return this.http.del<ArchiveCustomEventResponse>(`/api/v1/events/custom/${registrationId}`);
  }

  /**
   * Emit a payload against a registered event. Returns `status: 'queued'` on
   * success — delivery to subscribers is asynchronous. Free-tier tenants may
   * emit `platformxe.generic` without prior registration; everything else
   * requires Basic+.
   */
  async emit(input: EmitCustomEventRequest): Promise<EmitCustomEventResponse> {
    return this.http.post<EmitCustomEventResponse>('/api/v1/events/custom/emit', input);
  }

  /**
   * Validate a registration template without persisting. Mirrors the first
   * stage of {@link register}; useful for `terraform plan` previews and SDK
   * type-generation workflows.
   */
  async dryRun(input: DryRunCustomEventRequest): Promise<DryRunCustomEventResponse> {
    return this.http.post<DryRunCustomEventResponse>('/api/v1/events/custom/dry-run', input);
  }

  /** Usage diagnostics for the caller's organisation. */
  async health(): Promise<CustomEventHealthResponse> {
    return this.http.get<CustomEventHealthResponse>('/api/v1/events/custom/health');
  }

  /**
   * Subscribe a webhook to a registered custom event. The platform resolves
   * the canonical bus name from the calling org — tenants don't need to
   * construct `TENANT_CUSTOM:<orgId>:<ns>.<name>@<v>` strings by hand.
   *
   * Pass `version: '*'` (or omit) to subscribe to all versions.
   */
  async subscribe(input: SubscribeCustomEventRequest): Promise<SubscribeCustomEventResponse> {
    return this.http.post<SubscribeCustomEventResponse>('/api/v1/events/custom/subscribe', input);
  }

}

// =============================================================================
// Marketplace sub-resource (Phase 9C — added in 1.3.0)
// =============================================================================

export class MarketplaceResource {
  constructor(private http: HttpClient) {}

  /** Publish a registered event to the marketplace. PRO+ only. */
  async publish(input: PublishMarketplaceRequest): Promise<PublishMarketplaceResponse> {
    return this.http.post<PublishMarketplaceResponse>(
      '/api/v1/events/custom/marketplace/publish',
      input,
    );
  }

  /** Browse listings. Open to all plans. */
  async list(params?: ListMarketplaceParams): Promise<ListMarketplaceResponse> {
    return this.http.get<ListMarketplaceResponse>(
      '/api/v1/events/custom/marketplace',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  /** Fetch full detail (incl. payloadSchema) for a listing. */
  async get(listingId: string): Promise<MarketplaceListingDetail> {
    return this.http.get<MarketplaceListingDetail>(
      `/api/v1/events/custom/marketplace/${listingId}`,
    );
  }

  /** Unpublish a listing the caller's org owns. */
  async unpublish(listingId: string): Promise<UnpublishMarketplaceResponse> {
    return this.http.del<UnpublishMarketplaceResponse>(
      `/api/v1/events/custom/marketplace/${listingId}`,
    );
  }

  /** Re-activate a previously unpublished listing the caller's org owns. */
  async republish(listingId: string): Promise<RepublishMarketplaceResponse> {
    return this.http.post<RepublishMarketplaceResponse>(
      `/api/v1/events/custom/marketplace/${listingId}/republish`,
    );
  }

  /**
   * Fork a listing — copies the schema into the caller's org under the
   * destination shape they choose. PRO+ only.
   */
  async fork(
    listingId: string,
    input: ForkMarketplaceRequest,
  ): Promise<ForkMarketplaceResponse> {
    return this.http.post<ForkMarketplaceResponse>(
      `/api/v1/events/custom/marketplace/${listingId}/fork`,
      input,
    );
  }
}

// =============================================================================
// Federation sub-resource (Phase 9D — added in 1.4.0, ENTERPRISE only)
// =============================================================================

export class FederationResource {
  constructor(private http: HttpClient) {}

  /** Create a new federation group owned by the calling org. */
  async createGroup(input: CreateFederationGroupRequest): Promise<FederationGroupSummary> {
    return this.http.post<FederationGroupSummary>(
      '/api/v1/events/custom/federation/groups',
      input,
    );
  }

  /** List groups visible to the calling org (owned + member-of). */
  async listGroups(params?: { includeArchived?: boolean }): Promise<ListFederationGroupsResponse> {
    return this.http.get<ListFederationGroupsResponse>(
      '/api/v1/events/custom/federation/groups',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  /** Fetch full group detail (members + active pushes). */
  async getGroup(groupId: string): Promise<FederationGroupDetail> {
    return this.http.get<FederationGroupDetail>(
      `/api/v1/events/custom/federation/groups/${groupId}`,
    );
  }

  /** Archive a group the caller's org owns. Stops fan-out; preserves history. */
  async archiveGroup(groupId: string): Promise<FederationGroupSummary> {
    return this.http.del<FederationGroupSummary>(
      `/api/v1/events/custom/federation/groups/${groupId}`,
    );
  }

  /** Invite a peer ENTERPRISE org into a group. Owner-only. */
  async invite(
    groupId: string,
    input: InviteFederationMemberRequest,
  ): Promise<FederationMemberSummary> {
    return this.http.post<FederationMemberSummary>(
      `/api/v1/events/custom/federation/groups/${groupId}/invite`,
      input,
    );
  }

  /** Accept a pending invitation to a group. Caller must be the invited org. */
  async accept(groupId: string): Promise<FederationMemberSummary> {
    return this.http.post<FederationMemberSummary>(
      `/api/v1/events/custom/federation/groups/${groupId}/accept`,
      undefined,
    );
  }

  /** Voluntarily leave a group the caller is a member of. */
  async leave(groupId: string): Promise<FederationMemberSummary> {
    return this.http.post<FederationMemberSummary>(
      `/api/v1/events/custom/federation/groups/${groupId}/leave`,
      undefined,
    );
  }

  /** Declare a per-version push of one of the owner's registrations. Owner-only. */
  async declarePush(
    groupId: string,
    input: DeclareFederationPushRequest,
  ): Promise<FederationPushSummary> {
    return this.http.post<FederationPushSummary>(
      `/api/v1/events/custom/federation/groups/${groupId}/pushes`,
      input,
    );
  }

  /** List pushes declared in a group. */
  async listPushes(
    groupId: string,
    params?: { includeInactive?: boolean },
  ): Promise<ListFederationPushesResponse> {
    return this.http.get<ListFederationPushesResponse>(
      `/api/v1/events/custom/federation/groups/${groupId}/pushes`,
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  /** Stop pushing a previously-declared per-version push. Owner-only. */
  async undeclarePush(pushId: string): Promise<FederationPushSummary> {
    return this.http.del<FederationPushSummary>(
      `/api/v1/events/custom/federation/pushes/${pushId}`,
    );
  }
}

export class EventsResource {
  /** Tenant-defined custom events — register, emit, list, subscribe. */
  readonly custom: CustomEventsResource;

  constructor(private http: HttpClient) {
    this.custom = new CustomEventsResource(http);
  }

  /** Ingest a new event into the platform */
  async ingest(input: IngestEventInput): Promise<IngestEventResult> {
    return this.http.post<IngestEventResult>('/api/v1/events/ingest', input);
  }

  /** Query the event log */
  async log(params?: EventLogParams): Promise<EventLogItem[]> {
    return this.http.get<EventLogItem[]>(
      '/api/v1/event-log',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  // ── Subscriptions ────────────────────────────────────────────────────────

  /** List event subscriptions */
  async listSubscriptions(): Promise<EventSubscription[]> {
    return this.http.get<EventSubscription[]>('/api/v1/event-subscriptions');
  }

  /** Create an event subscription */
  async createSubscription(input: CreateEventSubscriptionInput): Promise<EventSubscription> {
    return this.http.post<EventSubscription>('/api/v1/event-subscriptions', input);
  }

  /** Get an event subscription by ID */
  async getSubscription(subscriptionId: string): Promise<EventSubscription> {
    return this.http.get<EventSubscription>(`/api/v1/event-subscriptions/${subscriptionId}`);
  }

  /** Update an event subscription */
  async updateSubscription(subscriptionId: string, input: UpdateEventSubscriptionInput): Promise<EventSubscription> {
    return this.http.patch<EventSubscription>(`/api/v1/event-subscriptions/${subscriptionId}`, input);
  }

  /** Delete an event subscription */
  async deleteSubscription(subscriptionId: string): Promise<void> {
    return this.http.del<void>(`/api/v1/event-subscriptions/${subscriptionId}`);
  }

  /** Replay events for a subscription within a time range */
  async replay(subscriptionId: string, input: ReplayInput): Promise<ReplayResult> {
    return this.http.post<ReplayResult>(`/api/v1/event-subscriptions/${subscriptionId}/replay`, input);
  }
}
