import { SendEmailRequest, SendEmailResponse, SendSmsRequest, SendSmsResponse, SendWhatsAppRequest, SendWhatsAppResponse, EmailHealthResponse, SmsHealthResponse, ProcessorConfig, UpdateProcessorRequest, UploadFileRequest, UploadResult, BatchUploadRequest, BatchUploadResult, SignUploadRequest, SignUploadResult, RegisterFileRequest, RegisterFileResult, StorageFile, CreateDocumentInput, DocumentWithMeta, ListDocumentsOptions, DocumentListResult, UpdateDocumentInput, RequestDeletionOverrideInput, DeletionOverrideWithMeta, ApproveDeletionOverrideInput, WebhookListItem, CreateWebhookInput, CreateWebhookResult, UpdateWebhookInput, RotateSecretResult, ActionConfig, TriggerFilters, TriggerContext, EvaluationResult, DryRunResult, TemplateListItem, CreateTemplateInput, UpdateTemplateInput, RenderTemplateInput, RenderedTemplate, RenderAndSendInput, PublishMarketplaceRequest, PublishMarketplaceResponse, ListMarketplaceParams, ListMarketplaceResponse, MarketplaceListingDetail, UnpublishMarketplaceResponse, RepublishMarketplaceResponse, ForkMarketplaceRequest, ForkMarketplaceResponse, CreateFederationGroupRequest, FederationGroupSummary, ListFederationGroupsResponse, FederationGroupDetail, InviteFederationMemberRequest, FederationMemberSummary, DeclareFederationPushRequest, FederationPushSummary, ListFederationPushesResponse, RegisterCustomEventRequest, RegisterCustomEventResponse, ListCustomEventsParams, ListCustomEventsResponse, CustomEventDetail, ArchiveCustomEventResponse, EmitCustomEventRequest, EmitCustomEventResponse, DryRunCustomEventRequest, DryRunCustomEventResponse, CustomEventHealthResponse, SubscribeCustomEventRequest, SubscribeCustomEventResponse, EventLogItem, EventSubscription, CreateEventSubscriptionInput, UpdateEventSubscriptionInput, ReplayInput, VerifyIdentityInput, VerifyIdentityResult, OfferLetterPdfRequest, OfferLetterPdfResponse, FlyerGenerationInput, FlyerGenerationResult, PolymorphicQRInput, QRGenerationResult, RegisterDomainInput, SendingDomain, VerifyDomainResult, CreateExportInput, ExportRecord, UsageSummary, CreateThreadChannelRequest, ThreadChannel, UpdateThreadChannelRequest, ThreadChannelEscalationConfig, CreateThreadRequest, ThreadWithParticipants, ThreadListParams, Thread, UpdateThreadRequest, SendThreadMessageRequest, ThreadMessage, SendSystemMessageRequest, ThreadParticipant, MarkReadRequest, ThreadReadState, ThreadInboxParams, ThreadInboxItem, EntityEventRequest, EntityEventResponse, FlagMessageRequest, ThreadFlag, ReviewFlagRequest, AdminEscalateRequest, IdentityResolveRequest, IdentityResolveResponse, IdentityVerifyRequest, IdentityVerifyResponse, IdentityLookupResponse, IdentityProviderStatus, PermissionCheckRequest, PermissionCheckResponse, ResolvedCapabilities, PermissionRole, PermissionOverride, ResourcePolicy, RelationshipTuple, RelationshipOperation, PermissionModule, PermissionAuditLog, PermissionChangeLog, ShadowCheckRequest, ShadowCheckResponse, FederationGroup, ListFraudCasesParams, FraudCaseRecord, OpenFraudCaseRequest, UpdateFraudCaseRequest, TransitionFraudCaseRequest, FraudDecideRequest, FraudDecideResponse, ListFraudDecisionsParams, FraudDecisionRecord, DeviceSeenRequest, DeviceSeenResponse, ListFraudRulesParams, FraudRuleDefinition, CreateFraudRuleRequest, UpdateFraudRuleRequest, TransitionFraudRuleRequest, FraudRuleShadowReport, FraudScreenRequest, FraudScreenResponse, TenantListSummary, CreateTenantListRequest, UpdateTenantListRequest, ScreeningListEntry, AppendListEntriesRequest, AppendListEntriesResponse, FraudTermsStatus, AcceptFraudTermsRequest, AcceptFraudTermsResponse, AuditLogRequest, AuditLogAcceptedResponse, ListIssuesParams, IssueRecord, CreateIssueRequest, CreateIssueResponse, SearchIndexRequest, SearchIndexAcceptedResponse, SearchQueryParams, SearchResult, WhoamiResponse, RegisterRequest, RegisterResponse } from '@caldera/platformxe-types';
export { AcceptFraudTermsRequest, AcceptFraudTermsResponse, AccessLevel, ActionConfig, ActionResult, AdminEscalateRequest, AgentBranding, ApiError, ApiResponse, ApiSuccess, AppendListEntriesRequest, AppendListEntriesResponse, ApproveDeletionOverrideInput, AuditLogAcceptedResponse, AuditLogRequest, BatchUploadRequest, BatchUploadResult, CallerBreakdownEntry, ContentEntityType, CreateDocumentInput, CreateEventSubscriptionInput, CreateEventSubscriptionResponse, CreateExportInput, CreateFraudRuleRequest, CreateInvoiceInput, CreateIssueRequest, CreateIssueResponse, CreateTemplateInput, CreateTenantListRequest, CreateThreadChannelRequest, CreateThreadRequest, CreateWebhookInput, CreateWebhookResult, CustomerBillingInfo, DecisionReason, DecisionReasonKind, DeletableBy, DeleteEventSubscriptionResponse, DeletionOverrideWithMeta, DeviceSeenRequest, DeviceSeenResponse, DeviceSignals, DnsRecord, DocumentActor, DocumentActorAdmin, DocumentActorAgent, DocumentActorPartner, DocumentCategory, DocumentListResult, DocumentSpace, DocumentWithMeta, DomainStatus, DryRunResult, EmailAttachment, EmailHealthResponse, EmailProviderName, EntityEventRequest, EntityEventResponse, EntityType, EvaluationResult, EventLogItem, EventSubscription, EventSubscriptionStatus, ExecutionFilters, ExportDataType, ExportFormat, ExportRecord, ExportStatus, FederationGroup, FileType, FlagMessageRequest, FlyerCurrency, FlyerGenerationInput, FlyerGenerationResult, FlyerTemplate, FraudAllPredicate, FraudAnyPredicate, FraudCaseNote, FraudCaseRecord, FraudCaseResolution, FraudCaseStatus, FraudCounterAggregation, FraudDecideAmount, FraudDecideContext, FraudDecideExternalScore, FraudDecideRequest, FraudDecideResource, FraudDecideResponse, FraudDecideSubject, FraudDecisionRecord, FraudLeafPredicate, FraudNotPredicate, FraudRuleAppliesTo, FraudRuleCondition, FraudRuleDefinition, FraudRuleOperator, FraudRuleShadowReport, FraudRuleStatus, FraudRuleWindow, FraudScreenRequest, FraudScreenResponse, FraudTermsStatus, FraudVerdict, IdentityCredentialType, IdentityLookupResponse, IdentityProviderStatus, IdentityResolveRequest, IdentityResolveResponse, IdentityVerifyRequest, IdentityVerifyResponse, Invoice, InvoiceLineItem, InvoiceListParams, InvoiceOverview, InvoiceStatus, InvoiceWithLineItems, IpIntelLookup, IpIntelResult, IssuePriority, IssueRecord, IssueStatus, ListDocumentsOptions, ListFraudCasesParams, ListFraudDecisionsParams, ListFraudRulesParams, ListIssuesParams, ListIssuesResponse, MarkReadRequest, MediaItem, MessagingOverview, MismatchReason, ModerationStatus, OfferLetterPdfRequest, OfferLetterPdfResponse, OpenFraudCaseRequest, OverrideStatus, OwnerType, PaginatedResponse, PaymentProvider, PermissionAuditLog, PermissionChangeLog, PermissionCheckRequest, PermissionCheckResponse, PermissionModule, PermissionOverride, PermissionRole, PlanDefinition, PlanLevel, PlatformEventType, PolicyAction, PolymorphicQRInput, PortalEntityType, PropertyFlyerData, ProviderHealthEntry, QREntityType, QRErrorCorrection, QRGenerationResult, QRGeneratorOptions, QRSize, QueryEventLogParams, QueryEventLogResponse, QueueStatus, QuotaCheckResult, RegionCode, RegionalPrice, RegisterDomainInput, RegisterFileRequest, RegisterFileResult, RegisterRequest, RegisterResponse, RegisteredTenant, RegistrationQRType, RelationshipOperation, RelationshipTuple, RenderAndSendInput, RenderTemplateInput, RenderedTemplate, ReplayEventSubscriptionResponse, ReplayInput, RequestDeletionOverrideInput, ResolvedCapabilities, ResourcePolicy, RetentionType, ReviewFlagRequest, RotateSecretResult, SalaryBreakdown, ScheduledTriggerResult, ScreeningHit, ScreeningListEntry, ScreeningListEntryInput, ScreeningListKind, ScreeningProvider, SearchIndexAcceptedResponse, SearchIndexRequest, SearchQueryParams, SearchQueryResponse, SearchResult, SendEmailRequest, SendEmailResponse, SendSmsRequest, SendSmsResponse, SendSystemMessageRequest, SendThreadMessageRequest, SendWhatsAppRequest, SendWhatsAppResponse, SendingDomain, ShadowCheckRequest, ShadowCheckResponse, SignUploadRequest, SignUploadResult, SmsHealthResponse, SmsOverview, StorageFile, StorageOverview, StorageProvider, SubscriptionStatus, TaskPriority, TaskStatus, TelemetryMetric, TelemetryPayload, TemplateBlock, TemplateBlockType, TemplateListItem, TenantListKind, TenantListSummary, Thread, ThreadChannel, ThreadChannelEscalationConfig, ThreadChannelLifecycleRules, ThreadEscalationRule, ThreadFlag, ThreadInboxItem, ThreadInboxParams, ThreadListParams, ThreadMessage, ThreadParticipant, ThreadReadState, ThreadWithParticipants, TimeRange, TimelinePoint, TransitionFraudCaseRequest, TransitionFraudRuleRequest, TriggerContext, TriggerFilters, UpdateDocumentInput, UpdateEventSubscriptionInput, UpdateFraudCaseRequest, UpdateFraudRuleRequest, UpdateTemplateInput, UpdateTenantListRequest, UpdateThreadChannelRequest, UpdateThreadRequest, UpdateWebhookInput, UploadFileRequest, UploadResult, UsageServiceLine, UsageServiceOverview, UsageSummary, UsageSummaryParams as UsageSummaryQueryParams, UsageSummaryResponse, VerifyDomainResult, VerifyIdentityInput, VerifyIdentityResult, Visibility, WebhookDeliveryItem, WebhookDeliveryOverview, WebhookListItem, WhoamiDbEnvironment, WhoamiResponse, WorkflowEventType, WorkflowExecutionStatus, WorkflowOverview, WorkflowTriggerType } from '@caldera/platformxe-types';

