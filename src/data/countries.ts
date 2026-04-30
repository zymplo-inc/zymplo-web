/**
 * Zymplo · Single Source of Truth — 7 países
 * Edit ONLY here. UI consumes via `getCountry(slug)`.
 */
export type CountrySlug = 'br' | 'mx' | 'us' | 'co' | 'es' | 'ar' | 'py';

export interface Country {
  slug: CountrySlug;
  flag: string;
  name: string;
  locale: string;
  currency: { code: string; symbol: string; format: (n: number) => string };
  influencer: { name: string; tagline: string; status?: 'tbd' };
  personas: { name: string; role: string }[];
  compliance: string[];
  payments: string[];
  slang: string[];
  cta: { primary: string; secondary: string };
  pricing: { free: string; starter: string; pro: string; gold: string; b2b?: string };
  videoSrc: string; // hero loop, country-specific
}

const fmt = (locale: string, code: string) => (n: number) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency: code, maximumFractionDigits: 0 }).format(n);

export const COUNTRIES: Record<CountrySlug, Country> = {
  br: {
    slug: 'br', flag: '🇧🇷', name: 'Brasil', locale: 'pt-BR',
    currency: { code: 'BRL', symbol: 'R$', format: fmt('pt-BR', 'BRL') },
    influencer: { name: 'Roni', tagline: 'Sua secretária IA no WhatsApp' },
    personas: [
      { name: 'Diego', role: 'eletricista' },
      { name: 'Luana', role: 'cabeleireira' },
      { name: 'Raimundo', role: 'pedreiro' },
    ],
    compliance: ['NFS-e MEI', 'DAS', 'LGPD'],
    payments: ['Pix', 'Boleto', 'Cartão'],
    slang: ['véi', 'oxe', 'uai', 'tchê'],
    cta: { primary: 'Bora começar 💪', secondary: 'Ver demo 90s ▶' },
    pricing: { free: 'Grátis', starter: 'R$ 19', pro: 'R$ 39', gold: 'R$ 79', b2b: 'R$ 149' },
    videoSrc: '/videos/hero/br.mp4',
  },
  mx: {
    slug: 'mx', flag: '🇲🇽', name: 'México', locale: 'es-MX',
    currency: { code: 'MXN', symbol: '$', format: fmt('es-MX', 'MXN') },
    influencer: { name: 'Memo', tagline: 'Tu secretaria IA en WhatsApp' },
    personas: [
      { name: 'Mario', role: 'electricista' },
      { name: 'Sofía', role: 'estilista' },
      { name: 'Pedro', role: 'plomero' },
    ],
    compliance: ['CFDI 4.0', 'SAT', 'RESICO', 'LFPDPPP'],
    payments: ['SPEI', 'CoDi', 'OXXO'],
    slang: ['chido', 'güey', 'órale', 'neta'],
    cta: { primary: 'Vamos a empezar 💪', secondary: 'Ver demo 90s ▶' },
    pricing: { free: 'Gratis', starter: '$99 MXN', pro: '$199 MXN', gold: '$399 MXN' },
    videoSrc: '/videos/hero/mx.mp4',
  },
  us: {
    slug: 'us', flag: '🇺🇸', name: 'United States', locale: 'en-US',
    currency: { code: 'USD', symbol: '$', format: fmt('en-US', 'USD') },
    influencer: { name: 'King', tagline: 'Your AI secretary on WhatsApp' },
    personas: [
      { name: 'Mike', role: 'electrician' },
      { name: 'Maria', role: 'hairstylist' },
      { name: 'Jose', role: 'plumber' },
    ],
    compliance: ['IRS 1099', '50-state tax', 'CCPA'],
    payments: ['ACH', 'Zelle', 'Stripe'],
    slang: ["y'all", 'gonna', 'totally'],
    cta: { primary: "Let's go 💪", secondary: 'Watch demo 90s ▶' },
    pricing: { free: 'Free', starter: '$5 USD', pro: '$10 USD', gold: '$20 USD' },
    videoSrc: '/videos/hero/us.mp4',
  },
  co: {
    slug: 'co', flag: '🇨🇴', name: 'Colombia', locale: 'es-CO',
    currency: { code: 'COP', symbol: '$', format: fmt('es-CO', 'COP') },
    influencer: { name: 'Falca', tagline: 'Tu secretaria IA en WhatsApp' },
    personas: [
      { name: 'Carlos', role: 'electricista' },
      { name: 'Andrea', role: 'estilista' },
      { name: 'Ricardo', role: 'plomero' },
    ],
    compliance: ['DIAN', 'RUT', 'Habeas Data'],
    payments: ['PSE', 'Wompi', 'Nequi'],
    slang: ['bacano', 'parce', 'rumba'],
    cta: { primary: 'Dale parce 💪', secondary: 'Ver demo 90s ▶' },
    pricing: { free: 'Gratis', starter: '$19.000 COP', pro: '$39.000 COP', gold: '$79.000 COP' },
    videoSrc: '/videos/hero/co.mp4',
  },
  es: {
    slug: 'es', flag: '🇪🇸', name: 'España', locale: 'es-ES',
    currency: { code: 'EUR', symbol: '€', format: fmt('es-ES', 'EUR') },
    influencer: { name: 'Andre', tagline: 'Tu secretaria IA en WhatsApp' },
    personas: [
      { name: 'Antonio', role: 'electricista' },
      { name: 'Carmen', role: 'peluquera' },
      { name: 'Pablo', role: 'fontanero' },
    ],
    compliance: ['AEAT', 'SII', 'RETA', 'GDPR'],
    payments: ['SEPA', 'Bizum'],
    slang: ['tío', 'vale', 'majo', 'guay'],
    cta: { primary: 'A por ello 💪', secondary: 'Ver demo 90s ▶' },
    pricing: { free: 'Gratis', starter: '€4', pro: '€9', gold: '€19' },
    videoSrc: '/videos/hero/es.mp4',
  },
  ar: {
    slug: 'ar', flag: '🇦🇷', name: 'Argentina', locale: 'es-AR',
    currency: { code: 'ARS', symbol: '$', format: fmt('es-AR', 'ARS') },
    influencer: { name: 'Lío', tagline: 'Tu secretaria IA en WhatsApp' },
    personas: [
      { name: 'Juan', role: 'electricista' },
      { name: 'Lucía', role: 'peluquera' },
      { name: 'Diego', role: 'plomero' },
    ],
    compliance: ['AFIP', 'CAE', 'Monotributo', 'Ley 25.326'],
    payments: ['MercadoPago', 'Transferencia'],
    slang: ['che', 'boludo', 'viste', 're'],
    cta: { primary: 'Dale che 💪', secondary: 'Ver demo 90s ▶' },
    pricing: { free: 'Gratis', starter: '$4.000 ARS', pro: '$9.000 ARS', gold: '$19.000 ARS' },
    videoSrc: '/videos/hero/ar.mp4',
  },
  py: {
    slug: 'py', flag: '🇵🇾', name: 'Paraguay', locale: 'es-PY',
    currency: { code: 'PYG', symbol: '₲', format: fmt('es-PY', 'PYG') },
    influencer: { name: 'Roque', tagline: 'Tu secretaria IA en WhatsApp' },
    personas: [
      { name: 'José', role: 'electricista' },
      { name: 'Carmen', role: 'peluquera' },
      { name: 'Luis', role: 'plomero' },
    ],
    compliance: ['DGT', 'IRACIS', 'IVA', 'Ley 6534/20'],
    payments: ['Tigo Money', 'Personal Pay'],
    slang: ['che mau', 'estamos arreglando', 'pio'],
    cta: { primary: 'Dale che mau 💪', secondary: 'Ver demo 90s ▶' },
    pricing: { free: 'Gratis', starter: '₲ 35.000', pro: '₲ 75.000', gold: '₲ 149.000' },
    videoSrc: '/videos/hero/py.mp4',
  },
};

export const COUNTRY_SLUGS = Object.keys(COUNTRIES) as CountrySlug[];
export const getCountry = (slug: string): Country | null =>
  (COUNTRIES as Record<string, Country>)[slug] ?? null;

export const EU_SLUGS: CountrySlug[] = ['es'];
