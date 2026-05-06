// =============================================================================
// PermissionsResource — RBAC + ABAC + ReBAC + Federation authorization engine
// =============================================================================

import type { HttpClient } from '../http';
import type {
  PermissionCheckRequest,
  PermissionCheckResponse,
  ResolvedCapabilities,
  PermissionRole,
  PermissionOverride,
  ResourcePolicy,
  RelationshipTuple,
  RelationshipOperation,
  PermissionModule,
  PermissionAuditLog,
  PermissionChangeLog,
  FederationGroup,
  ShadowCheckRequest,
  ShadowCheckResponse,
} from '@caldera/platformxe-types';

// ─── SDK-local param types ──────────────────────────────────────────────────

export interface CreateRoleInput {
  name: string;
  description?: string;
  model?: 'SIMPLE' | 'FULL';
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
}

export interface CreateOverrideInput {
  adminId: string;
  path: string;
  action: string;
  effect: 'GRANT' | 'DENY';
  reason: string;
  expiresAt?: string;
}

export interface CreatePolicyInput {
  path: string;
  action: string;
  condition: Record<string, unknown>;
  effect: 'GRANT' | 'DENY';
  priority?: number;
  description?: string;
}

export interface UpdatePolicyInput {
  path?: string;
  action?: string;
  condition?: Record<string, unknown>;
  effect?: 'GRANT' | 'DENY';
  priority?: number;
  description?: string;
  isActive?: boolean;
}

export interface AuditLogParams {
  adminId?: string;
  path?: string;
  page?: number;
  limit?: number;
}

export interface ChangeLogParams {
  entityType?: string;
  entityId?: string;
  changedBy?: string;
  limit?: number;
  offset?: number;
}

export interface AuditExportParams {
  from?: string;
  to?: string;
}

export interface RelationshipListParams {
  objectNamespace?: string;
  objectId?: string;
  relation?: string;
  subjectNamespace?: string;
  subjectId?: string;
}

export interface AddFederationMemberInput {
  organizationId: string;
  prefix: string;
}

// ─── Resource ───────────────────────────────────────────────────────────────

export class PermissionsResource {
  constructor(private http: HttpClient) {}

  // ── Check & Resolve ─────────────────────────────────────────────────────

  /** Check a single permission */
  async check(input: PermissionCheckRequest): Promise<PermissionCheckResponse> {
    return this.http.post<PermissionCheckResponse>('/api/v1/permissions/check', input);
  }

  /** Batch-check multiple permissions */
  async checkBatch(
    checks: Array<{ adminId: string; path: string; action: string }>,
  ): Promise<{ results: PermissionCheckResponse[] }> {
    return this.http.post<{ results: PermissionCheckResponse[] }>(
      '/api/v1/permissions/check-batch',
      { checks },
    );
  }

  /** Resolve all capabilities for an admin */
  async resolve(adminId: string): Promise<ResolvedCapabilities> {
    return this.http.get<ResolvedCapabilities>(`/api/v1/permissions/resolve/${adminId}`);
  }

  // ── Roles ───────────────────────────────────────────────────────────────

  /** List all roles */
  async listRoles(): Promise<PermissionRole[]> {
    return this.http.get<PermissionRole[]>('/api/v1/permissions/roles');
  }

  /** Create a role */
  async createRole(input: CreateRoleInput): Promise<PermissionRole> {
    return this.http.post<PermissionRole>('/api/v1/permissions/roles', input);
  }

  /** Get a role by ID */
  async getRole(roleId: string): Promise<PermissionRole> {
    return this.http.get<PermissionRole>(`/api/v1/permissions/roles/${roleId}`);
  }

  /** Update a role */
  async updateRole(roleId: string, input: UpdateRoleInput): Promise<PermissionRole> {
    return this.http.patch<PermissionRole>(`/api/v1/permissions/roles/${roleId}`, input);
  }

  /** Delete a role */
  async deleteRole(roleId: string): Promise<void> {
    return this.http.del<void>(`/api/v1/permissions/roles/${roleId}`);
  }

