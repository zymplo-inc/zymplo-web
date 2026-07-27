import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { waLink, qrLink, type CountrySlug } from '@data/countries';

interface Props {
  slug: CountrySlug;
  dict: any;
}

/**
 * "My account" header button.
 * Click → modal with QR (WhatsApp deep-link) + "Open WhatsApp" CTA.
 * Zymplo flow: account = your WhatsApp · no separate login.
 */
export default function MyAccount({ slug, dict }: Props) {
  const [open, setOpen] = useState(false);
  const a = (dict.my_account ?? {}) as any;
  const label = a.label ?? 'My account';
  const title = a.title ?? 'Open Zymplo on your WhatsApp';
  const subtitle = a.subtitle ?? 'Your account lives inside WhatsApp · no app · no login.';
  const scanLabel = a.scan_label ?? 'Scan with your phone';
  const orLabel = a.or_label ?? 'or';
  const openCta = a.open_cta ?? 'Open WhatsApp';
  const help = a.help ?? 'Already a customer? Just message us · we recognize you.';

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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-slate hover:text-turquesa-deeper transition px-3 py-2 rounded-full border border-ink/10 hover:border-turquesa/50 bg-white/60"
        aria-label={label}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0116 0v1" /></svg>
        {label}
      </button>

      {open && typeof document !== 'undefined' && createPortal((
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-[1000] overflow-y-auto overscroll-contain"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          {/* Backdrop · pointer-events-none so clicks fall through to the scroll container */}
          <div className="fixed inset-0 bg-ink/55 backdrop-blur-sm pointer-events-none" aria-hidden="true" />
          {/* Scroll container · `min-h-screen` + `my-auto` on the card centers vertically when there is space
              and gracefully allows scroll from top when content is taller than the viewport. */}
          <div
            className="relative min-h-screen w-full flex flex-col px-4 py-6 sm:py-10"
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <div
              className="relative bg-white rounded-3xl shadow-2xl border border-ink/10 w-full max-w-[420px] mx-auto my-auto overflow-hidden"
              style={{ animation: 'ma-pop 0.22s cubic-bezier(0.2,0.9,0.3,1.2)' }}
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

              <div className="p-5 sm:p-7 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-turquesa/10 text-turquesa-deeper text-[11px] font-bold uppercase tracking-widest mb-3 sm:mb-4">
                  <img src="/brand/isotipo.svg" alt="" className="w-4 h-4" />
                  Zymplo
                </div>
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tightest leading-tight">{title}</h3>
                <p className="mt-2 text-sm text-slate">{subtitle}</p>

                {/* QR · responsive (180 mobile · 200 desktop) */}
                <div className="mt-5 sm:mt-6 inline-block bg-white rounded-2xl border-2 border-turquesa/20 p-3 sm:p-4 shadow-lg">
                  <img
                    src={qrLink(slug, 200)}
                    alt={scanLabel}
                    className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] block"
                    width={200}
                    height={200}
                    loading="eager"
                  />
                </div>
                <div className="mt-2 sm:mt-3 text-xs text-slate font-medium uppercase tracking-widest">{scanLabel}</div>

                {/* Divider */}
                <div className="my-4 sm:my-5 flex items-center gap-3">
                  <span className="flex-1 h-px bg-ink/10" />
                  <span className="text-xs text-mute uppercase tracking-widest">{orLabel}</span>
                  <span className="flex-1 h-px bg-ink/10" />
                </div>

                <a
                  href={waLink(slug)}
                  target="_blank"
                  rel="noopener"
                  className="block w-full bg-turquesa hover:bg-turquesa-dark hover:-translate-y-0.5 active:translate-y-0 text-white font-bold text-base py-3 sm:py-3.5 rounded-full shadow-md hover:shadow-lg"
                  style={{ transition: 'transform 0.4s var(--ease-spring), background-color 0.2s var(--ease-out-expo), box-shadow 0.3s var(--ease-out-expo)' }}
                >
                  {openCta}
                </a>

                <p className="mt-3 sm:mt-4 text-xs text-mute leading-relaxed">{help}</p>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes ma-pop {
              from { opacity: 0; transform: translateY(8px) scale(0.97); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
        </div>
      ), document.body)}
    </>
  );
}
