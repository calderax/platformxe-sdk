// src/errors.ts
var PlatformXeError = class extends Error {
  code;
  status;
  requestId;
  constructor(message, code, status, requestId) {
    super(message);
    this.name = "PlatformXeError";
    this.code = code;
    this.status = status;
    this.requestId = requestId;
  }
};
var AuthenticationError = class extends PlatformXeError {
  constructor(message = "Invalid or missing API key") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "AuthenticationError";
  }
};
var RateLimitError = class extends PlatformXeError {
  retryAfter;
  constructor(message = "Rate limit exceeded", retryAfter) {
    super(message, "RATE_LIMITED", 429);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
};
var ValidationError = class extends PlatformXeError {
  constructor(message) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
};
var NotFoundError = class extends PlatformXeError {
  constructor(message = "Resource not found") {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
};
var TimeoutError = class extends PlatformXeError {
  constructor(timeoutMs) {
    super(`Request timed out after ${timeoutMs}ms`, "TIMEOUT", 0);
    this.name = "TimeoutError";
  }
};

// src/http.ts
var HttpClient = class {
  opts;
  constructor(opts) {
    this.opts = opts;
  }
  async request(path, options = {}) {
    const { method = "GET", body, params, headers } = options;
    let url = `${this.opts.baseUrl}${path}`;
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== void 0) searchParams.set(key, String(value));
      }
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }
    let lastError = null;
    for (let attempt = 0; attempt <= this.opts.retries; attempt++) {
      if (attempt > 0) {
        const delay = this.opts.retryDelay * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, delay));
      }
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.opts.timeout);
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.opts.apiKey,
            ...headers
          },
          body: body ? JSON.stringify(body) : void 0,
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (response.status === 401) throw new AuthenticationError();
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get("retry-after") ?? "", 10) || void 0;
          throw new RateLimitError("Rate limit exceeded", retryAfter);
        }
        const json = await response.json();
        if (!json.success) {
          const err = json;
          if (response.status === 400) throw new ValidationError(err.error.message);
          if (response.status === 404) throw new NotFoundError(err.error.message);
          if (response.status >= 500) {
            lastError = new PlatformXeError(err.error.message, err.error.code, response.status);
            continue;
          }
          throw new PlatformXeError(err.error.message, err.error.code, response.status);
        }
        return json.data;
      } catch (err) {
        if (err instanceof PlatformXeError) {
          if (err.status > 0 && err.status < 500 && !(err instanceof RateLimitError)) throw err;
          lastError = err;
        } else if (err instanceof DOMException && err.name === "AbortError") {
          lastError = new TimeoutError(this.opts.timeout);
        } else {
          lastError = err instanceof Error ? err : new Error(String(err));
        }
      }
    }
    throw lastError ?? new PlatformXeError("Request failed after retries", "UNKNOWN", 0);
  }
  get(path, params) {
    return this.request(path, { method: "GET", params });
  }
  post(path, body) {
    return this.request(path, { method: "POST", body });
  }
  patch(path, body) {
    return this.request(path, { method: "PATCH", body });
  }
  put(path, body) {
    return this.request(path, { method: "PUT", body });
  }
  del(path) {
    return this.request(path, { method: "DELETE" });
  }
};

// src/resources/messaging.ts
var MessagingResource = class {
  constructor(http) {
    this.http = http;
  }
  /** Send a transactional email */
  async sendEmail(input) {
    return this.http.post("/api/v1/messaging/email/send", input);
  }
  /** Send an SMS */
  async sendSms(input) {
    return this.http.post("/api/v1/messaging/sms", input);
  }
  /** Send a WhatsApp message */
  async sendWhatsApp(input) {
    return this.http.post("/api/v1/messaging/whatsapp", input);
  }
  /** Check email provider health */
  async emailHealth() {
    return this.http.get("/api/v1/messaging/email/health");
  }
  /** Check SMS provider health */
  async smsHealth() {
    return this.http.get("/api/v1/messaging/sms/health");
  }
  /** Process the email queue */
  async processQueue(batchSize) {
    return this.http.post("/api/v1/messaging/queue/process", { batchSize });
  }
  /** Get queue statistics */
  async queueStats() {
    return this.http.get("/api/v1/messaging/queue/stats");
  }
  /** Get the messaging processor configuration */
  async getProcessor() {
    return this.http.get("/api/v1/messaging/processor");
  }
  /** Update the messaging processor configuration */
  async updateProcessor(input) {
    return this.http.put("/api/v1/messaging/processor", input);
  }
};

// src/resources/storage.ts
var StorageResource = class {
  constructor(http) {
    this.http = http;
  }
  /** Upload a single file (base64-encoded) */
  async upload(input) {
    return this.http.post("/api/v1/storage/media/upload", input);
  }
  /** Upload multiple files in a single request */
  async batchUpload(input) {
    return this.http.post("/api/v1/storage/media/upload/batch", input);
  }
  /** Get a presigned upload URL for direct browser uploads */
  async signUpload(input) {
    return this.http.post("/api/v1/storage/media/sign-upload", input);
  }
  /** Register a file after a presigned upload completes */
  async register(input) {
    return this.http.post("/api/v1/storage/media/register", input);
  }
  /** List media files for an entity */
  async list(params) {
    return this.http.get("/api/v1/storage/media/files", params);
  }
  /** Get a single file by ID */
  async get(fileId) {
    return this.http.get(`/api/v1/storage/media/files/${fileId}`);
  }
  /** Delete a file by ID */
  async delete(fileId) {
    return this.http.del(`/api/v1/storage/media/files/${fileId}`);
  }
  /** Reorder files (set display order) */
  async reorder(input) {
    return this.http.post("/api/v1/storage/media/reorder", input);
  }
  /** Get the storage processor configuration */
  async getProcessor() {
    return this.http.get("/api/v1/storage/processor");
  }
  /** Update the storage processor configuration */
  async updateProcessor(input) {
    return this.http.put("/api/v1/storage/processor", input);
  }
};

