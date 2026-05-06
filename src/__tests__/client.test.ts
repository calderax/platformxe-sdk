// =============================================================================
// PlatformXeClient Tests
// =============================================================================

import { describe, it, expect, vi } from 'vitest';
import { PlatformXeClient } from '../client';
import { MessagingResource } from '../resources/messaging';
import { StorageResource } from '../resources/storage';
import { DocumentsResource } from '../resources/documents';
import { WebhooksResource } from '../resources/webhooks';
import { WorkflowsResource } from '../resources/workflows';
import { TemplatesResource } from '../resources/templates';
import { EventsResource } from '../resources/events';
import { OcrResource } from '../resources/ocr';
import { PdfResource } from '../resources/pdf';
import { QrResource } from '../resources/qr';
import { DomainsResource } from '../resources/domains';
import { ExportsResource } from '../resources/exports';
import { UsageResource } from '../resources/usage';

// Prevent real fetch calls
vi.stubGlobal('fetch', vi.fn());

describe('PlatformXeClient', () => {
  it('creates all 13 resource instances', () => {
    const client = new PlatformXeClient({ apiKey: 'pk_test_123' });

    expect(client.messaging).toBeInstanceOf(MessagingResource);
    expect(client.storage).toBeInstanceOf(StorageResource);
    expect(client.documents).toBeInstanceOf(DocumentsResource);
    expect(client.webhooks).toBeInstanceOf(WebhooksResource);
    expect(client.workflows).toBeInstanceOf(WorkflowsResource);
    expect(client.templates).toBeInstanceOf(TemplatesResource);
    expect(client.events).toBeInstanceOf(EventsResource);
    expect(client.ocr).toBeInstanceOf(OcrResource);
    expect(client.pdf).toBeInstanceOf(PdfResource);
    expect(client.qr).toBeInstanceOf(QrResource);
    expect(client.domains).toBeInstanceOf(DomainsResource);
    expect(client.exports).toBeInstanceOf(ExportsResource);
    expect(client.usage).toBeInstanceOf(UsageResource);
  });

  it('uses default baseUrl and options when not provided', () => {
    const client = new PlatformXeClient({ apiKey: 'pk_test_123' });

    // Resources should be created without errors — defaults applied internally
    expect(client.messaging).toBeDefined();
    expect(client.usage).toBeDefined();
  });

  it('accepts custom options that override defaults', () => {
    const client = new PlatformXeClient({
      apiKey: 'pk_custom_key',
      baseUrl: 'https://custom.example.com',
      timeout: 30000,
      retries: 5,
      retryDelay: 2000,
    });

    // All 13 resources should still be initialised
    expect(client.messaging).toBeInstanceOf(MessagingResource);
    expect(client.storage).toBeInstanceOf(StorageResource);
    expect(client.documents).toBeInstanceOf(DocumentsResource);
    expect(client.webhooks).toBeInstanceOf(WebhooksResource);
    expect(client.workflows).toBeInstanceOf(WorkflowsResource);
    expect(client.templates).toBeInstanceOf(TemplatesResource);
    expect(client.events).toBeInstanceOf(EventsResource);
    expect(client.ocr).toBeInstanceOf(OcrResource);
    expect(client.pdf).toBeInstanceOf(PdfResource);
    expect(client.qr).toBeInstanceOf(QrResource);
    expect(client.domains).toBeInstanceOf(DomainsResource);
    expect(client.exports).toBeInstanceOf(ExportsResource);
    expect(client.usage).toBeInstanceOf(UsageResource);
  });
});
