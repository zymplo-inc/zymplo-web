# Pricing · Zymplo

**Last updated**: 2026-05-25 · **Ratified**: R147 HYBRID v2 SUPREMA · evidence-based via MEGA SIM 540 LLM calls + multi-agent debate

Machine-readable pricing data for AI agents and programmatic comparison. All prices USD-pegged with local currency conversion for 14 countries.

## Plan 0 · Zy Grátis 🎁

- **Price**: $0/month · forever free (gateway viral · R28 LOCKED)
- **Messages**: 100/month hard cap
- **Cobranças (collections)**: 5/month
- **Notas fiscais (NFS-e Brasil)**: 1/month
- **Features**: DAS reminder · basic agenda · WhatsApp-only

## Plan 1 · Zy Starter 🌱

- **Price USD**: $3.99/month (billed monthly)
- **Local prices**:
  - 🇧🇷 R$ 19,90 BRL
  - 🇲🇽 $69 MXN
  - 🇦🇷 AR$ 4.490
  - 🇨🇴 $14.900 COP
  - 🇨🇱 $3.490 CLP
  - 🇵🇪 S/ 12,90 PEN
  - 🇺🇾 $U 159 UYU
  - 🇵🇾 ₲ 29.000 PYG
  - 🇧🇴 Bs 27,90 BOB
  - 🇨🇷 ₡ 1.990 CRC
  - 🇪🇨 $3.99 USD
  - 🇪🇸 €3,49 EUR · 🇵🇹 €3,49 EUR
  - 🇺🇸 $3.99 USD
- **Messages**: 500/month hard cap
- **Cobranças**: 20/month
- **Notas fiscais**: 10/month
- **Features**: Planilla financiera · payment reminders
- **Margin**: 78.4% real (cost $0.86/user)

## Plan 2 · Zy Pro ⭐

- **Price USD**: $5.99/month
- **Local prices**:
  - 🇧🇷 R$ 29,90 BRL
  - 🇲🇽 $99 MXN
  - 🇦🇷 AR$ 6.890
  - 🇨🇴 $22.900 COP
  - 🇨🇱 $5.490 CLP
  - 🇵🇪 S/ 19,90 PEN
  - 🇺🇾 $U 239 UYU
  - 🇵🇾 ₲ 43.500 PYG
  - 🇧🇴 Bs 41,90 BOB
  - 🇨🇷 ₡ 2.990 CRC
  - 🇪🇨 $5.99 USD
  - 🇪🇸 €4,99 EUR · 🇵🇹 €4,99 EUR
  - 🇺🇸 $5.99 USD
- **Messages**: 1,500/month hard cap · soft warning at 1,350 (90%)
- **Cobranças**: unlimited
- **Notas fiscais**: unlimited
- **Features**: Lembretes IA · audio transcription · multi-modal · all Plan 1 features
- **Overage**: $0.00996/message above cap
- **Margin**: 74.1% real (cost $1.55/user)

## Plan 3 · Zy Equipo 👥

- **Price USD**: $13.99/month
- **Local prices**:
  - 🇧🇷 R$ 69,90 BRL
  - 🇲🇽 $239 MXN
  - 🇦🇷 AR$ 17.490
  - 🇨🇴 $54.900 COP
  - 🇨🇱 $12.990 CLP
  - 🇵🇪 S/ 49,90 PEN
  - 🇺🇾 $U 559 UYU
  - 🇵🇾 ₲ 102.000 PYG
  - 🇧🇴 Bs 97,90 BOB
  - 🇨🇷 ₡ 6.990 CRC
  - 🇪🇨 $13.99 USD
  - 🇪🇸 €12,49 EUR · 🇵🇹 €12,49 EUR
  - 🇺🇸 $13.99 USD
- **Messages**: 3,500/month hard cap · soft warning at 3,150 (90%)
- **Cobranças**: unlimited
- **Notas fiscais**: unlimited
- **Features**: Multi-team (5 seats) · API access · Priority queue · Analytics dashboard · White-label option · Webhooks · all Plan 2 features
- **Overage**: $0.00996/message above cap
- **Margin**: 70.8% real (cost $4.08/user)

## Payment methods

- **Brasil**: Pix · Boleto · Credit card via Stripe Connect (0.99% Pix · 3.99% credit)
- **México**: OXXO · SPEI · Credit card via Stripe Connect
- **Argentina**: Mercado Pago · Credit card
- **Paraguay/Uruguay/Chile/Peru**: Mercado Pago primary
- **Colombia/Ecuador/Bolivia/Costa Rica**: Stripe variants
- **Spain/Portugal**: SEPA · Credit card via Stripe Connect
- **USA**: Credit card via Stripe Connect (2.9% + $0.30)

## Activation flow (R94 magic-link)

1. Plan 0 user clicks "Upgrade" in WhatsApp bot
2. Bot sends magic link (HMAC SHA256 · 1h validity · 1-use)
3. User taps link → Stripe Checkout (or Mercado Pago)
4. 1-3 taps · Apple Pay/Pix nativo · ≤30s wall-clock
5. Webhook activates plan instantly · bot proactive acknowledgment ≤5s

## Trial & refund policy

- **Trial**: 7 days free for Plan 1/2/3 (post-LGPD consent)
- **Refund**: 30 days money-back if not satisfied (R94 + R28 conjugada)
- **Cancellation**: Anytime via WhatsApp message "cancelar" · no penalty

## API & enterprise

For volume discounts (1,000+ seats) or white-label deployment, contact `inversores@zymplo.com` or `legal@zymplo.com`.

## Verification

This pricing is the canonical source. Auto-sync with database `pricing_country_matrix` (Postgres SSOT). Review trimestral cron · FX shift >10% triggers update notification.

For ratification audit trail, see CLAUDE.md R147 SUPREMA in zymplo-inc/zymplo-hq GitHub repository.

## Last updated

2026-05-25
