# Caldera Ecosystem Architecture

## Products

| Product | Repo | Domain | Purpose |
|---------|------|--------|---------|
| **Errands® by Caldera** | caldera-concierge | errandone.com | Hyper-local service marketplace (Lagos) |
| **Lettings® by Caldera** | caldera-lettings | calderalettings.com | Short-let property management |
| **xAdmin** | caldera-xadmin | admin.calderasuite.com | Central admin hub — HR, permissions, cross-product management |
| **Caldera Chats** | caldera-chats | chats.calderasuite.com | SaaS live chat for all Caldera products |
| **PlatformX** | caldera-platformx | platformx.calderasuite.com | Shared infrastructure — messaging, storage, OCR, PDF, workflows |

## Shared npm Packages

| Package | Version | Purpose |
|---------|---------|---------|
| **@caldera/events** | 1.9.0 | Cross-product event bus + Ably relay. 72 errands events, 350+ core events. |
| **@caldera/permissions** | 1.3.0 | Federated permission engine. 67 modules: concierge (12), lettings (25), xadmin (30). |
| **@caldera/platformxe-types** | 2.1.0 | TypeScript types for PlatformX API. 131 type definitions across 18 modules. |
| **@caldera/xproxy-service** | 1.3.1 | Inter-service communication SDK. Circuit breaker, health checks, webhook dispatcher. |
| **@caldera/chats-admin** | 1.2.1 | Tenant-facing chat admin UI widget. React + vanilla JS bundle. |
| **@caldera/platformxe-sdk** | 1.0.0 | Official TypeScript SDK for PlatformX API. 13 resource modules, 77 operations. |

## Package × Consumer Matrix

| Package | Concierge | Lettings | xAdmin | Chats | PlatformX |
|---------|:---------:|:--------:|:------:|:-----:|:---------:|
| **@caldera/events** | ^1.9.0 | ^1.9.0 | ^1.9.0 | ^1.9.0 | ^1.9.0 |
| **@caldera/permissions** | ^1.3.0 | ^1.3.0 | ^1.3.0 | ^1.3.0 | — |
| **@caldera/platformxe-types** | ^2.1.0 | ^2.1.0 | ^2.1.0 | — | ^2.1.0 |
| **@caldera/xproxy-service** | ^1.3.1 | ^1.3.1 | ^1.3.1 | ^1.3.1 | ^1.3.1 |
| **@caldera/chats-admin** | — | — | — | — | — |

*chats-admin is consumed by external SaaS tenants, not internal Caldera apps.*

## CI Consumer Validation

Every package publish validates against ALL consumers end-to-end before release:

| Package | Concierge | Lettings | xAdmin | Chats | PlatformX |
|---------|:---------:|:--------:|:------:|:-----:|:---------:|
| **@caldera/events** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **@caldera/permissions** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **@caldera/platformxe-types** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **@caldera/xproxy-service** | ✅ | ✅ | ✅ | ✅ | ✅ |

Pipeline: test → build → pack → validate (trigger downstream consumer pipelines) → publish on `v*` tag.

## Inter-Service Communication

```
                    ┌─────────────────────────────┐
                    │         PlatformX            │
                    │  (Shared Infrastructure Hub) │
                    │  Email, Storage, OCR, PDF,   │
                    │  Webhooks, Workflows, Events │
                    └──────────┬──────────────────┘
                               │ xproxy
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
   ┌────▼─────┐          ┌────▼─────┐          ┌────▼─────┐
   │ Concierge│          │ Lettings │          │  xAdmin  │
   │(ErrandOne│◄────────►│(Lettings)│◄────────►│ (Admin)  │
   └────┬─────┘  xproxy  └────┬─────┘  xproxy  └────┬─────┘
        │                      │                      │
        └──────────┬───────────┘                      │
                   │                                  │
              ┌────▼─────┐                            │
              │  Chats   │◄───────────────────────────┘
              │  (SaaS)  │        xproxy
              └──────────┘
```

