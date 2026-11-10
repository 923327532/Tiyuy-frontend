export const tiyuyColors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  brand: {
    DEFAULT: '#4A9A3E',
    light: '#5dae4c',
    dark: '#3d8b35',
  },

  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
  },

  text: {
    primary: '#1f2937',
    secondary: '#4b5563',
    tertiary: '#6b7280',
    inverse: '#ffffff',
  },

  border: {
    light: '#e5e7eb',
    medium: '#d1d5db',
    dark: '#9ca3af',
  },
} as const;

export const tiyuyTheme = {
  extend: {
    colors: {
      tiyuy: tiyuyColors.primary,
      'tiyuy-green': tiyuyColors.secondary,
      brand: tiyuyColors.brand,
    },
    boxShadow: {
      tiyuy:
        '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)',
      'tiyuy-lg':
        '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
    },
  },
};

export const getTiyuyClass = (color: string, shade: number = 500) => {
  return `text-tiyuy-${shade}`;
};

export const getTiyuyBgClass = (color: string, shade: number = 500) => {
  return `bg-tiyuy-${shade}`;
};

export const getTiyuyBorderClass = (color: string, shade: number = 500) => {
  return `border-tiyuy-${shade}`;
};