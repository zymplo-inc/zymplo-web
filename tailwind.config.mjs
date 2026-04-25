/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        zymplo: {
          DEFAULT: '#14B8A6',
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0F9488',
          700: '#0D7B70',
          800: '#115E59',
          900: '#134E4A',
        },
        ink: '#000000',
        bg: '#FAFBFF',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        accent: '#623AE6',
        info: '#1E4AD4',
      },
      fontFamily: {
        sans: ['"Manrope Variable"', 'Manrope', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '70ch',
      },
    },
  },
  plugins: [],
};
