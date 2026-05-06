# Zymplo Web · Multi-país

Astro 5 + React 18 islands + Tailwind 4 + Framer Motion + TypeScript
**14 países** (BR · MX · AR · CO · CL · PE · UY · PY · BO · EC · ES · US · CR · PT) · single codebase
Hosting: **Vercel Edge** · domain `zymplo.com`

---

## Quickstart

```bash
pnpm install
pnpm dev
# → http://localhost:4321/br/
```

Rutas de desarrollo:

- `/br/` `/mx/` `/ar/` `/co/` `/cl/` `/pe/` `/uy/` `/py/` `/bo/` `/ec/` `/es/` `/us/` `/cr/` `/pt/`
- `/br/precios/` · `/br/onboarding/`
- `/` redirige por geo-IP / Accept-Language (default: `/br/`)

## Build

```bash
pnpm build       # output → dist/
pnpm preview
```

## Deploy · Vercel

1. Push a GitHub (`zymplo-inc/zymplo-web`)
2. Vercel Dashboard → New Project → Import repo
3. Framework preset: **Astro**
4. Build command: `pnpm build` · Output dir: `dist`
5. Env: ver `.env.example`
6. Custom domain: `zymplo.com` (Cloudflare DNS) · `zymplo.com.br` 301 → `zymplo.com/pt/`

El adapter `@astrojs/vercel` ya está configurado en `astro.config.mjs`.

## Estructura

```
src/
├── data/countries.ts         ← Single source of truth (14 países)
├── i18n/{pt-br,es-mx,...,pt-pt}  ← 14 diccionarios por locale
├── layouts/CountryLayout     ← Shell con SEO + hreflang × 14
├── pages/
│   ├── index.astro           ← Geo-IP / Accept-Language redirect
│   └── [country]/            ← 14 países · index + precios + onboarding
├── components/
│   ├── Hero/                 ✅ cinematográfico (SVG tubes + typewriter)
│   ├── ChatDemo/             ✅ WhatsApp simulator
│   ├── PricingTable/         ✅ 4 planes canónicos (R102 SUPREMA)
│   ├── LangSwitcher/         ✅ dropdown 14 países
│   ├── Footer/               ✅ links + compliance + payments
│   ├── CookieBanner/         ✅ LGPD/GDPR-safe (V22-06)
│   ├── InfluencerHero/       ⚠ scaffold (placeholder SVG)
│   ├── PersonajesMEI/        ⚠ scaffold (3 personas/país)
│   ├── ToolsCarousel/        ⚠ scaffold (grid estático, falta marquee)
│   └── Onboarding5Steps/     ⚠ scaffold (página `/onboarding/`)
└── styles/tokens.css         ← Tokens canónicos V2 (DEC-02)
```

## Reglas inmutables (NUNCA violar)

- **R42 IDENTIDAD** · sin tech jerga ERP/CRM/SaaS/plataforma · sin "MEIs/microempresários" en plural genérico
- **R93 REQUIRED PHRASES** · eyebrow + hero copy locked por país (ver brief §2)
- **R98 EXTERIORS-ONLY** · Cowork autónomo en código · Carlos firma 2FA + dominios + term sheets
- **R100 ZERO-FAIL PERF** · TTFB ≤500ms p95 · WCAG AAA · sin headers Clear-Site-Data
- **R102 SUPREMA** · NUNCA mencionar CONTIQ · Hugo Costa · Plan B R$149 · "200+ contadores" (eliminado raíz 2026-05-04)
- **R103 ORDEN SUPREMA** · 14 países desde día 1 · NEVER ship BR-only

Pre-commit grep checks: `pnpm grep:all` (ver `scripts/grep-checks.sh`).

## Próximos pasos

Ver `MIGRATION-NOTES-2026-05-06.md`.

## Brand assets

Single source of truth: `https://sims.zymplo.com/brand/` (CSS tokens · SVG isotipo · favicon · wordmark V2). NO regenerar localmente.