  // ── Capabilities ────────────────────────────────────────────────────────

  /** Get capabilities for a role (SIMPLE model) */
  async getRoleCapabilities(roleId: string): Promise<{ capabilities: string[] }> {
    return this.http.get<{ capabilities: string[] }>(
      `/api/v1/permissions/roles/${roleId}/capabilities`,
    );
  }

  /** Set capabilities for a role (SIMPLE model) */
  async setRoleCapabilities(roleId: string, capabilities: string[]): Promise<{ capabilities: string[] }> {
    return this.http.put<{ capabilities: string[] }>(
      `/api/v1/permissions/roles/${roleId}/capabilities`,
      { capabilities },
    );
  }

  // ── Module Permissions ──────────────────────────────────────────────────

  /** Get module permissions for a role (FULL model) */
  async getRoleModulePermissions(
    roleId: string,
  ): Promise<{ modules: Array<{ moduleId: string; actions: string[] }> }> {
    return this.http.get<{ modules: Array<{ moduleId: string; actions: string[] }> }>(
      `/api/v1/permissions/roles/${roleId}/modules`,
    );
  }

  /** Set module permissions for a role (FULL model) */
  async setRoleModulePermissions(
    roleId: string,
    modules: Array<{ moduleId: string; actions: string[] }>,
  ): Promise<{ modules: Array<{ moduleId: string; actions: string[] }> }> {
    return this.http.put<{ modules: Array<{ moduleId: string; actions: string[] }> }>(
      `/api/v1/permissions/roles/${roleId}/modules`,
      { modules },
    );
  }

  // ── Overrides ───────────────────────────────────────────────────────────

  /** List overrides for an admin */
  async listOverrides(adminId: string): Promise<PermissionOverride[]> {
    return this.http.get<PermissionOverride[]>(`/api/v1/permissions/overrides/${adminId}`);
  }

  /** Create an override */
  async createOverride(input: CreateOverrideInput): Promise<PermissionOverride> {
    return this.http.post<PermissionOverride>('/api/v1/permissions/overrides', input);
  }

  /** Delete an override */
  async deleteOverride(overrideId: string): Promise<void> {
    return this.http.del<void>(`/api/v1/permissions/overrides/remove/${overrideId}`);
  }

  // ── Policies ────────────────────────────────────────────────────────────

  /** List all resource policies */
  async listPolicies(): Promise<ResourcePolicy[]> {
    return this.http.get<ResourcePolicy[]>('/api/v1/permissions/policies');
  }

  /** Create a resource policy */
  async createPolicy(input: CreatePolicyInput): Promise<ResourcePolicy> {
    return this.http.post<ResourcePolicy>('/api/v1/permissions/policies', input);
  }

  /** Update a resource policy */
  async updatePolicy(policyId: string, input: UpdatePolicyInput): Promise<ResourcePolicy> {
    return this.http.patch<ResourcePolicy>(`/api/v1/permissions/policies/${policyId}`, input);
  }

  /** Delete a resource policy */
  async deletePolicy(policyId: string): Promise<void> {
    return this.http.del<void>(`/api/v1/permissions/policies/${policyId}`);
  }

  // ── Relationships ───────────────────────────────────────────────────────

  /** List relationship tuples */
  async listRelationships(params?: RelationshipListParams): Promise<RelationshipTuple[]> {
    return this.http.get<RelationshipTuple[]>(
      '/api/v1/permissions/relationships',
      params as Record<string, string | undefined>,
    );
  }

  /** Write or delete relationship tuples */
  async updateRelationships(operations: RelationshipOperation[]): Promise<{ applied: number }> {
    return this.http.post<{ applied: number }>('/api/v1/permissions/relationships', operations);
  }

  // ── Modules ─────────────────────────────────────────────────────────────

  /** Register a permission module */
  async registerModule(input: PermissionModule): Promise<PermissionModule> {
    return this.http.post<PermissionModule>('/api/v1/permissions/modules', input);
  }

