import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { Colors, Gradients, type GradientSet, type Palette } from '@/constants/theme';
import { clampLuminance, darken, lighten, mix, normalizeHex, readableOn } from '@/lib/color';
import { keychainStorage } from '@/lib/keychain-storage';

export type ThemePreference = 'light' | 'dark' | 'system';

const PREFERENCE_KEY = 'theme-preference';
const PRIMARY_KEY = 'theme-primary';
const SECONDARY_KEY = 'theme-secondary';

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  /** User-picked brand colours (`null` = built-in ShutterSync palette). */
  primaryColor: string | null;
  secondaryColor: string | null;
  setBrandColors: (colors: { primary: string | null; secondary: string | null }) => void;
  scheme: 'light' | 'dark';
  palette: Palette;
  gradients: GradientSet;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function resolveTheme(scheme: 'light' | 'dark', primary: string | null, secondary: string | null) {
  const palette: Palette = { ...Colors[scheme] };
  const gradients: GradientSet = { ...Gradients[scheme] };
  const [lo, hi] = scheme === 'dark' ? [0.16, 0.5] : [0.02, 0.32];

  if (primary) {
    const p = clampLuminance(primary, lo, hi);
    palette.primary = p;
    palette.onPrimary = readableOn(p);
    gradients.primary = scheme === 'dark' ? [p, lighten(p, 0.3)] : [darken(p, 0.35), lighten(p, 0.12)];
    gradients.hero = [mix(palette.background, p, 0.1), mix(palette.background, p, 0.04), palette.background];
  }
  if (secondary) {
    const s = clampLuminance(secondary, lo, hi + 0.1);
    palette.accent = s;
    gradients.accent = scheme === 'dark' ? [s, lighten(s, 0.3)] : [darken(s, 0.15), lighten(s, 0.2)];
  }
  return { palette, gradients };
}

/** Wrap the app so `useTheme`/`useGradients` resolve the light/dark choice plus the user's brand colours. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [primaryColor, setPrimary] = useState<string | null>(null);
  const [secondaryColor, setSecondary] = useState<string | null>(null);

  useEffect(() => {
    keychainStorage.getItem(PREFERENCE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') setPreferenceState(saved);
    });
    keychainStorage.getItem(PRIMARY_KEY).then((saved) => setPrimary(saved ? normalizeHex(saved) : null));
    keychainStorage.getItem(SECONDARY_KEY).then((saved) => setSecondary(saved ? normalizeHex(saved) : null));
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    keychainStorage.setItem(PREFERENCE_KEY, next).catch(() => {});
  }, []);

  const setBrandColors = useCallback(
    ({ primary, secondary }: { primary: string | null; secondary: string | null }) => {
      setPrimary(primary);
      setSecondary(secondary);
      const persist = (key: string, value: string | null) =>
        (value ? keychainStorage.setItem(key, value) : keychainStorage.removeItem(key)).catch(() => {});
      persist(PRIMARY_KEY, primary);
      persist(SECONDARY_KEY, secondary);
    },
    [],
  );

  const scheme: 'light' | 'dark' =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo(() => {
    const { palette, gradients } = resolveTheme(scheme, primaryColor, secondaryColor);
    return { preference, setPreference, primaryColor, secondaryColor, setBrandColors, scheme, palette, gradients };
  }, [preference, setPreference, primaryColor, secondaryColor, setBrandColors, scheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme/useGradients must be used within <ThemeProvider>');
  return ctx;
}

export function useTheme() {
  return useThemeContext().palette;
}

export function useGradients() {
  return useThemeContext().gradients;
}

/** Resolved light/dark mode, the raw preference and the brand colours, for the Appearance settings. */
export function useThemePreference() {
  return useThemeContext();
}
