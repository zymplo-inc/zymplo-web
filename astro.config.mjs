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
