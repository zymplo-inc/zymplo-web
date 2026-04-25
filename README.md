# Zymplo Web · zymplo.com

Sitio web institucional de **Zymplo** · assistente operacional de microempreendedores brasileiros.

## Stack

- **Framework:** [Astro 4](https://astro.build) (zero JS por default · static SSG)
- **Estilos:** Tailwind CSS 3 + design tokens da brand bible (DEC-02)
- **Tipografia:** [Manrope Variable](https://fontsource.org/fonts/manrope) self-hosted
- **Hosting:** Cloudflare Pages (auto-deploy desde branch `main`)
- **Linguagem primária:** pt-BR

## Páginas v1

| Rota | Conteúdo |
|---|---|
| `/` | Home · hero MEI + 3 features + como funciona + CTA lançamento |
| `/privacy` | Política de Privacidade LGPD-compliant |
| `/terms` | Termos de Uso |
| `/data-deletion` | Solicitação de exclusão de dados (LGPD Art. 18) |
| `/sub-processors` | Lista de sub-processadores (DPAs) |
| `/contact` | Canais oficiais de contato (suporte, DPO, press, legal, investidores) |

## Desenvolvimento local

```bash
npm install
npm run dev   # http://localhost:4321
npm run build # gera ./dist
npm run preview
```

Requisitos: Node 20+ · npm 10+

## Deploy

Cloudflare Pages auto-deploy ao push em `main`. Build settings:

- **Framework preset:** Astro
- **Build command:** `npm run build`
- **Build output:** `dist`
- **Root directory:** `/`
- **Node version:** `20`
- **Custom domain:** `zymplo.com` (root) + `www.zymplo.com` (redirect 301)

## Brand

- **Cor primária:** `#14B8A6` (turquesa teal · ratificada SIM-V24-B 90.8% confidence)
- **Tipografia:** Manrope Variable
- **Logo:** SVG embedded em `public/logo-zymplo.svg`
- **Não usar:** "ERP", "CRM", "SaaS", "plataforma", "dashboard", "pipeline", "KPI" (regra brand voice MEI BR)

## Estrutura

```
src/
├── layouts/BaseLayout.astro    # Layout base · meta tags · SEO · OG
├── components/
│   ├── Header.astro            # Nav + logo + CTA
│   └── Footer.astro            # Footer 4 colunas + links legais
├── pages/                      # Rotas · uma por arquivo
└── styles/global.css           # Tailwind + tipografia + componentes
public/                          # Static assets
```

## Manutenção

- **Atualizar `lastUpdated` em /privacy, /terms, /sub-processors** sempre que houver mudança
- **Adicionar sub-processador novo:** editar array `subProcessors` em `src/pages/sub-processors.astro` + notificar usuários 30 dias antes
- **Mudança material em política:** alerta por e-mail + push notification 30 dias antes (responsabilidade DPO Rolón)

## Links relacionados

- **Repositório produto:** [zymplo-inc/zymplo](https://github.com/zymplo-inc/zymplo)
- **HQ comando central:** [zymplo-inc/zymplo-hq](https://github.com/zymplo-inc/zymplo-hq)
- **ADR CRM Full MVP:** `zymplo-hq/01-comando-central/2026-04-24_ADR-CRM-FULL-MVP.md`
- **LGPD amendment fonte:** `zymplo-hq/01-comando-central/2026-04-25_CRM-DRAFTS/03_lgpd-privacy-amendment.md`

## Licença

Privado · © 2026 Zymplo Inc. Todos os direitos reservados.
