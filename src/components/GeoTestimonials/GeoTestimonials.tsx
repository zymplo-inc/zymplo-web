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

  return (
    <section className="bg-paper py-14 md:py-20 border-y border-ink/5">
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
          className="mt-8 inline-block bg-white rounded-3xl border-2 border-turquesa/15 px-6 py-5 md:px-8 md:py-6 shadow-lg max-w-xl"
          style={{ animation: 'gt-fade 0.5s ease-out' }}
        >
          <div className="flex items-center justify-center gap-3 text-xl md:text-2xl">
            <span>{cur.emoji ?? '🚀'}</span>
            <span className="font-display font-bold text-turquesa-deeper">
              {cur.count.toLocaleString()}
            </span>
            <span className="text-ink/80">·</span>
            <span className="font-semibold text-ink">{cur.city}</span>
            {cur.state && <span className="text-ink/40 text-sm hidden sm:inline">{cur.state}</span>}
          </div>
          <div className="mt-2 text-base md:text-lg text-slate font-medium">
            {cur.metric}
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
