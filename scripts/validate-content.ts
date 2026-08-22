#!/usr/bin/env -S npx tsx
/**
 * Zymplo · Content validator (Path C · 14 countries)
 *
 * Asserts every country locale has every required key filled (no nulls,
 * no empty strings, no empty arrays). Exits non-zero on first error so
 * CI fails the build.
 *
 * Usage:
 *   npx tsx scripts/validate-content.ts          # default: all 14 locales
 *   npx tsx scripts/validate-content.ts --strict # also flag deprecated R102 b2b/contiq keys
 *   npx tsx scripts/validate-content.ts --diff   # diff every locale vs es-py (gold ref)
 *
 * R23: never prompt — just run, report, exit.
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ---------------------------------------------------------------------
// Country slugs (kept in sync with src/data/countries.ts)
// ---------------------------------------------------------------------
const SLUGS = [
  'br', 'mx', 'us', 'co', 'es', 'ar', 'py',
  'pe', 'ec', 'cl', 'uy', 'bo', 'cr', 'pt',
] as const;

const LOCALE_FILES: Record<string, string> = {
  br: 'pt-br.json',
  mx: 'es-mx.json',
  us: 'en-us.json',
  co: 'es-co.json',
  es: 'es-es.json',
  ar: 'es-ar.json',
  py: 'es-py.json',
  pe: 'es-pe.json',
  ec: 'es-ec.json',
  cl: 'es-cl.json',
  uy: 'es-uy.json',
  bo: 'es-bo.json',
  cr: 'es-cr.json',
  pt: 'pt-pt.json',
};

// ---------------------------------------------------------------------
// Required keys (must stay in sync with src/data/content-schema.ts)
// ---------------------------------------------------------------------
const REQUIRED_KEYS = [
  'nav.product', 'nav.pricing', 'nav.login', 'nav.cta',
  'hero.eyebrow', 'hero.headline_a', 'hero.subline', 'hero.cta_microcopy',
  'hero.rotate', 'hero.stats', 'hero.live_activity',
  'hero.comparison.headers', 'hero.comparison.rows',
  'chat.title', 'chat.messages', 'chat.persona_intro',
  'features.title', 'features.items',
  'tools.title', 'tools.labels',
  'pricing.title', 'pricing.free_label', 'pricing.starter_label',
  'pricing.pro_label', 'pricing.gold_label',
  'pricing.features_free', 'pricing.features_starter',
  'pricing.features_pro', 'pricing.features_gold',
  'faq.title', 'faq.items',
  'payments_label',
  'chat_widget.greeting', 'chat_widget.quick',
  'my_account.title', 'my_account.open_cta',
  'qr_connect.title', 'qr_connect.subtitle',
  'trust_bar.items',
  'geo_testimonials.items',
  'video_testimonials.items',
  'exit_intent.title', 'exit_intent.cta',
  'microbiz_score.title', 'microbiz_score.calculate',
  'voice_lang.tooltip',
  'footer.tagline', 'footer.rights', 'footer.testimonial_quotes',
];

// R102 NO-CONTIQ-FOREVER · these keys MUST NOT appear in any locale JSON.
// They were scrubbed by `scripts/scrub-r102-contiq.ts` on 2026-05-07.
// In `--strict` mode the validator fails the build if any reappear.
const DEPRECATED_KEYS = [
  'pricing.b2b_label',
  'pricing.b2b_desc',
  'footer.link_contiq',
];

// R102 NO-CONTIQ-FOREVER · forbidden substrings in any string value.
// These prevent regressions in copy (e.g., a future PR adding "Conhecer Contiq" back).
const FORBIDDEN_SUBSTRINGS = [
  'contiq',
  'CONTIQ',
  'Contiq',
];

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
function getPath(obj: unknown, path: string): unknown {
  let cur: unknown = obj;
  for (const part of path.split('.')) {
    if (cur && typeof cur === 'object' && part in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return cur;
}

function isEmpty(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  if (typeof v === 'string' && v.trim() === '') return true;
  if (Array.isArray(v) && v.length === 0) return true;
  if (typeof v === 'object' && Object.keys(v as Record<string, unknown>).length === 0) return true;
  return false;
}

function loadLocale(slug: string): unknown {
  const file = resolve(ROOT, 'src', 'i18n', LOCALE_FILES[slug]);
  return JSON.parse(readFileSync(file, 'utf-8'));
}

// ---------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------
const args = process.argv.slice(2);
const STRICT = args.includes('--strict');
const DIFF = args.includes('--diff');

let totalErrors = 0;
let totalWarnings = 0;
const goldRef = loadLocale('py');

// ---------------------------------------------------------------------
// 🔴 EL CANDADO DE LOS PAÍSES HUÉRFANOS
// ---------------------------------------------------------------------
//
// EL DEFECTO QUE CIERRA · medido 2026-08-22 02:48 -03:
// `pt.zymplo.com` declaraba `lang="pt-PT"` y servía «Vos trabajás. Zymplo
// cobra.» — español rioplatense. El archivo `pt-pt.json` existía con sus 197
// claves traducidas; simplemente NUNCA se importó en `src/data/content/index.ts`,
// así que `MATRIX['pt']` era `undefined` y caía al `?? DEFAULT_CONTENT`, que es
// el español de Paraguay. Indexado con 435 referencias `hreflang="pt-PT"`.
//
// La causa NO fue el descuido: fue que la lista de países vive DUPLICADA en tres
// lugares (`src/data/countries.ts`, el mapa `RAW` de `content/index.ts`, y el
// `SLUGS` de acá) y nada comprobaba que coincidieran. El encabezado de este
// mismo archivo decía «14 countries» mientras su lista tenía 13.
//
// `Record<CountrySlug, unknown>` habría cazado la falta en compilación — pero
// este repo no tiene `typecheck` en `package.json` ni `@astrojs/check`
// instalado, así que ese tipo NUNCA se compila. Un candado que nadie ejecuta es
// una intención, no un candado. Por eso éste corre acá, en tiempo de ejecución,
// dentro de algo que ya se corre.
{
  const src = readFileSync(resolve(ROOT, 'src/data/countries.ts'), 'utf8');
  const tipo = src.match(/export type CountrySlug\s*=\s*([^;]+);/);
  const declarados = tipo
    ? Array.from(tipo[1].matchAll(/'([a-z]{2})'/g)).map((m) => m[1])
    : [];
  const contenido = readFileSync(resolve(ROOT, 'src/data/content/index.ts'), 'utf8');
  const raw = contenido.match(/const RAW: Record<CountrySlug, unknown> = \{([\s\S]*?)\};/);
  const mapeados = raw
    ? Array.from(raw[1].matchAll(/(?:^|[\s,])([a-z]{2}):/g)).map((m) => m[1])
    : [];

  const faltanEnRaw = declarados.filter((s) => !mapeados.includes(s));
  const faltanAca = declarados.filter((s) => !(SLUGS as readonly string[]).includes(s));
  const sobranAca = (SLUGS as readonly string[]).filter((s) => !declarados.includes(s));

  if (declarados.length === 0 || mapeados.length === 0) {
    console.error(
      'ERROR · el candado de países no pudo leer las listas · ' +
        'si cambió la forma de countries.ts o de content/index.ts, arreglá el candado, ' +
        'no lo borres — sin él un país nuevo vuelve a salir en español',
    );
    totalErrors += 1;
  }
  for (const s of faltanEnRaw) {
    console.error(
      'ERROR · el país "' + s + '" existe en countries.ts pero NO está en el mapa RAW de ' +
        'src/data/content/index.ts → su sitio se sirve en ESPAÑOL (DEFAULT_CONTENT), ' +
        'aunque su archivo de idioma exista. Es el defecto exacto de pt el 2026-08-22.',
    );
    totalErrors += 1;
  }
  for (const s of faltanAca) {
    console.error('ERROR · el país "' + s + '" no está en SLUGS de este validador: no se valida nada suyo');
    totalErrors += 1;
  }
  for (const s of sobranAca) {
    console.error('ERROR · este validador lista "' + s + '", que ya no existe en countries.ts');
    totalErrors += 1;
  }
  if (totalErrors === 0) {
    console.log('Países: ' + declarados.length + ' declarados · ' + mapeados.length + ' con contenido propio · listas alineadas.');
  }
}


console.log('Zymplo content validator · ' + SLUGS.length + ' locales · ' + REQUIRED_KEYS.length + ' required keys');
console.log('-'.repeat(72));

for (const slug of SLUGS) {
  const data = loadLocale(slug);
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Required keys must exist and be non-empty
  for (const key of REQUIRED_KEYS) {
    const v = getPath(data, key);
    if (isEmpty(v)) {
      errors.push('  MISSING: ' + key);
    }
  }

  // 2. Deprecated R102 keys (warn always, error in --strict)
  for (const key of DEPRECATED_KEYS) {
    const v = getPath(data, key);
    if (v !== undefined) {
      const msg = '  DEPRECATED (R102 NO-CONTIQ-FOREVER): ' + key;
      if (STRICT) errors.push(msg); else warnings.push(msg);
    }
  }

  // 3. Forbidden substrings in any string value (R102 regression guard)
  const seen = new Set<string>();
  function scan(node: unknown, pathTrail: string): void {
    if (typeof node === 'string') {
      for (const bad of FORBIDDEN_SUBSTRINGS) {
        if (node.includes(bad) && !seen.has(pathTrail + ':' + bad)) {
          seen.add(pathTrail + ':' + bad);
          errors.push('  FORBIDDEN (R102): "' + bad + '" found in ' + pathTrail);
          break;
        }
      }
    } else if (Array.isArray(node)) {
      node.forEach((item, i) => scan(item, pathTrail + '[' + i + ']'));
    } else if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        scan(v, pathTrail ? pathTrail + '.' + k : k);
      }
    }
  }
  scan(data, '');

  // 4. Diff vs gold ref (top-level keys only — sub-tree drift is OK
  //    per Carlos: country-specific overrides are the whole point)
  if (DIFF) {
    const goldKeys = new Set(Object.keys(goldRef as Record<string, unknown>));
    const localKeys = new Set(Object.keys(data as Record<string, unknown>));
    for (const k of goldKeys) {
      if (!localKeys.has(k)) warnings.push('  DIFF vs es-py: missing top-level "' + k + '"');
    }
    for (const k of localKeys) {
      if (!goldKeys.has(k)) warnings.push('  DIFF vs es-py: extra top-level "' + k + '"');
    }
  }

  const flag = errors.length === 0 ? 'OK' : 'FAIL';
  console.log(slug + ' · ' + LOCALE_FILES[slug] + ' · ' + flag +
    ' (' + errors.length + ' errors, ' + warnings.length + ' warnings)');
  for (const e of errors) console.log(e);
  for (const w of warnings) console.log(w);

  totalErrors += errors.length;
  totalWarnings += warnings.length;
}

console.log('-'.repeat(72));
console.log('Total: ' + totalErrors + ' errors, ' + totalWarnings + ' warnings');

if (totalErrors > 0) {
  console.error('Validation FAILED.');
  process.exit(1);
}
console.log('Validation passed.');
process.exit(0);
