import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/novel/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'heading-xl': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-lg': ['1.75rem', { lineHeight: '1.25', fontWeight: '700' }],
        'heading-md': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-sm': ['1rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['0.9375rem', { lineHeight: '1.6' }],
        body: ['0.875rem', { lineHeight: '1.6' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.5' }],
        caption: ['0.75rem', { lineHeight: '1.4' }],
        'caption-sm': ['0.6875rem', { lineHeight: '1.4' }],
        'caption-xs': ['0.625rem', { lineHeight: '1.3' }],
      },
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        'card-border': 'var(--card-border)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        link: 'var(--link)',
        muted: 'var(--muted)',
        subtle: 'var(--subtle)',
        surface: 'var(--surface)',
        error: 'var(--error)',
        'error-foreground': 'var(--error-foreground)',
        'glow-primary': 'var(--glow-primary)',
        'glow-accent': 'var(--glow-accent)',
        'status-active': 'var(--status-active)',
        'status-completed': 'var(--status-completed)',
        'status-archived': 'var(--status-archived)',
        'cat-dev': 'var(--cat-dev)',
        'cat-cooking': 'var(--cat-cooking)',
        'cat-daily': 'var(--cat-daily)',
        'cat-study': 'var(--cat-study)',
        'cat-exercise': 'var(--cat-exercise)',
        'cat-invest': 'var(--cat-invest)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            fontSize: '1.0625rem',
            lineHeight: '1.8',
            code: {
              backgroundColor: 'var(--surface)',
              color: 'var(--primary)',
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            h2: {
              marginTop: '2.5em',
              letterSpacing: '-0.02em',
            },
            blockquote: {
              borderLeftColor: 'var(--primary)',
            },
            img: {
              borderRadius: '0.5rem',
              border: '1px solid var(--card-border)',
            },
          },
        },
        invert: {
          css: {
            code: {
              backgroundColor: '#2D2D2D',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
