// src/data/pricing-v5.ts
// INTERIM pricing source · web v5 · rama feat/web-v5-scrollytelling
// Fuente: ZYMPLO-WEB-SPEC.md §7 (R147 HYBRID v2 · ratificado 2026-05-23 · 14/14 países verificados R115).
// ⚠️ INTERINO — la regla §7 exige "consumir get_pricing, no hardcodear".
// TODO(get_pricing): reemplazar por fetch al handler get_pricing del backend
//   (zymplo-langgraph/src/tools/tools.py) ANTES de merge a main (OPS-R211).
// Reglas de display §7: prohibido "ilimitado" (usar "sem teto") · prohibido "Gold" ·
//   prohibido mezclar monedas en una vista · Plan 0 forever-free (jamás eliminado) · sin trial temporal.

export type PlanId = 'free' | 'starter' | 'pro' | 'team';

export interface Plan {
  id: PlanId;
  name: string;      // naming R147 (:107)
  emoji: string;
  anchorUSD: number; // precio ancla USD (§7)
}

export const PLANS: Plan[] = [
  { id: 'free',    name: 'Zy Grátis',  emoji: '🎁', anchorUSD: 0 },
  { id: 'starter', name: 'Zy Starter', emoji: '🌱', anchorUSD: 3.99 },
  { id: 'pro',     name: 'Zy Pro',     emoji: '⭐', anchorUSD: 5.99 },
  { id: 'team',    name: 'Zy Equipo',  emoji: '👥', anchorUSD: 13.99 },
];

// Precio EXACTO por país (free = 0 siempre) · §7 tabla :299-312
export const PRICE_BY_COUNTRY: Record<string, { currency: string; starter: string; pro: string; team: string }> = {
  BR: { currency: 'R$',  starter: 'R$ 19,90',  pro: 'R$ 29,90',  team: 'R$ 69,90' },
  MX: { currency: 'MXN', starter: '$69',       pro: '$99',       team: '$239' },
  AR: { currency: 'ARS', starter: 'AR$ 4.490', pro: 'AR$ 6.890', team: 'AR$ 17.490' },
  CO: { currency: 'COP', starter: '$14.900',   pro: '$22.900',   team: '$54.900' },
  CL: { currency: 'CLP', starter: '$3.490',    pro: '$5.490',    team: '$12.990' },
  PE: { currency: 'PEN', starter: 'S/ 12,90',  pro: 'S/ 19,90',  team: 'S/ 49,90' },
  UY: { currency: 'UYU', starter: '$U 159',    pro: '$U 239',    team: '$U 559' },
  BO: { currency: 'BOB', starter: 'Bs 27,90',  pro: 'Bs 41,90',  team: 'Bs 97,90' },
  CR: { currency: 'CRC', starter: '₡ 1.990',   pro: '₡ 2.990',   team: '₡ 6.990' },
  EC: { currency: 'USD', starter: '$3.99',     pro: '$5.99',     team: '$13.99' },
  ES: { currency: 'EUR', starter: '€3,49',     pro: '€4,99',     team: '€12,49' },
  PT: { currency: 'EUR', starter: '€3,49',     pro: '€4,99',     team: '€12,49' },
  US: { currency: 'USD', starter: '$3.99',     pro: '$5.99',     team: '$13.99' },
  PY: { currency: 'PYG', starter: '₲ 29.000',  pro: '₲ 43.500',  team: '₲ 102.000' },
};

// Caps/features por plan · §7 :315-318 · sin "ilimitado" (usar "sem teto")
export const PLAN_CAPS: Record<PlanId, { msgs: string; cobrancas: string; nfse: string; extra: string[] }> = {
  free:    { msgs: '100',   cobrancas: '5',        nfse: '1',        extra: ['DAS reminder', 'agenda básica'] },
  starter: { msgs: '500',   cobrancas: '20',       nfse: '10',       extra: ['planilha financeira'] },
  pro:     { msgs: '1.500', cobrancas: 'sem teto', nfse: 'sem teto', extra: ['lembretes IA'] },
  team:    { msgs: '3.500', cobrancas: 'sem teto', nfse: 'sem teto', extra: ['5 seats', 'API', 'white-label', 'webhooks'] },
};
