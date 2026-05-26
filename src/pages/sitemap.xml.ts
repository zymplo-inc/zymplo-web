import { COUNTRY_SLUGS, getCountry } from '@data/countries';
import { OFICIO_SLUGS } from '@data/oficios';
import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const today = new Date().toISOString().split('T')[0];
  const urls: string[] = [];

  // Root + key paths
  urls.push(`<url><loc>https://zymplo.com/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`);

  // ccTLDs (R118 · Brasil + España ya activos · others pending DNS)
  urls.push(`<url><loc>https://zymplo.com.br/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority><xhtml:link rel="alternate" hreflang="pt-BR" href="https://zymplo.com.br/"/><xhtml:link rel="alternate" hreflang="pt-BR" href="https://br.zymplo.com/"/><xhtml:link rel="alternate" hreflang="x-default" href="https://zymplo.com/"/></url>`);
  urls.push(`<url><loc>https://zymplo.es/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority><xhtml:link rel="alternate" hreflang="es-ES" href="https://zymplo.es/"/><xhtml:link rel="alternate" hreflang="es-ES" href="https://es.zymplo.com/"/><xhtml:link rel="alternate" hreflang="x-default" href="https://zymplo.com/"/></url>`);

  for (const slug of COUNTRY_SLUGS) {
    const c = getCountry(slug)!;
    const base = `https://${slug}.zymplo.com`;
    // Country root with full hreflang cluster
    urls.push(`<url><loc>${base}/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority>${COUNTRY_SLUGS.map((s) => `<xhtml:link rel="alternate" hreflang="${getCountry(s)!.locale}" href="https://${s}.zymplo.com/"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="https://zymplo.com/"/></url>`);
    urls.push(`<url><loc>${base}/precios/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`);
    urls.push(`<url><loc>${base}/onboarding/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`);

    // R-AISEO 2026-05-25 · Programmatic SEO · 28 ofícios per country = 364 pages
    for (const oficio of OFICIO_SLUGS) {
      urls.push(`<url><loc>${base}/oficios/${oficio}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority>${COUNTRY_SLUGS.map((s) => `<xhtml:link rel="alternate" hreflang="${getCountry(s)!.locale}" href="https://${s}.zymplo.com/oficios/${oficio}/"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="https://zymplo.com/"/></url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
