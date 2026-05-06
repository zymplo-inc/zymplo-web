# MIGRATION NOTES · 2026-05-06

Aplicado al repo `zymplo-inc/zymplo-web` por Cowork autónomo (R98) según brief
`/01-comando-central/2026-05-06_COWORK-WEB-BRIEF.md` · firma Carlos: "go path A".

---

## Cambios aplicados

### Bloque 1 · R102 SUPREMA · Purge Contiq total

- ❌ `src/pages/[country]/contiq.astro` → archivo eliminado
- ❌ `src/components/PricingTable/PricingTable.tsx` → bloque B2B Contiq strip eliminado
  (líneas que renderizaban `country.slug === 'br' && country.pricing.b2b`)
- ❌ `src/data/countries.ts` → `b2b?: string` eliminado del type `Country.pricing`
- ❌ `src/i18n/*.json` (13 archivos) → keys `cta_secondary`, `b2b_label`, `b2b_desc`, `link_contiq` eliminadas
- ❌ `src/pages/sitemap.xml.ts` → línea con `/contiq/` URL eliminada
- ❌ `src/pages/index.astro` → `<a href="…/contiq/">Contiq B2B</a>` eliminado
- ❌ `src/pages/legal/terms.astro` línea 59 → `<li>Plan B CONTIQ · R$149/mes · B2B contadores.</li>` eliminada
- ❌ `README.md` → todas las referencias a Contiq B2B eliminadas
- ❌ `DESIGN-TOKENS.md` → comentarios "Contiq B2B" reemplazados por "info azul"

Validado por: R102 SUPREMA · 2026-05-04 · Plan B R$149 eliminado raíz · Carlos.
Grep CI fail-safe: `scripts/grep-checks.sh r102`.

### Bloque 2 · Stack bump (Astro 4→5 · Tailwind 3→4)

- `package.json` → `astro ^5.1.5` · `tailwindcss ^4.0.3` · `@tailwindcss/vite ^4.0.3` · `@fontsource/sora ^5.1.1` · removed `@astrojs/tailwind`
- `astro.config.mjs` → `vite: { plugins: [tailwindcss()] }` · removed `tailwind()` integration
- Removed: `tailwind.config.ts` · `postcss.config.mjs` (Tailwind 4 nativo Vite)
- Added: `@theme` block CSS para tokens en `src/styles/global.css` (paleta DEC-02)

### Bloque 3 · Adapter Cloudflare → Vercel

- `astro.config.mjs` → `adapter: vercel({ webAnalytics, edgeMiddleware: true, imageService: true })`
- `package.json` → `@astrojs/vercel ^8.0.4` (removed any cloudflare adapter ref)
- README · adapter section reescrita

### Bloque 4 · R103 ORDEN SUPREMA · 14 países

- Added: `src/i18n/pt-pt.json` (Portugal · trabalhador independente · EUR · NIF)
- `src/data/countries.ts` → entry PT agregada (locale `pt-PT` · currency `EUR` · doc `NIF`)
- 14 países totales: BR · MX · AR · CO · CL · PE · UY · PY · BO · EC · ES · US · CR · PT

### Bloque 5 · 4 planes canónicos (R29 + R102)

- `src/data/countries.ts` pricing per país → 4 planes (free / starter / pro / gold)
- Validated by: Sim 10 + V22-10 + V23-03 · 476 actions · CI 95%+
- Blended ARPU R$ 15.60 · Plan B R$149 NUNCA aparece

### Bloque 6 · Brand canonical via CDN

- `<link>` to `https://sims.zymplo.com/brand/brand-guidelines/brand-tokens.css` en `Base.astro`/CountryLayout
- Isotipo · wordmark V2 turquesa · favicon · apple-touch-icon vía CDN (R57)
- `src/styles/tokens.css` mantiene fallback local (offline)

### Bloque 7 · Grep checks pre-commit (R42 + R93 + R102 + R100)

- Added: `scripts/grep-checks.sh` (4 checks · R42 identidad · R93 phrases · R102 Contiq · R100 forbidden HTTP headers)
- `package.json` scripts: `grep:r42`, `grep:r93`, `grep:r102`, `grep:r100`, `grep:all`

---

## Sims que validaron esta migración

- Brief `2026-05-06_COWORK-WEB-BRIEF.md` (10 secciones · 127 sims totales)
- Sim 08 BRAND-VOICE (90.8% confidence)
- Sim 10 + V22-10 + V23-03 PRICING (476 actions · CI 95%+)
- V22-06 LGPD (92 actions)
- V24-COLOR-BRAND-AB (composite 96.3 · paleta DEC-02 turquesa)
- V25-BRAND-01-LOGO (isotipo turquesa)
- V25-{14}-EXPANSION sims para los 14 países
- R42 · R57 · R93 · R98 · R100 · R102 SUPREMA · R103 ORDEN SUPREMA

---

## Próximos pasos (Sprint post-merge)

1. **Onboarding5Steps** end-to-end (5 pasos · 90s · confeti · install ≥75% · D+0 ≥87%)
2. **Videos hero país-specific** subir a `public/videos/hero/` (8s loop · cultura local)
3. **Ilustraciones warm** para 14 influencers IA (encargar ilustrador, NO IA)
4. **ToolsCarousel** marquee real (100+ herramientas · scroll infinito)
5. Forms: capturar email + WA deep-link tracking · Resend Pro key dedicada `WEB_FORM_RESEND_KEY`
6. Lighthouse CI gate: Performance ≥95 · A11y 100 · SEO 100 · WCAG AAA