All inter-service calls route through **@caldera/xproxy-service** for:
- Circuit breaker protection (auto-failover after 5 consecutive failures)
- Health monitoring and metrics collection
- Retry with exponential backoff
- HMAC-SHA256 webhook signature verification

## Permission Federation

xAdmin is the **federation hub**. Each product defines its own permission modules:

| Product | Modules | Key Modules |
|---------|:-------:|-------------|
| **Concierge** | 12 | REQUESTS, PROVIDERS, DISPATCH, CUSTOMERS, CATEGORIES |
| **Lettings** | 25 | PROPERTIES, MANDATES, BOOKINGS, EARNINGS, RECRUITMENT |
| **xAdmin** | 30 | B2B_PARTNERS, WORKSHOPS, ACTIVITY_TRACKER, DOCUMENTS |

Federation flow:
1. **Pull:** xAdmin fetches `GET /api/v1/permissions/modules` from each product
2. **Store:** Modules saved with federated key prefix (e.g., `CONCIERGE:REQUESTS`)
3. **Assign:** Admin assigns permissions to operators via xAdmin UI
4. **Push:** xAdmin pushes resolved permissions to `POST /api/internal/permissions/sync` on each product
5. **Enforce:** Each product checks permissions locally via `hasPermission()`

## Event Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Local dispatch** | `dispatchEvent()` → Inngest | Durable workflow execution within each product |
| **Cross-product relay** | Ably via `@caldera/events` | Real-time event forwarding between products |
| **PlatformX ingestion** | `POST /api/v1/events` | Centralized event log + workflow trigger evaluation |

72 errands events (`errands/*`), 350+ core events. Each product subscribes to relevant cross-product events via Ably relay.

## PlatformX Services Used by ErrandOne

| Service | Endpoint | Status |
|---------|----------|--------|
| **Email** | `/api/v1/messaging/email/send` | ✅ Live via xproxy |
| **Media Storage** | `/api/v1/storage/media/*` | ✅ Live via xproxy |
| **Fixed Storage** | `/api/v1/storage/fixed/*` | ✅ Live via xproxy |
| **OCR (Azure AI)** | `/api/v1/ocr/verify-identity` | ✅ Live — primary verification provider |
| **SMS** | `/api/v1/messaging/sms` | Available (uses Termii directly currently) |
| **WhatsApp** | `/api/v1/messaging/whatsapp` | Available (uses Infobip directly currently) |
| **PDF** | `/api/v1/pdf/*` | Available |
| **QR** | `/api/v1/qr` | Available |
| **Webhooks** | `/api/v1/webhooks/*` | Available (uses own system currently) |
| **Workflows** | `/api/v1/workflows/*` | Available (uses Inngest directly currently) |

## Verification Architecture (Two-Level)

### Level 1: Provider Registration (Business Owner KYC)
- **Primary:** PlatformX OCR (document photo → Azure AI)
- **Fallback:** Prembly BVN/NIN (circuit breaker: 3 failures → 5-min cooldown)
- One-time, gates dispatch eligibility

### Level 2: Point-of-Service (Nominated Staff)
- Provider registers staff (drivers, assistants, technicians)
- Verification level follows the **person doing the work**:
  - `GATE_DELIVERY` → Standard (ID only)
  - `ACCOMPANIMENT` → Standard + valid driver's license
  - `ENTERS_PREMISES` → Enhanced (ID + proof of address + emergency contact)
- Pre-registered fleet OR ad-hoc nomination at dispatch time

## Tech Stack (Common)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Hosting | Vercel |
| Database | PostgreSQL (Neon) |
| ORM | Drizzle (Concierge, xAdmin, PlatformX), Prisma (Lettings) |
| Auth | NextAuth (admin), JWT (customer/provider/partner) |
| Workflows | Inngest (Concierge), direct (others) |
| Cache | Upstash Redis |
| Observability | Sentry + BetterStack |
| UI | React, Tailwind CSS, shadcn/ui |

## Zero Tolerance Policy

Every TypeScript error, test failure, lint warning, or CI issue found during any session MUST be fixed immediately — regardless of who or what caused it. No "pre-existing" or "not mine" exceptions. The codebase must be clean when you leave it.