interface HttpClientOptions {
    apiKey: string;
    baseUrl: string;
    timeout: number;
    retries: number;
    retryDelay: number;
}
interface RequestOptions {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
    headers?: Record<string, string>;
}
declare class HttpClient {
    private readonly opts;
    constructor(opts: HttpClientOptions);
    request<T>(path: string, options?: RequestOptions): Promise<T>;
    get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T>;
    post<T>(path: string, body?: unknown): Promise<T>;
    patch<T>(path: string, body?: unknown): Promise<T>;
    put<T>(path: string, body?: unknown): Promise<T>;
    del<T>(path: string): Promise<T>;
}

/** Queue processing response */
interface QueueProcessResult {
    processed: number;
    failed: number;
    remaining: number;
}
/** Queue statistics */
interface QueueStats {
    pending: number;
    processing: number;
    sent: number;
    deadLetter: number;
    total: number;
}
declare class MessagingResource {
    private http;
    constructor(http: HttpClient);
    /** Send a transactional email */
    sendEmail(input: SendEmailRequest): Promise<SendEmailResponse>;
    /** Send an SMS */
    sendSms(input: SendSmsRequest): Promise<SendSmsResponse>;
    /** Send a WhatsApp message */
    sendWhatsApp(input: SendWhatsAppRequest): Promise<SendWhatsAppResponse>;
    /** Check email provider health */
    emailHealth(): Promise<EmailHealthResponse>;
    /** Check SMS provider health */
    smsHealth(): Promise<SmsHealthResponse>;
    /** Process the email queue */
    processQueue(batchSize?: number): Promise<QueueProcessResult>;
    /** Get queue statistics */
    queueStats(): Promise<QueueStats>;
    /** Get the messaging processor configuration */
    getProcessor(): Promise<ProcessorConfig>;
    /** Update the messaging processor configuration */
    updateProcessor(input: UpdateProcessorRequest): Promise<ProcessorConfig>;
}