// src/resources/documents.ts
var DocumentsResource = class {
  constructor(http) {
    this.http = http;
  }
  /** Create a new document */
  async create(input) {
    return this.http.post("/api/v1/storage/fixed/documents", input);
  }
  /** List documents with optional filters */
  async list(options) {
    return this.http.get(
      "/api/v1/storage/fixed/documents",
      options
    );
  }
  /** Get a document by ID */
  async get(documentId) {
    return this.http.get(`/api/v1/storage/fixed/documents/${documentId}`);
  }
  /** Update a document */
  async update(documentId, input) {
    return this.http.patch(`/api/v1/storage/fixed/documents/${documentId}`, input);
  }
  /** Delete a document (may require override if protected) */
  async delete(documentId) {
    return this.http.del(`/api/v1/storage/fixed/documents/${documentId}`);
  }
  // ── Folders ──────────────────────────────────────────────────────────────
  /** Create a folder */
  async createFolder(input) {
    return this.http.post("/api/v1/storage/fixed/folders", input);
  }
  /** Get a folder by ID (includes child documents) */
  async getFolder(folderId) {
    return this.http.get(`/api/v1/storage/fixed/folders/${folderId}`);
  }
  // ── Deletion Overrides ───────────────────────────────────────────────────
  /** Request a deletion override for a protected document */
  async requestOverride(input) {
    return this.http.post("/api/v1/storage/fixed/overrides", input);
  }
  /** Approve or reject a deletion override request */
  async processOverride(overrideId, input) {
    return this.http.patch(`/api/v1/storage/fixed/overrides/${overrideId}`, input);
  }
};

// src/resources/webhooks.ts
var WebhooksResource = class {
  constructor(http) {
    this.http = http;
  }
  /** List all webhooks */
  async list() {
    return this.http.get("/api/v1/webhooks");
  }
  /** Create a new webhook */
  async create(input) {
    return this.http.post("/api/v1/webhooks", input);
  }
  /** Get a webhook by ID */
  async get(webhookId) {
    return this.http.get(`/api/v1/webhooks/${webhookId}`);
  }
  /** Update a webhook */
  async update(webhookId, input) {
    return this.http.patch(`/api/v1/webhooks/${webhookId}`, input);
  }
  /** Delete a webhook */
  async delete(webhookId) {
    return this.http.del(`/api/v1/webhooks/${webhookId}`);
  }
  /** Send a test delivery to the webhook URL */
  async test(webhookId) {
    return this.http.post(`/api/v1/webhooks/${webhookId}/test`);
  }
  /** Rotate the signing secret (old secret is immediately invalidated) */
  async rotateSecret(webhookId) {
    return this.http.post(`/api/v1/webhooks/${webhookId}/rotate`);
  }
};

// src/resources/workflows.ts
var WorkflowsResource = class {
  constructor(http) {
    this.http = http;
  }
  /** List workflow triggers with optional filters */
  async list(filters) {
    return this.http.get(
      "/api/v1/workflows",
      filters
    );
  }
  /** Create a workflow trigger */
  async create(input) {
    return this.http.post("/api/v1/workflows", input);
  }
  /** Get a workflow trigger by ID */
  async get(triggerId) {
    return this.http.get(`/api/v1/workflows/${triggerId}`);
  }
  /** Update a workflow trigger */
  async update(triggerId, input) {
    return this.http.patch(`/api/v1/workflows/${triggerId}`, input);
  }
  /** Delete a workflow trigger */
  async delete(triggerId) {
    return this.http.del(`/api/v1/workflows/${triggerId}`);
  }
  /** Evaluate triggers against a given context */
  async evaluate(context) {
    return this.http.post("/api/v1/workflows/evaluate", context);
  }
  /** Dry-run a trigger against a context (no side effects) */
  async dryRun(triggerId, context) {
    return this.http.post(`/api/v1/workflows/${triggerId}/dry-run`, context);
  }
};

// src/resources/templates.ts
var TemplatesResource = class {
  constructor(http) {
    this.http = http;
  }
  /** List templates */
  async list(params) {
    return this.http.get(
      "/api/v1/templates",
      params
    );
  }
  /** Create a template */
  async create(input) {
    return this.http.post("/api/v1/templates", input);
  }
  /** Get a template by ID */
  async get(templateId) {
    return this.http.get(`/api/v1/templates/${templateId}`);
  }
  /** Update a template */
  async update(templateId, input) {
    return this.http.patch(`/api/v1/templates/${templateId}`, input);
  }
  /** Delete a template */
  async delete(templateId) {
    return this.http.del(`/api/v1/templates/${templateId}`);
  }
  /** Render a template with variables (returns HTML/text, does not send) */
  async render(templateId, input) {
    return this.http.post(`/api/v1/templates/${templateId}/render`, input);
  }
  /** Render a template and send it as an email */
  async send(templateId, input) {
    return this.http.post(`/api/v1/templates/${templateId}/send`, input);
  }
};

