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
        'card-border': 'rgb(var(--card-border) / 0.1)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        link: 'rgb(var(--link) / <alpha-value>)',
        muted: 'rgb(var(--muted) / 0.5)',
        subtle: 'rgb(var(--subtle) / 0.7)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        'error-foreground': 'rgb(var(--error-foreground) / <alpha-value>)',
        'glow-primary': 'rgb(var(--glow-primary) / <alpha-value>)',
        'glow-accent': 'rgb(var(--glow-accent) / <alpha-value>)',
        'status-active': 'rgb(var(--status-active) / <alpha-value>)',
        'status-completed': 'rgb(var(--status-completed) / <alpha-value>)',
        'status-archived': 'rgb(var(--status-archived) / 0.5)',
        'cat-dev': 'rgb(var(--cat-dev) / <alpha-value>)',
        'cat-cooking': 'rgb(var(--cat-cooking) / <alpha-value>)',
        'cat-daily': 'rgb(var(--cat-daily) / <alpha-value>)',
        'cat-study': 'rgb(var(--cat-study) / <alpha-value>)',
        'cat-exercise': 'rgb(var(--cat-exercise) / <alpha-value>)',
        'cat-invest': 'rgb(var(--cat-invest) / <alpha-value>)',
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
