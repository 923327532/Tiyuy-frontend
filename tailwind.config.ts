import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/presentation/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'text-brand',
    'border-brand',
    'bg-brand',
    'bg-brand-light',
    'text-teal-600',
    'bg-teal-600',
    'hover:bg-teal-700',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#61BF53',
          light: 'rgba(74, 154, 62, 0.10)',
          'light-hover': 'rgba(74, 154, 62, 0.18)',
          dark: '#498D42',
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