// src/resources/events.ts
var CustomEventsResource = class {
  constructor(http) {
    this.http = http;
    this.marketplace = new MarketplaceResource(http);
    this.federation = new FederationResource(http);
  }
  /**
   * Marketplace surface — publish + browse + fork. Available on PRO+
   * plans for publish/fork; browsing is open to all plans.
   *
   * Mirrors the Python SDK's `client.events.custom.marketplace` and the
   * Go SDK's `client.Events.Custom.Marketplace`.
   */
  marketplace;
  /**
   * Federation push surface — group-based event federation. ENTERPRISE-only
   * on both sides (owner and member). Owners create groups, invite peer
   * orgs, and declare per-version pushes; relays fan out automatically.
   *
   * Mirrors the Python SDK's `client.events.custom.federation` and the
   * Go SDK's `client.Events.Custom.Federation`.
   */
  federation;
  /** Register a new custom event (or a new version of an existing one). */
  async register(input) {
    return this.http.post("/api/v1/events/custom", input);
  }
  /** List registrations belonging to the caller's organisation. */
  async list(params) {
    const query = {};
    if (params?.namespace) query.namespace = params.namespace;
    if (params?.status) query.status = params.status;
    return this.http.get("/api/v1/events/custom", query);
  }
  /** Fetch the full detail for a single registration. */
  async get(registrationId) {
    return this.http.get(`/api/v1/events/custom/${registrationId}`);
  }
  /** Soft-delete a registration. The platform-seeded generic event is protected. */
  async archive(registrationId) {
    return this.http.del(`/api/v1/events/custom/${registrationId}`);
  }
  /**
   * Emit a payload against a registered event. Returns `status: 'queued'` on
   * success — delivery to subscribers is asynchronous. Free-tier tenants may
   * emit `platformxe.generic` without prior registration; everything else
   * requires Basic+.
   */
  async emit(input) {
    return this.http.post("/api/v1/events/custom/emit", input);
  }
  /**
   * Validate a registration template without persisting. Mirrors the first
   * stage of {@link register}; useful for `terraform plan` previews and SDK
   * type-generation workflows.
   */
  async dryRun(input) {
    return this.http.post("/api/v1/events/custom/dry-run", input);
  }
  /** Usage diagnostics for the caller's organisation. */
  async health() {
    return this.http.get("/api/v1/events/custom/health");
  }
  /**
   * Subscribe a webhook to a registered custom event. The platform resolves
   * the canonical bus name from the calling org — tenants don't need to
   * construct `TENANT_CUSTOM:<orgId>:<ns>.<name>@<v>` strings by hand.
   *
   * Pass `version: '*'` (or omit) to subscribe to all versions.
   */
  async subscribe(input) {
    return this.http.post("/api/v1/events/custom/subscribe", input);
  }
};
var MarketplaceResource = class {
  constructor(http) {
    this.http = http;
  }
  /** Publish a registered event to the marketplace. PRO+ only. */
  async publish(input) {
    return this.http.post(
      "/api/v1/events/custom/marketplace/publish",
      input
    );
  }
  /** Browse listings. Open to all plans. */
  async list(params) {
    return this.http.get(
      "/api/v1/events/custom/marketplace",
      params
    );
  }
  /** Fetch full detail (incl. payloadSchema) for a listing. */
  async get(listingId) {
    return this.http.get(
      `/api/v1/events/custom/marketplace/${listingId}`
    );
  }
  /** Unpublish a listing the caller's org owns. */
  async unpublish(listingId) {
    return this.http.del(
      `/api/v1/events/custom/marketplace/${listingId}`
    );
  }
  /** Re-activate a previously unpublished listing the caller's org owns. */
  async republish(listingId) {
    return this.http.post(
      `/api/v1/events/custom/marketplace/${listingId}/republish`
    );
  }
  /**
   * Fork a listing — copies the schema into the caller's org under the
   * destination shape they choose. PRO+ only.
   */
  async fork(listingId, input) {
    return this.http.post(
      `/api/v1/events/custom/marketplace/${listingId}/fork`,
      input
    );
  }
};
var FederationResource = class {
  constructor(http) {
    this.http = http;
  }
  /** Create a new federation group owned by the calling org. */
  async createGroup(input) {
    return this.http.post(
      "/api/v1/events/custom/federation/groups",
      input
    );
  }
  /** List groups visible to the calling org (owned + member-of). */
  async listGroups(params) {
    return this.http.get(
      "/api/v1/events/custom/federation/groups",
      params
    );
  }
  /** Fetch full group detail (members + active pushes). */
  async getGroup(groupId) {
    return this.http.get(
      `/api/v1/events/custom/federation/groups/${groupId}`
    );
  }
  /** Archive a group the caller's org owns. Stops fan-out; preserves history. */
  async archiveGroup(groupId) {
    return this.http.del(
      `/api/v1/events/custom/federation/groups/${groupId}`
    );
  }
  /** Invite a peer ENTERPRISE org into a group. Owner-only. */
  async invite(groupId, input) {
    return this.http.post(
      `/api/v1/events/custom/federation/groups/${groupId}/invite`,
      input
    );
  }
  /** Accept a pending invitation to a group. Caller must be the invited org. */
  async accept(groupId) {
    return this.http.post(
      `/api/v1/events/custom/federation/groups/${groupId}/accept`,
      void 0
    );
  }
  /** Voluntarily leave a group the caller is a member of. */
  async leave(groupId) {
    return this.http.post(
      `/api/v1/events/custom/federation/groups/${groupId}/leave`,
      void 0
    );
  }
  /** Declare a per-version push of one of the owner's registrations. Owner-only. */
  async declarePush(groupId, input) {
    return this.http.post(
      `/api/v1/events/custom/federation/groups/${groupId}/pushes`,
      input
    );
  }
  /** List pushes declared in a group. */
  async listPushes(groupId, params) {
    return this.http.get(
      `/api/v1/events/custom/federation/groups/${groupId}/pushes`,
      params
    );
  }
  /** Stop pushing a previously-declared per-version push. Owner-only. */
  async undeclarePush(pushId) {
    return this.http.del(
      `/api/v1/events/custom/federation/pushes/${pushId}`
    );
  }
};
var EventsResource = class {
  constructor(http) {
    this.http = http;
    this.custom = new CustomEventsResource(http);
  }
  /** Tenant-defined custom events — register, emit, list, subscribe. */
  custom;
  /** Ingest a new event into the platform */
  async ingest(input) {
    return this.http.post("/api/v1/events/ingest", input);
  }
  /** Query the event log */
  async log(params) {
    return this.http.get(
      "/api/v1/event-log",
      params
    );
  }
  // ── Subscriptions ────────────────────────────────────────────────────────
  /** List event subscriptions */
  async listSubscriptions() {
    return this.http.get("/api/v1/event-subscriptions");
  }
  /** Create an event subscription */
  async createSubscription(input) {
    return this.http.post("/api/v1/event-subscriptions", input);
  }
  /** Get an event subscription by ID */
  async getSubscription(subscriptionId) {
    return this.http.get(`/api/v1/event-subscriptions/${subscriptionId}`);
  }
  /** Update an event subscription */
  async updateSubscription(subscriptionId, input) {
    return this.http.patch(`/api/v1/event-subscriptions/${subscriptionId}`, input);
  }
  /** Delete an event subscription */
  async deleteSubscription(subscriptionId) {
    return this.http.del(`/api/v1/event-subscriptions/${subscriptionId}`);
  }
  /** Replay events for a subscription within a time range */
  async replay(subscriptionId, input) {
    return this.http.post(`/api/v1/event-subscriptions/${subscriptionId}/replay`, input);
  }
};

