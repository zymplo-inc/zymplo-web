import { useEffect, useState } from 'react';
import type { Country, CountrySlug } from '@data/countries';
import { waLink } from '@data/countries';
import type { Dict } from '@i18n/index';

interface Props { slug: string; country: Country; dict: Dict }

/** HeroA v2 — improvements consenso 10 LLMs (subheadline IA + stats + live activity + CTA micro-copy + counter-up). */
export default function HeroA({ slug, country, dict }: Props) {
  const headline = dict.hero.headline_a ?? dict.hero.eyebrow;
  const subline = dict.hero.subline;
  const subheadlineAI = (dict.hero as any).subheadline_ai ?? '';
  const ctaMicro = (dict.hero as any).cta_microcopy ?? 'Free · no card';
  const stats: Array<{ value: string; label: string }> = (dict.hero as any).stats ?? [];
  const liveActivity: string[] = (dict.hero as any).live_activity ?? [];

  // Live activity ticker · rotates every 3.5s
  const [tickerIdx, setTickerIdx] = useState(0);
  useEffect(() => {
    if (liveActivity.length === 0) return;
    const t = setInterval(() => setTickerIdx((i) => (i + 1) % liveActivity.length), 3500);
    return () => clearInterval(t);
  }, [liveActivity.length]);

  return (
    <section className="relative bg-paper">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-16 md:pt-20 md:pb-24 grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        {/* Left · text */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-turquesa-paler text-turquesa-deeper text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-turquesa animate-pulse" /> {country.flag} {country.name}
          </div>
          <h1
            className="mt-5 font-display text-[40px] sm:text-[60px] md:text-[76px] leading-[0.95] tracking-tightest text-ink"
            style={{ fontWeight: 700 }}
          >
            {headline}
          </h1>
          {subheadlineAI && (
            <p className="mt-4 text-base md:text-lg text-turquesa-deeper font-semibold max-w-xl">
              {subheadlineAI}
            </p>
          )}
          <p className="mt-3 text-base md:text-lg text-slate max-w-xl leading-relaxed">
            {subline}
          </p>

          {/* CTAs · primary + secondary with micro-copy */}
          <div className="mt-8 flex flex-wrap gap-3 items-start">
            <div className="flex flex-col gap-1.5">
              <a
                id="cta"
                href={waLink(slug as CountrySlug)}
                target="_blank"
                rel="noopener"
                className="bg-ink text-paper font-semibold text-base px-7 py-3.5 rounded-full hover:bg-slate transition shadow-lg inline-flex items-center justify-center"
              >
                {country.cta.primary}
              </a>
              <span className="text-xs text-mute pl-3">{ctaMicro}</span>
            </div>
            <a
              href="#chatdemo"
              className="bg-white border-2 border-ink/10 text-ink font-semibold text-base px-7 py-3.5 rounded-full hover:border-turquesa transition inline-flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5 text-turquesa" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              {country.cta.secondary}
            </a>
          </div>

          {/* Stats hero · 3 metrics */}
          {stats.length > 0 && (
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
              {stats.map((s, i) => (
                <div key={i} className="border-l-2 border-turquesa pl-3">
                  <div className="font-display text-xl md:text-2xl font-bold text-ink tracking-tightest">{s.value}</div>
                  <div className="text-xs text-mute mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Live activity ticker · rotating social proof */}
          {liveActivity.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2.5 bg-white border border-ink/8 rounded-full px-4 py-2 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span key={tickerIdx} className="text-xs md:text-sm text-slate font-medium animate-fade-in">
                {liveActivity[tickerIdx]}
              </span>
            </div>
          )}
        </div>

        {/* Right · warm illustration */}
        <div className="relative h-[380px] md:h-[480px] hidden md:block">
          <WarmIllustration country={country} badge={(dict.hero as any).persona_badge ?? 'just got paid'} />
        </div>
      </div>
    </section>
  );
}

function WarmIllustration({ country, badge }: { country: Country; badge: string }) {
  const persona = country.personas[0];
  return (
    <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-[#F8E5D6] via-[#F5D8C6] to-[#E8C5AE]">
      <svg viewBox="0 0 600 600" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8C5AE" />
            <stop offset="100%" stopColor="#C9967D" />
          </linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8B5A3C" />
            <stop offset="100%" stopColor="#6B4226" />
          </linearGradient>
        </defs>
        <rect width="600" height="380" fill="url(#wall)" />
        <rect y="380" width="600" height="220" fill="url(#floor)" />
        <rect x="60" y="80" width="200" height="240" rx="8" fill="#FFE6CF" stroke="#8B5A3C" strokeWidth="3" />
        <path d="M 100 280 Q 120 200 140 280 M 160 280 Q 180 180 200 280 M 220 280 Q 200 220 180 200" stroke="#0F4D3E" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="200" cy="140" r="28" fill="#F4A261" />
        <ellipse cx="430" cy="540" rx="120" ry="20" fill="#000" opacity="0.15" />
        <rect x="380" y="280" width="100" height="180" rx="40" fill="#2D5A87" />
        <circle cx="430" cy="240" r="50" fill="#D4A574" />
        <path d="M 380 230 Q 430 180 480 230 L 480 220 Q 430 175 380 220 Z" fill="#3E2723" />
        <rect x="450" y="290" width="20" height="100" rx="10" fill="#D4A574" />
        <rect x="440" y="350" width="60" height="100" rx="10" fill="#1A1A1A" />
        <rect x="445" y="358" width="50" height="80" rx="4" fill="#25D366" />
        <rect x="448" y="365" width="44" height="14" rx="3" fill="#FFF" />
        <rect x="448" y="383" width="32" height="10" rx="3" fill="#DCF8C6" />
        <rect x="448" y="397" width="40" height="10" rx="3" fill="#FFF" />
        <rect x="448" y="411" width="28" height="10" rx="3" fill="#DCF8C6" />
      </svg>
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur rounded-2xl px-4 py-3 shadow-xl">
        <div className="text-xs font-bold uppercase tracking-widest text-turquesa-deeper">{persona.role}</div>
        <div className="text-sm font-semibold text-ink mt-0.5">{persona.name} · {badge}</div>
      </div>
      <div className="absolute top-6 right-6 bg-white/95 backdrop-blur rounded-2xl px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="font-semibold text-ink">+{country.currency.symbol}480</span>
        </div>
      </div>
    </div>
  );
}
