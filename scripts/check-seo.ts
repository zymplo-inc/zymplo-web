/**
 * Candado SEO post-build · corre en cada `npm run build` (local y CF Pages).
 *
 * Nació del aviso de GSC 2026-08-07: 70 páginas se auto-excluían con la
 * canónica apuntando al home, el apex declaraba 8 hreflang cuando eran 14 y el
 * sitemap mezclaba dominios de otra propiedad. Vigila la FORMA, no los casos:
 * se pone rojo si CUALQUIER página del dist vuelve a cualquiera de las tres.
 *
 *   1 · canónica de cada página == su propia URL pública (vía country-proxy)
 *   2 · todo set de hreflang == los 14 locales (± x-default) — ni uno menos
 *   3 · sitemap sólo con hosts de la propiedad sc-domain:zymplo.com
 *   4 · cero cifras fabricadas (R63) en el HTML
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { COUNTRY_SLUGS, getCountry } from '../src/data/countries';

const DIST = join(process.cwd(), 'dist');
const LOCALES = new Set(COUNTRY_SLUGS.map((s) => getCountry(s)!.locale));
const SLUGS = new Set<string>(COUNTRY_SLUGS);
const FORBIDDEN = ['12.847', '12,847']; // social-proof fabricado, purgado por R63 2026-06-09

// Los legales del apex vienen en trío de idiomas (/legal/ es · /en/legal/ en ·
// /pt/legal/ pt-BR) — un set de hreflang distinto al de países, y válido.
const LEGAL_TRIO = new Set(['es', 'en', 'pt-BR']);

// Páginas ALIAS: su canónica DEBE apuntar al destino, no a sí mismas.
const ALIASES: Record<string, string> = {
  'privacy/': 'https://zymplo.com/legal/privacy/',
  'terms/': 'https://zymplo.com/legal/terms/',
  'privacy/delete/': 'https://zymplo.com/legal/delete-account/',
  'legal/delete-request/': 'https://zymplo.com/legal/delete-account/',
};

// /en/legal/ y /pt/legal/ son secciones del APEX (idioma, no país): el prefijo
// pt/ colisiona con el slug de Portugal pero estas páginas viven en zymplo.com.
const APEX_LANG_PREFIXES = ['en/legal/', 'pt/legal/'];

// Deuda declarada (GSC 2026-08-07): experimentos sin canónica ni noindex.
const NO_CANONICAL_OK = new Set(['social/', 'social/c/', 'social/c-radical/']);

const errors: string[] = [];
let pages = 0;
let withHreflang = 0;

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return walk(p);
    return name === 'index.html' ? [p] : [];
  });

if (!existsSync(DIST)) {
  console.error('check-seo: no existe dist/ — correr `astro build` antes.');
  process.exit(1);
}

for (const file of walk(DIST)) {
  const rel = relative(DIST, file); // ej: py/precios/index.html
  const html = readFileSync(file, 'utf8');
  pages++;

  const dirPath = rel === 'index.html' ? '' : rel.slice(0, -'/index.html'.length) + '/';
  const [first, ...restParts] = dirPath.split('/');
  const expected =
    ALIASES[dirPath] ??
    (SLUGS.has(first) && !APEX_LANG_PREFIXES.some((p) => dirPath.startsWith(p))
      ? `https://${first}.zymplo.com/${restParts.join('/')}`
      : `https://zymplo.com/${dirPath}`);

  const noindex = /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html);
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i)?.[1];
  if (!canonical) {
    // Una página noindex no necesita canónica: Google no la va a indexar.
    if (!noindex && !NO_CANONICAL_OK.has(dirPath)) errors.push(`${rel}: SIN canónica`);
  } else if (canonical !== expected) errors.push(`${rel}: canónica ${canonical} ≠ ${expected}`);

  const hreflangs = [...html.matchAll(/<link[^>]*hreflang="([^"]*)"/gi)].map((m) => m[1]);
  if (hreflangs.length > 0) {
    withHreflang++;
    const set = new Set(hreflangs.filter((h) => h !== 'x-default'));
    const isTrio = set.size === LEGAL_TRIO.size && [...set].every((l) => LEGAL_TRIO.has(l));
    const missing = [...LOCALES].filter((l) => !set.has(l));
    const extra = [...set].filter((l) => !LOCALES.has(l));
    if (!isTrio && (missing.length || extra.length))
      errors.push(`${rel}: hreflang faltan [${missing}] sobran [${extra}]`);
  }

  for (const bad of FORBIDDEN)
    if (html.includes(bad)) errors.push(`${rel}: contiene la cifra fabricada "${bad}"`);
}

const sitemapPath = join(DIST, 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  errors.push('dist/sitemap.xml: NO EXISTE');
} else {
  const sm = readFileSync(sitemapPath, 'utf8');
  const locs = [...sm.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
  for (const loc of locs) {
    const host = new URL(loc).hostname;
    if (host !== 'zymplo.com' && !host.endsWith('.zymplo.com'))
      errors.push(`sitemap.xml: host fuera de la propiedad → ${loc}`);
  }
  for (const s of COUNTRY_SLUGS)
    if (!locs.includes(`https://${s}.zymplo.com/`))
      errors.push(`sitemap.xml: falta el home de ${s}.zymplo.com`);
  if (!locs.includes('https://zymplo.com/')) errors.push('sitemap.xml: falta el apex');
}

if (errors.length) {
  console.error(`\n🔴 check-seo: ${errors.length} problema(s) en ${pages} páginas:\n`);
  for (const e of errors.slice(0, 40)) console.error('  · ' + e);
  if (errors.length > 40) console.error(`  … y ${errors.length - 40} más`);
  process.exit(1);
}
console.log(
  `✅ check-seo: ${pages} páginas · canónicas propias OK · ${withHreflang} con hreflang completo (${LOCALES.size} locales) · sitemap OK · sin cifras fabricadas`
);
