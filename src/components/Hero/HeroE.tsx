import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Country, CountrySlug } from '@data/countries';
import { waLink } from '@data/countries';
import type { Dict } from '@i18n/index';

interface Props { slug: string; country: Country; dict: Dict }

interface Superpower { icon: string; title: string; desc: string }
interface DemoLine { from: 'user' | 'bot'; text: string; time: string }

/** HeroE v5 · R93d outcome-driven · "Tu negocio funciona solo · hablando por WhatsApp" · animated demo · 4 superpowers · 2 CTAs · FOMO bar */
export default function HeroE({ slug, country, dict }: Props) {
  const h = dict.hero as any;
  const headline = h.headline_d ?? h.headline_c ?? h.eyebrow;
  const subline = h.subline_d ?? h.subheadline_ai ?? h.subline;
  const ctaPrimary = h.cta_primary_v2 ?? country.cta.primary;
  const ctaDemo = h.cta_demo_v2 ?? 'Demo · 47s';
  const fomoBar = h.fomo_bar ?? '+18,000 businesses automating with Zymplo';
  const ctaMicro = h.cta_microcopy ?? 'No app · no signup · free forever';
  const liveCounterLabel = h.live_counter_label ?? 'collected today';
  const stats: Array<{ value: string; label: string }> = h.stats ?? [];
  const taglineWarm = h.tagline_warm ?? '';
  const trustStripLabel = h.trust_strip_label ?? '13 COUNTRIES · 1 SAME BOT';
  const COUNTRY_FLAGS = ['🇧🇷','🇲🇽','🇺🇸','🇨🇴','🇪🇸','🇦🇷','🇵🇾','🇵🇪','🇨🇱','🇺🇾','🇧🇴','🇪🇨','🇨🇷'];

  const superpowers: Superpower[] = h.superpowers ?? [
    { icon: '💰', title: 'Auto-collections', desc: 'Reminders without typing a word' },
    { icon: '📄', title: 'Invoices in 3 seconds', desc: 'Right from chat · no login' },
    { icon: '📊', title: 'Your business answers', desc: 'Ask anything · instant reply' },
    { icon: '📅', title: 'Smart scheduling', desc: 'Clients and reminders on autopilot' },
  ];

  const demoLines: DemoLine[] = h.demo_lines ?? [
    { from: 'user', text: 'How much did I sell today?', time: '2:32 PM' },
    { from: 'bot', text: 'You collected $2,341 today · 12 invoices pending · Send them payment links?', time: '2:32 PM' },
    { from: 'user', text: 'Yes', time: '2:33 PM' },
    { from: 'bot', text: '✅ 12 links sent · 8 paid in 6 min · $1,560 collected 🎉', time: '2:39 PM' },
  ];

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

  const formatUsers = (n: number) => {
    try {
      const locale = (country as any).locale || 'pt-BR';
      return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);
    } catch {
      return n.toLocaleString();
    }
  };

  // Demo conversation animation · sequential reveal · loop
  const [visibleLines, setVisibleLines] = useState(0);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    let timers: number[] = [];
    const cycle = () => {
      setVisibleLines(0);
      let acc = 800;
      demoLines.forEach((line, idx) => {
        if (line.from === 'bot') {
          timers.push(window.setTimeout(() => setTyping(true), acc));
          acc += 1300; // typing visible 1.3s · feels real
          timers.push(window.setTimeout(() => setTyping(false), acc));
        }
        timers.push(window.setTimeout(() => setVisibleLines(idx + 1), acc));
        // R93j · slow down · 3.5s avg per message · readable
        acc += line.text.length > 60 ? 4200 : line.text.length > 30 ? 3500 : 2800;
      });
      // restart loop after long pause · let user complete read
      timers.push(window.setTimeout(cycle, acc + 8000));
    };
    cycle();
    return () => timers.forEach(clearTimeout);
  }, [demoLines.length]);

  return (
    <section
      className="relative text-white overflow-hidden flex flex-col"
      style={{
        backgroundColor: '#14B8A6',
        backgroundImage: 'radial-gradient(ellipse 80% 60% at 20% 20%, rgba(94,234,212,0.35) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 80% 75%, rgba(30,74,212,0.30) 0%, transparent 65%), linear-gradient(135deg, #14B8A6 0%, #0F9488 60%, #1E4AD4 100%)',
      }}
    >
      {/* FOMO bar (top sticky) */}
      <div className="relative z-20 bg-ink/40 backdrop-blur border-b border-white/10 py-2.5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs md:text-sm font-medium">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-white"><span className="font-bold">{fomoBar}</span></span>
          </span>
          <span className="hidden md:inline text-white/50">·</span>
          <span className="hidden md:inline text-white/85">
            <span className="font-bold tabular-nums">{formatUsers(users)}</span>{' '}
            <span className="text-white/65 uppercase tracking-widest text-[10px]">{liveCounterLabel}</span>
          </span>
        </div>
      </div>

      <FloatingShapes />

      <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16 w-full z-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-x-12 xl:gap-x-20 2xl:gap-x-24 gap-y-12 lg:items-start items-center text-center lg:text-left">
          {/* LEFT · Outcome headline + subline + 2 CTAs + 4 superpowers */}
          <div>
            <h1
              className="font-display leading-[0.92] tracking-tightest text-white"
              style={{ fontSize: 'clamp(40px, 7.5vw, 108px)', fontWeight: 800, letterSpacing: '-0.04em', textShadow: '0 4px 60px rgba(0,0,0,0.18)' }}
            >
              {headline.split('. ').filter(Boolean).map((part: string, i: number) => {
                  const fullPart = part.endsWith('.') ? part : part + '.';
                  // R93t · "En WhatsApp." MUCHO MÁS llamativo · gradient animado Apple "Wonderful"-style · sheen blanco viajando + glow pulsante turquesa · WhatsApp brand green accent en mid-stop
                  const waIdx = fullPart.indexOf('WhatsApp');
                  if (waIdx !== -1) {
                    return (
                      <span
                        key={i}
                        className="block whitespace-nowrap zymplo-wa-shimmer"
                        style={{
                          backgroundImage: 'linear-gradient(110deg, #FFFFFF 0%, #5EEAD4 22%, #FFFFFF 38%, #25D366 50%, #FFFFFF 62%, #5EEAD4 78%, #FFFFFF 100%)',
                          backgroundSize: '300% 100%',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          color: 'transparent',
                        }}
                      >
                        {fullPart}
                      </span>
                    );
                  }
                  return (
                    <span key={i} className="block">
                      {fullPart}
                    </span>
                  );
                })}
            </h1>

            <p className="mt-6 text-base md:text-lg text-white/85 lg:max-w-xl leading-relaxed">
              {subline}
            </p>

            {/* Tagline warm · cierre emocional · italic sutil */}
            {taglineWarm && (
              <p className="mt-4 text-sm md:text-base text-white/75 italic font-medium lg:max-w-xl">
                {taglineWarm}
              </p>
            )}

            {/* CTAs · 1 primary + 1 demo */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start items-center">
              <div className="flex flex-col gap-1.5 items-center lg:items-start">
                <a
                  id="cta"
                  href={waLink(slug as CountrySlug)}
                  target="_blank"
                  rel="noopener"
                  className="bg-white text-turquesa-deeper font-bold text-base md:text-lg px-7 md:px-9 py-4 rounded-full hover:bg-paper shadow-2xl hero-cta-spring inline-flex items-center gap-2.5"
                  style={{ transition: 'transform 0.4s var(--ease-spring), background-color 0.2s var(--ease-out-expo), box-shadow 0.3s var(--ease-out-expo)' }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.157 5.335 5.493 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.413c-.003 6.557-5.339 11.892-11.893 11.892-1.99 0-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.999 5.945L1.998 22l5.656-1.81z"/></svg>
                  {ctaPrimary}
                </a>
                <span className="text-xs text-white/75 text-center self-center block max-w-[280px] sm:max-w-md leading-snug mt-1">{ctaMicro}</span>
              </div>
              <a
                href="#chatdemo"
                className="bg-transparent border-2 border-white/40 text-white font-semibold text-sm md:text-base px-5 py-3.5 rounded-full hover:bg-white/10 hover:border-white/80 transition inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                {ctaDemo}
              </a>
            </div>

          </div>

          {/* RIGHT · animated WhatsApp mockup demo · MOBILE: aparece después de CTAs · ANTES de superpoderes (R93m fix) */}
          <AnimatedDemo lines={demoLines} visibleLines={visibleLines} typing={typing} country={country} />
        </div>

        {/* 4 superpowers + trust strip · FUERA del grid · full-width · mobile order: AFTER iPhone (R93m) */}
        <div className="mt-10 lg:mt-14 max-w-3xl lg:max-w-4xl mx-auto lg:mx-0">
          <div className="grid grid-cols-2 gap-3">
            {superpowers.slice(0, 4).map((sp, i) => (
              <div
                key={i}
                className="bg-white/8 backdrop-blur rounded-2xl px-4 py-3.5 border border-white/15 text-left hover:bg-white/12 transition"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-2xl shrink-0 leading-none mt-0.5">{sp.icon}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-sm leading-snug">{sp.title}</div>
                    <div className="text-[11px] md:text-xs text-white/65 mt-0.5 leading-snug">{sp.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust strip · 13 países · banderitas */}
          <div className="mt-7 flex flex-wrap gap-2 items-center justify-center">
            <span className="text-[11px] uppercase tracking-widest text-white/65 font-bold mr-2">
              {trustStripLabel}
            </span>
            {COUNTRY_FLAGS.map((flag, i) => (
              <span
                key={i}
                className="text-base md:text-lg opacity-80 hover:opacity-100 transition"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
              >
                {flag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats below */}
        {stats.length > 0 && (
          <div className="mt-14 grid grid-cols-3 gap-3 md:gap-8 max-w-2xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="border-l-2 border-white/40 pl-3 md:pl-4 text-left">
                <div className="font-display text-lg md:text-2xl font-bold text-white tracking-tightest">{s.value}</div>
                <div className="text-[10px] md:text-xs text-white/70 mt-0.5 uppercase tracking-wider leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AnimatedDemo({ lines, visibleLines, typing, country }: { lines: DemoLine[]; visibleLines: number; typing: boolean; country: Country }) {
  const isPT = country.lang === 'pt-BR';
  const isEN = country.lang === 'en-US';
  const onlineLabel = isPT ? 'online · digitando…' : isEN ? 'online · typing…' : 'en línea · escribiendo…';
  const inputPlaceholder = isPT ? 'Mensagem' : isEN ? 'Message' : 'Mensaje';

  // R93k · ref + useLayoutEffect · NO remount on each msg · NO parpadeo
  const chatRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    if (el.scrollHeight > el.clientHeight) {
      el.scrollTop = el.scrollHeight;
    }
  }, [visibleLines, typing]);

  return (
    <div className="relative w-[320px] xl:w-[340px] mx-auto lg:ml-4 xl:ml-8" style={{ contain: 'layout' }}>
      {/* Phone frame · R93u · breathing micro-motion + glow pulsante turquesa · FIXED dims */}
      <div
        className="zymplo-phone-frame relative rounded-[2.4rem] overflow-hidden"
        style={{
          background: '#0B141A',
          border: '9px solid #1F2C33',
          width: '320px',
          height: '660px',
        }}
      >
        {/* Phone notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-20" />

        {/* WA header · fixed height */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-3 relative z-10" style={{ background: '#202C33', height: '74px' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg" style={{ background: '#14B8A6', color: 'white' }}>Z</div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold text-sm leading-tight">Zymplo</div>
            <div className="text-[10px] flex items-center gap-1" style={{ color: '#8696A0' }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
              </span>
              {onlineLabel}
            </div>
          </div>
        </div>

        {/* Chat area · FIXED height · ref + useLayoutEffect (NO key remount · NO parpadeo) */}
        <div
          ref={chatRef}
          className="flex flex-col gap-2 px-3 py-4"
          style={{
            background: '#0B141A',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M40 10l8 16 16 2-12 12 4 16-16-8-16 8 4-16-12-12 16-2z\' fill=\'%23182229\' opacity=\'0.4\'/%3E%3C/svg%3E")',
            height: '510px',
            overflowY: 'auto',
            scrollBehavior: 'auto',
            scrollbarWidth: 'none',
            contain: 'strict',
          }}
        >
          {lines.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className={`max-w-[82%] ${line.from === 'user' ? 'self-end' : 'self-start'}`}
              style={{
                // R93u · stable key + animation SOLO en último mensaje · resto estático · zero parpadeo · entry slower con blur fade-in
                animation: i === visibleLines - 1 ? 'wamsg-pop-smooth 0.65s cubic-bezier(0.22, 1, 0.36, 1) both' : 'none',
              }}
            >
              <div
                className="px-3 py-2 rounded-lg text-[13px] leading-relaxed shadow-md"
                style={{
                  background: line.from === 'user' ? '#005C4B' : '#202C33',
                  color: '#E9EDEF',
                  borderTopLeftRadius: line.from === 'user' ? '8px' : '2px',
                  borderTopRightRadius: line.from === 'user' ? '2px' : '8px',
                }}
              >
                <div>{line.text}</div>
                <div className="text-[9px] mt-1 text-right" style={{ color: '#8696A0' }}>
                  {line.time} {line.from === 'user' ? <span style={{ color: '#53BDEB' }}>✓✓</span> : null}
                </div>
              </div>
            </div>
          ))}
          {typing && (
            <div className="self-start max-w-[60%]" style={{ animation: 'wamsg-pop 0.3s ease-out both' }}>
              <div className="px-4 py-3 rounded-lg shadow-md inline-flex items-center gap-1" style={{ background: '#202C33', borderTopLeftRadius: '2px' }}>
                <span className="dot dot1" />
                <span className="dot dot2" />
                <span className="dot dot3" />
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-2 py-2" style={{ background: '#202C33' }}>
          <div className="flex-1 px-3 py-2 rounded-full text-xs" style={{ background: '#2A3942', color: '#8696A0' }}>
            {inputPlaceholder}
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#00A884' }}>
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm-7-3a7 7 0 0014 0h-2a5 5 0 01-10 0H5zm6 11h2v-3h-2v3z"/></svg>
          </div>
        </div>
      </div>

      {/* floating money badge · subtle rotation on entry */}
      <div className="absolute -bottom-3 -left-3 hidden md:block bg-success text-white rounded-full px-3 py-1.5 text-xs font-bold shadow-2xl ring-4 ring-success/20 animate-bounce-soft">
        💸 +$2,341 hoy
      </div>

      <style>{`
        @keyframes wamsg-pop {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(0.4); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .dot {
          width: 6px; height: 6px; background: #8696A0; border-radius: 50%;
          animation: dot-bounce 1.2s infinite ease-in-out;
        }
        .dot1 { animation-delay: 0s; }
        .dot2 { animation-delay: 0.15s; }
        .dot3 { animation-delay: 0.3s; }
        .animate-bounce-soft { animation: bounce-soft 2s ease-in-out infinite; }
        /* R93u · message entry slower + smoother · blur fade-in + scale */
        @keyframes wamsg-pop-smooth {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.94);
            filter: blur(2px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        /* R93u · phone breathing micro-motion · float + tilt sutil · 7s ciclo */
        @keyframes phone-breath {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(0.35deg); }
        }
        /* R93u · phone glow turquesa pulsante · halo lit-from-within */
        @keyframes phone-glow-pulse {
          0%, 100% {
            box-shadow:
              0 30px 80px -15px rgba(0, 0, 0, 0.5),
              0 0 70px -10px rgba(94, 234, 212, 0.28),
              0 0 0 1px rgba(255, 255, 255, 0.05);
          }
          50% {
            box-shadow:
              0 36px 100px -15px rgba(0, 0, 0, 0.55),
              0 0 130px -10px rgba(94, 234, 212, 0.5),
              0 0 60px -10px rgba(20, 184, 166, 0.35),
              0 0 0 1px rgba(255, 255, 255, 0.08);
          }
        }
        .zymplo-phone-frame {
          animation: phone-breath 7s ease-in-out infinite, phone-glow-pulse 4.5s ease-in-out infinite;
          will-change: transform, box-shadow;
        }
        @media (prefers-reduced-motion: reduce) {
          .zymplo-phone-frame { animation: none !important; }
        }
        /* R93t · "En WhatsApp." Apple "Wonderful"-style · sheen white viajando + glow pulsante */
        @keyframes zymplo-wa-shimmer-anim {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes zymplo-wa-glow-anim {
          0%, 100% { filter: drop-shadow(0 4px 24px rgba(94, 234, 212, 0.55)) drop-shadow(0 0 32px rgba(255, 255, 255, 0.35)); }
          50% { filter: drop-shadow(0 6px 38px rgba(94, 234, 212, 0.85)) drop-shadow(0 0 56px rgba(37, 211, 102, 0.4)) drop-shadow(0 0 28px rgba(255, 255, 255, 0.55)); }
        }
        .zymplo-wa-shimmer {
          animation: zymplo-wa-shimmer-anim 5.5s ease-in-out infinite, zymplo-wa-glow-anim 3.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .zymplo-wa-shimmer { animation: none !important; }
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

