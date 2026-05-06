// =============================================================================
// @caldera/platformxe-sdk — Main Client
// =============================================================================

import { HttpClient } from './http';
import {
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
  FraudResource,
  AuditResource,
  IssuesResource,
  SearchResource,
  WhoamiResource,
} from './resources';

export interface PlatformXeClientOptions {
  apiKey: string;
  baseUrl?: string;    // default: 'https://platformxe.com'
  timeout?: number;    // default: 10000
  retries?: number;    // default: 2
  retryDelay?: number; // default: 1000
}

export class PlatformXeClient {
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

  constructor(options: PlatformXeClientOptions) {
    const http = new HttpClient({
      apiKey: options.apiKey,
      baseUrl: options.baseUrl ?? 'https://platformxe.com',
      timeout: options.timeout ?? 10000,
      retries: options.retries ?? 2,
      retryDelay: options.retryDelay ?? 1000,
    });

    this.messaging = new MessagingResource(http);
    this.storage = new StorageResource(http);
    this.documents = new DocumentsResource(http);
    this.webhooks = new WebhooksResource(http);
    this.workflows = new WorkflowsResource(http);
    this.templates = new TemplatesResource(http);
    this.events = new EventsResource(http);
    this.ocr = new OcrResource(http);
    this.pdf = new PdfResource(http);
    this.qr = new QrResource(http);
    this.domains = new DomainsResource(http);
    this.exports = new ExportsResource(http);
    this.usage = new UsageResource(http);
    this.threads = new ThreadsResource(http);
    this.identity = new IdentityResource(http);
    this.permissions = new PermissionsResource(http);
    this.fraud = new FraudResource(http);
    this.audit = new AuditResource(http);
    this.issues = new IssuesResource(http);
    this.search = new SearchResource(http);
    this.whoami = new WhoamiResource(http);
  }
}
