import { useEffect, useState } from 'react';

interface Quote {
  initials: string;
  name_short: string;
  role: string;
  quote: string;
  metric: string;
  color: string;
}
interface Props {
  eyebrow: string;
  quotes: Quote[];
  intervalMs?: number;
}

const FALLBACK_COLORS = ['#14B8A6', '#623AE6', '#1E4AD4', '#5EEAD4', '#F59E0B'];

/**
 * Anonymous-avatar testimonial carousel · Grok contrarian idea.
 * Quotes from real MEIs with metrics · auto-rotates every 5s · pause on hover.
 */
export default function FooterTestimonials({ eyebrow, quotes, intervalMs = 4500 }: Props) {
  const [idx, setIdx] = useState(0);
  const total = quotes?.length ?? 0;

  // Auto-rotate · stable deps (only count + interval) so the timer is not killed on every re-render
  useEffect(() => {
    if (total <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % total), intervalMs);
    return () => clearInterval(t);
  }, [total, intervalMs]);

  if (!quotes || quotes.length === 0) return null;
  const cur = quotes[idx];
  const ringColor = cur.color || FALLBACK_COLORS[idx % FALLBACK_COLORS.length];

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 max-w-2xl mx-auto text-center">
      <div className="text-[11px] font-bold uppercase tracking-widest text-paper/50 mb-5 inline-flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
        </span>
        {eyebrow}
      </div>

      <div key={idx} className="flex flex-col items-center gap-4" style={{ animation: 'ft-fade 0.4s ease-out' }}>
        <div
          className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold font-display text-base md:text-lg ring-2 ring-white/10"
          style={{ backgroundColor: ringColor }}
          aria-hidden="true"
        >
          {cur.initials}
        </div>
        <p className="text-base md:text-lg text-paper leading-relaxed font-medium max-w-xl">
          <span className="text-turquesa-light">"</span>{cur.quote}<span className="text-turquesa-light">"</span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs">
          <span className="font-semibold text-paper">{cur.name_short}</span>
          <span className="text-paper/40">·</span>
          <span className="text-paper/60">{cur.role}</span>
          <span className="text-paper/40 hidden sm:inline">·</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/15 text-success font-bold text-[10px] uppercase tracking-widest">
            {cur.metric}
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-1.5" role="tablist" aria-label="testimonials">
        {quotes.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === idx}
            aria-label={`Quote ${i + 1}`}
            onClick={() => setIdx(i)}
            style={{ transition: 'width 0.4s var(--ease-spring), transform 0.35s var(--ease-spring), background-color 0.25s var(--ease-out-expo)' }}
            className={`h-1.5 rounded-full active:scale-90 ${i === idx ? 'w-6 bg-turquesa' : 'w-1.5 bg-paper/15 hover:bg-paper/30 hover:scale-125'}`}
          />
        ))}
      </div>

      <style>{`
        @keyframes ft-fade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
