// =============================================================================
// @caldera/platformxe-sdk — Public API Barrel
// =============================================================================

// ─── Client ─────────────────────────────────────────────────────────────────
export { PlatformXeClient } from './client';
export type { PlatformXeClientOptions } from './client';

// ─── Errors ─────────────────────────────────────────────────────────────────
export {
  PlatformXeError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  TimeoutError,
} from './errors';

// ─── Resource Classes ───────────────────────────────────────────────────────
export {
  MessagingResource,
  StorageResource,
  DocumentsResource,
  WebhooksResource,
  WorkflowsResource,
  TemplatesResource,
  EventsResource,
  OcrResource,
  PdfResource,
  QrResource,
  DomainsResource,
  ExportsResource,
  UsageResource,
  ThreadsResource,
  IdentityResource,
  PermissionsResource,
  // v1.1.0
  FraudResource,
  FraudDecisionsResource,
  FraudRulesResource,
  FraudScreeningResource,
  FraudDevicesResource,
  FraudCasesResource,
  FraudTermsResource,
  AuditResource,
  IssuesResource,
  SearchResource,
  WhoamiResource,
} from './resources';

// ─── Standalone Functions ───────────────────────────────────────────────────
export { register } from './register';
export type { RegisterOptions } from './register';

// ─── SDK-specific Types (from resources) ────────────────────────────────────
export type { QueueProcessResult, QueueStats } from './resources';
export type { ListMediaParams, ReorderFilesInput, ReorderFilesResult } from './resources';
export type { CreateFolderInput, Folder } from './resources';
export type { ListDeliveriesParams, TestWebhookResult } from './resources';
export type {
  WorkflowTrigger,
  CreateWorkflowTriggerInput,
  UpdateWorkflowTriggerInput,
} from './resources';
export type { ListTemplatesParams } from './resources';
export type {
  IngestEventInput,
  IngestEventResult,
  EventLogParams,
  ReplayResult,
} from './resources';
export type { BatchQRInput, BatchQRResult } from './resources';
export type { UsageSummaryParams } from './resources';
export type {
  CreateRoleInput,
  UpdateRoleInput,
  CreateOverrideInput,
  CreatePolicyInput,
  UpdatePolicyInput,
  AuditLogParams,
  ChangeLogParams,
  AuditExportParams,
  RelationshipListParams,
  AddFederationMemberInput,
} from './resources';

