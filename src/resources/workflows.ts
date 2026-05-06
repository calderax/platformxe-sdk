// =============================================================================
// WorkflowsResource — Workflow trigger CRUD, evaluation & dry-run
// =============================================================================

import type { HttpClient } from '../http';
import type {
  TriggerContext,
  EvaluationResult,
  DryRunResult,
  TriggerFilters,
  ScheduledTriggerResult,
  ActionConfig,
} from '@caldera/platformxe-types';

/** Workflow trigger record */
export interface WorkflowTrigger {
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
export interface CreateWorkflowTriggerInput {
  name: string;
  description?: string;
  triggerType: 'EVENT' | 'SCHEDULE';
  eventType?: string;
  entityType?: string;
  conditions?: Record<string, unknown>;
  actions: ActionConfig[];
}

/** Input for updating a workflow trigger */
export interface UpdateWorkflowTriggerInput {
  name?: string;
  description?: string;
  eventType?: string;
  entityType?: string;
  conditions?: Record<string, unknown>;
  actions?: ActionConfig[];
  status?: 'ACTIVE' | 'INACTIVE';
}

export class WorkflowsResource {
  constructor(private http: HttpClient) {}

  /** List workflow triggers with optional filters */
  async list(filters?: TriggerFilters): Promise<WorkflowTrigger[]> {
    return this.http.get<WorkflowTrigger[]>(
      '/api/v1/workflows',
      filters as Record<string, string | number | boolean | undefined>,
    );
  }

  /** Create a workflow trigger */
  async create(input: CreateWorkflowTriggerInput): Promise<WorkflowTrigger> {
    return this.http.post<WorkflowTrigger>('/api/v1/workflows', input);
  }

  /** Get a workflow trigger by ID */
  async get(triggerId: string): Promise<WorkflowTrigger> {
    return this.http.get<WorkflowTrigger>(`/api/v1/workflows/${triggerId}`);
  }

  /** Update a workflow trigger */
  async update(triggerId: string, input: UpdateWorkflowTriggerInput): Promise<WorkflowTrigger> {
    return this.http.patch<WorkflowTrigger>(`/api/v1/workflows/${triggerId}`, input);
  }

  /** Delete a workflow trigger */
  async delete(triggerId: string): Promise<void> {
    return this.http.del<void>(`/api/v1/workflows/${triggerId}`);
  }

  /** Evaluate triggers against a given context */
  async evaluate(context: TriggerContext): Promise<EvaluationResult[]> {
    return this.http.post<EvaluationResult[]>('/api/v1/workflows/evaluate', context);
  }

  /** Dry-run a trigger against a context (no side effects) */
  async dryRun(triggerId: string, context: TriggerContext): Promise<DryRunResult> {
    return this.http.post<DryRunResult>(`/api/v1/workflows/${triggerId}/dry-run`, context);
  }
}
