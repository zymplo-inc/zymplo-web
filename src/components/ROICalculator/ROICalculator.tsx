/**
 * ROICalculator · interactive sliders · clients × price × hours → savings + ROI ×N.
 * Variant G v4.7 motion merge · React island (client:visible).
 * R86 country-aware via Country prop (currency.symbol + locale + pricing.pro).
 * R102 no CONTIQ · uses Plan 2 PRO price as baseline cost denominator.
 * R93 warm peer copy · R23 no-prompt.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { waNumberFor, type Country } from '@data/countries';

interface DictROI {
  eyebrow?: string;
  title_a?: string;
  title_b?: string;
  subtitle?: string;
  label_clients?: string;
  label_price?: string;
  label_hours?: string;
  saved_eyebrow?: string;
  saved_detail?: string;
  row_time?: string;
  row_recovered?: string;
  row_cost?: string;
  row_roi?: string;
  cta?: string;
  hours_suffix?: string;
}

interface Props {
  country: Country;
  dict: DictROI;
}

// Defaults per-country: price slider range + initial values · adjusted by currency magnitude.
// We try Plan 2 PRO numeric value to anchor cost; fall back to USD-equivalent estimate.
function parsePriceMonth(pro: string): number {
  // pro examples: "R$ 39", "$199 MXN", "$10 USD", "$39.000 COP", "₲ 89.000", "€ 9", "S/ 19"
  const digits = pro.replace(/[^\d]/g, '');
  const n = parseInt(digits, 10);
  return Number.isFinite(n) && n > 0 ? n : 9;
}

function defaultPriceForCountry(currencyCode: string): { initial: number; min: number; max: number; step: number } {
  // tuned per currency magnitude so sliders feel realistic
  switch (currencyCode) {
    case 'BRL': return { initial: 150, min: 20, max: 5000, step: 10 };
    case 'MXN': return { initial: 800, min: 50, max: 30000, step: 50 };
    case 'USD': return { initial: 50, min: 5, max: 2000, step: 5 };
    case 'COP': return { initial: 80000, min: 5000, max: 3000000, step: 1000 };
    case 'EUR': return { initial: 50, min: 5, max: 2000, step: 5 };
    case 'ARS': return { initial: 25000, min: 1000, max: 1000000, step: 500 };
    case 'PYG': return { initial: 250000, min: 20000, max: 10000000, step: 5000 };
    case 'PEN': return { initial: 100, min: 10, max: 5000, step: 10 };
    case 'CLP': return { initial: 25000, min: 2000, max: 1000000, step: 500 };
    case 'UYU': return { initial: 1500, min: 100, max: 50000, step: 50 };
    case 'BOB': return { initial: 200, min: 20, max: 10000, step: 10 };
    case 'CRC': return { initial: 25000, min: 2000, max: 1000000, step: 500 };
    default: return { initial: 50, min: 5, max: 2000, step: 5 };
  }
}

export default function ROICalculator({ country, dict }: Props) {
  const priceRange = useMemo(() => defaultPriceForCountry(country.currency.code), [country.currency.code]);
  const planCost = useMemo(() => parsePriceMonth(country.pricing.pro), [country.pricing.pro]);

  const [clients, setClients] = useState(25);
  const [price, setPrice] = useState(priceRange.initial);
  const [hours, setHours] = useState(5);

  // recompute defaults when country changes (e.g. SSR hydration of different slug)
  useEffect(() => { setPrice(priceRange.initial); }, [priceRange.initial]);

  const fmt = (n: number) => country.currency.format(Math.round(n));

  // Recovered cobros: 18% retention boost from auto-cobranza
  const recovered = Math.round(clients * price * 0.18);
  // Time-recovered value: hours/wk × 4 wks × hourly_value (price/clients * 0.6 conservative)
  const timeValue = Math.round((hours * 4 * price) / Math.max(clients, 1) * 0.6);
  const totalSaved = recovered + timeValue;
  const roi = Math.round(totalSaved / Math.max(planCost, 1));

  const eyebrow = dict.eyebrow ?? 'Calculá lo que ahorrás';
  const titleA = dict.title_a ?? '¿Cuánto te ahorra';
  const titleB = dict.title_b ?? 'Zymplo al mes?';
  const subtitle = dict.subtitle ?? 'Movéle a los sliders · resultado en vivo.';
  const labelClients = dict.label_clients ?? '¿Cuántos clientes por mes?';
  const labelPrice = dict.label_price ?? '¿Cuánto cobrás por servicio?';
  const labelHours = dict.label_hours ?? '¿Cuántas horas perseguís cobros por semana?';
  const savedEyebrow = dict.saved_eyebrow ?? 'Tu ahorro estimado mensual';
  const savedDetail = dict.saved_detail ?? 'cobros recuperados + ahorro tiempo';
  const rowTime = dict.row_time ?? 'Tiempo recuperado';
  const rowRecovered = dict.row_recovered ?? 'Cobros recuperados';
  const rowCost = dict.row_cost ?? 'Costo Zymplo Pro';
  const rowROI = dict.row_roi ?? 'ROI';
  const cta = dict.cta ?? 'Empezar a ahorrar gratis';
  const hoursSuffix = dict.hours_suffix ?? 'h';

  return (
    <section id="roi" data-slug={country.slug} className="py-20 md:py-28 bg-gradient-to-br from-turquesa-paler/40 via-white to-white">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-block bg-white text-turquesa-deeper px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-turquesa/30">{eyebrow}</span>
          <h2 className="mt-5 font-display text-4xl sm:text-6xl font-bold tracking-tightest leading-[0.95] text-ink">
            {titleA}<br/><span className="text-turquesa-deeper">{titleB}</span>
          </h2>
          <p className="mt-5 text-mute text-lg">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-[1.2fr_1fr] gap-6 lg:gap-10 items-stretch">
          <div className="bg-white border border-ink/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-7">
            <div>
              <label className="flex items-center justify-between mb-3">
                <span className="font-bold text-base text-ink">{labelClients}</span>
                <span className="font-display font-extrabold text-2xl text-turquesa-deeper tracking-tighter">{clients}</span>
              </label>
              <input
                type="range" min={3} max={200} value={clients}
                onChange={(e) => setClients(parseInt(e.target.value, 10))}
                className="roi-slider w-full"
                aria-label={labelClients}
              />
              <div className="flex justify-between text-xs text-mute mt-1.5"><span>3</span><span>100</span><span>200</span></div>
            </div>

            <div>
              <label className="flex items-center justify-between mb-3">
                <span className="font-bold text-base text-ink">{labelPrice}</span>
                <span className="font-display font-extrabold text-2xl text-turquesa-deeper tracking-tighter">{fmt(price)}</span>
              </label>
              <input
                type="range" min={priceRange.min} max={priceRange.max} step={priceRange.step} value={price}
                onChange={(e) => setPrice(parseInt(e.target.value, 10))}
                className="roi-slider w-full"
                aria-label={labelPrice}
              />
            </div>

            <div>
              <label className="flex items-center justify-between mb-3">
                <span className="font-bold text-base text-ink">{labelHours}</span>
                <span className="font-display font-extrabold text-2xl text-turquesa-deeper tracking-tighter">{hours}{hoursSuffix}</span>
              </label>
              <input
                type="range" min={0} max={20} value={hours}
                onChange={(e) => setHours(parseInt(e.target.value, 10))}
                className="roi-slider w-full"
                aria-label={labelHours}
              />
              <div className="flex justify-between text-xs text-mute mt-1.5"><span>0{hoursSuffix}</span><span>10{hoursSuffix}</span><span>20{hoursSuffix}</span></div>
            </div>
          </div>

          <div className="bg-ink text-paper rounded-3xl p-6 sm:p-8 shadow-soft flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-turquesa-light mb-3">{savedEyebrow}</div>
              <div className="font-display text-5xl sm:text-6xl font-extrabold tracking-tighter leading-none">{fmt(totalSaved)}</div>
              <div className="text-sm text-paper/60 mt-2">{savedDetail}</div>
            </div>
            <div className="space-y-3 mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between gap-2 text-sm"><span className="text-paper/70">{rowTime}</span><span className="font-bold text-turquesa-light">{Math.round(hours * 4)}{hoursSuffix}/mes</span></div>
              <div className="flex items-center justify-between gap-2 text-sm"><span className="text-paper/70">{rowRecovered}</span><span className="font-bold text-turquesa-light">+{fmt(recovered)}</span></div>
              <div className="flex items-center justify-between gap-2 text-sm"><span className="text-paper/70">{rowCost}</span><span className="font-bold text-paper">{country.pricing.pro}</span></div>
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10"><span className="text-paper/70 text-sm">{rowROI}</span><span className="font-display font-extrabold text-2xl text-turquesa-light tracking-tighter">×{roi.toLocaleString(country.locale)}</span></div>
            </div>
            <a href={`https://wa.me/${waNumberFor(country.slug)}?text=${encodeURIComponent(country.cta.primary)}`} className="mt-6 inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full font-extrabold text-base bg-turquesa text-white hover:bg-turquesa-dark transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              {cta}
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .roi-slider { appearance: none; -webkit-appearance: none; height: 8px; background: #E5E7EB; border-radius: 4px; outline: none; }
        .roi-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; background: #14B8A6; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 8px -2px rgba(20,184,166,0.5); border: 3px solid white; }
        .roi-slider::-moz-range-thumb { width: 24px; height: 24px; background: #14B8A6; border-radius: 50%; cursor: pointer; border: 3px solid white; }
        .roi-slider:focus { box-shadow: 0 0 0 4px rgba(20,184,166,0.15); }
      `}</style>
    </section>
  );
}