// src/resources/ocr.ts
var OcrResource = class {
  constructor(http) {
    this.http = http;
  }
  /** Verify an identity document against a profile name */
  async verifyIdentity(input) {
    return this.http.post("/api/v1/ocr/verify-identity", input);
  }
  /** Get the OCR processor configuration */
  async getProcessor() {
    return this.http.get("/api/v1/ocr/processor");
  }
  /** Update the OCR processor configuration */
  async updateProcessor(input) {
    return this.http.put("/api/v1/ocr/processor", input);
  }
};

// src/resources/pdf.ts
var PdfResource = class {
  constructor(http) {
    this.http = http;
  }
  /** Generate an offer letter PDF */
  async offerLetter(input) {
    return this.http.post("/api/v1/pdf/offer-letter", input);
  }
  /** Generate a property flyer PDF */
  async propertyFlyer(input) {
    return this.http.post("/api/v1/pdf/property-flyer", input);
  }
  /** Get the PDF processor configuration */
  async getProcessor() {
    return this.http.get("/api/v1/pdf/processor");
  }
  /** Update the PDF processor configuration */
  async updateProcessor(input) {
    return this.http.put("/api/v1/pdf/processor", input);
  }
};

// src/resources/qr.ts
var QrResource = class {
  constructor(http) {
    this.http = http;
  }
  /** Generate a single QR code */
  async generate(input) {
    return this.http.post("/api/v1/qr", input);
  }
  /** Generate QR codes in batch */
  async generateBatch(input) {
    return this.http.post("/api/v1/qr/batch", input);
  }
  /** Get the QR processor configuration */
  async getProcessor() {
    return this.http.get("/api/v1/qr/processor");
  }
  /** Update the QR processor configuration */
  async updateProcessor(input) {
    return this.http.put("/api/v1/qr/processor", input);
  }
};

// src/resources/domains.ts
var DomainsResource = class {
  constructor(http) {
    this.http = http;
  }
  /** Register a new sending domain */
  async register(input) {
    return this.http.post("/api/v1/domains", input);
  }
  /** List all sending domains */
  async list() {
    return this.http.get("/api/v1/domains");
  }
  /** Get a domain by ID */
  async get(domainId) {
    return this.http.get(`/api/v1/domains/${domainId}`);
  }
  /** Delete a domain */
  async delete(domainId) {
    return this.http.del(`/api/v1/domains/${domainId}`);
  }
  /** Verify DNS records for a domain */
  async verify(domainId) {
    return this.http.post(`/api/v1/domains/${domainId}/verify`);
  }
};

// src/resources/exports.ts
var ExportsResource = class {
  constructor(http) {
    this.http = http;
  }
  /** Create a new data export */
  async create(input) {
    return this.http.post("/api/v1/exports", input);
  }
  /** Get an export by ID (check status / download URL) */
  async get(exportId) {
    return this.http.get(`/api/v1/exports/${exportId}`);
  }
  /** Get the exports processor configuration */
  async getProcessor() {
    return this.http.get("/api/v1/exports/processor");
  }
  /** Update the exports processor configuration */
  async updateProcessor(input) {
    return this.http.put("/api/v1/exports/processor", input);
  }
};

