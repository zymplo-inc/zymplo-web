import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Country } from '@data/countries';
import type { Dict } from '@i18n/index';

interface Props { slug: string; country: Country; dict: Dict }

/** Hero — cinematográfico · SVG procedural "video tubes" + typewriter rotate. */
export default function Hero({ slug, country, dict }: Props) {
  const [idx, setIdx] = useState(0);
  const phrases = dict.hero.rotate;
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % phrases.length), 3000);
    return () => clearInterval(t);
  }, [phrases.length]);

  return (
    <section className="relative overflow-hidden bg-ink text-paper isolate">
      {/* ── Liquid-glass tubes (SVG procedural · respects prefers-reduced-motion) ── */}
      <Tubes />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/60 to-ink pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-32 md:pt-32 md:pb-40 grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full liquid-glass text-xs font-bold uppercase tracking-widest text-turquesa-light"
          >
            <span className="w-2 h-2 rounded-full bg-turquesa-light animate-breathe" />
            {country.flag} {country.name} · {country.influencer.name}{country.influencer.status === 'tbd' && <span className="opacity-60">(TBD)</span>}
          </motion.div>

          <h1 className="mt-6 font-display font-bold text-5xl md:text-7xl leading-[0.95] tracking-tightest">
            <span className="block text-paper">zymplo</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="block bg-gradient-to-r from-turquesa-light via-turquesa to-turquesa-light bg-clip-text text-transparent"
              >
                {phrases[idx]}
              </motion.span>
            </AnimatePresence>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-paper/70 max-w-xl">{dict.hero.subline}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a id="cta" href="#" className="bg-turquesa hover:bg-turquesa-dark text-white font-semibold text-base px-7 py-4 rounded-full transition shadow-[0_8px_30px_rgba(20,184,166,0.4)]">
              {country.cta.primary}
            </a>
            <a href="#chatdemo" className="liquid-glass text-paper font-semibold text-base px-7 py-4 rounded-full hover:bg-paper/10 transition">
              {country.cta.secondary}
            </a>
          </div>

          <p className="mt-8 text-sm text-paper/50">⭐⭐⭐⭐⭐ {dict.hero.trust}</p>
        </div>

        {/* Right column — animated isotipo + persona chip */}
        <div className="relative h-[420px] hidden md:block">
          <motion.img
            src="https://sims.zymplo.com/brand/isotipo.svg" alt="" aria-hidden="true"
            initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 m-auto w-64 h-64 drop-shadow-[0_0_60px_rgba(20,184,166,0.6)]"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="absolute bottom-4 left-4 liquid-glass rounded-2xl px-4 py-3 text-sm"
          >
            <div className="text-turquesa-light text-xs font-bold uppercase tracking-widest">{country.personas[0].role}</div>
            <div className="text-paper font-semibold mt-1">{country.personas[0].name} · acaba de cobrar</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Procedural liquid-glass tubes background. Pure SVG; no Three.js. */
function Tubes() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="tube1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.0" />
          <stop offset="50%" stopColor="#5EEAD4" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.0" />
        </linearGradient>
        <linearGradient id="tube2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#623AE6" stopOpacity="0.0" />
          <stop offset="50%" stopColor="#1E4AD4" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#623AE6" stopOpacity="0.0" />
        </linearGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="40" /></filter>
      </defs>
      <g filter="url(#blur)">
        <path d="M -200,400 Q 400,100 800,500 T 1800,300" stroke="url(#tube1)" strokeWidth="240" fill="none">
          <animate attributeName="d" dur="14s" repeatCount="indefinite"
            values="M -200,400 Q 400,100 800,500 T 1800,300;
                    M -200,500 Q 400,200 800,400 T 1800,400;
                    M -200,400 Q 400,100 800,500 T 1800,300" />
        </path>
        <path d="M -200,700 Q 500,300 1000,800 T 1800,600" stroke="url(#tube2)" strokeWidth="200" fill="none">
          <animate attributeName="d" dur="18s" repeatCount="indefinite"
            values="M -200,700 Q 500,300 1000,800 T 1800,600;
                    M -200,600 Q 500,400 1000,700 T 1800,700;
                    M -200,700 Q 500,300 1000,800 T 1800,600" />
        </path>
        <path d="M -200,200 Q 600,500 1200,200 T 1800,500" stroke="url(#tube1)" strokeWidth="160" fill="none" opacity="0.6">
          <animate attributeName="d" dur="22s" repeatCount="indefinite"
            values="M -200,200 Q 600,500 1200,200 T 1800,500;
                    M -200,300 Q 600,400 1200,300 T 1800,400;
                    M -200,200 Q 600,500 1200,200 T 1800,500" />
        </path>
      </g>
    </svg>
  );
}
