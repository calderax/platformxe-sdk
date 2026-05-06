// =============================================================================
// FraudResource — Fraud Detection Engine (Phase 6A–6H)
// =============================================================================
//
// Sub-namespaces:
//   client.fraud.decisions — decision rendering + audit
//   client.fraud.rules     — rule CRUD + lifecycle transitions
//   client.fraud.screening — screen + tenant lists/entries
//   client.fraud.devices   — device fingerprint registry
//   client.fraud.cases     — manual reviewer workflow
//   client.fraud.terms     — T&Cs status / acceptance
// =============================================================================

import type { HttpClient } from '../http';
import type {
  // Decisions
  FraudDecideRequest,
  FraudDecideResponse,
  ListFraudDecisionsParams,
  FraudDecisionRecord,
  // Rules
  FraudRuleDefinition,
  CreateFraudRuleRequest,
  UpdateFraudRuleRequest,
  ListFraudRulesParams,
  TransitionFraudRuleRequest,
  FraudRuleShadowReport,
  // Screening
  FraudScreenRequest,
  FraudScreenResponse,
  TenantListSummary,
  CreateTenantListRequest,
  UpdateTenantListRequest,
  ScreeningListEntry,
  AppendListEntriesRequest,
  AppendListEntriesResponse,
  // Devices
  DeviceSeenRequest,
  DeviceSeenResponse,
  // Cases
  FraudCaseRecord,
  ListFraudCasesParams,
  OpenFraudCaseRequest,
  UpdateFraudCaseRequest,
  TransitionFraudCaseRequest,
  // Terms
  FraudTermsStatus,
  AcceptFraudTermsRequest,
  AcceptFraudTermsResponse,
} from '@caldera/platformxe-types';

// ---------------------------------------------------------------------------
// Decisions
// ---------------------------------------------------------------------------

export class FraudDecisionsResource {
  constructor(private http: HttpClient) {}

  /** Render a production decision. */
  async decide(input: FraudDecideRequest): Promise<FraudDecideResponse> {
    return this.http.post<FraudDecideResponse>('/api/v1/fraud/decide', input);
  }

  /**
   * Render a shadow decision. BOTH shadow + published rules contribute to the
   * verdict; the decision is persisted with `shadow: true` and never enforced.
   */
  async shadowDecide(input: FraudDecideRequest): Promise<FraudDecideResponse> {
    return this.http.post<FraudDecideResponse>('/api/v1/fraud/shadow-decide', input);
  }