// src/resources/usage.ts
var UsageResource = class {
  constructor(http) {
    this.http = http;
  }
  /** Get usage summary for the current or specified billing month */
  async summary(params) {
    return this.http.get(
      "/api/v1/usage/summary",
      params
    );
  }
};

// src/resources/threads.ts
var ThreadsResource = class {
  constructor(http) {
    this.http = http;
  }
  // -- Channels --
  /** Create a messaging channel */
  async createChannel(input) {
    return this.http.post("/api/v1/threads/channels", input);
  }
  /** List all channels for the organization */
  async listChannels() {
    return this.http.get("/api/v1/threads/channels");
  }
  /** Update a channel */
  async updateChannel(channelId, input) {
    return this.http.patch(`/api/v1/threads/channels/${channelId}`, input);
  }
  /** Get escalation config for a channel */
  async getEscalationConfig(channelId) {
    return this.http.get(`/api/v1/threads/channels/${channelId}/escalation`);
  }
  /** Set escalation config for a channel */
  async setEscalationConfig(channelId, config) {
    return this.http.put(`/api/v1/threads/channels/${channelId}/escalation`, config);
  }
  // -- Threads --
  /** Create a thread */
  async createThread(input) {
    return this.http.post("/api/v1/threads", input);
  }
  /** List threads with optional filters */
  async listThreads(params) {
    return this.http.get(
      "/api/v1/threads",
      params
    );
  }
  /** Get a single thread by ID */
  async getThread(threadId) {
    return this.http.get(`/api/v1/threads/${threadId}`);
  }
  /** Update a thread */
  async updateThread(threadId, input) {
    return this.http.patch(`/api/v1/threads/${threadId}`, input);
  }
  /** Close a thread */
  async closeThread(threadId, input) {
    return this.http.post(`/api/v1/threads/${threadId}/close`, input ?? {});
  }
  /** Reopen a closed thread */
  async reopenThread(threadId) {
    return this.http.post(`/api/v1/threads/${threadId}/reopen`, {});
  }
  // -- Messages --
  /** Send a message in a thread */
  async sendMessage(threadId, input) {
    return this.http.post(`/api/v1/threads/${threadId}/messages`, input);
  }
  /** List messages in a thread */
  async listMessages(threadId, params) {
    return this.http.get(
      `/api/v1/threads/${threadId}/messages`,
      params
    );
  }
  /** Edit a message */
  async editMessage(messageId, input) {
    return this.http.patch(`/api/v1/threads/messages/${messageId}`, input);
  }
  /** Soft-delete a message */
  async deleteMessage(messageId) {
    return this.http.del(`/api/v1/threads/messages/${messageId}`);
  }
  /** Send a system message */
  async sendSystemMessage(threadId, input) {
    return this.http.post(`/api/v1/threads/${threadId}/messages/system`, input);
  }
  // -- Participants --
  /** Add a participant to a thread */
  async addParticipant(threadId, input) {
    return this.http.post(`/api/v1/threads/${threadId}/participants`, input);
  }
  /** Remove a participant from a thread */
  async removeParticipant(threadId, participantId) {
    return this.http.del(`/api/v1/threads/${threadId}/participants/${participantId}`);
  }
  /** Update a participant */
  async updateParticipant(threadId, participantId, input) {
    return this.http.patch(
      `/api/v1/threads/${threadId}/participants/${participantId}`,
      input
    );
  }
  // -- Read State --
  /** Mark messages as read */
  async markRead(threadId, input) {
    return this.http.post(`/api/v1/threads/${threadId}/read`, input);
  }
  /** Get read states for all participants in a thread */
  async getReadStates(threadId) {
    return this.http.get(`/api/v1/threads/${threadId}/read-state`);
  }
  // -- Inbox --
  /** Get inbox for a participant */
  async inbox(params) {
    return this.http.get(
      "/api/v1/threads/inbox",
      params
    );
  }
  /** Get unread count for a participant */
  async unreadCount(params) {
    return this.http.get("/api/v1/threads/inbox/unread-count", params);
  }
  // -- Lifecycle --
  /** Notify threads of an entity lifecycle event */
  async entityEvent(input) {
    return this.http.post("/api/v1/threads/entity-event", input);
  }
  // -- Flags & Escalation --
  /** Flag a message */
  async flagMessage(threadId, messageId, input) {
    return this.http.post(
      `/api/v1/threads/${threadId}/messages/${messageId}/flag`,
      input
    );
  }
  /** List flags for a thread */
  async listFlags(threadId, params) {
    return this.http.get(
      `/api/v1/threads/${threadId}/flags`,
      params
    );
  }
  /** List flags across all threads */
  async listFlagsAcrossThreads(params) {
    return this.http.get(
      "/api/v1/threads/flags",
      params
    );
  }
  /** Review a flag */
  async reviewFlag(flagId, input) {
    return this.http.patch(`/api/v1/threads/flags/${flagId}`, input);
  }
  /** Escalate a thread */
  async escalateThread(threadId, input) {
    return this.http.post(
      `/api/v1/threads/${threadId}/escalate`,
      input
    );
  }
};

