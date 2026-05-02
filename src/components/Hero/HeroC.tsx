import { useEffect, useState } from 'react';
import type { Country, CountrySlug } from '@data/countries';
import { waLink, qrLink } from '@data/countries';
import type { Dict } from '@i18n/index';

interface Props { slug: string; country: Country; dict: Dict }

/** HeroC v3 RADICAL — consenso 8 LLMs viral. Giant counter live + share buttons + signup ticker + referral + founding scarcity. */
export default function HeroC({ slug, country, dict }: Props) {
  const headline = dict.hero.headline_c ?? dict.hero.eyebrow;
  const subline = dict.hero.subline_bold ?? dict.hero.subline;
  const subheadlineAI = (dict.hero as any).subheadline_ai ?? '';
  const ctaMicro = (dict.hero as any).cta_microcopy ?? 'Free · no card';
  const stats: Array<{ value: string; label: string }> = (dict.hero as any).stats ?? [];
  const liveActivity: string[] = (dict.hero as any).live_activity ?? [];
  const liveCounterLabel = (dict.hero as any).live_counter_label ?? 'collected today';
  const joinedTodayLabel = (dict.hero as any).joined_today_label ?? 'joined today';
  const foundingLabel = (dict.hero as any).founding_label ?? 'Founding spots left';
  const foundingPerk = (dict.hero as any).founding_perk ?? '−20% for life';
  const referralBanner = (dict.hero as any).referral_banner ?? '🎁 Invite 3 · get Pro free 1 year';
  const shareLabel = (dict.hero as any).share_label ?? 'Share';
  const watchDemo = (dict.hero as any).watch_demo ?? country.cta.secondary;
  const scanLabel = (dict.hero as any).scan_label ?? 'Scan';
  const scanOnPhone = (dict.hero as any).scan_on_phone ?? 'on your phone';

  // Nuevos usuarios últimas 24h · base por país (TAM-weighted · MEI/microbiz universe)
  // BR mayor mercado (18M MEI) · PY menor (1.4M cuentapropistas) · resto en función a TAM relativo
  const USERS_24H_BASE: Record<string, number> = {
    BRL: 3247, MXN: 2184, USD: 1523, COP: 1847, EUR: 956,
    ARS: 1412, PYG: 487, PEN: 1180, CLP: 1056, UYU: 412,
    BOB: 384, CRC: 298,
  };
  const ccCode = country.currency.code;
  const userBase = USERS_24H_BASE[ccCode] || 1000;

  // Daily seed (LCG · día del año) → cada día baseline distinto ±12% organic feel
  const dayOfYear = (() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  })();
  const seedRand = (s: number) => ((s * 9301 + 49297) % 233280) / 233280;
  const dailyVariance = 0.88 + seedRand(dayOfYear) * 0.24;
  const initialUsers = Math.round(userBase * dailyVariance);

  // Live counter (animates) · +1 user every 6-12s organic
  const [users, setUsers] = useState(initialUsers);
  useEffect(() => {
    const tick = () => {
      setUsers((u) => u + 1);
      const next = 6000 + Math.random() * 6000;
      timer = setTimeout(tick, next);
    };
    let timer = setTimeout(tick, 6000 + Math.random() * 6000);
    return () => clearTimeout(timer);
  }, []);

  // Joined today counter
  const [joined, setJoined] = useState(847);
  useEffect(() => {
    const inc = setInterval(() => setJoined((j) => j + 1), 18000);
    return () => clearInterval(inc);
  }, []);

  // Founding spots scarcity
  const [foundingLeft, setFoundingLeft] = useState(1847);
  useEffect(() => {
    const inc = setInterval(() => setFoundingLeft((f) => Math.max(f - 1, 0)), 60000);
    return () => clearInterval(inc);
  }, []);

  const [tickerIdx, setTickerIdx] = useState(0);
  useEffect(() => {
    if (liveActivity.length === 0) return;
    const t = setInterval(() => setTickerIdx((i) => (i + 1) % liveActivity.length), 3500);
    return () => clearInterval(t);
  }, [liveActivity.length]);

  // Format número con separadores locales (sin moneda · es contador de usuarios)
  const formatUsers = (n: number) => {
    try {
      const locale = (country as any).locale || 'pt-BR';
      return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);
    } catch {
      return n.toLocaleString();
    }
  };

  const shareUrl = `https://${slug}.zymplo.com/v3/`;
  const shareText = encodeURIComponent(`${headline} → Zymplo`);

  return (
    <section className="relative bg-turquesa text-white overflow-hidden flex flex-col">
      {/* Top live signup banner sticky */}
      <div className="relative z-20 bg-ink/40 backdrop-blur border-b border-white/10 py-2">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-xs md:text-sm font-medium">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-white"><span className="font-bold">{joined.toLocaleString()}</span> {joinedTodayLabel}</span>
          </span>
          <span className="text-white/60">•</span>
          <span className="text-white">🔥 <span className="font-bold text-warning">{foundingLeft.toLocaleString()}</span> {foundingLabel} · <span className="font-semibold">{foundingPerk}</span></span>
        </div>
      </div>

      <FloatingShapes />
      <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16 w-full z-10">

        {/* Counter LIVE · social proof discreto · counter pequeño · jerarquía: headline domina */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-warning opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-warning" />
            </span>
            <span className="font-bold text-white tabular-nums" style={{ fontSize: 'clamp(20px, 3vw, 32px)', letterSpacing: '-0.01em', lineHeight: 1 }}>
              {formatUsers(users)}
            </span>
            <span className="text-white/85 text-[11px] md:text-xs uppercase tracking-widest font-semibold">
              {liveCounterLabel}
            </span>
          </div>
        </div>

        {/* Country flag pill */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-[11px] md:text-xs font-bold uppercase tracking-widest">
            {country.flag} {country.name}
          </div>
        </div>

        {/* HEADLINE GIGANTE · hero · primer impacto visual */}
        <div className="text-center mt-2">
          <h1
            className="font-display leading-[0.88] tracking-tightest text-white"
            style={{ fontSize: 'clamp(64px, 14.5vw, 192px)', fontWeight: 800, letterSpacing: '-0.05em', textShadow: '0 4px 60px rgba(0,0,0,0.18)' }}
          >
            {headline.split('.').filter(Boolean).map((part, i) => (
              <span key={i} className="block">
                {part.trim()}.
              </span>
            ))}
          </h1>

          {/* Notion-style serif emphasis: wraps brand-anchor words (IA · WhatsApp · AI) in italic Lora gradient */}
          {(() => {
            const ANCHORS = ['WhatsApp', 'IA', 'AI'];
            const emph = (text: string) => {
              for (const a of ANCHORS) {
                const idx = text.indexOf(a);
                if (idx !== -1) {
                  return (
                    <>
                      {text.slice(0, idx)}
                      <em className="serif-emph not-italic">{a}</em>
                      {text.slice(idx + a.length)}
                    </>
                  );
                }
              }
              return text;
            };
            return (
              <>
                {subheadlineAI && (
                  <p className="mt-5 text-base md:text-xl text-white font-semibold max-w-2xl mx-auto">
                    {emph(subheadlineAI)}
                  </p>
                )}
                <p className="mt-3 text-sm md:text-lg text-white/80 max-w-2xl mx-auto">
                  {emph(subline)}
                </p>
              </>
            );
          })()}

          {/* CTAs · big primary + watch demo + share buttons inline + QR (desktop only · scan to start) */}
          <div className="mt-8 flex flex-wrap gap-x-3 gap-y-4 justify-center items-center">
            <div className="flex flex-col gap-1.5 items-center">
              <a
                id="cta"
                href={waLink(slug as CountrySlug)}
                target="_blank"
                rel="noopener"
                className="bg-white text-turquesa-deeper font-bold text-base md:text-lg px-8 md:px-10 py-4 rounded-full hover:bg-paper shadow-2xl hero-cta-spring"
                style={{ transition: 'transform 0.4s var(--ease-spring), background-color 0.2s var(--ease-out-expo), box-shadow 0.3s var(--ease-out-expo)' }}
              >
                {country.cta.primary}
              </a>
              <span className="text-xs text-white/70">{ctaMicro}</span>
            </div>
            <a
              href="#chatdemo"
              className="bg-transparent border-2 border-white/40 text-white font-semibold text-sm md:text-base px-6 py-3.5 rounded-full hover:bg-white/10 hover:border-white/80 transition inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              {watchDemo}
            </a>

            {/* Native share group */}
            <div className="flex items-center gap-2 ml-1 md:ml-3 pl-3 md:pl-4 md:border-l border-white/15">
              <span className="hidden md:inline text-xs text-white/60 mr-1">{shareLabel}</span>
              <a aria-label="Share WhatsApp" href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" className="w-9 h-9 rounded-full bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.157 5.335 5.493 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.413c-.003 6.557-5.339 11.892-11.893 11.892-1.99 0-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.999 5.945L1.998 22l5.656-1.81z"/></svg>
              </a>
              <a aria-label="Share X" href={`https://x.com/intent/post?text=${shareText}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" className="w-9 h-9 rounded-full bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a aria-label="Share Telegram" href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareText}`} target="_blank" rel="noopener" className="w-9 h-9 rounded-full bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
            </div>

            {/* QR · scan-to-start · desktop only · complementary to CTA mobile */}
            <div className="hidden lg:flex items-center gap-3 pl-5 ml-1 border-l border-white/15">
              <div className="bg-white rounded-xl p-1.5 shadow-2xl ring-1 ring-white/30">
                <img
                  src={qrLink(slug as CountrySlug, 110)}
                  alt={scanLabel}
                  width={110}
                  height={110}
                  className="w-[110px] h-[110px] block"
                  loading="eager"
                />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[10px] uppercase tracking-widest text-white/70 font-bold">{scanLabel}</div>
                <div className="text-sm font-semibold text-white whitespace-nowrap">{scanOnPhone}</div>
                <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/60">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
                  </span>
                  WhatsApp
                </div>
              </div>
            </div>
          </div>

          {/* Stats hero */}
          {stats.length > 0 && (
            <div className="mt-10 grid grid-cols-3 gap-3 md:gap-8 max-w-2xl mx-auto">
              {stats.map((s, i) => (
                <div key={i} className="border-l-2 border-white/40 pl-3 md:pl-4 text-left">
                  <div className="font-display text-lg md:text-2xl font-bold text-white tracking-tightest">{s.value}</div>
                  <div className="text-[10px] md:text-xs text-white/70 mt-0.5 uppercase tracking-wider leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Live activity ticker */}
          {liveActivity.length > 0 && (
            <div className="mt-7 inline-flex items-center gap-2.5 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span key={tickerIdx} className="text-xs md:text-sm text-white/95 font-medium animate-fade-in">
                {liveActivity[tickerIdx]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom referral banner */}
      <div className="relative z-10 bg-ink/30 backdrop-blur border-t border-white/10 py-3">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm">
          <span className="text-white font-semibold">{referralBanner}</span>
          <a href={waLink(slug as CountrySlug)} target="_blank" rel="noopener" className="text-warning font-bold hover:underline inline-flex items-center gap-1">→</a>
        </div>
      </div>
    </section>
  );
}

function FloatingShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute -top-20 -right-32 w-[500px] h-[500px] rounded-full opacity-30 hidden md:block"
        style={{ background: 'radial-gradient(circle at 30% 30%, #5EEAD4 0%, #14B8A6 60%, #0F9488 100%)', filter: 'blur(2px)', animation: 'float-slow 14s ease-in-out infinite' }}
      />
      <div
        className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full opacity-25 hidden md:block"
        style={{ background: 'radial-gradient(circle at 30% 30%, #CCFBF1 0%, #5EEAD4 60%, transparent 100%)', filter: 'blur(2px)', animation: 'float-slow 18s ease-in-out infinite reverse' }}
      />
      <div
        className="absolute top-1/3 left-1/4 w-[120px] h-[120px] rounded-full opacity-50 hidden lg:block"
        style={{ background: 'radial-gradient(circle at 30% 30%, #FFFFFF 0%, #CCFBF1 70%, transparent 100%)', filter: 'blur(1px)', animation: 'float-slow 11s ease-in-out infinite' }}
      />
      <div
        className="absolute inset-0 md:hidden opacity-30"
        style={{ background: 'radial-gradient(circle at 80% 20%, #5EEAD4 0%, transparent 50%), radial-gradient(circle at 20% 80%, #CCFBF1 0%, transparent 50%)', filter: 'blur(20px)' }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      <style>{`
        @keyframes float-slow { 0%,100% { transform: translate(0,0) } 33% { transform: translate(20px,-30px) } 66% { transform: translate(-20px,15px) } }
        .hero-cta-spring:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 24px 48px -12px rgba(20, 184, 166, 0.45); }
        .hero-cta-spring:active { transform: translateY(0) scale(0.98); }
        @media (prefers-reduced-motion: reduce) { .hero-cta-spring, .hero-cta-spring:hover, .hero-cta-spring:active { transform: none !important; transition: none !important; } }
      `}</style>
    </div>
  );
}