  /** List rendered decisions for the calling organisation. */
  async list(params?: ListFraudDecisionsParams): Promise<FraudDecisionRecord[]> {
    return this.http.get<FraudDecisionRecord[]>(
      '/api/v1/fraud/decisions',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  /** Fetch a single decision by id. */
  async get(decisionId: string): Promise<FraudDecisionRecord> {
    return this.http.get<FraudDecisionRecord>(`/api/v1/fraud/decisions/${decisionId}`);
  }
}

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

export class FraudRulesResource {
  constructor(private http: HttpClient) {}

  async list(params?: ListFraudRulesParams): Promise<FraudRuleDefinition[]> {
    return this.http.get<FraudRuleDefinition[]>(
      '/api/v1/fraud/rules',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  async create(input: CreateFraudRuleRequest): Promise<FraudRuleDefinition> {
    return this.http.post<FraudRuleDefinition>('/api/v1/fraud/rules', input);
  }

  async get(ruleId: string): Promise<FraudRuleDefinition> {
    return this.http.get<FraudRuleDefinition>(`/api/v1/fraud/rules/${ruleId}`);
  }

  async update(ruleId: string, input: UpdateFraudRuleRequest): Promise<FraudRuleDefinition> {
    return this.http.patch<FraudRuleDefinition>(`/api/v1/fraud/rules/${ruleId}`, input);
  }

  /** Soft-archive the rule (transitions to `archived`). */
  async delete(ruleId: string): Promise<{ deleted: true }> {
    return this.http.del<{ deleted: true }>(`/api/v1/fraud/rules/${ruleId}`);
  }

  /** Move a rule through the draft → shadow → published → archived lifecycle. */
  async transition(
    ruleId: string,
    input: TransitionFraudRuleRequest,
  ): Promise<FraudRuleDefinition> {
    return this.http.post<FraudRuleDefinition>(
      `/api/v1/fraud/rules/${ruleId}/transition`,
      input,
    );
  }

  /** Trigger / FP rate report for a shadow rule (only meaningful in `shadow` status). */
  async shadowReport(ruleId: string): Promise<FraudRuleShadowReport> {
    return this.http.get<FraudRuleShadowReport>(`/api/v1/fraud/rules/${ruleId}/shadow-report`);
  }
}

// ---------------------------------------------------------------------------
// Screening (single-call screen + tenant list management)
// ---------------------------------------------------------------------------

export class FraudScreeningResource {
  constructor(private http: HttpClient) {}

  /** Run a sanctions / PEP / blocklist screen. */
  async screen(input: FraudScreenRequest): Promise<FraudScreenResponse> {
    return this.http.post<FraudScreenResponse>('/api/v1/fraud/screen', input);
  }

  /** List tenant-managed screening lists for the calling organisation. */
  async listTenantLists(): Promise<TenantListSummary[]> {
    return this.http.get<TenantListSummary[]>('/api/v1/fraud/lists');
  }

  /** Create a tenant blocklist or allowlist. */
  async createTenantList(input: CreateTenantListRequest): Promise<TenantListSummary> {
    return this.http.post<TenantListSummary>('/api/v1/fraud/lists', input);
  }

  async getTenantList(listId: string): Promise<TenantListSummary> {
    return this.http.get<TenantListSummary>(`/api/v1/fraud/lists/${listId}`);
  }

  /** Rename a tenant list (`source` and `kind` are immutable post-create). */
  async updateTenantList(
    listId: string,
    input: UpdateTenantListRequest,
  ): Promise<TenantListSummary> {
    return this.http.patch<TenantListSummary>(`/api/v1/fraud/lists/${listId}`, input);
  }

  async deleteTenantList(listId: string): Promise<{ deleted: true }> {
    return this.http.del<{ deleted: true }>(`/api/v1/fraud/lists/${listId}`);
  }

  async listEntries(listId: string): Promise<ScreeningListEntry[]> {
    return this.http.get<ScreeningListEntry[]>(`/api/v1/fraud/lists/${listId}/entries`);
  }

  async appendEntries(
    listId: string,
    input: AppendListEntriesRequest,
  ): Promise<AppendListEntriesResponse> {
    return this.http.post<AppendListEntriesResponse>(
      `/api/v1/fraud/lists/${listId}/entries`,
      input,
    );
  }

  async deleteEntry(listId: string, entryId: string): Promise<{ deleted: true }> {
    return this.http.del<{ deleted: true }>(
      `/api/v1/fraud/lists/${listId}/entries/${entryId}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Devices
// ---------------------------------------------------------------------------

export class FraudDevicesResource {
  constructor(private http: HttpClient) {}

  /** Upsert a device fingerprint observation and receive computed signals. */
  async seen(input: DeviceSeenRequest): Promise<DeviceSeenResponse> {
    return this.http.post<DeviceSeenResponse>('/api/v1/fraud/devices/seen', input);
  }
}

// ---------------------------------------------------------------------------
// Cases
// ---------------------------------------------------------------------------

export class FraudCasesResource {
  constructor(private http: HttpClient) {}

  async list(params?: ListFraudCasesParams): Promise<FraudCaseRecord[]> {
    return this.http.get<FraudCaseRecord[]>(
      '/api/v1/fraud/cases',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  /** Open a case manually (or against an existing decision). */
  async open(input: OpenFraudCaseRequest): Promise<FraudCaseRecord> {
    return this.http.post<FraudCaseRecord>('/api/v1/fraud/cases', input);
  }

  async get(caseId: string): Promise<FraudCaseRecord> {
    return this.http.get<FraudCaseRecord>(`/api/v1/fraud/cases/${caseId}`);
  }

  async update(caseId: string, input: UpdateFraudCaseRequest): Promise<FraudCaseRecord> {
    return this.http.patch<FraudCaseRecord>(`/api/v1/fraud/cases/${caseId}`, input);
  }

  /** Move through open → triaging → escalated → resolved. */
  async transition(
    caseId: string,
    input: TransitionFraudCaseRequest,
  ): Promise<FraudCaseRecord> {
    return this.http.post<FraudCaseRecord>(
      `/api/v1/fraud/cases/${caseId}/transition`,
      input,
    );
  }
}

// ---------------------------------------------------------------------------
// Terms & Conditions
// ---------------------------------------------------------------------------

export class FraudTermsResource {
  constructor(private http: HttpClient) {}

  async status(): Promise<FraudTermsStatus> {
    return this.http.get<FraudTermsStatus>('/api/v1/fraud/terms/status');
  }

  async accept(input: AcceptFraudTermsRequest): Promise<AcceptFraudTermsResponse> {
    return this.http.post<AcceptFraudTermsResponse>('/api/v1/fraud/terms/accept', input);
  }
}

// ---------------------------------------------------------------------------
// Aggregator
// ---------------------------------------------------------------------------

/**
 * Top-level FraudResource exposed at `client.fraud`. Each sub-resource
 * groups the endpoints for one slice of the Detection Engine.
 */
export class FraudResource {
  readonly decisions: FraudDecisionsResource;
  readonly rules: FraudRulesResource;
  readonly screening: FraudScreeningResource;
  readonly devices: FraudDevicesResource;
  readonly cases: FraudCasesResource;
  readonly terms: FraudTermsResource;

  constructor(http: HttpClient) {
    this.decisions = new FraudDecisionsResource(http);
    this.rules = new FraudRulesResource(http);
    this.screening = new FraudScreeningResource(http);
    this.devices = new FraudDevicesResource(http);
    this.cases = new FraudCasesResource(http);
    this.terms = new FraudTermsResource(http);
  }
}
