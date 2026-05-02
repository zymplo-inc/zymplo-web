import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}'],
  theme: {
    extend: {
      colors: {
        turquesa: {
          DEFAULT: '#14B8A6',
          dark: '#0F9488',
          light: '#5EEAD4',
          paler: '#CCFBF1',
          deeper: '#0B6B62',
        },
        azul: '#1E4AD4',
        purple: '#623AE6',
        // Hardcoded literal · dark mode aplica via CSS overrides selectivos en tokens.css (NO via tailwind bridge global)
        // Bridge previo causaba text-paper invisible en dark mode (text → bg color cuando era para text)
        ink: '#0A0B14',
        paper: '#FAFBFF',
        slate: '#1F2937',
        mute: '#6B7280',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Manrope', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'breathe': 'breathe 2.4s ease-in-out infinite',
        'float': 'float 14s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'count-up': 'countUp 0.6s ease-out',
      },
      keyframes: {
        breathe: { '0%, 100%': { opacity: '0.4' }, '50%': { opacity: '1' } },
        float: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '33%': { transform: 'translate(8px,-16px)' },
          '66%': { transform: 'translate(-12px,8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        countUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
} satisfies Config;
