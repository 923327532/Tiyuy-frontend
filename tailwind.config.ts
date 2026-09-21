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
      },
      keyframes: {
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
