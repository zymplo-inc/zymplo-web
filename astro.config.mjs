import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// SSG estático · 7 países × N routes vía getStaticPaths().
// Adapter Cloudflare quitado · deploy estático S1 + opcional CF Pages.
// i18n built-in quitado · slugs br/mx/us/co/es/ar/py los maneja [country] dynamic.
export default defineConfig({
  site: 'https://zymplo.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  build: { inlineStylesheets: 'auto', format: 'directory' },
  // Dos URLs de borrado de cuenta que se publicaron y hoy dan 404.
  //
  // `/legal/delete-request/` estaba enlazada como "Opción 3 · Web form" desde
  // las tres versiones de `delete-account` (es/pt/en) y NUNCA existió. Google
  // lo trata como incumplimiento, no como detalle:
  //
  //   "The weblink must be functional (for example, loads without error),
  //    relevant in scope ... and reference the app or developer name."
  //   support.google.com/googleplay/android-developer/answer/13327111
  //   (leído 2026-07-30)
  //
  // Con la app ya suspendida el 28-jul, un enlace roto en la página de borrado
  // es exactamente el hallazgo que convierte una apelación en un rechazo.
  //
  // `/privacy/delete/` era una página huérfana (sin enlaces entrantes) cuyo
  // formulario posteaba a `api.zymplo.com/v1/lgpd/delete-request`, que también
  // responde 404 — medido 2026-07-30. Un formulario que traga el pedido en
  // silencio es peor que no tenerlo: el titular cree que pidió el borrado y
  // nadie lo recibe.
  //
  // Ambas apuntan a la página que sí funciona y que sí ofrece caminos reales.
  redirects: {
    '/legal/delete-request/': '/legal/delete-account/',
    '/privacy/delete/': '/legal/delete-account/',
  },
  vite: {
    ssr: { noExternal: ['framer-motion'] },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@layouts': path.resolve(__dirname, 'src/layouts'),
        '@i18n': path.resolve(__dirname, 'src/i18n'),
        '@data': path.resolve(__dirname, 'src/data'),
      },
    },
  },
});
