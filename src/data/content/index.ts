/**
 * Zymplo · Unified content matrix (Path C · 14 countries)
 *
 * Each country slug maps to a `ContentSchema` instance, built by deep-merging
 * the country's own JSON over `DEFAULT_CONTENT` (Spanish-Paraguay gold ref).
 *
 * Public API:
 *   getContent(slug) -> ContentSchema   // typed, 100% complete (no nulls)
 *
 * Components SHOULD migrate from `getDict(slug)` (loose `Dict`) to
 * `getContent(slug)` (typed `ContentSchema`) to gain editor + build checks.
 *
 * `getDict` continues to work for backwards compat (it is now an alias).
 */
import type { CountrySlug } from '@data/countries';
import type { ContentSchema } from '@data/content-schema';
import { DEFAULT_CONTENT } from './default';

import ptBR from '@i18n/pt-br.json';
import esMX from '@i18n/es-mx.json';
import enUS from '@i18n/en-us.json';
import esCO from '@i18n/es-co.json';
import esES from '@i18n/es-es.json';
import esAR from '@i18n/es-ar.json';
import esPY from '@i18n/es-py.json';
import esPE from '@i18n/es-pe.json';
import esEC from '@i18n/es-ec.json';
import esCL from '@i18n/es-cl.json';
import esUY from '@i18n/es-uy.json';
import esBO from '@i18n/es-bo.json';
import esCR from '@i18n/es-cr.json';

const RAW: Record<CountrySlug, unknown> = {
  br: ptBR, mx: esMX, us: enUS, co: esCO, es: esES, ar: esAR, py: esPY,
  pe: esPE, ec: esEC, cl: esCL, uy: esUY, bo: esBO, cr: esCR,
};

/**
 * Deep-merge `override` over `base`. Arrays from `override` REPLACE arrays
 * from `base` (we don't try to align array indexes — country variation is
 * the whole point: 5 personas BR vs 5 personas PY are different humans).
 *
 * Plain objects merge recursively. Primitives from `override` win. Missing
 * keys in `override` fall back to `base`.
 */
function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (Array.isArray(override)) return override as unknown as T;
  if (typeof override !== 'object') return override as unknown as T;
  if (Array.isArray(base) || typeof base !== 'object' || base === null) {
    return override as unknown as T;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override as Record<string, unknown>)) {
    const baseVal = (base as Record<string, unknown>)[key];
    const overVal = (override as Record<string, unknown>)[key];
    out[key] = deepMerge(baseVal, overVal);
  }
  return out as unknown as T;
}

/**
 * Build the content matrix once at module load. Each entry is a fully
 * resolved `ContentSchema` (no missing keys, no nulls — guaranteed by
 * deep-merge over DEFAULT_CONTENT).
 */
const MATRIX: Record<CountrySlug, ContentSchema> = (() => {
  const slugs = Object.keys(RAW) as CountrySlug[];
  const out = {} as Record<CountrySlug, ContentSchema>;
  for (const slug of slugs) {
    out[slug] = deepMerge(DEFAULT_CONTENT, RAW[slug]);
  }
  return out;
})();

/** Get the typed content for a country slug. Always returns a complete
 *  `ContentSchema` (deep-merged with the default baseline). */
export function getContent(slug: CountrySlug): ContentSchema {
  return MATRIX[slug] ?? DEFAULT_CONTENT;
}

export { DEFAULT_CONTENT };
