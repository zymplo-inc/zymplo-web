import type { Country } from '@data/countries';
import { waLink } from '@data/countries';
import type { ContentSchema } from '@data/content-schema';

interface Props { slug: string; country: Country; dict: ContentSchema }

/**
 * PricingTable v4 · Path C migration (Carlos · 2026-05-07)
 *  - Typed against `ContentSchema` (no more `any` casts on dict.pricing)
 *  - R29 LOCKED · 4 plans only (free, starter, pro, gold)
 *  - R102 NO-CONTIQ-FOREVER · BR B2B Contiq strip removed
 *  - Big feature anchor (value prop first, price second)
 *  - Hover lift -8px, shadow-pop on highlight, dark-mode aware
 */
export default function PricingTable({ country, dict }: Props) {
  const p = dict.pricing;
  const fFree = p.features_free;
  const fStarter = p.features_starter;
  const fPro = p.features_pro;
  const fGold = p.features_gold;
  const popular = p.popular;
  const eyebrow = p.eyebrow;
  const headlineFeature = p.headline_feature;
  const headlineCaption = p.headline_caption ?? p.subtitle;
  const fromLabel = p.from_label;

  const plans = [
    { key: 'free',    label: dict.pricing.free_label,    price: country.pricing.free,    highlight: false, features: fFree    },
    { key: 'starter', label: dict.pricing.starter_label, price: country.pricing.starter, highlight: false, features: fStarter },
    { key: 'pro',     label: dict.pricing.pro_label,     price: country.pricing.pro,     highlight: true,  features: fPro     },
    { key: 'gold',    label: dict.pricing.gold_label,    price: country.pricing.gold,    highlight: false, features: fGold    },
  ];

  return (
    <section
      id="pricing"
      className="organic-bg relative py-14 md:py-20"
      style={{ background: 'var(--bg-base)', color: 'var(--fg-primary)' }}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* HEADER · features-first (the VALUE before the PRICE) */}
        <div className="text-center mb-14 md:mb-20">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'var(--paler)', color: 'var(--turquesa-deeper)' }}
          >
            {eyebrow}
          </span>
          <h2
            className="mt-4 font-display font-bold tracking-tightest leading-[0.95]"
            style={{ fontSize: 'clamp(40px, 7vw, 88px)' }}
          >
            {headlineFeature}
          </h2>
          {headlineCaption && (
            <p
              className="mt-4 max-w-2xl mx-auto text-base md:text-lg"
              style={{ color: 'var(--fg-secondary)' }}
            >
              {headlineCaption}
            </p>
          )}
          <p className="mt-3 text-sm" style={{ color: 'var(--fg-mute)' }}>
            {fromLabel} <span className="font-semibold" style={{ color: 'var(--fg-primary)' }}>{country.pricing.free}</span>
            {' · '}
            {dict.pricing.title}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((pl) => {
            const isHi = pl.highlight;
            return (
              <div
                key={pl.key}
                className="pricing-card relative rounded-3xl p-7 flex flex-col"
                data-highlight={isHi ? 'true' : 'false'}
                style={{
                  background: isHi ? 'var(--ink)' : 'var(--bg-raised)',
                  color: isHi ? 'var(--paper)' : 'var(--fg-primary)',
                  border: '1px solid ' + (isHi ? 'var(--ink)' : 'var(--border-subtle)'),
                  boxShadow: isHi ? 'var(--shadow-pop)' : 'var(--shadow-card)',
                  transition: 'transform 0.4s var(--ease-spring), box-shadow 0.4s var(--ease-out-expo)',
                }}
              >
                {isHi && (
                  <span
                    className="absolute -top-3 left-7 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--turquesa)', color: '#fff' }}
                  >
                    {popular}
                  </span>
                )}

                {/* PLAN LABEL */}
                <div
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: isHi ? 'var(--turquesa-light)' : 'var(--fg-mute)' }}
                >
                  {pl.label}
                </div>

                {/* FEATURES FIRST · the value */}
                <ul className="mt-5 space-y-2.5 text-sm flex-1">
                  {pl.features.map((f: string, i: number) => (
                    <li key={f} className="flex gap-2 items-start">
                      <span
                        className="mt-0.5"
                        style={{ color: isHi ? 'var(--turquesa-light)' : 'var(--turquesa)' }}
                      >
                        ✓
                      </span>
                      <span
                        className={i === 0 ? 'font-semibold' : ''}
                        style={i === 0
                          ? { color: isHi ? 'var(--paper)' : 'var(--fg-primary)' }
                          : { color: isHi ? 'rgba(250,251,255,0.85)' : 'var(--fg-secondary)' }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* PRICE · secondary, smaller, separator above */}
                <div
                  className="mt-6 pt-5"
                  style={{ borderTop: '1px solid ' + (isHi ? 'rgba(250,251,255,0.10)' : 'var(--border-subtle)') }}
                >
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl font-bold tracking-tightest">{pl.price}</span>
                    {pl.key !== 'free' && (
                      <span style={{ color: isHi ? 'rgba(250,251,255,0.55)' : 'var(--fg-mute)' }}>
                        {dict.pricing.month}
                      </span>
                    )}
                  </div>
                  <a
                    href={waLink(country.slug, pl.label)}
                    target="_blank"
                    rel="noopener"
                    className="mt-4 block text-center font-semibold text-sm py-3 rounded-full transition"
                    style={{
                      background: isHi ? 'var(--gradient-cta)' : 'var(--bg-overlay)',
                      color: isHi ? '#fff' : 'var(--fg-primary)',
                      boxShadow: isHi ? '0 12px 24px -10px rgba(20,184,166,0.55)' : undefined,
                    }}
                  >
                    {country.cta.primary}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* R102 NO-CONTIQ-FOREVER · BR B2B strip removed (Path C migration 2026-05-07) */}
      </div>

      <style>{`
        .pricing-card:hover { transform: translateY(-8px); }
        .pricing-card[data-highlight="true"]:hover { transform: translateY(-12px) scale(1.01); }
        @media (prefers-reduced-motion: reduce) {
          .pricing-card { transition: none !important; }
          .pricing-card:hover { transform: none !important; }
        }
      `}</style>
    </section>
  );
}
