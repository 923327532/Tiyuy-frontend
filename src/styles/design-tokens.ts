/**
 * TIYUY Design System - Centralized Design Tokens
 * Single source of truth for all visual design decisions
 */

// ============================================
// COLOR PALETTE - Semantic & Brand Colors
// ============================================

export const colors = {
  // Brand colors (TIYUY Green)
  brand: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Primary brand
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    DEFAULT: '#4A9A3E', // Legacy brand green
    light: '#5dae4c',
    dark: '#3d8b35',
  },

  // Primary (Blue) - for primary actions, links, focus states
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

  // Neutral grays
  neutral: {
    0: '#ffffff',
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
    950: '#030712',
  },

  // Semantic colors
  semantic: {
    success: {
      light: '#dcfce7',
      DEFAULT: '#22c55e',
      dark: '#16a34a',
      onLight: '#166534',
      onDark: '#dcfce7',
    },
    warning: {
      light: '#fef3c7',
      DEFAULT: '#f59e0b',
      dark: '#d97706',
      onLight: '#92400e',
      onDark: '#fef3c7',
    },
    danger: {
      light: '#fee2e2',
      DEFAULT: '#ef4444',
      dark: '#dc2626',
      onLight: '#991b1b',
      onDark: '#fee2e2',
    },
    info: {
      light: '#dbeafe',
      DEFAULT: '#3b82f6',
      dark: '#2563eb',
      onLight: '#1e40af',
      onDark: '#dbeafe',
    },
  },

  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    inverse: '#0f172a',
    // Admin sidebar dark
    adminSidebar: '#0f2e3a',
    adminSidebarHover: 'rgba(255,255,255,0.05)',
    adminSidebarActive: 'rgba(255,255,255,0.1)',
    adminSidebarBorder: 'rgba(255,255,255,0.1)',
  },

  // Text colors
  text: {
    primary: '#111827',
    secondary: '#4b5563',
    tertiary: '#6b7280',
    quaternary: '#9ca3af',
    inverse: '#ffffff',
    onBrand: '#ffffff',
    onPrimary: '#ffffff',
    disabled: '#9ca3af',
    // Admin sidebar text
    adminSidebar: '#e2e8f0',
    adminSidebarMuted: '#94a3b8',
  },

  // Border colors
  border: {
    light: '#e5e7eb',
    DEFAULT: '#d1d5db',
    dark: '#9ca3af',
    focus: '#3b82f6',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    // Admin sidebar
    adminSidebar: 'rgba(255,255,255,0.1)',
  },

  // Overlay
  overlay: {
    light: 'rgba(15, 23, 42, 0.4)',
    medium: 'rgba(15, 23, 42, 0.6)',
    heavy: 'rgba(15, 23, 42, 0.8)',
  },
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },

  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],      // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
    '5xl': ['3rem', { lineHeight: '1' }],           // 48px
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },

  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
  },
} as const;

// ============================================
// SPACING
// ============================================

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  9: '2.25rem',   // 36px
  10: '2.5rem',   // 40px
  11: '2.75rem',  // 44px
  12: '3rem',     // 48px
  14: '3.5rem',   // 56px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px,
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  DEFAULT: '0.375rem', // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  // Card specific
  card: '0 1px 2px 0 rgb(15 46 58 / 0.04)',
  cardHover: '0 4px 12px -2px rgb(15 46 58 / 0.08)',
  // Admin specific
  adminCard: '0 1px 2px 0 rgb(15 46 58 / 0.04)',
  adminCardHover: '0 4px 12px -2px rgb(15 46 58 / 0.08)',
} as const;

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================
// TRANSITIONS
// ============================================

export const transitions = {
  fast: '150ms ease',
  DEFAULT: '200ms ease',
  slow: '300ms ease',
  spring: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ============================================
// Z-INDEX
// ============================================

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1200,
  popover: 1300,
  tooltip: 1400,
  toast: 1500,
} as const;

// ============================================
// ICON SIZES
// ============================================

export const iconSizes = {
  xs: '12px',
  sm: '16px',
  DEFAULT: '20px',
  lg: '24px',
  xl: '28px',
  '2xl': '32px',
} as const;

// ============================================
// COMPONENT HEIGHTS
// ============================================

export const controlHeights = {
  xs: '28px',
  sm: '36px',
  DEFAULT: '44px',
  lg: '52px',
  xl: '60px',
} as const;

// ============================================
// CONTAINER WIDTHS
// ============================================

export const container = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px', // Admin dashboard max width
  full: '100%',
} as const;

// ============================================
// EXPORT ALL TOKENS
// ============================================

export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  transitions,
  zIndex,
  iconSizes,
  controlHeights,
  container,
} as const;

export type DesignTokens = typeof designTokens;
export type ColorScale = keyof typeof colors.brand;
export type SemanticColor = keyof typeof colors.semantic;