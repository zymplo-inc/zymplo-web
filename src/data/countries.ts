/**
 * Zymplo · Single Source of Truth — 14 países (Tier 1 + Tier 2 + Portugal)
 * Edit ONLY here. UI consumes via `getCountry(slug)`.
 */
export type CountrySlug = 'br' | 'mx' | 'us' | 'co' | 'es' | 'ar' | 'py' | 'pe' | 'ec' | 'cl' | 'uy' | 'bo' | 'cr' | 'pt';

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
    pricing: { free: 'Grátis', starter: 'R$ 19,90', pro: 'R$ 29,90', gold: 'R$ 69,90' },
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
    pricing: { free: 'Gratis', starter: '$69 MXN', pro: '$99 MXN', gold: '$239 MXN' },
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
    pricing: { free: 'Free', starter: '$3.99', pro: '$5.99', gold: '$13.99' },
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
    pricing: { free: 'Gratis', starter: '$14.900 COP', pro: '$22.900 COP', gold: '$54.900 COP' },
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
    pricing: { free: 'Gratis', starter: '€3,49', pro: '€4,99', gold: '€12,49' },
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
    cta: { primary: 'Dale que 💪', secondary: 'Ver demo 90s ▶' },
    pricing: { free: 'Gratis', starter: '$4.490 ARS', pro: '$6.890 ARS', gold: '$17.490 ARS' },
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
    slang: ['metele', 'dale que', 'estamos arreglando', 'pio'],
    cta: { primary: 'Metele 💪', secondary: 'Ver demo 90s ▶' },
    pricing: { free: 'Gratis', starter: '₲ 29.000', pro: '₲ 43.500', gold: '₲ 102.000' },
  },
  pe: {
    slug: 'pe', flag: '🇵🇪', name: 'Perú', locale: 'es-PE',
    currency: { code: 'PEN', symbol: 'S/', format: fmt('es-PE', 'PEN') },
    influencer: { name: 'Paolo', tagline: 'Tu secretaria IA en WhatsApp' },
    personas: [
      { name: 'Luis', role: 'electricista' },
      { name: 'Rosa', role: 'estilista' },
      { name: 'Carlos', role: 'gasfitero' },
    ],
    compliance: ['SUNAT', 'RUC', 'IGV', 'Ley 29733'],
    payments: ['Yape', 'Plin', 'BIM'],
    slang: ['causa', 'pata', 'chévere', 'jato'],
    cta: { primary: 'Vamos causa 💪', secondary: 'Ver demo 90s ▶' },
    pricing: { free: 'Gratis', starter: 'S/ 12,90', pro: 'S/ 19,90', gold: 'S/ 49,90' },
  },
  ec: {
    slug: 'ec', flag: '🇪🇨', name: 'Ecuador', locale: 'es-EC',
    currency: { code: 'USD', symbol: '$', format: fmt('es-EC', 'USD') },
    influencer: { name: 'Enner', tagline: 'Tu secretaria IA en WhatsApp' },
    personas: [
      { name: 'José', role: 'electricista' },
      { name: 'María', role: 'estilista' },
      { name: 'Carlos', role: 'plomero' },
    ],
    compliance: ['SRI', 'RUC', 'IVA', 'RIMPE Emprendedor', 'LOPDP'],
    payments: ['DeUna!', 'Pichincha', 'BIM'],
    slang: ['chévere', 'bacán', 'pana', 'simón'],
    cta: { primary: 'Dale pana 💪', secondary: 'Ver demo 90s ▶' },
    pricing: { free: 'Gratis', starter: '$3.99', pro: '$5.99', gold: '$13.99' },
  },
  cl: {
    slug: 'cl', flag: '🇨🇱', name: 'Chile', locale: 'es-CL',
    currency: { code: 'CLP', symbol: '$', format: fmt('es-CL', 'CLP') },
    influencer: { name: 'Iván', tagline: 'Tu secretaria IA en WhatsApp', status: 'tbd' },
    personas: [
      { name: 'Pedro', role: 'electricista' },
      { name: 'Camila', role: 'peluquera' },
      { name: 'Felipe', role: 'gasfíter' },
    ],
    compliance: ['SII', 'RUT', 'IVA', 'Ley 19.628'],
    payments: ['Webpay', 'Mercado Pago', 'Transferencia'],
    slang: ['po', 'cachai', 'bacán', 'fome'],
    cta: { primary: 'Dale po 💪', secondary: 'Ver demo 90s ▶' },
    pricing: { free: 'Gratis', starter: '$3.490 CLP', pro: '$5.490 CLP', gold: '$12.990 CLP' },
  },
  uy: {
    slug: 'uy', flag: '🇺🇾', name: 'Uruguay', locale: 'es-UY',
    currency: { code: 'UYU', symbol: '$U', format: fmt('es-UY', 'UYU') },
    influencer: { name: 'Lucho', tagline: 'Tu secretaria IA en WhatsApp', status: 'tbd' },
    personas: [
      { name: 'Diego', role: 'electricista' },
      { name: 'Sofía', role: 'peluquera' },
      { name: 'Mauricio', role: 'plomero' },
    ],
    compliance: ['DGI', 'RUT', 'IVA', 'Ley 18.331'],
    payments: ['Mercado Pago', 'Redpagos', 'Transferencia'],
    slang: ['bo', 'ta', 'de pinga', 'masa'],
    cta: { primary: 'Dale bo 💪', secondary: 'Ver demo 90s ▶' },
    pricing: { free: 'Gratis', starter: '$U 159', pro: '$U 239', gold: '$U 559' },
  },
  bo: {
    slug: 'bo', flag: '🇧🇴', name: 'Bolivia', locale: 'es-BO',
    currency: { code: 'BOB', symbol: 'Bs', format: fmt('es-BO', 'BOB') },
    influencer: { name: 'Marce', tagline: 'Tu secretaria IA en WhatsApp', status: 'tbd' },
    personas: [
      { name: 'Marcelo', role: 'electricista' },
      { name: 'Ana', role: 'peluquera' },
      { name: 'Roberto', role: 'plomero' },
    ],
    compliance: ['SIN', 'NIT', 'IVA', 'Ley 164'],
    payments: ['Tigo Money', 'Soli', 'Transferencia'],
    slang: ['pues', 'jaila', 'choco', 'qué pasó'],
    cta: { primary: 'Vamos pues 💪', secondary: 'Ver demo 90s ▶' },
    pricing: { free: 'Gratis', starter: 'Bs 27,90', pro: 'Bs 41,90', gold: 'Bs 97,90' },
  },
  cr: {
    slug: 'cr', flag: '🇨🇷', name: 'Costa Rica', locale: 'es-CR',
    currency: { code: 'CRC', symbol: '₡', format: fmt('es-CR', 'CRC') },
    influencer: { name: 'Keylo', tagline: 'Tu secretaria IA en WhatsApp', status: 'tbd' },
    personas: [
      { name: 'Carlos', role: 'electricista' },
      { name: 'Andrea', role: 'estilista' },
      { name: 'Mario', role: 'fontanero' },
    ],
    compliance: ['Hacienda', 'Cédula Jurídica', 'IVA', 'Ley 8968'],
    payments: ['SINPE Móvil', 'Transferencia'],
    slang: ['pura vida', 'mae', 'tuanis', 'vacilón'],
    cta: { primary: 'Pura vida 💪', secondary: 'Ver demo 90s ▶' },
    pricing: { free: 'Pura vida', starter: '₡ 1.990', pro: '₡ 2.990', gold: '₡ 6.990' },
  },
  pt: {
    slug: 'pt', flag: '🇵🇹', name: 'Portugal', locale: 'pt-PT',
    currency: { code: 'EUR', symbol: '€', format: fmt('pt-PT', 'EUR') },
    influencer: { name: 'Cristi', tagline: 'A tua secretária IA no WhatsApp', status: 'tbd' },
    personas: [
      { name: 'João', role: 'eletricista' },
      { name: 'Inês', role: 'cabeleireira' },
      { name: 'Miguel', role: 'canalizador' },
    ],
    compliance: ['NIF', 'IRS', 'IVA', 'RGPD'],
    payments: ['MB Way', 'Transferência'],
    slang: ['fixe', 'porreiro', 'altamente', 'bué da fixe'],
    cta: { primary: 'Bora começar 💪', secondary: 'Ver demo 90s ▶' },
    pricing: { free: 'Grátis', starter: '€3,49', pro: '€4,99', gold: '€12,49' },
  },
};

