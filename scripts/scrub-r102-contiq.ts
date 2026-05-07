#!/usr/bin/env -S npx tsx
/**
 * Zymplo · R102 NO-CONTIQ-FOREVER scrubber
 *
 * Removes the deprecated `pricing.b2b_label`, `pricing.b2b_desc`, and
 * `footer.link_contiq` keys from every locale JSON. Idempotent.
 *
 * Usage:  npx tsx scripts/scrub-r102-contiq.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const I18N_DIR = resolve(__dirname, '..', 'src', 'i18n');

const FILES = [
  'pt-br.json', 'es-mx.json', 'en-us.json', 'es-co.json', 'es-es.json',
  'es-ar.json', 'es-py.json', 'es-pe.json', 'es-ec.json', 'es-cl.json',
  'es-uy.json', 'es-bo.json', 'es-cr.json',
];

// Localized neutral replacements for `pricing.cta_secondary` (was "Learn about Contiq")
const NEUTRAL_CTA: Record<string, string> = {
  'pt-br.json': 'Saiba mais',
  'es-mx.json': 'Conocer más',
  'en-us.json': 'Learn more',
  'es-co.json': 'Conocer más',
  'es-es.json': 'Saber más',
  'es-ar.json': 'Conocer más',
  'es-py.json': 'Conocer más',
  'es-pe.json': 'Conocer más',
  'es-ec.json': 'Conocer más',
  'es-cl.json': 'Conocer más',
  'es-uy.json': 'Conocer más',
  'es-bo.json': 'Conocer más',
  'es-cr.json': 'Conocer más',
};

let totalRemoved = 0;
let totalRewritten = 0;
for (const file of FILES) {
  const path = resolve(I18N_DIR, file);
  const data = JSON.parse(readFileSync(path, 'utf-8'));
  let removed = 0;
  let rewritten = 0;

  // 1. Delete deprecated keys (b2b_label, b2b_desc, link_contiq)
  if (data.pricing?.b2b_label !== undefined) { delete data.pricing.b2b_label; removed++; }
  if (data.pricing?.b2b_desc !== undefined)  { delete data.pricing.b2b_desc;  removed++; }
  if (data.footer?.link_contiq !== undefined){ delete data.footer.link_contiq; removed++; }

  // 2. Rewrite values that mention "Contiq" (string scrub)
  if (typeof data.pricing?.cta_secondary === 'string' &&
      /contiq/i.test(data.pricing.cta_secondary)) {
    data.pricing.cta_secondary = NEUTRAL_CTA[file] ?? 'Learn more';
    rewritten++;
  }

  if (removed > 0 || rewritten > 0) {
    writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
  }
  console.log(file + ' · removed ' + removed + ' keys · rewrote ' + rewritten + ' values');
  totalRemoved += removed;
  totalRewritten += rewritten;
}
console.log('-'.repeat(48));
console.log('Total: removed ' + totalRemoved + ' keys, rewrote ' + totalRewritten +
  ' values across ' + FILES.length + ' files');
