'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { themes, defaultTheme, defaultColorScheme, ColorScheme } from '@/lib/themes';

type ThemeKey = keyof typeof themes;

interface ThemeContextType {
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
  themeName: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'wouldbymarty-theme';
const COLOR_SCHEME_KEY = 'wouldbymarty-color-scheme';

function getSystemColorScheme(): ColorScheme {
  if (typeof window === 'undefined') return defaultColorScheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialTheme(): ThemeKey {
  if (typeof window === 'undefined') return defaultTheme;
  const stored = localStorage.getItem(THEME_KEY);
  if (stored && stored in themes) {
    return stored as ThemeKey;
  }
  return defaultTheme;
}

function getInitialColorScheme(): ColorScheme {
  if (typeof window === 'undefined') return defaultColorScheme;
  const stored = localStorage.getItem(COLOR_SCHEME_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return getSystemColorScheme();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>(defaultTheme);
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(defaultColorScheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeState(getInitialTheme());
    setColorSchemeState(getInitialColorScheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(COLOR_SCHEME_KEY, colorScheme);
  }, [colorScheme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-color-scheme', colorScheme);
  }, [theme, colorScheme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(COLOR_SCHEME_KEY);
      if (!stored) {
        setColorSchemeState(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted]);

  const setTheme = (newTheme: ThemeKey) => {
    setThemeState(newTheme);
  };

  const toggleColorScheme = () => {
    setColorSchemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const themeName = themes[theme]?.name || 'Modern Artisan';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        colorScheme,
        toggleColorScheme,
        themeName,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
