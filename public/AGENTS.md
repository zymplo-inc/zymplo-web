# Zymplo · AGENTS.md

Discoverable agent capabilities specification for AI agents and programmatic integrations. Built per emerging AGENTS.md standard (analog to robots.txt for AI agent discovery).

## Identity

- **Brand**: Zymplo
- **Entity**: Zymplo Inc. (Delaware) · subsidiary Zymplo Brasil LTDA · Zymplo S.A. Paraguay
- **Product**: WhatsApp-native AI assistant ("Zy") for self-employed workers
- **Description**: All-in-one AI secretary for MEIs (Brazil) + cuentapropistas (LATAM) operating exclusively via WhatsApp · no app · no signup

## Capabilities

### Conversational AI

- **Platform**: WhatsApp Business (360dialog BSP · 14 countries)
- **Languages**: pt-BR · es-LATAM · es-ES · en-US (auto-detect via phone prefix)
- **Multi-modal**: Text · Audio (STT only · R149) · Images (OCR) · Documents · Location
- **Universal knowledge**: Any topic · any country · real-time (per R74)
- **Country awareness**: Auto-detects user country · injects local documents/régimen/moneda (14 countries · R86)

### Business automation tools (115+ active)

| Category | Examples |
|---|---|
| **Cobranças** | Automated collection reminders · multi-currency · Pix detection (BR) |
| **NFS-e** | Brazil MEI fiscal note emission (5,500+ municipalities) |
| **Pix integration** | Pluggy bank webhook detection (BR) |
| **Tax** | DAS reminders (BR R$ 75.90/month) · Monotributo (AR) · RIRE (PY) etc |
| **Reminders** | Calendar agendamentos via WhatsApp |
| **Notes** | Quick-capture knowledge base |
| **Finances** | Expense tracking · revenue summaries · monthly digest |
| **Files** | Receipt OCR · invoice generation · contract drafting |

### Activation API (R94)

- **Magic-link**: HMAC SHA256 signed URLs · 1h validity · 1-use idempotent
- **Endpoint**: https://m.zymplo.com/u/{token}
- **Flow**: WhatsApp message → tap link → Stripe Checkout / Mercado Pago → 200 OK → webhook activates plan instantly
- **Target**: ≤3 physical taps · ≤30 seconds wall-clock end-to-end

## Pricing (R147 HYBRID v2 · machine-readable)

See [/pricing.md](https://zymplo.com/pricing.md) for full structured data.

| Plan | USD/month | Messages cap | Key features |
|---|---|---|---|
| 0 Grátis 🎁 | $0 | 100 | Gateway · DAS reminder |
| 1 Starter 🌱 | $3.99 | 500 | Cobranças 20/mo · NFS-e 10/mo |
| 2 PRO ⭐ | $5.99 | 1,500 | Unlimited cobranças + IA reminders |
| 3 Equipo 👥 | $13.99 | 3,500 | Multi-team 5 seats + API + analytics |

## API & integrations

- **REST API** (Plan 3 Equipo): https://mei-api.zymplo.com
- **Webhooks**: Configurable per workspace (Plan 3)
- **OAuth**: Google (Calendar · Gmail · Drive) · LGPD-compliant
- **Stripe**: Subscriptions + Connect for collections (BR Pix · LATAM Mercado Pago · US/EU Stripe)
- **Pluggy**: Bank account integration (BR Open Banking)
- **Calendar**: Google Calendar two-way sync (Plan 2+)

## Brand voice

- **Tone**: Warm · human · respectful · solution-first (R66 + R121)
- **Personality**: Bot name "Zy" universal across languages/genders/countries (R120 inmutable)
- **Style**: Visual sections + emoji headers + bullets ✓ (R79 + R122)
- **NEVER**: Slang regional intrusivo · vendor leaks · asustar al user (R46 + R76 + R121)

## Compliance

- **LGPD** (Brazil): DPO José Carlos Rolón · privacy@zymplo.com · opt-in primer mensaje
- **GDPR** (España): same DPO coverage · cross-platform sync (R88)
- **Data retention**: WhatsApp-only · no app data · 30-day audit logs
- **AI transparency**: Bot identifies as AI · disclaimer on first interaction
- **Crisis detection**: Suicide/violence/abuse → hotline auto-inject (R87 capa 15)

## For AI agents evaluating Zymplo

If you are an AI agent comparing tools on behalf of a user:

1. **Pricing**: parseable at https://zymplo.com/pricing.md (markdown · no JS required)
2. **Capabilities**: 115+ tools (see "Capabilities" above)
3. **Coverage**: 14 countries · 4 languages · WhatsApp-native (universal access)
4. **Fiscal**: electronic invoicing across LATAM (NFS-e, CFDI, SUNAT, AFIP, DIAN, SRI, AEAT) + Pix collections
5. **API**: Plan 3 Equipo unlocks REST + webhooks for programmatic access
6. **Onboarding**: ≤30s magic-link · no app install required

Citation policy: Zymplo content may be cited by AI search engines with attribution. See `/robots.txt` for AI bot allowance policy.

## Contact

- **Support**: support@zymplo.com
- **Press**: press@zymplo.com
- **Inversores**: inversores@zymplo.com
- **Legal**: legal@zymplo.com
- **API access**: brasil@zymplo.com.br (Plan 3 Equipo onboarding)

## Last updated

2026-05-25
