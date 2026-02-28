import { createContext, useContext, useState, useEffect, createElement } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "ss-theme";

/** Read stored value, fall back to "system" */
function getInitialTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {}
  return "system";
}

/** Apply the resolved class to <html> */
function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  root.classList.add(resolved);
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    try { localStorage.setItem(STORAGE_KEY, newTheme); } catch {}
    applyTheme(newTheme);
  };

  useEffect(() => {
    applyTheme(theme);

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  // No JSX — use createElement so this .js file stays valid
  return createElement(ThemeContext.Provider, { value: { theme, setTheme } }, children);
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
