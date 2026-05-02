import { useEffect, useState } from 'react';
import type { Country, CountrySlug } from '@data/countries';
import { waLink, qrLink } from '@data/countries';
import type { Dict } from '@i18n/index';

interface Props { slug: string; country: Country; dict: Dict }

const COUNTRY_FLAGS: Array<{ code: string; flag: string; label: string }> = [
  { code: 'br', flag: '🇧🇷', label: 'BR' },
  { code: 'mx', flag: '🇲🇽', label: 'MX' },
  { code: 'us', flag: '🇺🇸', label: 'US' },
  { code: 'co', flag: '🇨🇴', label: 'CO' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
  { code: 'ar', flag: '🇦🇷', label: 'AR' },
  { code: 'py', flag: '🇵🇾', label: 'PY' },
  { code: 'pe', flag: '🇵🇪', label: 'PE' },
  { code: 'cl', flag: '🇨🇱', label: 'CL' },
  { code: 'uy', flag: '🇺🇾', label: 'UY' },
  { code: 'bo', flag: '🇧🇴', label: 'BO' },
  { code: 'ec', flag: '🇪🇨', label: 'EC' },
  { code: 'cr', flag: '🇨🇷', label: 'CR' },
];

/** HeroD v4 · R93b multi-LLM debate convergence · 1 primary CTA + WhatsApp mockup show-don't-tell */
export default function HeroD({ slug, country, dict }: Props) {
  const headline = dict.hero.headline_c ?? dict.hero.eyebrow;
  const subline = dict.hero.subline_bold ?? dict.hero.subline;
  const subheadlineAI = (dict.hero as any).subheadline_ai ?? '';
  const ctaMicro = (dict.hero as any).cta_microcopy ?? 'Free · no card';
  const stats: Array<{ value: string; label: string }> = (dict.hero as any).stats ?? [];
  const liveCounterLabel = (dict.hero as any).live_counter_label ?? 'collected today';
  const joinedTodayLabel = (dict.hero as any).joined_today_label ?? 'joined today';
  const foundingLabel = (dict.hero as any).founding_label ?? 'Founding spots left';
  const foundingPerk = (dict.hero as any).founding_perk ?? '−20% for life';
  const watchDemo = (dict.hero as any).watch_demo ?? country.cta.secondary;
  const scanLabel = (dict.hero as any).scan_label ?? 'Scan';
  const scanOnPhone = (dict.hero as any).scan_on_phone ?? 'on your phone';
  const trustStripLabel = (dict.hero as any).trust_strip_label ?? '13 países · 1 mismo bot';

  const USERS_24H_BASE: Record<string, number> = {
    BRL: 3247, MXN: 2184, USD: 1523, COP: 1847, EUR: 956,
    ARS: 1412, PYG: 487, PEN: 1180, CLP: 1056, UYU: 412,
    BOB: 384, CRC: 298,
  };
  const userBase = USERS_24H_BASE[country.currency.code] || 1000;
  const dayOfYear = (() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  })();
  const seedRand = (s: number) => ((s * 9301 + 49297) % 233280) / 233280;
  const dailyVariance = 0.88 + seedRand(dayOfYear) * 0.24;
  const initialUsers = Math.round(userBase * dailyVariance);

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

  const [joined, setJoined] = useState(847);
  useEffect(() => {
    const inc = setInterval(() => setJoined((j) => j + 1), 18000);
    return () => clearInterval(inc);
  }, []);

  const [foundingLeft, setFoundingLeft] = useState(1847);
  useEffect(() => {
    const inc = setInterval(() => setFoundingLeft((f) => Math.max(f - 1, 0)), 60000);
    return () => clearInterval(inc);
  }, []);

  const formatUsers = (n: number) => {
    try {
      const locale = (country as any).locale || 'pt-BR';
      return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);
    } catch {
      return n.toLocaleString();
    }
  };

  return (
    <section
      className="relative text-white overflow-hidden flex flex-col"
      style={{
        backgroundColor: '#14B8A6',
        backgroundImage: 'radial-gradient(ellipse 80% 60% at 20% 20%, rgba(94,234,212,0.35) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 80% 75%, rgba(30,74,212,0.30) 0%, transparent 65%), linear-gradient(135deg, #14B8A6 0%, #0F9488 60%, #1E4AD4 100%)',
      }}
    >
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

        <div className="text-center mt-2 grid lg:grid-cols-[1.2fr_1fr] gap-x-12 gap-y-10 items-center lg:text-left">
          <div className="lg:max-w-2xl mx-auto lg:mx-0">
            <h1
              className="font-display leading-[0.88] tracking-tightest text-white"
              style={{ fontSize: 'clamp(56px, 11vw, 156px)', fontWeight: 800, letterSpacing: '-0.05em', textShadow: '0 4px 60px rgba(0,0,0,0.18)' }}
            >
              {headline.split('.').filter(Boolean).map((part, i) => (
                <span
                  key={i}
                  className="block"
                  style={i === 0
                    ? undefined
                    : {
                        backgroundImage: 'linear-gradient(135deg, #5EEAD4 0%, #A7F3D0 35%, #BAE6FD 75%, #DBEAFE 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent',
                      }
                  }
                >
                  {part.trim()}.
                </span>
              ))}
            </h1>

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
                    <p className="mt-5 text-base md:text-xl text-white font-semibold lg:max-w-xl">
                      {emph(subheadlineAI)}
                    </p>
                  )}
                  <p className="mt-3 text-sm md:text-lg text-white/80 lg:max-w-xl">
                    {emph(subline)}
                  </p>
                </>
              );
            })()}

            <div className="mt-8 flex flex-wrap gap-x-3 gap-y-4 justify-center lg:justify-start items-center">
              <div className="flex flex-col gap-1.5 items-center lg:items-start">
                <a
                  id="cta"
                  href={waLink(slug as CountrySlug)}
                  target="_blank"
                  rel="noopener"
                  className="bg-white text-turquesa-deeper font-bold text-base md:text-lg px-8 md:px-10 py-4 rounded-full hover:bg-paper shadow-2xl hero-cta-spring inline-flex items-center gap-2"
                  style={{ transition: 'transform 0.4s var(--ease-spring), background-color 0.2s var(--ease-out-expo), box-shadow 0.3s var(--ease-out-expo)' }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.157 5.335 5.493 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.413c-.003 6.557-5.339 11.892-11.893 11.892-1.99 0-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.999 5.945L1.998 22l5.656-1.81z"/></svg>
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
            </div>

            {/* Country trust strip · 13 banderitas sutil */}
            <div className="mt-7 flex flex-wrap gap-1.5 justify-center lg:justify-start items-center">
              <span className="text-[11px] uppercase tracking-widest text-white/60 font-bold mr-2">
                {trustStripLabel}
              </span>
              {COUNTRY_FLAGS.map((c) => (
                <span
                  key={c.code}
                  title={c.label}
                  className={`text-base ${c.code === slug ? 'opacity-100 ring-2 ring-white/60 rounded' : 'opacity-70 hover:opacity-100'} transition`}
                >
                  {c.flag}
                </span>
              ))}
            </div>
          </div>

          {/* WhatsApp mockup · show don't tell · convergencia 3/3 LLMs */}
          <WhatsAppMockup country={country} slug={slug} />
        </div>

        <div className="mt-12 grid grid-cols-3 gap-3 md:gap-8 max-w-2xl mx-auto">
          {stats.length > 0
            ? stats.map((s, i) => (
                <div key={i} className="border-l-2 border-white/40 pl-3 md:pl-4 text-left">
                  <div className="font-display text-lg md:text-2xl font-bold text-white tracking-tightest">{s.value}</div>
                  <div className="text-[10px] md:text-xs text-white/70 mt-0.5 uppercase tracking-wider leading-tight">{s.label}</div>
                </div>
              ))
            : [0, 1, 2].map((i) => (
                <div key={i} className="border-l-2 border-white/40 pl-3 md:pl-4 text-left" aria-hidden="true">
                  <div className="skeleton h-7 md:h-8 w-20 md:w-24" />
                  <div className="skeleton h-3 w-16 mt-1.5" />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

function WhatsAppMockup({ country, slug }: { country: Country; slug: string }) {
  const isPT = country.lang === 'pt-BR' || slug === 'br';
  const isEN = country.lang === 'en-US' || slug === 'us';
  const personaName = country.personas?.[0]?.name ?? 'Diego';
  const currency = country.currency.symbol ?? 'R$';
  const amount = isEN ? '450' : '450';

  const lines: Array<{ from: 'bot' | 'user'; text: string; time: string }> = isPT
    ? [
        { from: 'user', text: `Cliente Diego não pagou ainda. Posso cobrar?`, time: '14:32' },
        { from: 'bot', text: `Pode deixar comigo · vou mandar pra ele agora um link de pagamento de ${currency} ${amount}.`, time: '14:32' },
        { from: 'bot', text: `✅ Cobrado · Diego pagou agora ${currency} ${amount} · NFS-e emitida automatic 🎉`, time: '14:35' },
      ]
    : isEN
    ? [
        { from: 'user', text: `Hey · client ${personaName} hasn't paid yet. Can you handle it?`, time: '2:32 PM' },
        { from: 'bot', text: `On it · sending them a payment link for $${amount} now.`, time: '2:32 PM' },
        { from: 'bot', text: `✅ Done · ${personaName} just paid $${amount} · invoice sent automatically 🎉`, time: '2:35 PM' },
      ]
    : [
        { from: 'user', text: `${personaName} todavía no me pagó · ¿podés cobrarle?`, time: '14:32' },
        { from: 'bot', text: `Dale · le mando ahora un link de cobro por ${currency} ${amount}.`, time: '14:32' },
        { from: 'bot', text: `✅ Cobrado · ${personaName} pagó ${currency} ${amount} · factura emitida automatic 🎉`, time: '14:35' },
      ];

  return (
    <div className="hidden lg:block relative max-w-sm mx-auto">
      <div
        className="relative rounded-[2.2rem] overflow-hidden shadow-2xl"
        style={{
          background: '#0B141A',
          border: '8px solid #1F2C33',
          aspectRatio: '9/19',
        }}
      >
        {/* Phone notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20" />

        {/* WA header */}
        <div
          className="flex items-center gap-3 px-4 pt-9 pb-3"
          style={{ background: '#202C33' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: '#14B8A6', color: 'white' }}>Z</div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold text-sm leading-tight">Zymplo</div>
            <div className="text-[10px] flex items-center gap-1" style={{ color: '#8696A0' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
              {isPT ? 'online · digitando…' : isEN ? 'online · typing…' : 'en línea · escribiendo…'}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div
          className="flex flex-col gap-2 px-3 py-4 overflow-hidden"
          style={{
            background: '#0B141A',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M40 10l8 16 16 2-12 12 4 16-16-8-16 8 4-16-12-12 16-2z\' fill=\'%23182229\' opacity=\'0.4\'/%3E%3C/svg%3E")',
            minHeight: '420px',
          }}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className={`max-w-[78%] ${line.from === 'user' ? 'self-end' : 'self-start'}`}
              style={{
                animation: `wamsg-in 0.5s ${i * 0.6}s both var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1))`,
              }}
            >
              <div
                className="px-3 py-2 rounded-lg text-[13px] leading-relaxed shadow-sm"
                style={{
                  background: line.from === 'user' ? '#005C4B' : '#202C33',
                  color: line.from === 'user' ? '#E9EDEF' : '#E9EDEF',
                  borderTopLeftRadius: line.from === 'user' ? '8px' : '2px',
                  borderTopRightRadius: line.from === 'user' ? '2px' : '8px',
                }}
              >
                <div>{line.text}</div>
                <div className="text-[9px] mt-1 text-right" style={{ color: '#8696A0' }}>
                  {line.time} {line.from === 'user' ? '✓✓' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-2 py-2"
          style={{ background: '#202C33' }}
        >
          <div className="flex-1 px-3 py-2 rounded-full text-xs" style={{ background: '#2A3942', color: '#8696A0' }}>
            {isPT ? 'Mensagem' : isEN ? 'Message' : 'Mensaje'}
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#00A884' }}>
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm-7-3a7 7 0 0014 0h-2a5 5 0 01-10 0H5zm6 11h2v-3h-2v3z"/></svg>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes wamsg-in {
          from { opacity: 0; transform: translateY(8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

function FloatingShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      <style>{`
        .hero-cta-spring:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 24px 48px -12px rgba(20, 184, 166, 0.45); }
        .hero-cta-spring:active { transform: translateY(0) scale(0.98); }
        @media (prefers-reduced-motion: reduce) { .hero-cta-spring, .hero-cta-spring:hover, .hero-cta-spring:active { transform: none !important; transition: none !important; } }
      `}</style>
    </div>
  );
}
