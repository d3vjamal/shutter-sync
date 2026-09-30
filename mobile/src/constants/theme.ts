/**
 * Color tokens mirror the web app's design system (../src/styles.css), converted
 * from HSL to hex, so the mobile UI matches the web look where it makes sense.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#141925',
    background: '#F9FAFB',
    backgroundElement: '#ECEFF4',
    backgroundSelected: '#DCE2EA',
    textSecondary: '#60728A',
    primary: '#1E4976',
    accent: '#C97D1E',
    card: '#FFFFFF',
    border: '#E1E7EF',
    destructive: '#EF4444',
    success: '#16A34A',
    onPrimary: '#FFFFFF',
  },
  dark: {
    text: '#EEF2F7',
    background: '#05080F',
    backgroundElement: '#161D2D',
    backgroundSelected: '#1B2232',
    textSecondary: '#8796AB',
    primary: '#5C9BD8',
    accent: '#F0B84C',
    card: '#10162A',
    border: '#232C40',
    destructive: '#F87171',
    success: '#4ADE80',
    onPrimary: '#FFFFFF',
  },
} as const;

/** Brand gradients: the ShutterSync mark's own navy and gold blade tones. */
export const Gradients = {
  light: {
    primary: ['#173257', '#3E74AC'],
    accent: ['#C97D1E', '#F0B84C'],
    success: ['#16A34A', '#0EA5A4'],
    hero: ['#EAF0F8', '#FDF3E4', '#FFF7EC'],
  },
  dark: {
    primary: ['#3E74AC', '#7EB2E0'],
    accent: ['#E8A23A', '#F7D488'],
    success: ['#22C55E', '#14B8A6'],
    hero: ['#0B1220', '#1A140A', '#05080F'],
  },
} as const;

export type GradientName = keyof typeof Gradients.light;

export const Shadow = {
  soft: {
    shadowColor: '#0B1B4D',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  glow: {
    shadowColor: '#1E4976',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** Resolved palette: `Colors` widened so primary/accent can be user-customised. */
export type Palette = { [K in ThemeColor]: string };
export type GradientSet = { [K in GradientName]: readonly string[] };

/** Curated primary + secondary pairs offered in Appearance; `null` colours mean the built-in brand. */
export const ThemePresets = [
  { key: 'brand', name: 'ShutterSync', primary: null, secondary: null },
  { key: 'emerald', name: 'Emerald', primary: '#0F766E', secondary: '#D97706' },
  { key: 'rose', name: 'Rose', primary: '#BE185D', secondary: '#0E7490' },
  { key: 'violet', name: 'Violet', primary: '#6D28D9', secondary: '#EA580C' },
  { key: 'crimson', name: 'Crimson', primary: '#B91C1C', secondary: '#0369A1' },
  { key: 'graphite', name: 'Graphite', primary: '#334155', secondary: '#CA8A04' },
] as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = 14;

export const MaxContentWidth = 800;
