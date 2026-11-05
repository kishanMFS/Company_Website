'use client';

import { useEffect, useSyncExternalStore } from 'react';

function subscribeToTheme(onChange: () => void) {
  document.addEventListener('themechange', onChange);
  return () => {
    document.removeEventListener('themechange', onChange);
  };
}

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.classList.contains('dark'),
    () => false
  );

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');
    const shouldUseDark =
      savedTheme === 'dark' ||
      (savedTheme === null &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    applyTheme(shouldUseDark);
    document.dispatchEvent(new Event('themechange'));
  }, []);

  function toggleTheme() {
    const nextIsDark = !isDark;
    window.localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
    applyTheme(nextIsDark);
    document.dispatchEvent(new Event('themechange'));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 px-4 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
    >
      {isDark ? 'Light mode' : 'Dark mode'}
    </button>
  );
}
