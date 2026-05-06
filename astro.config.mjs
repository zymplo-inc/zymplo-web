import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Astro 5 + Tailwind 4 + Vercel Edge adapter.
// 14 países · slugs br/mx/ar/co/cl/pe/uy/py/bo/ec/es/us/cr/pt vía [country] dynamic.
// R103 ORDEN SUPREMA · NEVER ship BR-only.
// Validated by: Brief 2026-05-06 §5 · R100 ZERO-FAIL perf · V22-06 LGPD.
export default defineConfig({
  site: 'https://zymplo.com',
  output: 'static',
  trailingSlash: 'always',
  adapter: vercel({
    webAnalytics: { enabled: true },
    edgeMiddleware: true,
    imageService: true,
  }),
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'pt-br',
        locales: {
          'pt-br': 'pt-BR', 'es-ar': 'es-AR', 'es-mx': 'es-MX', 'es-co': 'es-CO',
          'es-cl': 'es-CL', 'es-pe': 'es-PE', 'es-uy': 'es-UY', 'es-py': 'es-PY',
          'es-bo': 'es-BO', 'es-ec': 'es-EC', 'es-es': 'es-ES', 'es-cr': 'es-CR',
          'en-us': 'en-US', 'pt-pt': 'pt-PT',
        },
      },
    }),
  ],
  build: { inlineStylesheets: 'auto', format: 'directory' },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  vite: {
    plugins: [tailwindcss()],
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
