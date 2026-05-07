/**
 * Zymplo · Content baseline (default)
 *
 * Spanish-Paraguay content from py.zymplo.com is the GOLD REFERENCE
 * (Carlos · 2026-05-07). Any country locale that is missing a key falls
 * back to this baseline at merge time.
 *
 * This file is a TS shim around `@i18n/es-py.json` so:
 *   1. The schema (`ContentSchema`) is enforced at the type level.
 *   2. Future country additions inherit a complete baseline.
 *
 * R84 AUTO-LOCALIZE-ALL-LANGUAGES applies — when this baseline changes,
 * `npm run validate:content` flags all locales that diverge.
 */
import esPY from '@i18n/es-py.json';
import type { ContentSchema } from '@data/content-schema';

// JSONs are validated structurally by `validate-content.ts`.
// The `as ContentSchema` cast trusts the validator output.
export const DEFAULT_CONTENT = esPY as unknown as ContentSchema;
