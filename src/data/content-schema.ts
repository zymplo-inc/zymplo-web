/**
 * Zymplo · Unified Content Schema (Path C · 14 countries)
 *
 * Single TypeScript contract for the marketing copy of every country landing.
 * The 14 JSONs in `src/i18n/*.json` MUST conform to `ContentSchema`.
 *
 * Rules (CLAUDE.md):
 * - R29 Plans LOCKED · 4 plans (free, starter, pro, gold). NO Plan B.
 * - R42 Brand identity mandatory · turquesa #14B8A6, Manrope/Sora.
 * - R76 Zero vendor leak · NEVER mention internal vendors.
 * - R84 Auto-localize · changes propagate to all 14 locales atomically.
 * - R86 Country-aware · currency, documents, regime per country.
 * - R93 Warm copy · "Gente como vos/tú/você" / "People like you".
 * - R102 No-CONTIQ · plan B references kept ONLY when locale already has them
 *        (legacy field) but page MUST NOT render it (component-side check).
 * - R103 Multi-país completo · all 14 countries must validate.
 *
 * Gold reference: py.zymplo.com (es-py.json) — Spanish-Paraguay landing live.
 */

// =====================================================================
// SHARED PRIMITIVES
// =====================================================================

export interface ComparisonRow {
  feature: string;
  values: boolean[]; // aligned with `headers`
}

