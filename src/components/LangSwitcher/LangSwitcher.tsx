import { useState, useRef, useEffect } from 'react';
import { COUNTRIES, COUNTRY_SLUGS, type CountrySlug } from '@data/countries';

interface Props { currentSlug: CountrySlug }

export default function LangSwitcher({ currentSlug }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  const current = COUNTRIES[currentSlug];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink/5 hover:bg-ink/10 text-sm font-semibold transition"
        aria-label="Switch language"
        aria-expanded={open}
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline uppercase text-xs">{currentSlug}</span>
        <span className="text-xs opacity-50">▾</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-56 bg-paper border border-ink/10 rounded-2xl shadow-xl py-2 z-50">
          {COUNTRY_SLUGS.map((s) => {
            const c = COUNTRIES[s];
            const active = s === currentSlug;
            return (
              <a key={s} href={`/${s}/`} role="menuitem"
                 className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-ink/5 ${active ? 'font-bold' : ''}`}>
                <span className="text-lg">{c.flag}</span>
                <span className="flex-1">{c.name}</span>
                <span className="text-xs text-mute uppercase">{s}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