// src/resources/identity.ts
var IdentityResource = class {
  constructor(http) {
    this.http = http;
  }
  /** Resolve an identity with consent */
  async resolve(input) {
    return this.http.post("/api/v1/identity/resolve", input);
  }
  /** Verify identity against known data */
  async verify(input) {
    return this.http.post("/api/v1/identity/verify", input);
  }
  /** Look up an identity by type and value */
  async lookup(type, value) {
    return this.http.get("/api/v1/identity/lookup", { type, value });
  }
  /** List identity provider statuses */
  async providers() {
    return this.http.get("/api/v1/identity/providers");
  }
  /** Get the identity processor configuration */
  async getProcessor() {
    return this.http.get("/api/v1/identity/processor");
  }
  /** Update the identity processor configuration */
  async updateProcessor(input) {
    return this.http.put("/api/v1/identity/processor", input);
  }
};

// src/resources/permissions.ts
var PermissionsResource = class {
  constructor(http) {
    this.http = http;
  }
  // ── Check & Resolve ─────────────────────────────────────────────────────
  /** Check a single permission */
  async check(input) {
    return this.http.post("/api/v1/permissions/check", input);
  }
  /** Batch-check multiple permissions */
  async checkBatch(checks) {
    return this.http.post(
      "/api/v1/permissions/check-batch",
      { checks }
    );
  }
  /** Resolve all capabilities for an admin */
  async resolve(adminId) {
    return this.http.get(`/api/v1/permissions/resolve/${adminId}`);
  }
  // ── Roles ───────────────────────────────────────────────────────────────
  /** List all roles */
  async listRoles() {
    return this.http.get("/api/v1/permissions/roles");
  }
  /** Create a role */
  async createRole(input) {
    return this.http.post("/api/v1/permissions/roles", input);
  }
  /** Get a role by ID */
  async getRole(roleId) {
    return this.http.get(`/api/v1/permissions/roles/${roleId}`);
  }
  /** Update a role */
  async updateRole(roleId, input) {
    return this.http.patch(`/api/v1/permissions/roles/${roleId}`, input);
  }
  /** Delete a role */
  async deleteRole(roleId) {
    return this.http.del(`/api/v1/permissions/roles/${roleId}`);
  }
  // ── Capabilities ────────────────────────────────────────────────────────
  /** Get capabilities for a role (SIMPLE model) */
  async getRoleCapabilities(roleId) {
    return this.http.get(
      `/api/v1/permissions/roles/${roleId}/capabilities`
    );
  }
  /** Set capabilities for a role (SIMPLE model) */
  async setRoleCapabilities(roleId, capabilities) {
    return this.http.put(
      `/api/v1/permissions/roles/${roleId}/capabilities`,
      { capabilities }
    );
  }
  // ── Module Permissions ──────────────────────────────────────────────────
  /** Get module permissions for a role (FULL model) */
  async getRoleModulePermissions(roleId) {
    return this.http.get(
      `/api/v1/permissions/roles/${roleId}/modules`
    );
  }
  /** Set module permissions for a role (FULL model) */
  async setRoleModulePermissions(roleId, modules) {
    return this.http.put(
      `/api/v1/permissions/roles/${roleId}/modules`,
      { modules }
    );
  }
  // ── Overrides ───────────────────────────────────────────────────────────
  /** List overrides for an admin */
  async listOverrides(adminId) {
    return this.http.get(`/api/v1/permissions/overrides/${adminId}`);
  }
  /** Create an override */
  async createOverride(input) {
    return this.http.post("/api/v1/permissions/overrides", input);
  }
  /** Delete an override */
  async deleteOverride(overrideId) {
    return this.http.del(`/api/v1/permissions/overrides/remove/${overrideId}`);
  }
  // ── Policies ────────────────────────────────────────────────────────────
  /** List all resource policies */
  async listPolicies() {
    return this.http.get("/api/v1/permissions/policies");
  }
  /** Create a resource policy */
  async createPolicy(input) {
    return this.http.post("/api/v1/permissions/policies", input);
  }
  /** Update a resource policy */
  async updatePolicy(policyId, input) {
    return this.http.patch(`/api/v1/permissions/policies/${policyId}`, input);
  }
  /** Delete a resource policy */
  async deletePolicy(policyId) {
    return this.http.del(`/api/v1/permissions/policies/${policyId}`);
  }
  // ── Relationships ───────────────────────────────────────────────────────
  /** List relationship tuples */
  async listRelationships(params) {
    return this.http.get(
      "/api/v1/permissions/relationships",
      params
    );
  }
  /** Write or delete relationship tuples */
  async updateRelationships(operations) {
    return this.http.post("/api/v1/permissions/relationships", operations);
  }
  // ── Modules ─────────────────────────────────────────────────────────────
  /** Register a permission module */
  async registerModule(input) {
    return this.http.post("/api/v1/permissions/modules", input);
  }
  /** List all permission modules */
  async listModules() {
    return this.http.get("/api/v1/permissions/modules");
  }
  // ── Audit ───────────────────────────────────────────────────────────────
  /** Query permission audit logs */
  async getAuditLogs(params) {
    return this.http.get(
      "/api/v1/permissions/audit",
      params
    );
  }
  /** Query permission change logs */
  async listChangeLogs(params) {
    return this.http.get(
      "/api/v1/permissions/audit/changes",
      params
    );
  }
  /** Export audit logs */
  async exportAudit(params) {
    return this.http.get(
      "/api/v1/permissions/audit/export",
      params
    );
  }
  // ── Shadow Check ────────────────────────────────────────────────────────
  /** Run a shadow permission check (compare local vs remote decisions) */
  async shadowCheck(input) {
    return this.http.post("/api/v1/permissions/shadow-check", input);
  }
  // ── Federation ──────────────────────────────────────────────────────────
  /** Create a federation group */
  async createFederationGroup(name) {
    return this.http.post("/api/v1/permissions/federation/groups", { name });
  }
  /** List all federation groups */
  async listFederationGroups() {
    return this.http.get("/api/v1/permissions/federation/groups");
  }
  /** Get a federation group by ID */
  async getFederationGroup(groupId) {
    return this.http.get(`/api/v1/permissions/federation/groups/${groupId}`);
  }
  /** Delete a federation group */
  async deleteFederationGroup(groupId) {
    return this.http.del(`/api/v1/permissions/federation/groups/${groupId}`);
  }
  /** Add a member to a federation group */
  async addFederationMember(groupId, input) {
    return this.http.post(
      `/api/v1/permissions/federation/groups/${groupId}/members`,
      input
    );
  }
  /** Remove a member from a federation group */
  async removeFederationMember(groupId, organizationId) {
    return this.http.request(
      `/api/v1/permissions/federation/groups/${groupId}/members`,
      { method: "DELETE", params: { organizationId } }
    );
  }
  /** Pull modules from federated apps into a group */
  async pullFederationModules(groupId, targetOrgId) {
    return this.http.post(
      `/api/v1/permissions/federation/groups/${groupId}/pull`,
      { targetOrgId }
    );
  }
  /** Push resolved permissions to federated apps */
  async pushFederationPermissions(groupId, adminIds, targetOrgId) {
    return this.http.post(
      `/api/v1/permissions/federation/groups/${groupId}/push`,
      { adminIds, targetOrgId }
    );
  }
  /** Get federation group sync status */
  async getFederationStatus(groupId) {
    return this.http.get(
      `/api/v1/permissions/federation/groups/${groupId}/status`
    );
  }
};