export const COUNTRY_SLUGS = Object.keys(COUNTRIES) as CountrySlug[];
export const getCountry = (slug: string): Country | null =>
  (COUNTRIES as Record<string, Country>)[slug] ?? null;

// fix(legal): idioma legal por país · reusa el mismo campo `locale` que ya usa
// CountryLayout.astro para <html lang> en la homepage · NO inventa un mecanismo nuevo.
// pt-BR/pt-PT → pt · en-US → en · cualquier es-XX → es (3 idiomas legales soportados).
export type LegalLang = 'es' | 'pt' | 'en';
export const legalLang = (slug: CountrySlug): LegalLang =>
  (COUNTRIES[slug].locale.split('-')[0] as LegalLang);

// hreflang set para /[country]/legal/{doc}/ — mismo patrón que CountryLayout usa
// para la homepage (un <link alternate> por cada subdominio de país + x-default
// apuntando al apex ES, que sigue siendo el fallback histórico del sitio).
export const legalHreflangs = (doc: string): { hreflang: string; href: string }[] => [
  ...COUNTRY_SLUGS.map((s) => ({ hreflang: COUNTRIES[s].locale, href: `https://${s}.zymplo.com/legal/${doc}/` })),
  { hreflang: 'x-default', href: `https://zymplo.com/legal/${doc}/` },
];