export interface HeroComparison {
  eyebrow: string;
  headers: string[];
  rows: ComparisonRow[];
  disclaimer: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

export interface FeatureItem {
  icon: string; // emoji
  title: string;
  desc: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface QuickReplyItem {
  icon: string;
  text: string;
  intent: string;
}

export interface TrustBarItem {
  icon: string;
  text: string;
}

export interface GeoTestimonialItem {
  city: string;
  state: string;
  count: number;
  metric: string;
  emoji: string;
}

export interface VideoTestimonialItem {
  name: string;
  role: string;
  city: string;
  quote: string;
  metric: string;
  emoji: string;
  gradient: string; // tailwind gradient classes
}

export interface FooterTestimonialQuote {
  initials: string;
  name_short: string;
  role: string;
  quote: string;
  metric: string;
  color: string; // hex
}

// =====================================================================
// SECTIONS
// =====================================================================

export interface NavSection {
  product: string;
  pricing: string;
  integrations: string;
  solutions: string;
  resources: string;
  login: string;
  cta: string;
  theme_toggle: string;
}

export interface HeroSection {
  eyebrow: string;
  headline_a: string;
  headline_b: string;
  headline_c: string;
  rotate: string[];
  subline: string;
  subline_premium: string;
  subline_bold: string;
  trust: string;
  persona_badge: string;
  subheadline_ai: string;
  cta_microcopy: string;
  stats: HeroStat[];
  live_activity: string[];
  live_counter_label: string;
  joined_today_label: string;
  founding_label: string;
  founding_perk: string;
  referral_banner: string;
  share_label: string;
  challenge_label: string;
  challenge_prize: string;
  watch_demo: string;
  scan_label: string;
  scan_on_phone: string;
  vs_label: string;
  comparison: HeroComparison;
}

export interface ChatSection {
  title: string;
  online: string;
  demo_label: string;
  persona_intro: string; // "{name}, {role}, conversa con Zymplo..."
  placeholder: string;
  messages: ChatMessage[];
}

export interface FeaturesSection {
  title: string;
  items: FeatureItem[];
}

export interface ToolsSection {
  eyebrow: string;
  title: string;
  subtitle: string;
  labels: string[];
}

/**
 * R29 LOCKED · 4 plans (free, starter, pro, gold). `b2b_*` fields are
 * legacy and MUST NOT be rendered (R102 NO-CONTIQ-FOREVER). Validator
 * tolerates their presence but the page MUST not consume them.
 */
export interface PricingSection {
  title: string;
  subtitle: string;
  eyebrow: string;
  free_label: string;
  starter_label: string;
  pro_label: string;
  gold_label: string;
  month: string;
  popular: string;
  cta_secondary: string;
  features_free: string[];
  features_starter: string[];
  features_pro: string[];
  features_gold: string[];
  // R102 NO-CONTIQ-FOREVER · `b2b_label` / `b2b_desc` removed (Path C migration 2026-05-07)
  headline_feature: string;
  headline_caption: string;
  from_label: string;
}

export interface FaqSection {
  eyebrow: string;
  title: string;
  items: FaqItem[];
}

export interface ChatWidgetSection {
  title: string;
  persona: string;
  greeting: string;
  tagline: string;
  ask_placeholder: string;
  quick: QuickReplyItem[];
}

export interface MyAccountSection {
  label: string;
  title: string;
  subtitle: string;
  scan_label: string;
  or_label: string;
  open_cta: string;
  help: string;
}

export interface QrConnectSection {
  eyebrow: string;
  title: string;
  subtitle: string;
  wa_label: string;
  wa_sub: string;
  app_label: string;
  app_sub: string;
  app_eyebrow: string;
  app_title: string;
  app_intro: string;
  open_cta: string;
  soon_label: string;
  notify_label: string;
  notify_help: string;
}

export interface TrustBarSection {
  items: TrustBarItem[];
}

export interface GeoTestimonialsSection {
  eyebrow: string;
  title: string;
  items: GeoTestimonialItem[];
}

export interface VideoTestimonialsSection {
  eyebrow: string;
  title: string;
  subtitle: string;
  watch_label: string;
  see_more: string;
  items: VideoTestimonialItem[];
}

export interface ExitIntentSection {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  dismiss: string;
  perks: string[];
}

export interface MicrobizScoreSection {
  eyebrow: string;
  title: string;
  subtitle: string;
  label_billing: string;
  label_clients: string;
  label_hours: string;
  place_billing: string;
  place_clients: string;
  place_hours: string;
  calculate: string;
  your_score: string;
  recap: string;
  fit_low: string;
  fit_mid: string;
  fit_high: string;
  cta: string;
}

export interface VoiceLangSection {
  tooltip: string;
  listening: string;
  detected: string;
  no_match: string;
  unsupported: string;
}

export interface FooterSection {
  tagline: string;
  rights: string;
  made_in: string;
  brand_legal: string;
  use_terms: string;
  universal_terms: string;
  payments_supported: string;
  soon_label: string;
  apps_subtitle: string;
  section_product: string;
  section_company: string;
  section_support: string;
  section_compliance: string;
  section_countries: string;
  section_apps: string;
  link_home: string;
  link_features: string;
  link_pricing: string;
  link_onboarding: string;
  // R102 NO-CONTIQ-FOREVER · `link_contiq` removed (Path C migration 2026-05-07)
  link_about: string;
  link_careers: string;
  link_press: string;
  link_blog: string;
  link_help: string;
  link_contact: string;
  link_status: string;
  link_security: string;
  legal_terms: string;
  legal_privacy: string;
  legal_cookies: string;
  legal_lgpd: string;
  legal_sitemap: string;
  testimonial_eyebrow: string;
  testimonial_quotes: FooterTestimonialQuote[];
}

// =====================================================================
// VARIANT-G v4.7 MOTION MERGE (2026-05-08)
// 3 new sections: HowItWorks 3-steps · SinCon · ROI calculator
// =====================================================================

export interface HowItWorksStep {
  n: string; // "1" "2" "✓"
  title: string;
  desc: string;
  highlight?: boolean;
}

export interface HowItWorksSection {
  eyebrow: string;
  title: string;
  subtitle: string;
  steps: HowItWorksStep[];
  footnote: string;
}

export interface SinConSection {
  title: string;
  subtitle: string;
  sin_label: string;
  con_label: string;
  sin_items: string[];
  con_items: string[];
}

export interface RoiSection {
  eyebrow: string;
  title_a: string;
  title_b: string;
  subtitle: string;
  label_clients: string;
  label_price: string;
  label_hours: string;
  saved_eyebrow: string;
  saved_detail: string;
  row_time: string;
  row_recovered: string;
  row_cost: string;
  row_roi: string;
  cta: string;
  hours_suffix: string;
}

// =====================================================================
// TOP-LEVEL CONTENT SCHEMA
// =====================================================================

export interface ContentSchema {
  nav: NavSection;
  hero: HeroSection;
  chat: ChatSection;
  features: FeaturesSection;
  tools: ToolsSection;
  pricing: PricingSection;
  faq: FaqSection;
  payments_label: string; // top-level small label
  chat_widget: ChatWidgetSection;
  my_account: MyAccountSection;
  qr_connect: QrConnectSection;
  trust_bar: TrustBarSection;
  geo_testimonials: GeoTestimonialsSection;
  video_testimonials: VideoTestimonialsSection;
  exit_intent: ExitIntentSection;
  microbiz_score: MicrobizScoreSection;
  voice_lang: VoiceLangSection;
  footer: FooterSection;
  // Variant G v4.7 merge (2026-05-08) · all locales populated by R84 auto-localize.
  how_it_works: HowItWorksSection;
  sin_con: SinConSection;
  roi: RoiSection;
}

/**
 * Required key paths for the validator.
 * "section.field" or "section.subfield.x" using dot notation.
 * Used by `scripts/validate-content.ts`.
 */
export const REQUIRED_KEYS = [
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
  // Variant G v4.7 merge
  'how_it_works.title', 'how_it_works.steps',
  'sin_con.title', 'sin_con.sin_items', 'sin_con.con_items',
  'roi.title_a', 'roi.label_clients', 'roi.cta',
] as const;

export type RequiredKey = (typeof REQUIRED_KEYS)[number];
