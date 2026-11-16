
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',

  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  safelist: [
    'text-brand',
    'text-brand-dark',
    'text-brand-bright',
    'border-brand',
    'bg-brand',
    'bg-brand-light',
    'bg-brand-light-hover',
    'hover:bg-brand-dark',
    'text-teal-600',
    'bg-teal-600',
    'hover:bg-teal-700',
  ],

  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--brand-primary)',
          dark: 'var(--brand-primary-hover)',
          bright: '#5dae4c',
          light: 'var(--brand-primary-light)',
          'light-hover': 'var(--brand-primary-light-hover)',
        },

        surface: {
          DEFAULT: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          card: 'var(--bg-card)',
        },

        content: {
          DEFAULT: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          muted: 'var(--text-muted)',
        },

        border: {
          DEFAULT: 'var(--border-color)',
          light: 'var(--border-light)',
          input: 'var(--input-border)',
        },
      },

      maxWidth: {
        '8xl': '90rem',
      },

      animation: {
        blob: 'blob 7s infinite',
        'menu-fade-in': 'menu-fade-in 200ms ease-out',
        'menu-slide-in': 'menu-slide-in 200ms ease-out',
        'menu-drop-in': 'menu-drop-in 150ms ease-out',
      },

      keyframes: {
        'menu-fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'menu-slide-in': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'menu-drop-in': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
    },
  },

  plugins: [],
};

export default config;