// getStaticPaths() de /[country]/legal/{doc}.astro NO puede incluir 'pt' (Portugal):
// esa misma URL /pt/legal/{doc}/ ya la sirve la ruta legacy src/pages/pt/legal/{doc}.astro
// (prefijo de idioma "pt" = português-BR, no el país Portugal — colisión de namespace
// pre-existente en el sitio, no introducida por este fix). Portugal está `status:'tbd'`
// (aún no lanzado) y su idioma legal resuelve al mismo fragment 'pt' de todos modos,
// así que no hay pérdida de contenido — solo se pospone el canonical/hreflang propio
// de pt.zymplo.com hasta que se resuelva esa colisión de URL (ver PR description).
export const LEGAL_COUNTRY_SLUGS = COUNTRY_SLUGS.filter((s) => s !== 'pt');

export const EU_SLUGS: CountrySlug[] = ['es'];

// WhatsApp Business number for signup CTAs (Zymplo onboarding)
export const WA_NUMBER = '595981970735';
const WA_TEXT: Record<CountrySlug, string> = {
  br: 'Olá! Quero começar com Zymplo grátis.',
  mx: '¡Hola! Quiero empezar con Zymplo gratis.',
  us: 'Hi! I want to start with Zymplo free.',
  co: '¡Hola! Quiero empezar con Zymplo gratis.',
  es: '¡Hola! Quiero empezar con Zymplo gratis.',
  ar: '¡Hola! Quiero empezar con Zymplo gratis.',
  py: '¡Hola! Quiero empezar con Zymplo gratis.',
  pe: '¡Hola causa! Quiero empezar con Zymplo gratis.',
  ec: '¡Hola pana! Quiero empezar con Zymplo gratis.',
  cl: '¡Hola! Quiero empezar con Zymplo gratis po.',
  uy: '¡Hola bo! Quiero empezar con Zymplo gratis.',
  bo: '¡Hola pues! Quiero empezar con Zymplo gratis.',
  cr: '¡Pura vida! Quiero empezar con Zymplo gratis.',
};
export const waLink = (slug: CountrySlug, planLabel?: string): string => {
  const baseText = WA_TEXT[slug] ?? WA_TEXT.br;
  const text = planLabel ? `${baseText} (${planLabel})` : baseText;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
};

// Social profiles (Zymplo official · global brand)
export const SOCIAL = {
  instagram: 'https://www.instagram.com/zymplo',
  tiktok: 'https://www.tiktok.com/@zymplo',
  facebook: 'https://www.facebook.com/zymplo',
  x: 'https://x.com/zymplo',
  youtube: 'https://www.youtube.com/@zymplo',
  linkedin: 'https://www.linkedin.com/company/zymplo',
  threads: 'https://www.threads.net/@zymplo',
} as const;

// Brand assets (single source · S1 mirror)
export const BRAND = {
  logoIso: '/brand/isotipo.svg',
  logoIsoWhite: '/brand/isotipo-blanco.svg',
  apple: '/brand/apple-touch-icon.png',
  manifest: '/manifest.webmanifest',
} as const;

// Legal pages (relative · same-country)
export const LEGAL = {
  terms: '/legal/terms/',
  privacy: '/legal/privacy/',
  cookies: '/legal/cookies/',
  compliance: '/legal/compliance/',
  delete_account: '/legal/delete-account/',
  lgpd: '/legal/lgpd/',
  contact: '/contact/',
  press: 'mailto:press@zymplo.com',
  support: 'mailto:support@zymplo.com',
} as const;

// QR code generator (WhatsApp deep-link · brand colors via api.qrserver.com)
// PNG (no SVG) · garantiza compat 100% iOS Safari/Chrome/Firefox/Edge mobile + desktop
// SVG-cross-origin tiene issues silenciosos en algunos browsers · QR aparecía como broken-image icon
// `data` simplificado al wa.me link sin text param · evita encoding pesado que rompía en algunos clients
export const qrLink = (slug: CountrySlug, size = 240): string => {
  // Strip the ?text=... portion · QR debe contener solo el wa.me clean (texto se aplica al hacer click)
  const url = waLink(slug).split('?')[0];
  const params = new URLSearchParams({
    size: `${size}x${size}`,
    data: url,
    color: '14B8A6',
    bgcolor: 'FFFFFF',
    margin: '8',
    qzone: '1',
    format: 'png',
    ecc: 'M',
  });
  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
};
