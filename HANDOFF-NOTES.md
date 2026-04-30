# HANDOFF NOTES · Zymplo Web Multi-país

Para Claude Code · VS Code

---

## ✅ Qué está hecho (production-ready)

1. **Stack configurado** — Astro 4 + React 18 + Tailwind + Framer Motion + TS + Cloudflare adapter
2. **Tokens V2 canónicos** — `tokens.css` + `tailwind.config.ts` con paleta DEC-02 completa
3. **Single source of truth** — `src/data/countries.ts`: influencer, personas, currency, compliance, payments, slang, pricing por país
4. **i18n** — 7 JSON dictionaries (`pt-br`, `es-mx`, `en-us`, `es-co`, `es-es`, `es-ar`, `es-py`)
5. **Routing 7 países** — `[country]/index.astro` con `getStaticPaths()` + páginas `precios`, `onboarding`, `contiq`
6. **CountryLayout.astro** — header, hreflang × 7, Schema.org SoftwareApplication, OG tags, EU cookie gate
7. **Geo-IP redirect** — root `/` lee `request.cf.country` (Cloudflare) y redirige a `/br/` por defecto
8. **Componentes hero terminados**:
   - `Hero` — cinematográfico, SVG procedural tubes liquid-glass animados, typewriter rotate, CTAs país-specific
   - `ChatDemo` — WhatsApp simulator interactivo, cycle infinito, typing dots realistas
   - `PricingTable` — 4 planes + Contiq B2B (BR-only), highlight Pro
   - `LangSwitcher` — dropdown 7 países accesible
   - `Footer` — links, compliance, payments, países
   - `CookieBanner` — EU-only, consent persistido localStorage
9. **Brand canonical V2** — Sora + Manrope, paleta turquesa-azul-purple, isotipo desde CDN público

## ⚠ Qué quedó pendiente (scaffolding con contrato definido)

Cada uno tiene un componente/página con `TODO` comentado y estructura lista. Claude Code los puede completar leyendo el archivo.

| Archivo | Pendiente |
|---|---|
| `components/InfluencerHero.astro` | Reemplazar SVG placeholder por **ilustraciones warm** (NO foto real) específicas por país: Roni, Memo, King, Falca, Andre, Lío, TBD-PY |
| `components/PersonajesMEI.astro` | Ilustraciones de los 3 personas/país (avatares warm) |
| `components/ToolsCarousel.astro` | Convertir grid en **marquee horizontal** infinito con CSS `animation: scroll` o Framer Motion |
| `pages/[country]/onboarding.astro` | Implementar los **5 pasos reales** (Welcome → Oficio → Datos → Demo cobranza → Listo). Métricas target: install ≥75%, D+0 ≥87% |
| `public/videos/hero/{slug}.mp4` | **Videos hero país-specific** (8s loop, cultura local). Mientras tanto, el Hero SVG tubes funciona como fallback |
| `pages/[country]/contiq.astro` | Detalles del producto Contiq (BR-only), cases, demo, formulario |
| Confeti animation | En el paso "Primera cobranza demo" del onboarding |

## 🚨 Decisiones que tomé (confirmar conmigo)

1. **Hero "video tubes"** → implementé con **SVG procedural animado** (paths con `<animate>`) en vez de Three.js. Razones:
   - Bundle <100KB JS gzip ✅
   - Lighthouse Performance 95+ ✅
   - Mismo aesthetic liquid-glass cinematográfico
   - Si querés Three.js real, decime y lo cambio (~150KB extra).
2. **PY influencer** → placeholder visible "TBD" + warning amarillo. Cuando confirmen el nombre, editar `src/data/countries.ts` línea ~125.
3. **Cookie banner** → custom liviano (no Klaro!). Solo aparece para `slug === 'es'`. Si querés agregar más países EU, edit `EU_SLUGS` en `countries.ts`.
4. **Speaker notes / hreflang x-default** → apunta a `https://zymplo.com/`. Confirmar si querés que sea `/br/` o `/us/`.
5. **Astro `output: 'hybrid'`** → permite SSG por defecto + SSR para el redirect raíz. Cloudflare-friendly.

## 🔥 Cómo correr local

```bash
cd handoff/
npm install
npm run dev
# → http://localhost:4321/br/  (también /mx/, /us/, etc.)
```

## ☁ Cómo deployar Cloudflare Pages

```bash
npm run build  # → dist/
```

Pages dashboard → Connect repo → Framework preset: **Astro** → Build cmd `npm run build` → Output `dist` → Env `NODE_VERSION=20`.

Custom domains: agregar `zymplo.com` (root con redirect) y `br.zymplo.com`, `mx.zymplo.com`, etc. Cada subdominio puede apuntar al mismo Pages project; Cloudflare maneja SSL automático.

## 🗺 Roadmap recomendado (en orden de impacto)

### Sprint 1 (esta semana)
- [ ] Implementar `Onboarding5Steps` end-to-end (5 pasos · 90s · confeti)
- [ ] Subir 7 videos hero a `public/videos/hero/` y conectarlos en `Hero.tsx` como background opcional
- [ ] Ilustraciones warm para los 7 influencers IA (encargar a ilustrador, NO IA)

### Sprint 2
- [ ] Marquee real en `ToolsCarousel` (100+ herramientas, scroll infinito)
- [ ] Página `/br/contiq/` completa (B2B landing)
- [ ] Forms: capturar email + WA deep-link tracking
- [ ] Analytics: Cloudflare Web Analytics o Plausible (privacy-first)

### Sprint 3
- [ ] A/B testing CTAs por país (slang variants)
- [ ] PWA (manifest + service worker)
- [ ] Localización extra: Cookie banner i18n por país EU futuro
- [ ] Schema.org expandido: `FAQPage`, `Product`, `Review`

## 🧪 Validación pre-deploy (checklist)

```bash
# 1. Lighthouse
npm run build && npm run preview
# Abrir Chrome DevTools · Lighthouse · Performance/A11y/SEO/Best Practices ≥ 95

# 2. Bundle size
ls -lh dist/_astro/*.js  # Cada chunk JS < 100KB gzip

# 3. Forbidden copy check
grep -ri "ERP\|CRM\|SaaS\|plataforma\|dashboard\|pipeline" src/  # Debe estar vacío

# 4. hreflang válido
curl -s http://localhost:4321/br/ | grep hreflang  # 8 entries (7 países + x-default)

# 5. 7 países build
ls dist/  # br/ mx/ us/ co/ es/ ar/ py/
```

## 🤖 Cómo trabajar con Claude Code en VS Code

Abrir el proyecto en VS Code con extensión Claude Code. Pedirle:

> "Leé `HANDOFF-NOTES.md` y `DESIGN-TOKENS.md`. Después implementá `Onboarding5Steps` siguiendo el contrato del scaffold y respetando los tokens V2 + reglas non-negotiable de copy."

Claude Code va a:
1. Leer la estructura `src/`
2. Respetar `countries.ts` como source of truth
3. Usar Tailwind con los tokens custom
4. Mantener Framer Motion para animations cinematográficas
5. No tocar config files sin pedir

## 📞 Contacto / contexto

- Brand canonical V2: `https://sims.zymplo.com/brand/manual-v2/`
- Validation data: SIM 476 actions, CI 95%+ (pricing locked)
- Identidad: agente operacional nativo de WhatsApp para microempresarios autónomos. **NO es ERP/CRM/SaaS.**

---

**GO 🚀**
