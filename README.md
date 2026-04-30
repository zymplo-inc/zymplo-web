# Zymplo Web · Multi-país

> Astro 4 + React 18 islands + TailwindCSS + Framer Motion + TypeScript
> 7 países (BR · MX · US · CO · ES · AR · PY) · single codebase

---

## Quickstart

```bash
npm install
npm run dev
# → http://localhost:4321/br/
```

Otras URLs de desarrollo:

- `/br/` `/mx/` `/us/` `/co/` `/es/` `/ar/` `/py/`
- `/br/precios/` · `/br/onboarding/` · `/br/contiq/` (B2B BR-only)
- `/` redirige por geo-IP (en local cae a `/br/`)

## Build

```bash
npm run build       # output → dist/
npm run preview
```

## Deploy · Cloudflare Pages

1. Push del repo a GitHub
2. Cloudflare Dashboard → Pages → Create → Connect repo
3. Build command: `npm run build`
4. Output dir: `dist`
5. Env: `NODE_VERSION=20`
6. Custom domains: `zymplo.com`, `br.zymplo.com`, `mx.zymplo.com`, etc.

El adapter `@astrojs/cloudflare` ya está configurado en `astro.config.mjs`.
La detección de `request.cf.country` para geo-IP funciona automáticamente en Pages.

## Estructura

```
src/
├── data/countries.ts         ← Single source of truth (7 países)
├── i18n/{pt-br,es-mx,...}    ← Diccionarios por locale
├── layouts/CountryLayout     ← Shell con SEO + hreflang
├── pages/
│   ├── index.astro           ← Geo-IP redirect
│   └── [country]/            ← /br/ /mx/ /us/ /co/ /es/ /ar/ /py/
├── components/
│   ├── Hero/                 ✅ cinematográfico (SVG tubes + typewriter)
│   ├── ChatDemo/             ✅ WhatsApp simulator
│   ├── PricingTable/         ✅ 4 planes + Contiq B2B (BR)
│   ├── LangSwitcher/         ✅ dropdown 7 países
│   ├── Footer/               ✅ links + compliance + payments
│   ├── CookieBanner/         ✅ EU-only (gated en CountryLayout)
│   ├── InfluencerHero/       ⚠ scaffold (placeholder SVG)
│   ├── PersonajesMEI/        ⚠ scaffold (3 personas/país)
│   ├── ToolsCarousel/        ⚠ scaffold (grid estático, falta marquee)
│   └── Onboarding5Steps/     ⚠ scaffold (página `/onboarding/`)
└── styles/tokens.css         ← Tokens canónicos V2
```

## Próximos pasos

Ver `HANDOFF-NOTES.md`.