// src/resources/fraud.ts
var FraudDecisionsResource = class {
  constructor(http) {
    this.http = http;
  }
  /** Render a production decision. */
  async decide(input) {
    return this.http.post("/api/v1/fraud/decide", input);
  }
  /**
   * Render a shadow decision. BOTH shadow + published rules contribute to the
   * verdict; the decision is persisted with `shadow: true` and never enforced.
   */
  async shadowDecide(input) {
    return this.http.post("/api/v1/fraud/shadow-decide", input);
  }
  /** List rendered decisions for the calling organisation. */
  async list(params) {
    return this.http.get(
      "/api/v1/fraud/decisions",
      params
    );
  }
  /** Fetch a single decision by id. */
  async get(decisionId) {
    return this.http.get(`/api/v1/fraud/decisions/${decisionId}`);
  }
};
var FraudRulesResource = class {
  constructor(http) {
    this.http = http;
  }
  async list(params) {
    return this.http.get(
      "/api/v1/fraud/rules",
      params
    );
  }
  async create(input) {
    return this.http.post("/api/v1/fraud/rules", input);
  }
  async get(ruleId) {
    return this.http.get(`/api/v1/fraud/rules/${ruleId}`);
  }
  async update(ruleId, input) {
    return this.http.patch(`/api/v1/fraud/rules/${ruleId}`, input);
  }
  /** Soft-archive the rule (transitions to `archived`). */
  async delete(ruleId) {
    return this.http.del(`/api/v1/fraud/rules/${ruleId}`);
  }
  /** Move a rule through the draft → shadow → published → archived lifecycle. */
  async transition(ruleId, input) {
    return this.http.post(
      `/api/v1/fraud/rules/${ruleId}/transition`,
      input
    );
  }
  /** Trigger / FP rate report for a shadow rule (only meaningful in `shadow` status). */
  async shadowReport(ruleId) {
    return this.http.get(`/api/v1/fraud/rules/${ruleId}/shadow-report`);
  }
};
var FraudScreeningResource = class {
  constructor(http) {
    this.http = http;
  }
  /** Run a sanctions / PEP / blocklist screen. */
  async screen(input) {
    return this.http.post("/api/v1/fraud/screen", input);
  }
  /** List tenant-managed screening lists for the calling organisation. */
  async listTenantLists() {
    return this.http.get("/api/v1/fraud/lists");
  }
  /** Create a tenant blocklist or allowlist. */
  async createTenantList(input) {
    return this.http.post("/api/v1/fraud/lists", input);
  }
  async getTenantList(listId) {
    return this.http.get(`/api/v1/fraud/lists/${listId}`);
  }
  /** Rename a tenant list (`source` and `kind` are immutable post-create). */
  async updateTenantList(listId, input) {
    return this.http.patch(`/api/v1/fraud/lists/${listId}`, input);
  }
  async deleteTenantList(listId) {
    return this.http.del(`/api/v1/fraud/lists/${listId}`);
  }
  async listEntries(listId) {
    return this.http.get(`/api/v1/fraud/lists/${listId}/entries`);
  }
  async appendEntries(listId, input) {
    return this.http.post(
      `/api/v1/fraud/lists/${listId}/entries`,
      input
    );
  }
  async deleteEntry(listId, entryId) {
    return this.http.del(
      `/api/v1/fraud/lists/${listId}/entries/${entryId}`
    );
  }
};
var FraudDevicesResource = class {
  constructor(http) {
    this.http = http;
  }
  /** Upsert a device fingerprint observation and receive computed signals. */
  async seen(input) {
    return this.http.post("/api/v1/fraud/devices/seen", input);
  }
};
var FraudCasesResource = class {
  constructor(http) {
    this.http = http;
  }
  async list(params) {
    return this.http.get(
      "/api/v1/fraud/cases",
      params
    );
  }
  /** Open a case manually (or against an existing decision). */
  async open(input) {
    return this.http.post("/api/v1/fraud/cases", input);
  }
  async get(caseId) {
    return this.http.get(`/api/v1/fraud/cases/${caseId}`);
  }
  async update(caseId, input) {
    return this.http.patch(`/api/v1/fraud/cases/${caseId}`, input);
  }
  /** Move through open → triaging → escalated → resolved. */
  async transition(caseId, input) {
    return this.http.post(
      `/api/v1/fraud/cases/${caseId}/transition`,
      input
    );
  }
};
var FraudTermsResource = class {
  constructor(http) {
    this.http = http;
  }
  async status() {
    return this.http.get("/api/v1/fraud/terms/status");
  }
  async accept(input) {
    return this.http.post("/api/v1/fraud/terms/accept", input);
  }
};
var FraudResource = class {
  decisions;
  rules;
  screening;
  devices;
  cases;
  terms;
  constructor(http) {
    this.decisions = new FraudDecisionsResource(http);
    this.rules = new FraudRulesResource(http);
    this.screening = new FraudScreeningResource(http);
    this.devices = new FraudDevicesResource(http);
    this.cases = new FraudCasesResource(http);
    this.terms = new FraudTermsResource(http);
  }
};

