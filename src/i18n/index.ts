/**
 * Zymplo · i18n loader (legacy alias).
 *
 * This module is kept for backwards compatibility. New code SHOULD import
 * from `@data/content` instead:
 *
 *   import { getContent } from '@data/content';
 *   import type { ContentSchema } from '@data/content-schema';
 *
 * Behaviour is unchanged: every locale comes back fully populated thanks
 * to the deep-merge over `DEFAULT_CONTENT` performed in `@data/content`.
 */
import type { CountrySlug } from '@data/countries';
import type { ContentSchema } from '@data/content-schema';
import { getContent } from '@data/content';

/** @deprecated Use `ContentSchema` from `@data/content-schema`. */
export type Dict = ContentSchema;

/** @deprecated Use `getContent(slug)` from `@data/content`. Identical
 *  behaviour, but typed against the unified schema. */
export const getDict = (slug: CountrySlug): Dict => getContent(slug);
