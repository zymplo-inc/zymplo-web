import { useEffect, useState } from 'react';

interface Item {
  city: string;
  state: string;
  count: number;
  metric: string;
  emoji?: string;
}
interface Props {
  items: Item[];
  eyebrow: string;
  title: string;
  intervalMs?: number;
}

const ACCENT_GRADIENTS = [
  'linear-gradient(135deg, #14B8A6 0%, #1E4AD4 100%)',
  'linear-gradient(135deg, #5EEAD4 0%, #14B8A6 100%)',
  'linear-gradient(135deg, #1E4AD4 0%, #623AE6 100%)',
  'linear-gradient(135deg, #14B8A6 0%, #623AE6 100%)',
  'linear-gradient(135deg, #0F9488 0%, #14B8A6 100%)',
];

/**
 * Geo-testimonios dinámicos · Uber-inspired social proof per region.
 * Rotates an array of city-level success metrics every ~3s.
 * 5 LLMs in the debate converged on this idea (Haiku + Sonnet + Qwen + Llama + GPT).
 */
export default function GeoTestimonials({ items, eyebrow, title, intervalMs = 3500 }: Props) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!items || items.length === 0) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), intervalMs);
    return () => clearInterval(t);
  }, [items, intervalMs]);

  if (!items || items.length === 0) return null;
  const cur = items[idx];
  const cityInitial = (cur.city || '?').trim().charAt(0).toUpperCase();
  const gradient = ACCENT_GRADIENTS[idx % ACCENT_GRADIENTS.length];

  return (
    <section className="gt-section relative bg-paper py-14 md:py-20 border-y border-ink/5 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-success/10 text-success text-[11px] font-bold uppercase tracking-widest">
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
            </span>
            {eyebrow}
          </span>
        </span>
        <h2 className="mt-3 font-display text-2xl md:text-4xl font-bold tracking-tightest leading-tight">
          {title}
        </h2>

        <div
          key={idx}
          className="gt-card mt-8 inline-flex items-center gap-4 bg-white rounded-3xl border-2 border-turquesa/15 px-5 py-4 md:px-7 md:py-5 shadow-lg max-w-xl text-left"
          style={{ animation: 'gt-fade 0.5s var(--ease-spring)' }}
        >
          <div
            className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-display font-bold text-white text-lg md:text-xl ring-2 ring-white shadow-md relative"
            style={{ background: gradient }}
            aria-hidden="true"
          >
            {cityInitial}
            <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-base">
              {cur.emoji ?? '🚀'}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 text-lg md:text-xl">
              <span className="font-display font-bold text-turquesa-deeper">
                {cur.count.toLocaleString()}
              </span>
              <span className="font-semibold text-ink">{cur.city}</span>
              {cur.state && <span className="text-ink/40 text-xs hidden sm:inline">{cur.state}</span>}
            </div>
            <div className="mt-1 text-sm md:text-base text-slate font-medium leading-snug">
              {cur.metric}
            </div>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="mt-5 flex items-center justify-center gap-1.5" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === idx}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-turquesa' : 'w-1.5 bg-ink/20 hover:bg-ink/40'}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gt-fade {
          from { opacity: 0; transform: translateY(6px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  );
}