/** Parameters for listing media files */
interface ListMediaParams {
    module?: string;
    entityId?: string;
    category?: string;
    page?: number;
    limit?: number;
}
/** Reorder request body */
interface ReorderFilesInput {
    fileIds: string[];
}
/** Reorder response */
interface ReorderFilesResult {
    updated: number;
}
declare class StorageResource {
    private http;
    constructor(http: HttpClient);
    /** Upload a single file (base64-encoded) */
    upload(input: UploadFileRequest): Promise<UploadResult>;
    /** Upload multiple files in a single request */
    batchUpload(input: BatchUploadRequest): Promise<BatchUploadResult>;
    /** Get a presigned upload URL for direct browser uploads */
    signUpload(input: SignUploadRequest): Promise<SignUploadResult>;
    /** Register a file after a presigned upload completes */
    register(input: RegisterFileRequest): Promise<RegisterFileResult>;
    /** List media files for an entity */
    list(params?: ListMediaParams): Promise<StorageFile[]>;
    /** Get a single file by ID */
    get(fileId: string): Promise<StorageFile>;
    /** Delete a file by ID */
    delete(fileId: string): Promise<void>;
    /** Reorder files (set display order) */
    reorder(input: ReorderFilesInput): Promise<ReorderFilesResult>;
    /** Get the storage processor configuration */
    getProcessor(): Promise<ProcessorConfig>;
    /** Update the storage processor configuration */
    updateProcessor(input: UpdateProcessorRequest): Promise<ProcessorConfig>;
}

/** Folder creation input */
interface CreateFolderInput {
    name: string;
    parentId?: string;
    description?: string;
}
/** Folder record */
interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    description: string | null;
    documentCount: number;
    createdAt: string;
    updatedAt: string;
}
declare class DocumentsResource {
    private http;
    constructor(http: HttpClient);
    /** Create a new document */
    create(input: CreateDocumentInput): Promise<DocumentWithMeta>;
    /** List documents with optional filters */
    list(options?: ListDocumentsOptions): Promise<DocumentListResult>;
    /** Get a document by ID */
    get(documentId: string): Promise<DocumentWithMeta>;
    /** Update a document */
    update(documentId: string, input: UpdateDocumentInput): Promise<DocumentWithMeta>;
    /** Delete a document (may require override if protected) */
    delete(documentId: string): Promise<void>;
    /** Create a folder */
    createFolder(input: CreateFolderInput): Promise<Folder>;
    /** Get a folder by ID (includes child documents) */
    getFolder(folderId: string): Promise<Folder>;
    /** Request a deletion override for a protected document */
    requestOverride(input: RequestDeletionOverrideInput): Promise<DeletionOverrideWithMeta>;
    /** Approve or reject a deletion override request */
    processOverride(overrideId: string, input: ApproveDeletionOverrideInput): Promise<DeletionOverrideWithMeta>;
}

/** Parameters for listing webhook deliveries */
interface ListDeliveriesParams {
    status?: 'PENDING' | 'SUCCESS' | 'RETRYING' | 'FAILED';
    page?: number;
    limit?: number;
}
/** Test webhook response */
interface TestWebhookResult {
    success: boolean;
    responseStatus: number | null;
    responseTimeMs: number | null;
    error?: string;
}
declare class WebhooksResource {
    private http;
    constructor(http: HttpClient);
    /** List all webhooks */
    list(): Promise<WebhookListItem[]>;
    /** Create a new webhook */
    create(input: CreateWebhookInput): Promise<CreateWebhookResult>;
    /** Get a webhook by ID */
    get(webhookId: string): Promise<WebhookListItem>;
    /** Update a webhook */
    update(webhookId: string, input: UpdateWebhookInput): Promise<WebhookListItem>;
    /** Delete a webhook */
    delete(webhookId: string): Promise<void>;
    /** Send a test delivery to the webhook URL */
    test(webhookId: string): Promise<TestWebhookResult>;
    /** Rotate the signing secret (old secret is immediately invalidated) */
    rotateSecret(webhookId: string): Promise<RotateSecretResult>;
}

/** Workflow trigger record */
interface WorkflowTrigger {
    id: string;
    callerService: string;
    name: string;
    description: string | null;
    triggerType: 'EVENT' | 'SCHEDULE';
    eventType: string | null;
    entityType: string | null;
    conditions: Record<string, unknown> | null;
    actions: ActionConfig[];
    status: 'ACTIVE' | 'INACTIVE';
    lastTriggeredAt: string | null;
    executionCount: number;
    createdAt: string;
    updatedAt: string;
}
/** Input for creating a workflow trigger */
interface CreateWorkflowTriggerInput {
    name: string;
    description?: string;
    triggerType: 'EVENT' | 'SCHEDULE';
    eventType?: string;
    entityType?: string;
    conditions?: Record<string, unknown>;
    actions: ActionConfig[];
}
/** Input for updating a workflow trigger */
interface UpdateWorkflowTriggerInput {
    name?: string;
    description?: string;
    eventType?: string;
    entityType?: string;
    conditions?: Record<string, unknown>;
    actions?: ActionConfig[];
    status?: 'ACTIVE' | 'INACTIVE';
}
declare class WorkflowsResource {
    private http;
    constructor(http: HttpClient);
    /** List workflow triggers with optional filters */
    list(filters?: TriggerFilters): Promise<WorkflowTrigger[]>;
    /** Create a workflow trigger */
    create(input: CreateWorkflowTriggerInput): Promise<WorkflowTrigger>;
    /** Get a workflow trigger by ID */
    get(triggerId: string): Promise<WorkflowTrigger>;
    /** Update a workflow trigger */
    update(triggerId: string, input: UpdateWorkflowTriggerInput): Promise<WorkflowTrigger>;
    /** Delete a workflow trigger */
    delete(triggerId: string): Promise<void>;
    /** Evaluate triggers against a given context */
    evaluate(context: TriggerContext): Promise<EvaluationResult[]>;
    /** Dry-run a trigger against a context (no side effects) */
    dryRun(triggerId: string, context: TriggerContext): Promise<DryRunResult>;
}

