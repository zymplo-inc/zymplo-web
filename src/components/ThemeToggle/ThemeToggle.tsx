import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'zymplo-theme';

function getInitial(): Theme {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function apply(theme: Theme) {
  const html = document.documentElement;
  if (theme === 'dark') html.setAttribute('data-theme', 'dark');
  else html.removeAttribute('data-theme');
}

export default function ThemeToggle({ ariaLabel = 'Toggle theme' }: { ariaLabel?: string }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const initial = getInitial();
    setTheme(initial);
    apply(initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    apply(next);
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch {}
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={ariaLabel}
      aria-pressed={isDark}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--bg-overlay)] hover:bg-[color:var(--bg-sunken)] focus:outline-none focus-visible:ring-2 focus-visible:ring-turquesa transition-transform active:scale-95"
      title={isDark ? 'Light mode' : 'Dark mode'}
      style={{ transitionTimingFunction: 'var(--ease-spring)' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          color: 'var(--fg-primary)',
          opacity: isDark ? 0 : 1,
          transform: isDark ? 'rotate(-90deg) scale(0.6)' : 'rotate(0) scale(1)',
          transition: 'opacity .25s var(--ease-out-expo), transform .35s var(--ease-spring)',
          position: 'absolute',
        }}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          color: 'var(--fg-primary)',
          opacity: isDark ? 1 : 0,
          transform: isDark ? 'rotate(0) scale(1)' : 'rotate(90deg) scale(0.6)',
          transition: 'opacity .25s var(--ease-out-expo), transform .35s var(--ease-spring)',
          position: 'absolute',
        }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
