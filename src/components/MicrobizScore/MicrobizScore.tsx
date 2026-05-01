import { useState } from 'react';
import { waLink, type CountrySlug } from '@data/countries';
import type { Country } from '@data/countries';

interface Props {
  slug: CountrySlug;
  country: Country;
  dict: any;
}

/**
 * Microbiz Score · Grok contrarian idea.
 * 3 inputs (monthly billing · clients · hours/week chasing) → personalized fit score.
 * No login · instant value · primes user toward CTA.
 */
export default function MicrobizScore({ slug, country, dict }: Props) {
  const m = (dict.microbiz_score ?? {}) as any;
  const eyebrow = m.eyebrow ?? '✨ Free score · 30 seconds';
  const title = m.title ?? 'Is Zymplo right for you?';
  const subtitle = m.subtitle ?? 'Answer 3 questions · we score your fit instantly. No login. No spam.';

  const labelBilling = m.label_billing ?? 'How much do you bill per month?';
  const labelClients = m.label_clients ?? 'How many clients do you have?';
  const labelHours = m.label_hours ?? 'Hours/week chasing or invoicing?';
  const calculate = m.calculate ?? 'Calculate my score';

  // Realistic monthly billing example per country (purchasing-power normalized to ~$1,000 USD)
  const BILLING_EXAMPLE: Record<string, number> = {
    BRL: 5000, MXN: 18000, USD: 1000, COP: 4000000, EUR: 900,
    ARS: 1000000, PYG: 7500000, PEN: 3700, CLP: 950000, UYU: 40000,
    BOB: 7000, CRC: 500000,
  };
  // Custom currency symbol map (consistent with HeroC formatMoney)
  const SYM: Record<string, string> = {
    BRL: 'R$', MXN: '$', USD: '$', COP: '$', EUR: '€',
    ARS: '$', PYG: 'Gs', PEN: 'S/', CLP: '$', UYU: '$U',
    BOB: 'Bs', CRC: '₡',
  };
  const code = country.currency.code;
  const sym = SYM[code] || country.currency.symbol;
  const exampleAmount = BILLING_EXAMPLE[code] || 5000;
  const locale = (country as any).locale || 'pt-BR';
  const formatExample = (n: number) => {
    try {
      const formatted = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);
      return code === 'EUR' ? `${formatted} ${sym}` : `${sym} ${formatted}`;
    } catch {
      return `${sym} ${n.toLocaleString()}`;
    }
  };
  const placeBilling = m.place_billing ?? `ej: ${formatExample(exampleAmount)}`;
  const placeClients = m.place_clients ?? 'ej: 25';
  const placeHours = m.place_hours ?? 'ej: 8';

  const yourScore = m.your_score ?? 'Your fit score';
  const ctaText = m.cta ?? country.cta.primary;
  const recap = m.recap ?? 'Estimated saving';

  const fitLow = m.fit_low ?? 'Just starting · Zymplo grows with you.';
  const fitMid = m.fit_mid ?? 'Strong fit · you’ll save real time from day 1.';
  const fitHigh = m.fit_high ?? 'Perfect match · Zymplo pays itself back in week 1.';

  const [billing, setBilling] = useState('');
  const [clients, setClients] = useState('');
  const [hours, setHours] = useState('');
  const [score, setScore] = useState<number | null>(null);

  const calc = () => {
    const b = Math.max(0, Number(String(billing).replace(/[^\d.]/g, '')) || 0);
    const c = Math.max(0, Number(clients) || 0);
    const h = Math.max(0, Number(hours) || 0);

    // Weighted heuristic · clamps 0-100
    // Hours-chasing has heaviest weight (Zymplo's core saving)
    let s = 0;
    s += Math.min(40, Math.log10(b + 10) * 12); // 0-40 from billing volume
    s += Math.min(25, c * 1.2); // 0-25 from clients (more = more chasing)
    s += Math.min(35, h * 4); // 0-35 from hours saved
    s = Math.round(Math.min(100, Math.max(15, s + 15))); // floor at 15 (everyone benefits)
    setScore(s);
  };

  const reset = () => { setBilling(''); setClients(''); setHours(''); setScore(null); };

  const fitMessage = score === null ? '' : score < 50 ? fitLow : score < 80 ? fitMid : fitHigh;

  // Estimated monthly saving (very rough · purely illustrative)
  const monthlySaving = score === null ? 0 : Math.round(((Number(hours) || 4) * 4 * 25) + (Number(clients) || 10) * 2);

  return (
    <section id="score" className="bg-paper py-16 md:py-24 border-y border-ink/5">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-warning/15 text-warning text-[11px] font-bold uppercase tracking-widest">{eyebrow}</span>
          <h2 className="mt-4 font-display text-3xl md:text-5xl font-bold tracking-tightest leading-tight">{title}</h2>
          <p className="mt-3 text-base text-slate max-w-xl mx-auto">{subtitle}</p>
        </div>

        <div className="bg-white rounded-3xl border border-ink/10 shadow-xl p-6 md:p-8">
          {score === null ? (
            <form
              onSubmit={(e) => { e.preventDefault(); calc(); }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-mute mb-2">{labelBilling}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={billing}
                  onChange={(e) => setBilling(e.target.value)}
                  placeholder={placeBilling}
                  className="w-full bg-paper border border-ink/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-turquesa transition"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-mute mb-2">{labelClients}</label>
                  <input
                    type="number"
                    min={0}
                    value={clients}
                    onChange={(e) => setClients(e.target.value)}
                    placeholder={placeClients}
                    className="w-full bg-paper border border-ink/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-turquesa transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-mute mb-2">{labelHours}</label>
                  <input
                    type="number"
                    min={0}
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder={placeHours}
                    className="w-full bg-paper border border-ink/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-turquesa transition"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-turquesa hover:bg-turquesa-dark text-white font-bold text-base py-3.5 rounded-full transition shadow-md"
              >
                {calculate}
              </button>
            </form>
          ) : (
            <div className="text-center" style={{ animation: 'ms-pop 0.4s cubic-bezier(0.2,0.9,0.3,1.2)' }}>
              <div className="text-xs uppercase tracking-widest text-mute font-bold">{yourScore}</div>
              <div className="mt-1 font-display text-7xl md:text-8xl font-bold text-turquesa-deeper tracking-tightest leading-none">
                {score}
                <span className="text-2xl md:text-3xl text-mute font-medium align-top">/100</span>
              </div>
              <div className="mt-4 max-w-md mx-auto h-2 rounded-full bg-ink/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-turquesa via-turquesa-dark to-azul transition-all duration-700"
                  style={{ width: `${score}%` }}
                />
              </div>
              <p className="mt-5 text-base md:text-lg text-ink font-semibold leading-relaxed">{fitMessage}</p>
              <p className="mt-1.5 text-sm text-slate">{recap}: <span className="font-bold text-turquesa-deeper">{country.currency.symbol} {monthlySaving.toLocaleString()}/mo</span></p>

              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <a
                  href={waLink(slug)}
                  target="_blank"
                  rel="noopener"
                  className="bg-turquesa hover:bg-turquesa-dark text-white font-bold text-base px-7 py-3.5 rounded-full transition shadow-md"
                >
                  {ctaText}
                </a>
                <button
                  type="button"
                  onClick={reset}
                  className="text-sm text-mute hover:text-ink transition px-4 py-2"
                >
                  ↺
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ms-pop {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}
