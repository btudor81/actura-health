import animate from 'tailwindcss-animate';

// Tailwind 3.4 on purpose: v4 needs Chrome 111+, the audience runs older county browsers.
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    // One body size (20px, older audience), small text floor 16px. The 21st.dev
    // components use text-xs / text-sm freely, so the scale itself is remapped.
    fontSize: {
      xs: ['1rem', { lineHeight: '1.5' }],
      sm: ['1rem', { lineHeight: '1.5' }],
      base: ['1.25rem', { lineHeight: '1.6' }],
      lg: ['1.375rem', { lineHeight: '1.25' }],
      xl: ['1.625rem', { lineHeight: '1.2' }],
      '2xl': ['clamp(1.875rem, 3vw, 2.5rem)', { lineHeight: '1.12' }],
      '3xl': ['clamp(2.125rem, 4.5vw, 4rem)', { lineHeight: '1.06' }],
    },
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      colors: {
        navy: '#0f0068',
        gold: '#d89b00',
        ink: '#15134a',
        tint: { DEFAULT: '#f3f8fe', 2: '#e5f0fd', 3: '#d3e5fb', 4: '#c0d9f8' },
        bad: '#a3261b',
        // shadcn names, mapped to the Actura tokens
        background: '#ffffff',
        foreground: '#2a2950',
        primary: { DEFAULT: '#0f0068', foreground: '#ffffff' },
        secondary: { DEFAULT: '#e5f0fd', foreground: '#15134a' },
        muted: { DEFAULT: '#f3f8fe', foreground: '#5a5980' },
        accent: { DEFAULT: '#f3f8fe', foreground: '#15134a' },
        destructive: { DEFAULT: '#a3261b', foreground: '#ffffff' },
        card: { DEFAULT: '#ffffff', foreground: '#2a2950' },
        popover: { DEFAULT: '#ffffff', foreground: '#2a2950' },
        border: 'rgba(20, 52, 110, 0.12)',
        input: '#8582a6',
        ring: '#0f0068',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        tile: 'var(--shadow-tile)',
        float: 'var(--shadow-float)',
        control: 'var(--shadow-control)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [animate],
};
