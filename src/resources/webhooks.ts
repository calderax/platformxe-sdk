// =============================================================================
// WebhooksResource — Webhook CRUD, testing & secret rotation
// =============================================================================

import type { HttpClient } from '../http';
import type {
  WebhookListItem,
  CreateWebhookInput,
  UpdateWebhookInput,
  CreateWebhookResult,
  RotateSecretResult,
  WebhookDeliveryItem,
} from '@caldera/platformxe-types';

/** Parameters for listing webhook deliveries */
export interface ListDeliveriesParams {
  status?: 'PENDING' | 'SUCCESS' | 'RETRYING' | 'FAILED';
  page?: number;
  limit?: number;
}

/** Test webhook response */
export interface TestWebhookResult {
  success: boolean;
  responseStatus: number | null;
  responseTimeMs: number | null;
  error?: string;
}

export class WebhooksResource {
  constructor(private http: HttpClient) {}

  /** List all webhooks */
  async list(): Promise<WebhookListItem[]> {
    return this.http.get<WebhookListItem[]>('/api/v1/webhooks');
  }

  /** Create a new webhook */
  async create(input: CreateWebhookInput): Promise<CreateWebhookResult> {
    return this.http.post<CreateWebhookResult>('/api/v1/webhooks', input);
  }

  /** Get a webhook by ID */
  async get(webhookId: string): Promise<WebhookListItem> {
    return this.http.get<WebhookListItem>(`/api/v1/webhooks/${webhookId}`);
  }

  /** Update a webhook */
  async update(webhookId: string, input: UpdateWebhookInput): Promise<WebhookListItem> {
    return this.http.patch<WebhookListItem>(`/api/v1/webhooks/${webhookId}`, input);
  }

  /** Delete a webhook */
  async delete(webhookId: string): Promise<void> {
    return this.http.del<void>(`/api/v1/webhooks/${webhookId}`);
  }

  /** Send a test delivery to the webhook URL */
  async test(webhookId: string): Promise<TestWebhookResult> {
    return this.http.post<TestWebhookResult>(`/api/v1/webhooks/${webhookId}/test`);
  }

  /** Rotate the signing secret (old secret is immediately invalidated) */
  async rotateSecret(webhookId: string): Promise<RotateSecretResult> {
    return this.http.post<RotateSecretResult>(`/api/v1/webhooks/${webhookId}/rotate`);
  }
}