// src/resources/audit.ts
var AuditResource = class {
  constructor(http) {
    this.http = http;
  }
  /**
   * Dispatch an audit event into the trace pipeline. Accepted asynchronously
   * (HTTP 202) — the event is durably recorded by the inngest worker.
   */
  async log(input) {
    return this.http.post("/api/v1/audit/log", input);
  }
};

// src/resources/issues.ts
var IssuesResource = class {
  constructor(http) {
    this.http = http;
  }
  /** List federated issues for the calling organisation. */
  async list(params) {
    const res = await this.http.get(
      "/api/v1/issues",
      params
    );
    return res.issues;
  }
  /** Create a federated issue (bug / support ticket). */
  async create(input) {
    return this.http.post("/api/v1/issues", input);
  }
};

// src/resources/search.ts
var SearchResource = class {
  constructor(http) {
    this.http = http;
  }
  /**
   * Upsert a resource into the federated search index. Accepted asynchronously
   * (HTTP 202) — the upsert is performed by the inngest worker.
   */
  async index(input) {
    return this.http.post("/api/v1/search/index", input);
  }
  /**
   * Query the federated search index. Returns at most 20 results. The
   * platform performs an ILIKE search across `title` + `keywords`.
   * Queries shorter than 2 characters return an empty array.
   */
  async query(params) {
    const res = await this.http.get(
      "/api/v1/search/query",
      params
    );
    return res.results;
  }
};

// src/resources/whoami.ts
var WhoamiResource = class {
  constructor(http) {
    this.http = http;
  }
  /**
   * Verify the calling API key and return caller identity.
   *
   * Designed for boot-time self-checks in consumer services. The response
   * includes grace-period + expiry warnings, plus platform-side env hints
   * so consumers can detect environment drift (dev consumer accidentally
   * pointed at prod, etc).
   */
  async get() {
    return this.http.get("/api/v1/whoami");
  }
};

// src/client.ts
var PlatformXeClient = class {
  messaging;
  storage;
  documents;
  webhooks;
  workflows;
  templates;
  events;
  ocr;
  pdf;
  qr;
  domains;
  exports;
  usage;
  threads;
  identity;
  permissions;
  fraud;
  audit;
  issues;
  search;
  whoami;
  constructor(options) {
    const http = new HttpClient({
      apiKey: options.apiKey,
      baseUrl: options.baseUrl ?? "https://platformxe.com",
      timeout: options.timeout ?? 1e4,
      retries: options.retries ?? 2,
      retryDelay: options.retryDelay ?? 1e3
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
};

// src/register.ts
async function register(input, options = {}) {
  const baseUrl = options.baseUrl ?? "https://platformxe.com";
  const timeout = options.timeout ?? 1e4;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(`${baseUrl}/api/v1/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: controller.signal
    });
    const json = await response.json();
    if (!json.success) {
      if (response.status === 400) throw new ValidationError(json.error.message);
      throw new PlatformXeError(json.error.message, json.error.code, response.status);
    }
    return json.data;
  } finally {
    clearTimeout(timeoutId);
  }
}
export {
  AuditResource,
  AuthenticationError,
  DocumentsResource,
  DomainsResource,
  EventsResource,
  ExportsResource,
  FraudCasesResource,
  FraudDecisionsResource,
  FraudDevicesResource,
  FraudResource,
  FraudRulesResource,
  FraudScreeningResource,
  FraudTermsResource,
  IdentityResource,
  IssuesResource,
  MessagingResource,
  NotFoundError,
  OcrResource,
  PdfResource,
  PermissionsResource,
  PlatformXeClient,
  PlatformXeError,
  QrResource,
  RateLimitError,
  SearchResource,
  StorageResource,
  TemplatesResource,
  ThreadsResource,
  TimeoutError,
  UsageResource,
  ValidationError,
  WebhooksResource,
  WhoamiResource,
  WorkflowsResource,
  register
};
//# sourceMappingURL=index.mjs.map