// ─── All @caldera/platformxe-types (re-exported for consumer convenience) ────
export type {
  // Envelope
  ApiSuccess, ApiError, ApiResponse, PaginatedResponse,
  // Storage: Media
  ModerationStatus, StorageProvider,
  UploadFileRequest, UploadResult,
  BatchUploadRequest, BatchUploadResult,
  SignUploadRequest, SignUploadResult,
  RegisterFileRequest, RegisterFileResult,
  StorageFile, MediaItem,
  // Storage: Fixed (Documents)
  DocumentCategory, DocumentSpace, FileType, OwnerType,
  AccessLevel, Visibility, RetentionType, DeletableBy,
  CreateDocumentInput, DocumentWithMeta,
  UpdateDocumentInput, ListDocumentsOptions, DocumentListResult,
  OverrideStatus, RequestDeletionOverrideInput, ApproveDeletionOverrideInput,
  DeletionOverrideWithMeta,
  DocumentActorAdmin, DocumentActorAgent, DocumentActorPartner, DocumentActor,
  // Messaging: Email
  SendEmailRequest, EmailAttachment, SendEmailResponse,
  EmailHealthResponse,
  // Messaging: SMS & WhatsApp
  SendSmsRequest, SendSmsResponse, SmsHealthResponse,
  SendWhatsAppRequest, SendWhatsAppResponse,
  // OCR
  IdentityCredentialType, MismatchReason,
  VerifyIdentityInput, VerifyIdentityResult,
  // PDF & QR
  OfferLetterPdfRequest, SalaryBreakdown, OfferLetterPdfResponse,
  PropertyFlyerData, AgentBranding, FlyerGenerationInput, FlyerGenerationResult,
  PortalEntityType, ContentEntityType, QREntityType, QRSize, QRErrorCorrection,
  RegistrationQRType, FlyerTemplate, FlyerCurrency,
  QRGeneratorOptions, PolymorphicQRInput, QRGenerationResult,
  // Webhooks
  WebhookListItem, CreateWebhookInput, UpdateWebhookInput,
  CreateWebhookResult, RotateSecretResult, WebhookDeliveryItem,
  // Workflows
  WorkflowTriggerType, WorkflowExecutionStatus, EntityType,
  TriggerContext, EvaluationResult, ActionResult,
  WorkflowEventType, TaskStatus, TaskPriority,
  ScheduledTriggerResult, ActionConfig, DryRunResult,
  TriggerFilters, ExecutionFilters,
  // Analytics
  TimeRange, MessagingOverview, ProviderHealthEntry,
  CallerBreakdownEntry, TimelinePoint,
  SmsOverview, StorageOverview, WorkflowOverview,
  WebhookDeliveryOverview, InvoiceOverview,
  UsageServiceOverview, QueueStatus,
  // Telemetry
  TelemetryPayload, TelemetryMetric,
  // Templates
  TemplateBlockType, TemplateBlock,
  CreateTemplateInput, UpdateTemplateInput,
  RenderTemplateInput, RenderAndSendInput,
  RenderedTemplate, TemplateListItem,
  // Domains
  DomainStatus, EmailProviderName, DnsRecord,
  RegisterDomainInput, VerifyDomainResult, SendingDomain,
  // Billing
  PlanLevel, PaymentProvider, SubscriptionStatus, RegionCode,
  RegionalPrice, PlanDefinition, CustomerBillingInfo,
  UsageSummary, QuotaCheckResult,
  // Events
  EventSubscriptionStatus, PlatformEventType,
  CreateEventSubscriptionInput, UpdateEventSubscriptionInput,
  EventSubscription, EventLogItem, ReplayInput,
  // Invoicing
  InvoiceStatus, InvoiceLineItem, Invoice, InvoiceWithLineItems,
  CreateInvoiceInput, InvoiceListParams,
  // Exports
  ExportFormat, ExportStatus, ExportDataType,
  CreateExportInput, ExportRecord,
  // Threads
  ThreadChannel, ThreadChannelLifecycleRules,
  ThreadChannelEscalationConfig, ThreadEscalationRule,
  CreateThreadChannelRequest, UpdateThreadChannelRequest,
  Thread, ThreadParticipant, ThreadWithParticipants,
  CreateThreadRequest, UpdateThreadRequest, ThreadListParams,
  ThreadMessage, SendThreadMessageRequest, SendSystemMessageRequest,
  ThreadReadState, MarkReadRequest,
  ThreadInboxItem, ThreadInboxParams,
  ThreadFlag, FlagMessageRequest, ReviewFlagRequest,
  AdminEscalateRequest,
  EntityEventRequest, EntityEventResponse,
  // Identity
  IdentityResolveRequest, IdentityResolveResponse,
  IdentityVerifyRequest, IdentityVerifyResponse,
  IdentityLookupResponse, IdentityProviderStatus,
  // Permissions
  PolicyAction,
  PermissionCheckRequest, PermissionCheckResponse,
  ResolvedCapabilities,
  PermissionRole, PermissionOverride,
  ResourcePolicy,
  RelationshipTuple, RelationshipOperation,
  PermissionModule,
  PermissionAuditLog, PermissionChangeLog,
  FederationGroup,
  ShadowCheckRequest, ShadowCheckResponse,
  // ─── New in v1.1.0 ──────────────────────────────────────────────────────
  // Audit
  AuditLogRequest, AuditLogAcceptedResponse,
  // Issues
  IssuePriority, IssueStatus,
  ListIssuesParams, IssueRecord, ListIssuesResponse,
  CreateIssueRequest, CreateIssueResponse,
  // Search
  SearchIndexRequest, SearchIndexAcceptedResponse,
  SearchQueryParams, SearchResult, SearchQueryResponse,
  // Register
  RegisterRequest, RegisteredTenant, RegisterResponse,
  // Whoami
  WhoamiDbEnvironment, WhoamiResponse,
  // Usage (extension to existing)
  UsageSummaryParams as UsageSummaryQueryParams,
  UsageServiceLine, UsageSummaryResponse,
  // Event log + extended subscriptions
  CreateEventSubscriptionResponse, DeleteEventSubscriptionResponse,
  ReplayEventSubscriptionResponse, QueryEventLogParams, QueryEventLogResponse,
  // Fraud Detection Engine
  FraudVerdict, FraudRuleStatus, FraudCaseStatus, FraudCaseResolution,
  DecisionReasonKind, DecisionReason,
  FraudDecideAmount, FraudDecideExternalScore, FraudDecideContext,
  FraudDecideSubject, FraudDecideResource,
  FraudDecideRequest, FraudDecideResponse,
  ListFraudDecisionsParams, FraudDecisionRecord,
  FraudRuleOperator, FraudLeafPredicate,
  FraudAllPredicate, FraudAnyPredicate, FraudNotPredicate, FraudRuleCondition,
  FraudCounterAggregation, FraudRuleWindow, FraudRuleAppliesTo, FraudRuleDefinition,
  CreateFraudRuleRequest, UpdateFraudRuleRequest, ListFraudRulesParams,
  TransitionFraudRuleRequest, FraudRuleShadowReport,
  ScreeningListKind, TenantListKind, ScreeningHit, ScreeningProvider,
  FraudScreenRequest, FraudScreenResponse,
  ScreeningListEntry, TenantListSummary,
  CreateTenantListRequest, UpdateTenantListRequest,
  AppendListEntriesRequest, ScreeningListEntryInput, AppendListEntriesResponse,
  DeviceSeenRequest, DeviceSignals, IpIntelLookup, IpIntelResult, DeviceSeenResponse,
  FraudCaseNote, FraudCaseRecord,
  ListFraudCasesParams, OpenFraudCaseRequest,
  UpdateFraudCaseRequest, TransitionFraudCaseRequest,
  FraudTermsStatus, AcceptFraudTermsRequest, AcceptFraudTermsResponse,
} from '@caldera/platformxe-types';
