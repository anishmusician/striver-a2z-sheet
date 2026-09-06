import { useCallback, useEffect } from 'react';

export type Theme = 'light';

const THEME_STORAGE_KEY = 'strivers_a2z_theme_v1';

export function getInitialTheme(): Theme {
  return 'light';
}

export function applyTheme(_theme: Theme = 'light'): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('dark');
  root.classList.add('light');
  root.setAttribute('data-theme', 'light');
  root.style.colorScheme = 'light';

  try {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
  } catch {
    // ignore
  }
}

export function useTheme() {
  useEffect(() => {
    applyTheme('light');
  }, []);

  const setTheme = useCallback((_newTheme: Theme) => {
    applyTheme('light');
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme('light');
  }, []);

  return {
    theme: 'light' as const,
    isDark: false,
    isLight: true,
    setTheme,
    toggleTheme,
  };
}
