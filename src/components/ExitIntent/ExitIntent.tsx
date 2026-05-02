import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { waLink, type CountrySlug } from '@data/countries';

interface Props {
  slug: CountrySlug;
  dict: any;
}

/**
 * Exit-intent recovery modal.
 * Desktop: triggers on mouseleave near the top edge once per session.
 * Mobile: triggers on rapid scroll-up + history back attempt heuristic (visibilitychange).
 * Only shows once per browser session (sessionStorage flag) and after 12s minimum dwell.
 */
export default function ExitIntent({ slug, dict }: Props) {
  const [open, setOpen] = useState(false);
  const ei = (dict.exit_intent ?? {}) as any;
  const eyebrow = ei.eyebrow ?? 'Wait!';
  const title = ei.title ?? 'Talk to a human · 2 minutes · no commitment';
  const subtitle = ei.subtitle ?? 'Quick chat on WhatsApp · we’ll show you how Zymplo works in your case · then you decide.';
  const cta = ei.cta ?? 'Yes · talk for 2 min';
  const dismiss = ei.dismiss ?? 'No thanks';
  const perks: string[] = ei.perks ?? [
    'No card · no install · no pressure',
    'Real human · responds in WhatsApp',
    '100% free · today',
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('zy-exit-shown') === '1') return;

    const startedAt = Date.now();
    let armed = false;
    const armT = setTimeout(() => { armed = true; }, 12_000); // arm after 12s

    const trigger = () => {
      if (!armed || open) return;
      if (sessionStorage.getItem('zy-exit-shown') === '1') return;
      sessionStorage.setItem('zy-exit-shown', '1');
      setOpen(true);
    };

    const onMouseLeave = (e: MouseEvent) => {
      // Top-edge exit (toward the address bar)
      if (e.clientY <= 0) trigger();
    };

    let lastY = window.scrollY;
    let lastT = Date.now();
    const onScroll = () => {
      const now = Date.now();
      const dt = now - lastT;
      const dy = window.scrollY - lastY;
      // Rapid scroll up of >300px in <250ms = suspected back/exit on mobile
      if (dy < -300 && dt < 250 && window.innerWidth < 768) trigger();
      lastY = window.scrollY;
      lastT = now;
    };

    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(armT);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal((
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[1010] overflow-y-auto overscroll-contain"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm pointer-events-none" aria-hidden="true" />
      <div
        className="relative min-h-screen w-full flex flex-col px-4 py-6 sm:py-10"
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      >
        <div
          className="relative bg-white rounded-3xl shadow-2xl border border-ink/10 w-full max-w-[460px] mx-auto my-auto overflow-hidden"
          style={{ animation: 'ei-pop 0.28s cubic-bezier(0.2,0.9,0.3,1.2)' }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-paper hover:bg-ink/10 hover:scale-110 active:scale-95 flex items-center justify-center"
            style={{ transition: 'transform 0.35s var(--ease-spring), background-color 0.2s var(--ease-out-expo)' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>

          <div className="bg-gradient-to-br from-turquesa to-azul text-white p-6 text-center">
            <div className="text-3xl">👋</div>
            <div className="mt-1.5 inline-block px-2 py-0.5 rounded-full bg-white/15 backdrop-blur text-[11px] font-bold uppercase tracking-widest">
              {eyebrow}
            </div>
            <h3 className="mt-3 font-display text-2xl md:text-3xl font-bold tracking-tightest leading-tight">
              {title}
            </h3>
          </div>

          <div className="p-6 text-center">
            <p className="text-sm md:text-base text-slate leading-relaxed">{subtitle}</p>

            <ul className="mt-4 space-y-1.5 text-sm">
              {perks.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-left">
                  <svg className="w-4 h-4 mt-0.5 text-success shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                  <span className="text-ink/85">{p}</span>
                </li>
              ))}
            </ul>

            <a
              href={waLink(slug)}
              target="_blank"
              rel="noopener"
              onClick={() => setOpen(false)}
              className="mt-5 block w-full bg-turquesa hover:bg-turquesa-dark hover:-translate-y-0.5 active:translate-y-0 text-white font-bold text-base py-3.5 rounded-full shadow-md hover:shadow-lg"
              style={{ transition: 'transform 0.4s var(--ease-spring), background-color 0.2s var(--ease-out-expo), box-shadow 0.3s var(--ease-out-expo)' }}
            >
              {cta}
            </a>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 text-xs text-mute hover:text-ink transition py-2"
            >
              {dismiss}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ei-pop {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  ), document.body);
}