  /** List all permission modules */
  async listModules(): Promise<PermissionModule[]> {
    return this.http.get<PermissionModule[]>('/api/v1/permissions/modules');
  }

  // ── Audit ───────────────────────────────────────────────────────────────

  /** Query permission audit logs */
  async getAuditLogs(params?: AuditLogParams): Promise<{ logs: PermissionAuditLog[]; total: number }> {
    return this.http.get<{ logs: PermissionAuditLog[]; total: number }>(
      '/api/v1/permissions/audit',
      params as Record<string, string | number | undefined>,
    );
  }

  /** Query permission change logs */
  async listChangeLogs(params?: ChangeLogParams): Promise<{ logs: PermissionChangeLog[]; total: number }> {
    return this.http.get<{ logs: PermissionChangeLog[]; total: number }>(
      '/api/v1/permissions/audit/changes',
      params as Record<string, string | number | undefined>,
    );
  }

  /** Export audit logs */
  async exportAudit(params?: AuditExportParams): Promise<{ url: string; expiresAt: string }> {
    return this.http.get<{ url: string; expiresAt: string }>(
      '/api/v1/permissions/audit/export',
      params as Record<string, string | undefined>,
    );
  }

  // ── Shadow Check ────────────────────────────────────────────────────────

  /** Run a shadow permission check (compare local vs remote decisions) */
  async shadowCheck(input: ShadowCheckRequest): Promise<ShadowCheckResponse> {
    return this.http.post<ShadowCheckResponse>('/api/v1/permissions/shadow-check', input);
  }

  // ── Federation ──────────────────────────────────────────────────────────

  /** Create a federation group */
  async createFederationGroup(name: string): Promise<FederationGroup> {
    return this.http.post<FederationGroup>('/api/v1/permissions/federation/groups', { name });
  }

  /** List all federation groups */
  async listFederationGroups(): Promise<FederationGroup[]> {
    return this.http.get<FederationGroup[]>('/api/v1/permissions/federation/groups');
  }

  /** Get a federation group by ID */
  async getFederationGroup(groupId: string): Promise<FederationGroup> {
    return this.http.get<FederationGroup>(`/api/v1/permissions/federation/groups/${groupId}`);
  }

  /** Delete a federation group */
  async deleteFederationGroup(groupId: string): Promise<void> {
    return this.http.del<void>(`/api/v1/permissions/federation/groups/${groupId}`);
  }

  /** Add a member to a federation group */
  async addFederationMember(groupId: string, input: AddFederationMemberInput): Promise<FederationGroup> {
    return this.http.post<FederationGroup>(
      `/api/v1/permissions/federation/groups/${groupId}/members`,
      input,
    );
  }

  /** Remove a member from a federation group */
  async removeFederationMember(groupId: string, organizationId: string): Promise<void> {
    return this.http.request<void>(
      `/api/v1/permissions/federation/groups/${groupId}/members`,
      { method: 'DELETE', params: { organizationId } },
    );
  }

  /** Pull modules from federated apps into a group */
  async pullFederationModules(
    groupId: string,
    targetOrgId?: string,
  ): Promise<{ pulled: number }> {
    return this.http.post<{ pulled: number }>(
      `/api/v1/permissions/federation/groups/${groupId}/pull`,
      { targetOrgId },
    );
  }

  /** Push resolved permissions to federated apps */
  async pushFederationPermissions(
    groupId: string,
    adminIds: string[],
    targetOrgId?: string,
  ): Promise<{ pushed: number }> {
    return this.http.post<{ pushed: number }>(
      `/api/v1/permissions/federation/groups/${groupId}/push`,
      { adminIds, targetOrgId },
    );
  }

  /** Get federation group sync status */
  async getFederationStatus(
    groupId: string,
  ): Promise<{ groupId: string; status: string; lastSyncAt: string | null }> {
    return this.http.get<{ groupId: string; status: string; lastSyncAt: string | null }>(
      `/api/v1/permissions/federation/groups/${groupId}/status`,
    );
  }
}
