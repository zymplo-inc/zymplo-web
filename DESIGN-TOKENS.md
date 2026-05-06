# Zymplo Design Tokens V2 (canonical)

Source of truth: `src/styles/tokens.css` y `tailwind.config.ts`.

## Colores

| Token | Hex | Uso |
|---|---|---|
| `--turquesa` / `bg-turquesa` | `#14B8A6` | Primary · CTAs · accents |
| `--turquesa-dark` | `#0F9488` | CTA hover |
| `--turquesa-deeper` | `#0B6B62` | Texto sobre paler |
| `--turquesa-light` | `#5EEAD4` | Glows · gradients |
| `--paler` / `bg-turquesa-paler` | `#CCFBF1` | Chips · pills · backgrounds suaves |
| `--azul` | `#1E4AD4` | info azul |
| `--purple` | `#623AE6` | info azul accent |
| `--ink` | `#0A0B14` | Texto · backgrounds dark |
| `--paper` | `#FAFBFF` | Background base |
| `--slate` | `#1F2937` | Texto secundario |
| `--mute` | `#6B7280` | Captions · placeholders |
| `--success` | `#22C55E` | Confirmaciones |
| `--warning` | `#F59E0B` | Alertas (TBD PY) |
| `--error` | `#EF4444` | Errores |

## Tipografía

- **Display · Sora** (400/500/600/700/800) — wordmark, headings, números grandes. Tracking: `tighter` (-0.025em) o `tightest` (-0.04em).
- **Body · Manrope** (400/500/600/700/800) — todo lo demás. Default weight: 500.

Fuentes cargadas vía `tokens.css` (`@import` Google Fonts) con `display: swap`.

## Brand assets (URLs públicos · CDN S1 · CORS-ok)

- Wordmark: `https://sims.zymplo.com/brand/manual-v2/zymplo-wordmark-v2-turquesa.svg`
- Lockup: `https://sims.zymplo.com/brand/manual-v2/zymplo-lockup-horizontal-v2.svg`
- Isotipo: `https://sims.zymplo.com/brand/isotipo.svg`
- Favicon: `https://sims.zymplo.com/brand/favicon.ico`
- Apple touch: `https://sims.zymplo.com/brand/apple-touch-icon.png`

## Liquid glass utility

```html
<div class="liquid-glass rounded-2xl px-4 py-3">…</div>
```

## Motion · easings

```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);   /* hero entry */
--ease-in-out-quad: cubic-bezier(0.45, 0, 0.55, 1); /* loops */
```

`prefers-reduced-motion: reduce` desactiva todas las animations.

## Reglas non-negotiable

❌ **Forbidden copy**: ERP, CRM, SaaS, "plataforma", "dashboard", "pipeline", "KPI", "software", "solução de gestão", "Tu CRM con IA"
✅ **OK**: "tu secretaria IA en WhatsApp", "organizar tus cobros", "emitir nota desde el WhatsApp"
✅ Identificar por **oficio** (electricista, cabeleireira), no por "empresário"
