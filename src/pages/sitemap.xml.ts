import { COUNTRY_SLUGS, getCountry } from '@data/countries';
import { OFICIO_SLUGS } from '@data/oficios';
import type { APIRoute } from 'astro';

// Sólo URLs de la propiedad `sc-domain:zymplo.com` (apex + subdominios). Los
// ccTLDs `zymplo.com.br` y `zymplo.es` NO van acá: viven fuera de esa propiedad
// y zymplo.es responde noindex — un sitemap con URLs ajenas o noindexadas hace
// que Google desconfíe del sitemap entero (aviso GSC 2026-08-07).
const cluster = (path = '/', withXDefault = false) =>
  COUNTRY_SLUGS.map(
    (s) => `<xhtml:link rel="alternate" hreflang="${getCountry(s)!.locale}" href="https://${s}.zymplo.com${path}"/>`
  ).join('') +
  (withXDefault ? `<xhtml:link rel="alternate" hreflang="x-default" href="https://zymplo.com/"/>` : '');

export const GET: APIRoute = () => {
  const today = new Date().toISOString().split('T')[0];
  const urls: string[] = [];

  // Apex = x-default. Lleva el cluster completo para ser recíproco con los
  // homes de país (un x-default que no lista a sus alternates rompe los pares).
  urls.push(
    `<url><loc>https://zymplo.com/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority>${cluster('/', true)}</url>`
  );

  for (const slug of COUNTRY_SLUGS) {
    const base = `https://${slug}.zymplo.com`;
    urls.push(
      `<url><loc>${base}/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority>${cluster('/', true)}</url>`
    );
    // Sin x-default en rutas profundas: el apex no tiene /precios/ ni /oficios/
    // — apuntar x-default a una URL inexistente invalida el cluster.
    urls.push(
      `<url><loc>${base}/precios/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority>${cluster('/precios/')}</url>`
    );
    urls.push(
      `<url><loc>${base}/onboarding/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority>${cluster('/onboarding/')}</url>`
    );

    // R-AISEO 2026-05-25 · Programmatic SEO · 28 ofícios per country
    for (const oficio of OFICIO_SLUGS) {
      urls.push(
        `<url><loc>${base}/oficios/${oficio}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority>${cluster(`/oficios/${oficio}/`)}</url>`
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
