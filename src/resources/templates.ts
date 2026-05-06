// =============================================================================
// TemplatesResource — Template CRUD, rendering & send
// =============================================================================

import type { HttpClient } from '../http';
import type {
  CreateTemplateInput,
  UpdateTemplateInput,
  RenderTemplateInput,
  RenderAndSendInput,
  RenderedTemplate,
  TemplateListItem,
  SendEmailResponse,
} from '@caldera/platformxe-types';

/** Parameters for listing templates */
export interface ListTemplatesParams {
  channel?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class TemplatesResource {
  constructor(private http: HttpClient) {}

  /** List templates */
  async list(params?: ListTemplatesParams): Promise<TemplateListItem[]> {
    return this.http.get<TemplateListItem[]>(
      '/api/v1/templates',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  /** Create a template */
  async create(input: CreateTemplateInput): Promise<TemplateListItem> {
    return this.http.post<TemplateListItem>('/api/v1/templates', input);
  }

  /** Get a template by ID */
  async get(templateId: string): Promise<TemplateListItem> {
    return this.http.get<TemplateListItem>(`/api/v1/templates/${templateId}`);
  }

  /** Update a template */
  async update(templateId: string, input: UpdateTemplateInput): Promise<TemplateListItem> {
    return this.http.patch<TemplateListItem>(`/api/v1/templates/${templateId}`, input);
  }

  /** Delete a template */
  async delete(templateId: string): Promise<void> {
    return this.http.del<void>(`/api/v1/templates/${templateId}`);
  }

  /** Render a template with variables (returns HTML/text, does not send) */
  async render(templateId: string, input: RenderTemplateInput): Promise<RenderedTemplate> {
    return this.http.post<RenderedTemplate>(`/api/v1/templates/${templateId}/render`, input);
  }

  /** Render a template and send it as an email */
  async send(templateId: string, input: RenderAndSendInput): Promise<SendEmailResponse> {
    return this.http.post<SendEmailResponse>(`/api/v1/templates/${templateId}/send`, input);
  }
}
