// =============================================================================
// MessagingResource — Email, SMS & WhatsApp
// =============================================================================

import type { HttpClient } from '../http';
import type {
  SendEmailRequest,
  SendEmailResponse,
  EmailHealthResponse,
  SendSmsRequest,
  SendSmsResponse,
  SmsHealthResponse,
  SendWhatsAppRequest,
  SendWhatsAppResponse,
  ProcessorConfig,
  UpdateProcessorRequest,
} from '@caldera/platformxe-types';

/** Queue processing response */
export interface QueueProcessResult {
  processed: number;
  failed: number;
  remaining: number;
}

/** Queue statistics */
export interface QueueStats {
  pending: number;
  processing: number;
  sent: number;
  deadLetter: number;
  total: number;
}

export class MessagingResource {
  constructor(private http: HttpClient) {}

  /** Send a transactional email */
  async sendEmail(input: SendEmailRequest): Promise<SendEmailResponse> {
    return this.http.post<SendEmailResponse>('/api/v1/messaging/email/send', input);
  }

  /** Send an SMS */
  async sendSms(input: SendSmsRequest): Promise<SendSmsResponse> {
    return this.http.post<SendSmsResponse>('/api/v1/messaging/sms', input);
  }

  /** Send a WhatsApp message */
  async sendWhatsApp(input: SendWhatsAppRequest): Promise<SendWhatsAppResponse> {
    return this.http.post<SendWhatsAppResponse>('/api/v1/messaging/whatsapp', input);
  }

  /** Check email provider health */
  async emailHealth(): Promise<EmailHealthResponse> {
    return this.http.get<EmailHealthResponse>('/api/v1/messaging/email/health');
  }

  /** Check SMS provider health */
  async smsHealth(): Promise<SmsHealthResponse> {
    return this.http.get<SmsHealthResponse>('/api/v1/messaging/sms/health');
  }

  /** Process the email queue */
  async processQueue(batchSize?: number): Promise<QueueProcessResult> {
    return this.http.post<QueueProcessResult>('/api/v1/messaging/queue/process', { batchSize });
  }

  /** Get queue statistics */
  async queueStats(): Promise<QueueStats> {
    return this.http.get<QueueStats>('/api/v1/messaging/queue/stats');
  }

  /** Get the messaging processor configuration */
  async getProcessor(): Promise<ProcessorConfig> {
    return this.http.get<ProcessorConfig>('/api/v1/messaging/processor');
  }

  /** Update the messaging processor configuration */
  async updateProcessor(input: UpdateProcessorRequest): Promise<ProcessorConfig> {
    return this.http.put<ProcessorConfig>('/api/v1/messaging/processor', input);
  }
}
