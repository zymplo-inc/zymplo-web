import type { Country, CountrySlug } from '@data/countries';
import { waLink } from '@data/countries';
import type { Dict } from '@i18n/index';

interface Props { slug: string; country: Country; dict: Dict }

/** PricingTable — 4 planes (+ Contiq B2B opcional para BR). */
export default function PricingTable({ country, dict }: Props) {
  const p: any = dict.pricing as any;
  const fFree = p.features_free ?? ['100 messages/mo', '5 payments', '1 note'];
  const fStarter = p.features_starter ?? ['500 messages/mo', '20 payments', '10 notes'];
  const fPro = p.features_pro ?? ['Unlimited', 'Unlimited', 'Unlimited', 'AI reminders'];
  const fGold = p.features_gold ?? ['Everything in Pro', 'Multi-team', 'API', 'Priority'];
  const popular = p.popular ?? 'Most popular';
  const eyebrow = p.eyebrow ?? 'pricing';
  const ctaSecondary = p.cta_secondary ?? 'Learn about Contiq';
  const b2bLabel = p.b2b_label ?? 'B2B';
  const b2bDesc = p.b2b_desc ?? '';

  const plans = [
    { key: 'free', label: dict.pricing.free_label, price: country.pricing.free, highlight: false, features: fFree },
    { key: 'starter', label: dict.pricing.starter_label, price: country.pricing.starter, highlight: false, features: fStarter },
    { key: 'pro', label: dict.pricing.pro_label, price: country.pricing.pro, highlight: true, features: fPro },
    { key: 'gold', label: dict.pricing.gold_label, price: country.pricing.gold, highlight: false, features: fGold },
  ];

  return (
    <section id="pricing" className="bg-paper py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-turquesa-paler text-turquesa-deeper text-xs font-bold uppercase tracking-widest">{eyebrow}</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold tracking-tightest">{dict.pricing.title}</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((pl) => (
            <div
              key={pl.key}
              className={`relative rounded-3xl p-7 border ${pl.highlight ? 'bg-ink text-paper border-ink shadow-[0_30px_60px_-20px_rgba(20,184,166,0.4)]' : 'bg-white border-ink/10'}`}
            >
              {pl.highlight && (
                <span className="absolute -top-3 left-7 bg-turquesa text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">{popular}</span>
              )}
              <div className={`text-sm font-bold uppercase tracking-widest ${pl.highlight ? 'text-turquesa-light' : 'text-mute'}`}>{pl.label}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold tracking-tightest">{pl.price}</span>
                {pl.key !== 'free' && <span className={pl.highlight ? 'text-paper/60' : 'text-mute'}>{dict.pricing.month}</span>}
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {pl.features.map((f: string) => (
                  <li key={f} className="flex gap-2 items-start"><span className="text-turquesa">✓</span><span>{f}</span></li>
                ))}
              </ul>
              <a href={waLink(country.slug, pl.label)} target="_blank" rel="noopener" className={`mt-7 block text-center font-semibold text-sm py-3 rounded-full transition ${pl.highlight ? 'bg-turquesa text-white hover:bg-turquesa-dark' : 'bg-ink/5 text-ink hover:bg-ink/10'}`}>
                {country.cta.primary}
              </a>
            </div>
          ))}
        </div>

        {country.slug === 'br' && country.pricing.b2b && (
          <div className="mt-10 rounded-3xl border border-azul/20 bg-gradient-to-br from-azul/5 via-purple/5 to-transparent p-7 flex flex-wrap items-center gap-6 justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-azul">{b2bLabel}</div>
              <div className="font-display text-2xl font-bold tracking-tightest mt-1">Contiq · {country.pricing.b2b}{dict.pricing.month}</div>
              <p className="text-mute text-sm mt-1 max-w-md">{b2bDesc}</p>
            </div>
            <a href="/br/contiq/" className="bg-azul text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-purple transition">{ctaSecondary}</a>
          </div>
        )}
      </div>
    </section>
  );
}