/** Parameters for listing templates */
interface ListTemplatesParams {
    channel?: string;
    search?: string;
    page?: number;
    limit?: number;
}
declare class TemplatesResource {
    private http;
    constructor(http: HttpClient);
    /** List templates */
    list(params?: ListTemplatesParams): Promise<TemplateListItem[]>;
    /** Create a template */
    create(input: CreateTemplateInput): Promise<TemplateListItem>;
    /** Get a template by ID */
    get(templateId: string): Promise<TemplateListItem>;
    /** Update a template */
    update(templateId: string, input: UpdateTemplateInput): Promise<TemplateListItem>;
    /** Delete a template */
    delete(templateId: string): Promise<void>;
    /** Render a template with variables (returns HTML/text, does not send) */
    render(templateId: string, input: RenderTemplateInput): Promise<RenderedTemplate>;
    /** Render a template and send it as an email */
    send(templateId: string, input: RenderAndSendInput): Promise<SendEmailResponse>;
}

/** Event ingestion input */
interface IngestEventInput {
    eventType: string;
    entityType?: string;
    entityId?: string;
    payload: Record<string, unknown>;
}
/** Event ingestion result */
interface IngestEventResult {
    eventId: string;
    subscriptionsNotified: number;
}
/** Parameters for querying the event log */
interface EventLogParams {
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
interface ReplayResult {
    replayed: number;
    failed: number;
}
declare class CustomEventsResource {
    private http;
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
    constructor(http: HttpClient);
    /** Register a new custom event (or a new version of an existing one). */
    register(input: RegisterCustomEventRequest): Promise<RegisterCustomEventResponse>;
    /** List registrations belonging to the caller's organisation. */
    list(params?: ListCustomEventsParams): Promise<ListCustomEventsResponse>;
    /** Fetch the full detail for a single registration. */
    get(registrationId: string): Promise<CustomEventDetail>;
    /** Soft-delete a registration. The platform-seeded generic event is protected. */
    archive(registrationId: string): Promise<ArchiveCustomEventResponse>;
    /**
     * Emit a payload against a registered event. Returns `status: 'queued'` on
     * success — delivery to subscribers is asynchronous. Free-tier tenants may
     * emit `platformxe.generic` without prior registration; everything else
     * requires Basic+.
     */
    emit(input: EmitCustomEventRequest): Promise<EmitCustomEventResponse>;
    /**
     * Validate a registration template without persisting. Mirrors the first
     * stage of {@link register}; useful for `terraform plan` previews and SDK
     * type-generation workflows.
     */
    dryRun(input: DryRunCustomEventRequest): Promise<DryRunCustomEventResponse>;
    /** Usage diagnostics for the caller's organisation. */
    health(): Promise<CustomEventHealthResponse>;
    /**
     * Subscribe a webhook to a registered custom event. The platform resolves
     * the canonical bus name from the calling org — tenants don't need to
     * construct `TENANT_CUSTOM:<orgId>:<ns>.<name>@<v>` strings by hand.
     *
     * Pass `version: '*'` (or omit) to subscribe to all versions.
     */
    subscribe(input: SubscribeCustomEventRequest): Promise<SubscribeCustomEventResponse>;
}
declare class MarketplaceResource {
    private http;
    constructor(http: HttpClient);
    /** Publish a registered event to the marketplace. PRO+ only. */
    publish(input: PublishMarketplaceRequest): Promise<PublishMarketplaceResponse>;
    /** Browse listings. Open to all plans. */
    list(params?: ListMarketplaceParams): Promise<ListMarketplaceResponse>;
    /** Fetch full detail (incl. payloadSchema) for a listing. */
    get(listingId: string): Promise<MarketplaceListingDetail>;
    /** Unpublish a listing the caller's org owns. */
    unpublish(listingId: string): Promise<UnpublishMarketplaceResponse>;
    /** Re-activate a previously unpublished listing the caller's org owns. */
    republish(listingId: string): Promise<RepublishMarketplaceResponse>;
    /**
     * Fork a listing — copies the schema into the caller's org under the
     * destination shape they choose. PRO+ only.
     */
    fork(listingId: string, input: ForkMarketplaceRequest): Promise<ForkMarketplaceResponse>;
}
declare class FederationResource {
    private http;
    constructor(http: HttpClient);
    /** Create a new federation group owned by the calling org. */
    createGroup(input: CreateFederationGroupRequest): Promise<FederationGroupSummary>;
    /** List groups visible to the calling org (owned + member-of). */
    listGroups(params?: {
        includeArchived?: boolean;
    }): Promise<ListFederationGroupsResponse>;
    /** Fetch full group detail (members + active pushes). */
    getGroup(groupId: string): Promise<FederationGroupDetail>;
    /** Archive a group the caller's org owns. Stops fan-out; preserves history. */
    archiveGroup(groupId: string): Promise<FederationGroupSummary>;
    /** Invite a peer ENTERPRISE org into a group. Owner-only. */
    invite(groupId: string, input: InviteFederationMemberRequest): Promise<FederationMemberSummary>;
    /** Accept a pending invitation to a group. Caller must be the invited org. */
    accept(groupId: string): Promise<FederationMemberSummary>;
    /** Voluntarily leave a group the caller is a member of. */
    leave(groupId: string): Promise<FederationMemberSummary>;
    /** Declare a per-version push of one of the owner's registrations. Owner-only. */
    declarePush(groupId: string, input: DeclareFederationPushRequest): Promise<FederationPushSummary>;
    /** List pushes declared in a group. */
    listPushes(groupId: string, params?: {
        includeInactive?: boolean;
    }): Promise<ListFederationPushesResponse>;
    /** Stop pushing a previously-declared per-version push. Owner-only. */
    undeclarePush(pushId: string): Promise<FederationPushSummary>;
}
declare class EventsResource {
    private http;
    /** Tenant-defined custom events — register, emit, list, subscribe. */
    readonly custom: CustomEventsResource;
    constructor(http: HttpClient);
    /** Ingest a new event into the platform */
    ingest(input: IngestEventInput): Promise<IngestEventResult>;
    /** Query the event log */
    log(params?: EventLogParams): Promise<EventLogItem[]>;
    /** List event subscriptions */
    listSubscriptions(): Promise<EventSubscription[]>;
    /** Create an event subscription */
    createSubscription(input: CreateEventSubscriptionInput): Promise<EventSubscription>;
    /** Get an event subscription by ID */
    getSubscription(subscriptionId: string): Promise<EventSubscription>;
    /** Update an event subscription */
    updateSubscription(subscriptionId: string, input: UpdateEventSubscriptionInput): Promise<EventSubscription>;
    /** Delete an event subscription */
    deleteSubscription(subscriptionId: string): Promise<void>;
    /** Replay events for a subscription within a time range */
    replay(subscriptionId: string, input: ReplayInput): Promise<ReplayResult>;
}

declare class OcrResource {
    private http;
    constructor(http: HttpClient);
    /** Verify an identity document against a profile name */
    verifyIdentity(input: VerifyIdentityInput): Promise<VerifyIdentityResult>;
    /** Get the OCR processor configuration */
    getProcessor(): Promise<ProcessorConfig>;
    /** Update the OCR processor configuration */
    updateProcessor(input: UpdateProcessorRequest): Promise<ProcessorConfig>;
}

declare class PdfResource {
    private http;
    constructor(http: HttpClient);
    /** Generate an offer letter PDF */
    offerLetter(input: OfferLetterPdfRequest): Promise<OfferLetterPdfResponse>;
    /** Generate a property flyer PDF */
    propertyFlyer(input: FlyerGenerationInput): Promise<FlyerGenerationResult>;
    /** Get the PDF processor configuration */
    getProcessor(): Promise<ProcessorConfig>;
    /** Update the PDF processor configuration */
    updateProcessor(input: UpdateProcessorRequest): Promise<ProcessorConfig>;
}

/** Batch QR generation input */
interface BatchQRInput {
    items: PolymorphicQRInput[];
}
/** Batch QR generation result */
interface BatchQRResult {
    results: QRGenerationResult[];
    totalGenerated: number;
    errors: string[];
}
declare class QrResource {
    private http;
    constructor(http: HttpClient);
    /** Generate a single QR code */
    generate(input: PolymorphicQRInput): Promise<QRGenerationResult>;
    /** Generate QR codes in batch */
    generateBatch(input: BatchQRInput): Promise<BatchQRResult>;
    /** Get the QR processor configuration */
    getProcessor(): Promise<ProcessorConfig>;
    /** Update the QR processor configuration */
    updateProcessor(input: UpdateProcessorRequest): Promise<ProcessorConfig>;
}

declare class DomainsResource {
    private http;
    constructor(http: HttpClient);
    /** Register a new sending domain */
    register(input: RegisterDomainInput): Promise<SendingDomain>;
    /** List all sending domains */
    list(): Promise<SendingDomain[]>;
    /** Get a domain by ID */
    get(domainId: string): Promise<SendingDomain>;
    /** Delete a domain */
    delete(domainId: string): Promise<void>;
    /** Verify DNS records for a domain */
    verify(domainId: string): Promise<VerifyDomainResult>;
}

declare class ExportsResource {
    private http;
    constructor(http: HttpClient);
    /** Create a new data export */
    create(input: CreateExportInput): Promise<ExportRecord>;
    /** Get an export by ID (check status / download URL) */
    get(exportId: string): Promise<ExportRecord>;
    /** Get the exports processor configuration */
    getProcessor(): Promise<ProcessorConfig>;
    /** Update the exports processor configuration */
    updateProcessor(input: UpdateProcessorRequest): Promise<ProcessorConfig>;
}

/** Parameters for usage summary query */
interface UsageSummaryParams {
    month?: string;
}
declare class UsageResource {
    private http;
    constructor(http: HttpClient);
    /** Get usage summary for the current or specified billing month */
    summary(params?: UsageSummaryParams): Promise<UsageSummary>;
}

declare class ThreadsResource {
    private http;
    constructor(http: HttpClient);
    /** Create a messaging channel */
    createChannel(input: CreateThreadChannelRequest): Promise<ThreadChannel>;
    /** List all channels for the organization */
    listChannels(): Promise<{
        channels: ThreadChannel[];
    }>;
    /** Update a channel */
    updateChannel(channelId: string, input: UpdateThreadChannelRequest): Promise<ThreadChannel>;
    /** Get escalation config for a channel */
    getEscalationConfig(channelId: string): Promise<{
        escalationConfig: ThreadChannelEscalationConfig | null;
    }>;
    /** Set escalation config for a channel */
    setEscalationConfig(channelId: string, config: ThreadChannelEscalationConfig): Promise<{
        escalationConfig: ThreadChannelEscalationConfig;
    }>;
    /** Create a thread */
    createThread(input: CreateThreadRequest): Promise<ThreadWithParticipants>;
    /** List threads with optional filters */
    listThreads(params?: ThreadListParams): Promise<{
        threads: Thread[];
        total: number;
    }>;
    /** Get a single thread by ID */
    getThread(threadId: string): Promise<ThreadWithParticipants>;
    /** Update a thread */
    updateThread(threadId: string, input: UpdateThreadRequest): Promise<Thread>;
    /** Close a thread */
    closeThread(threadId: string, input?: {
        reason?: string;
    }): Promise<Thread>;
    /** Reopen a closed thread */
    reopenThread(threadId: string): Promise<Thread>;
    /** Send a message in a thread */
    sendMessage(threadId: string, input: SendThreadMessageRequest): Promise<ThreadMessage>;
    /** List messages in a thread */
    listMessages(threadId: string, params?: {
        role?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        messages: ThreadMessage[];
        total: number;
    }>;
    /** Edit a message */
    editMessage(messageId: string, input: {
        content: string;
    }): Promise<ThreadMessage>;
    /** Soft-delete a message */
    deleteMessage(messageId: string): Promise<{
        deleted: boolean;
    }>;
    /** Send a system message */
    sendSystemMessage(threadId: string, input: SendSystemMessageRequest): Promise<ThreadMessage>;
    /** Add a participant to a thread */
    addParticipant(threadId: string, input: {
        role: string;
        externalId: string;
        displayName: string;
        avatarUrl?: string;
    }): Promise<ThreadParticipant>;
    /** Remove a participant from a thread */
    removeParticipant(threadId: string, participantId: string): Promise<{
        removed: boolean;
    }>;
    /** Update a participant */
    updateParticipant(threadId: string, participantId: string, input: {
        displayName?: string;
        avatarUrl?: string | null;
        isMuted?: boolean;
    }): Promise<ThreadParticipant>;
    /** Mark messages as read */
    markRead(threadId: string, input: MarkReadRequest): Promise<ThreadReadState>;
    /** Get read states for all participants in a thread */
    getReadStates(threadId: string): Promise<{
        readStates: ThreadReadState[];
    }>;
    /** Get inbox for a participant */
    inbox(params: ThreadInboxParams): Promise<{
        items: ThreadInboxItem[];
        total: number;
    }>;
    /** Get unread count for a participant */
    unreadCount(params: {
        externalId: string;
        role: string;
    }): Promise<{
        count: number;
    }>;
    /** Notify threads of an entity lifecycle event */
    entityEvent(input: EntityEventRequest): Promise<EntityEventResponse>;
    /** Flag a message */
    flagMessage(threadId: string, messageId: string, input: FlagMessageRequest): Promise<{
        flag: ThreadFlag;
    }>;
    /** List flags for a thread */
    listFlags(threadId: string, params?: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        flags: ThreadFlag[];
        total: number;
    }>;
    /** List flags across all threads */
    listFlagsAcrossThreads(params?: {
        status?: string;
        channelSlug?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        flags: ThreadFlag[];
        total: number;
    }>;
    /** Review a flag */
    reviewFlag(flagId: string, input: ReviewFlagRequest): Promise<ThreadFlag>;
    /** Escalate a thread */
    escalateThread(threadId: string, input: AdminEscalateRequest): Promise<{
        rulesEvaluated: number;
        rulesMatched: number;
    }>;
}

declare class IdentityResource {
    private http;
    constructor(http: HttpClient);
    /** Resolve an identity with consent */
    resolve(input: IdentityResolveRequest): Promise<IdentityResolveResponse>;
    /** Verify identity against known data */
    verify(input: IdentityVerifyRequest): Promise<IdentityVerifyResponse>;
    /** Look up an identity by type and value */
    lookup(type: string, value: string): Promise<IdentityLookupResponse>;
    /** List identity provider statuses */
    providers(): Promise<{
        providers: IdentityProviderStatus[];
    }>;
    /** Get the identity processor configuration */
    getProcessor(): Promise<ProcessorConfig>;
    /** Update the identity processor configuration */
    updateProcessor(input: UpdateProcessorRequest): Promise<ProcessorConfig>;
}

interface CreateRoleInput {
    name: string;
    description?: string;
    model?: 'SIMPLE' | 'FULL';
}
interface UpdateRoleInput {
    name?: string;
    description?: string;
}
interface CreateOverrideInput {
    adminId: string;
    path: string;
    action: string;
    effect: 'GRANT' | 'DENY';
    reason: string;
    expiresAt?: string;
}
interface CreatePolicyInput {
    path: string;
    action: string;
    condition: Record<string, unknown>;
    effect: 'GRANT' | 'DENY';
    priority?: number;
    description?: string;
}
interface UpdatePolicyInput {
    path?: string;
    action?: string;
    condition?: Record<string, unknown>;
    effect?: 'GRANT' | 'DENY';
    priority?: number;
    description?: string;
    isActive?: boolean;
}
interface AuditLogParams {
    adminId?: string;
    path?: string;
    page?: number;
    limit?: number;
}
interface ChangeLogParams {
    entityType?: string;
    entityId?: string;
    changedBy?: string;
    limit?: number;
    offset?: number;
}
interface AuditExportParams {
    from?: string;
    to?: string;
}
interface RelationshipListParams {
    objectNamespace?: string;
    objectId?: string;
    relation?: string;
    subjectNamespace?: string;
    subjectId?: string;
}
interface AddFederationMemberInput {
    organizationId: string;
    prefix: string;
}
declare class PermissionsResource {
    private http;
    constructor(http: HttpClient);
    /** Check a single permission */
    check(input: PermissionCheckRequest): Promise<PermissionCheckResponse>;
    /** Batch-check multiple permissions */
    checkBatch(checks: Array<{
        adminId: string;
        path: string;
        action: string;
    }>): Promise<{
        results: PermissionCheckResponse[];
    }>;
    /** Resolve all capabilities for an admin */
    resolve(adminId: string): Promise<ResolvedCapabilities>;
    /** List all roles */
    listRoles(): Promise<PermissionRole[]>;
    /** Create a role */
    createRole(input: CreateRoleInput): Promise<PermissionRole>;
    /** Get a role by ID */
    getRole(roleId: string): Promise<PermissionRole>;
    /** Update a role */
    updateRole(roleId: string, input: UpdateRoleInput): Promise<PermissionRole>;
    /** Delete a role */
    deleteRole(roleId: string): Promise<void>;
    /** Get capabilities for a role (SIMPLE model) */
    getRoleCapabilities(roleId: string): Promise<{
        capabilities: string[];
    }>;
    /** Set capabilities for a role (SIMPLE model) */
    setRoleCapabilities(roleId: string, capabilities: string[]): Promise<{
        capabilities: string[];
    }>;
    /** Get module permissions for a role (FULL model) */
    getRoleModulePermissions(roleId: string): Promise<{
        modules: Array<{
            moduleId: string;
            actions: string[];
        }>;
    }>;
    /** Set module permissions for a role (FULL model) */
    setRoleModulePermissions(roleId: string, modules: Array<{
        moduleId: string;
        actions: string[];
    }>): Promise<{
        modules: Array<{
            moduleId: string;
            actions: string[];
        }>;
    }>;
    /** List overrides for an admin */
    listOverrides(adminId: string): Promise<PermissionOverride[]>;
    /** Create an override */
    createOverride(input: CreateOverrideInput): Promise<PermissionOverride>;
    /** Delete an override */
    deleteOverride(overrideId: string): Promise<void>;
    /** List all resource policies */
    listPolicies(): Promise<ResourcePolicy[]>;
    /** Create a resource policy */
    createPolicy(input: CreatePolicyInput): Promise<ResourcePolicy>;
    /** Update a resource policy */
    updatePolicy(policyId: string, input: UpdatePolicyInput): Promise<ResourcePolicy>;
    /** Delete a resource policy */
    deletePolicy(policyId: string): Promise<void>;
    /** List relationship tuples */
    listRelationships(params?: RelationshipListParams): Promise<RelationshipTuple[]>;
    /** Write or delete relationship tuples */
    updateRelationships(operations: RelationshipOperation[]): Promise<{
        applied: number;
    }>;
    /** Register a permission module */
    registerModule(input: PermissionModule): Promise<PermissionModule>;
    /** List all permission modules */
    listModules(): Promise<PermissionModule[]>;
    /** Query permission audit logs */
    getAuditLogs(params?: AuditLogParams): Promise<{
        logs: PermissionAuditLog[];
        total: number;
    }>;
    /** Query permission change logs */
    listChangeLogs(params?: ChangeLogParams): Promise<{
        logs: PermissionChangeLog[];
        total: number;
    }>;
    /** Export audit logs */
    exportAudit(params?: AuditExportParams): Promise<{
        url: string;
        expiresAt: string;
    }>;
    /** Run a shadow permission check (compare local vs remote decisions) */
    shadowCheck(input: ShadowCheckRequest): Promise<ShadowCheckResponse>;
    /** Create a federation group */
    createFederationGroup(name: string): Promise<FederationGroup>;
    /** List all federation groups */
    listFederationGroups(): Promise<FederationGroup[]>;
    /** Get a federation group by ID */
    getFederationGroup(groupId: string): Promise<FederationGroup>;
    /** Delete a federation group */
    deleteFederationGroup(groupId: string): Promise<void>;
    /** Add a member to a federation group */
    addFederationMember(groupId: string, input: AddFederationMemberInput): Promise<FederationGroup>;
    /** Remove a member from a federation group */
    removeFederationMember(groupId: string, organizationId: string): Promise<void>;
    /** Pull modules from federated apps into a group */
    pullFederationModules(groupId: string, targetOrgId?: string): Promise<{
        pulled: number;
    }>;
    /** Push resolved permissions to federated apps */
    pushFederationPermissions(groupId: string, adminIds: string[], targetOrgId?: string): Promise<{
        pushed: number;
    }>;
    /** Get federation group sync status */
    getFederationStatus(groupId: string): Promise<{
        groupId: string;
        status: string;
        lastSyncAt: string | null;
    }>;
}

declare class FraudDecisionsResource {
    private http;
    constructor(http: HttpClient);
    /** Render a production decision. */
    decide(input: FraudDecideRequest): Promise<FraudDecideResponse>;
    /**
     * Render a shadow decision. BOTH shadow + published rules contribute to the
     * verdict; the decision is persisted with `shadow: true` and never enforced.
     */
    shadowDecide(input: FraudDecideRequest): Promise<FraudDecideResponse>;
    /** List rendered decisions for the calling organisation. */
    list(params?: ListFraudDecisionsParams): Promise<FraudDecisionRecord[]>;
    /** Fetch a single decision by id. */
    get(decisionId: string): Promise<FraudDecisionRecord>;
}
declare class FraudRulesResource {
    private http;
    constructor(http: HttpClient);
    list(params?: ListFraudRulesParams): Promise<FraudRuleDefinition[]>;
    create(input: CreateFraudRuleRequest): Promise<FraudRuleDefinition>;
    get(ruleId: string): Promise<FraudRuleDefinition>;
    update(ruleId: string, input: UpdateFraudRuleRequest): Promise<FraudRuleDefinition>;
    /** Soft-archive the rule (transitions to `archived`). */
    delete(ruleId: string): Promise<{
        deleted: true;
    }>;
    /** Move a rule through the draft → shadow → published → archived lifecycle. */
    transition(ruleId: string, input: TransitionFraudRuleRequest): Promise<FraudRuleDefinition>;
    /** Trigger / FP rate report for a shadow rule (only meaningful in `shadow` status). */
    shadowReport(ruleId: string): Promise<FraudRuleShadowReport>;
}
declare class FraudScreeningResource {
    private http;
    constructor(http: HttpClient);
    /** Run a sanctions / PEP / blocklist screen. */
    screen(input: FraudScreenRequest): Promise<FraudScreenResponse>;
    /** List tenant-managed screening lists for the calling organisation. */
    listTenantLists(): Promise<TenantListSummary[]>;
    /** Create a tenant blocklist or allowlist. */
    createTenantList(input: CreateTenantListRequest): Promise<TenantListSummary>;
    getTenantList(listId: string): Promise<TenantListSummary>;
    /** Rename a tenant list (`source` and `kind` are immutable post-create). */
    updateTenantList(listId: string, input: UpdateTenantListRequest): Promise<TenantListSummary>;
    deleteTenantList(listId: string): Promise<{
        deleted: true;
    }>;
    listEntries(listId: string): Promise<ScreeningListEntry[]>;
    appendEntries(listId: string, input: AppendListEntriesRequest): Promise<AppendListEntriesResponse>;
    deleteEntry(listId: string, entryId: string): Promise<{
        deleted: true;
    }>;
}
declare class FraudDevicesResource {
    private http;
    constructor(http: HttpClient);
    /** Upsert a device fingerprint observation and receive computed signals. */
    seen(input: DeviceSeenRequest): Promise<DeviceSeenResponse>;
}
declare class FraudCasesResource {
    private http;
    constructor(http: HttpClient);
    list(params?: ListFraudCasesParams): Promise<FraudCaseRecord[]>;
    /** Open a case manually (or against an existing decision). */
    open(input: OpenFraudCaseRequest): Promise<FraudCaseRecord>;
    get(caseId: string): Promise<FraudCaseRecord>;
    update(caseId: string, input: UpdateFraudCaseRequest): Promise<FraudCaseRecord>;
    /** Move through open → triaging → escalated → resolved. */
    transition(caseId: string, input: TransitionFraudCaseRequest): Promise<FraudCaseRecord>;
}
declare class FraudTermsResource {
    private http;
    constructor(http: HttpClient);
    status(): Promise<FraudTermsStatus>;
    accept(input: AcceptFraudTermsRequest): Promise<AcceptFraudTermsResponse>;
}
/**
 * Top-level FraudResource exposed at `client.fraud`. Each sub-resource
 * groups the endpoints for one slice of the Detection Engine.
 */
declare class FraudResource {
    readonly decisions: FraudDecisionsResource;
    readonly rules: FraudRulesResource;
    readonly screening: FraudScreeningResource;
    readonly devices: FraudDevicesResource;
    readonly cases: FraudCasesResource;
    readonly terms: FraudTermsResource;
    constructor(http: HttpClient);
}

declare class AuditResource {
    private http;
    constructor(http: HttpClient);
    /**
     * Dispatch an audit event into the trace pipeline. Accepted asynchronously
     * (HTTP 202) — the event is durably recorded by the inngest worker.
     */
    log(input: AuditLogRequest): Promise<AuditLogAcceptedResponse>;
}

declare class IssuesResource {
    private http;
    constructor(http: HttpClient);
    /** List federated issues for the calling organisation. */
    list(params?: ListIssuesParams): Promise<IssueRecord[]>;
    /** Create a federated issue (bug / support ticket). */
    create(input: CreateIssueRequest): Promise<CreateIssueResponse>;
}

declare class SearchResource {
    private http;
    constructor(http: HttpClient);
    /**
     * Upsert a resource into the federated search index. Accepted asynchronously
     * (HTTP 202) — the upsert is performed by the inngest worker.
     */
    index(input: SearchIndexRequest): Promise<SearchIndexAcceptedResponse>;
    /**
     * Query the federated search index. Returns at most 20 results. The
     * platform performs an ILIKE search across `title` + `keywords`.
     * Queries shorter than 2 characters return an empty array.
     */
    query(params: SearchQueryParams): Promise<SearchResult[]>;
}

declare class WhoamiResource {
    private http;
    constructor(http: HttpClient);
    /**
     * Verify the calling API key and return caller identity.
     *
     * Designed for boot-time self-checks in consumer services. The response
     * includes grace-period + expiry warnings, plus platform-side env hints
     * so consumers can detect environment drift (dev consumer accidentally
     * pointed at prod, etc).
     */
    get(): Promise<WhoamiResponse>;
}

interface PlatformXeClientOptions {
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
    retries?: number;
    retryDelay?: number;
}
declare class PlatformXeClient {
    readonly messaging: MessagingResource;
    readonly storage: StorageResource;
    readonly documents: DocumentsResource;
    readonly webhooks: WebhooksResource;
    readonly workflows: WorkflowsResource;
    readonly templates: TemplatesResource;
    readonly events: EventsResource;
    readonly ocr: OcrResource;
    readonly pdf: PdfResource;
    readonly qr: QrResource;
    readonly domains: DomainsResource;
    readonly exports: ExportsResource;
    readonly usage: UsageResource;
    readonly threads: ThreadsResource;
    readonly identity: IdentityResource;
    readonly permissions: PermissionsResource;
    readonly fraud: FraudResource;
    readonly audit: AuditResource;
    readonly issues: IssuesResource;
    readonly search: SearchResource;
    readonly whoami: WhoamiResource;
    constructor(options: PlatformXeClientOptions);
}

declare class PlatformXeError extends Error {
    readonly code: string;
    readonly status: number;
    readonly requestId?: string;
    constructor(message: string, code: string, status: number, requestId?: string);
}
declare class AuthenticationError extends PlatformXeError {
    constructor(message?: string);
}
declare class RateLimitError extends PlatformXeError {
    readonly retryAfter?: number;
    constructor(message?: string, retryAfter?: number);
}
declare class ValidationError extends PlatformXeError {
    constructor(message: string);
}
declare class NotFoundError extends PlatformXeError {
    constructor(message?: string);
}
declare class TimeoutError extends PlatformXeError {
    constructor(timeoutMs: number);
}

interface RegisterOptions {
    /** Override the platform base URL. Defaults to 'https://platformxe.com'. */
    baseUrl?: string;
    /** Request timeout in milliseconds. Defaults to 10000. */
    timeout?: number;
}
/**
 * Self-register a developer tenant and receive an API key.
 *
 * Creates a FREE-tier tenant with a slug suffixed `-dev` and returns a
 * `pxk_dev_…` API key that must be saved by the caller — the platform
 * does not retain a way to retrieve it.
 */
declare function register(input: RegisterRequest, options?: RegisterOptions): Promise<RegisterResponse>;

export { type AddFederationMemberInput, type AuditExportParams, type AuditLogParams, AuditResource, AuthenticationError, type BatchQRInput, type BatchQRResult, type ChangeLogParams, type CreateFolderInput, type CreateOverrideInput, type CreatePolicyInput, type CreateRoleInput, type CreateWorkflowTriggerInput, DocumentsResource, DomainsResource, type EventLogParams, EventsResource, ExportsResource, type Folder, FraudCasesResource, FraudDecisionsResource, FraudDevicesResource, FraudResource, FraudRulesResource, FraudScreeningResource, FraudTermsResource, IdentityResource, type IngestEventInput, type IngestEventResult, IssuesResource, type ListDeliveriesParams, type ListMediaParams, type ListTemplatesParams, MessagingResource, NotFoundError, OcrResource, PdfResource, PermissionsResource, PlatformXeClient, type PlatformXeClientOptions, PlatformXeError, QrResource, type QueueProcessResult, type QueueStats, RateLimitError, type RegisterOptions, type RelationshipListParams, type ReorderFilesInput, type ReorderFilesResult, type ReplayResult, SearchResource, StorageResource, TemplatesResource, type TestWebhookResult, ThreadsResource, TimeoutError, type UpdatePolicyInput, type UpdateRoleInput, type UpdateWorkflowTriggerInput, UsageResource, type UsageSummaryParams, ValidationError, WebhooksResource, WhoamiResource, type WorkflowTrigger, WorkflowsResource, register };
