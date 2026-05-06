// =============================================================================
// @caldera/platformxe-sdk — Resource Barrel Export
// =============================================================================

export { MessagingResource } from './messaging';
export type { QueueProcessResult, QueueStats } from './messaging';

export { StorageResource } from './storage';
export type { ListMediaParams, ReorderFilesInput, ReorderFilesResult } from './storage';

export { DocumentsResource } from './documents';
export type { CreateFolderInput, Folder } from './documents';

export { WebhooksResource } from './webhooks';
export type { ListDeliveriesParams, TestWebhookResult } from './webhooks';

export { WorkflowsResource } from './workflows';
export type {
  WorkflowTrigger,
  CreateWorkflowTriggerInput,
  UpdateWorkflowTriggerInput,
} from './workflows';

export { TemplatesResource } from './templates';
export type { ListTemplatesParams } from './templates';

export { EventsResource, CustomEventsResource, MarketplaceResource } from './events';
export type {
  IngestEventInput,
  IngestEventResult,
  EventLogParams,
  ReplayResult,
} from './events';

export { OcrResource } from './ocr';

export { PdfResource } from './pdf';

export { QrResource } from './qr';
export type { BatchQRInput, BatchQRResult } from './qr';

export { DomainsResource } from './domains';

export { ExportsResource } from './exports';

export { UsageResource } from './usage';
export type { UsageSummaryParams } from './usage';

export { ThreadsResource } from './threads';

export { IdentityResource } from './identity';

export { PermissionsResource } from './permissions';
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
} from './permissions';

// ─── New in v1.1.0 ─────────────────────────────────────────────────────────

export { FraudResource } from './fraud';
export {
  FraudDecisionsResource,
  FraudRulesResource,
  FraudScreeningResource,
  FraudDevicesResource,
  FraudCasesResource,
  FraudTermsResource,
} from './fraud';

export { AuditResource } from './audit';

export { IssuesResource } from './issues';

export { SearchResource } from './search';

export { WhoamiResource } from './whoami';
