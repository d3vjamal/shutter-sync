/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { Colors, Gradients } from '@/constants/theme';
import { keychainStorage } from '@/lib/keychain-storage';

export type ThemePreference = 'light' | 'dark' | 'system';

const PREFERENCE_KEY = 'theme-preference';

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  scheme: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Wrap the app so `useTheme`/`useGradients` resolve a manual light/dark override, falling back to the OS setting. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    keychainStorage.getItem(PREFERENCE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') setPreferenceState(saved);
    });
  }, []);

  const setPreference = (next: ThemePreference) => {
    setPreferenceState(next);
    keychainStorage.setItem(PREFERENCE_KEY, next).catch(() => {});
  };

  const scheme: 'light' | 'dark' =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo(() => ({ preference, setPreference, scheme }), [preference, scheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme/useGradients must be used within <ThemeProvider>');
  return ctx;
}

export function useTheme() {
  return Colors[useThemeContext().scheme];
}

export function useGradients() {
  return Gradients[useThemeContext().scheme];
}

/** The resolved light/dark mode plus the raw preference, for a settings toggle. */
export function useThemePreference() {
  return useThemeContext();
}
