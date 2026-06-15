import { useState, useEffect, useCallback } from "react";

/** Supported theme values. */
export type Theme = "light" | "dark";

/** Return object structure for the useTheme hook. */
export interface UseThemeResult {
  /** The current active theme ('light' or 'dark'). */
  theme: Theme;
  /** Boolean indicating if the active theme is dark mode. */
  isDark: boolean;
  /** Function to switch between light and dark themes. */
  toggleTheme: () => void;
}

/**
 * Custom React hook for managing application light/dark theme modes.
 * Syncs theme state with DOM element attribute and localStorage.
 *
 * @returns {UseThemeResult} Theme state and utility functions.
 */
export function useTheme(): UseThemeResult {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("regai-theme") as Theme | null;
    return saved ?? "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("regai-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return { theme, isDark: theme === "dark", toggleTheme };
}

