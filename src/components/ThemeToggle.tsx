import { useSyncExternalStore } from 'react';
import {
  getServerThemePreference,
  getThemePreference,
  setThemePreference,
  subscribeTheme,
  type ThemePreference,
} from '../lib/theme';

const OPTIONS: { value: ThemePreference; label: string; icon: React.ReactNode }[] = [
  {
    value: 'system',
    label: 'Match system theme',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'light',
    label: 'Light theme',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" fill="currentColor" />
        <path
          d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    value: 'dark',
    label: 'Dark theme',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="currentColor" />
      </svg>
    ),
  },
];

export function ThemeToggle() {
  const preference = useSyncExternalStore(subscribeTheme, getThemePreference, getServerThemePreference);

  return (
    <fieldset className="theme-toggle">
      <legend className="visually-hidden">Color theme</legend>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="theme-toggle__option"
          aria-label={option.label}
          aria-pressed={preference === option.value}
          title={option.label}
          onClick={() => setThemePreference(option.value)}
        >
          {option.icon}
        </button>
      ))}
    </fieldset>
  );
}
