import { useState, useEffect } from 'react';
import { waLink, type CountrySlug } from '@data/countries';

interface Props {
  slug: CountrySlug;
  dict: any;
}

/**
 * Floating chat widget (Hostinger Kodee-inspired).
 * Bottom-right · pill collapsed · panel expanded with 3 quick options + WhatsApp deep-link.
 * Brand turquesa · accessible · respects reduced-motion.
 */
export default function ChatWidget({ slug, dict }: Props) {
  const [open, setOpen] = useState(false);
  const w = (dict.chat_widget ?? {}) as any;
  const greeting = w.greeting ?? 'Hi! How can I help you today?';
  const persona = w.persona ?? 'Zé · your AI secretary';
  const titleLabel = w.title ?? 'Chat with Zymplo';
  const askPlaceholder = w.ask_placeholder ?? 'Ask anything…';
  const quick: Array<{ icon: string; text: string; intent: string }> = w.quick ?? [
    { icon: '🚀', text: 'I want to start free', intent: 'start' },
    { icon: '💰', text: 'How does pricing work?', intent: 'pricing' },
    { icon: '🤝', text: 'Need help choosing', intent: 'help' },
  ];
  const tagline = w.tagline ?? 'Replies in WhatsApp · 100% free';

  // Esc closes the panel
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = (intent: string, label: string) => {
    const url = `${waLink(slug)}%20%C2%B7%20${encodeURIComponent(label)}`;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <div className="fixed z-[60] right-4 bottom-4 md:right-6 md:bottom-6 print:hidden" aria-live="polite">
      {/* Collapsed pill */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={titleLabel}
          className="group flex items-center gap-2.5 bg-turquesa hover:bg-turquesa-dark text-white font-semibold pl-3 pr-4 md:pl-3.5 md:pr-5 py-3 rounded-full shadow-2xl shadow-turquesa/40 transition-all hover:scale-105"
          style={{ animation: 'cw-bounce 4s ease-in-out infinite' }}
        >
          <span className="relative flex">
            <span className="absolute inline-flex h-9 w-9 rounded-full bg-white/30 opacity-75 animate-ping" />
            <span className="relative flex items-center justify-center h-9 w-9 rounded-full bg-white">
              <img src="https://sims.zymplo.com/brand/isotipo.svg" alt="" className="h-6 w-6" />
            </span>
          </span>
          <span className="text-sm md:text-[15px]">{titleLabel}</span>
        </button>
      )}

      {/* Expanded panel */}
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={titleLabel}
          className="bg-white rounded-3xl shadow-2xl border border-ink/10 w-[min(96vw,380px)] overflow-hidden"
          style={{ animation: 'cw-slide 0.24s cubic-bezier(0.2,0.9,0.3,1.2)' }}
        >
          {/* Header */}
          <div className="bg-turquesa text-white p-5 relative">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-white/15 transition flex items-center justify-center"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full bg-white p-2 ring-4 ring-white/30">
                <img src="https://sims.zymplo.com/brand/isotipo.svg" alt="" className="w-full h-full" />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success rounded-full ring-2 ring-turquesa" />
              </div>
              <div>
                <div className="font-display font-bold text-lg leading-tight">{titleLabel}</div>
                <div className="text-xs text-white/80 mt-0.5">{persona}</div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 max-h-[min(70vh,520px)] overflow-y-auto">
            <div className="bg-paper rounded-2xl rounded-tl-md p-3.5 text-sm text-ink leading-relaxed">
              <span className="block text-[11px] font-bold uppercase tracking-widest text-turquesa-deeper mb-1">Zé</span>
              {greeting}
            </div>

            <div className="space-y-2">
              {quick.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => send(q.intent, q.text)}
                  className="w-full flex items-center gap-3 text-left bg-white border border-ink/10 hover:border-turquesa/60 hover:bg-turquesa/5 rounded-2xl px-3.5 py-3 transition group"
                >
                  <span className="text-xl">{q.icon}</span>
                  <span className="flex-1 text-sm font-medium text-ink leading-tight">{q.text}</span>
                  <svg className="w-4 h-4 text-mute group-hover:text-turquesa-deeper group-hover:translate-x-0.5 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M9 6l6 6-6 6" /></svg>
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const q = String(fd.get('q') || '').trim();
                if (!q) return;
                send('custom', q);
              }}
              className="flex items-center gap-2 bg-paper rounded-2xl border border-ink/10 px-1 py-1 focus-within:border-turquesa transition"
            >
              <input
                name="q"
                type="text"
                placeholder={askPlaceholder}
                aria-label={askPlaceholder}
                className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
                autoComplete="off"
              />
              <button
                type="submit"
                aria-label="Send"
                className="w-9 h-9 rounded-xl bg-turquesa hover:bg-turquesa-dark text-white flex items-center justify-center transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l14-7-7 14-2-5-5-2z" /></svg>
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-paper/60 border-t border-ink/5 text-[11px] text-mute leading-snug text-center">
            {tagline}
          </div>
        </div>
      )}

      <style>{`
        @keyframes cw-bounce {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes cw-slide {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-live="polite"] button[type="button"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
