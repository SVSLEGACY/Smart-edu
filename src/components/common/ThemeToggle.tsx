import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', compact = false }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('learnify-theme');
      if (stored) return stored === 'dark';
      // Default to light mode for the user
      return false;
    }
    return false;
  });

  useEffect(() => {
    const applyTheme = (dark: boolean) => {
      const root = document.documentElement;
      if (dark) {
        root.classList.add('dark');
        localStorage.setItem('learnify-theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('learnify-theme', 'light');
      }
    };

    applyTheme(isDark);

    const handleThemeChange = (e: CustomEvent<{ isDark: boolean }>) => {
      setIsDark(e.detail.isDark);
      applyTheme(e.detail.isDark);
    };

    window.addEventListener('learnify-theme-change' as any, handleThemeChange);
    return () => {
      window.removeEventListener('learnify-theme-change' as any, handleThemeChange);
    };
  }, [isDark]);

  const toggle = () => {
    const nextVal = !isDark;
    setIsDark(nextVal);
    window.dispatchEvent(
      new CustomEvent('learnify-theme-change', { detail: { isDark: nextVal } })
    );
  };

  if (compact) {
    return (
      <button
        onClick={toggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className={`p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 transition-all duration-200 active:scale-95 cursor-pointer ${className}`}
      >
        {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-zinc-700" />}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-zinc-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-800/90 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-600 transition-all active:scale-95 cursor-pointer ${className}`}
    >
      <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />
            <span className="text-[11px] font-semibold tracking-wide">Dark</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
            <span className="text-[11px] font-semibold tracking-wide">Light</span>
          </>
        )}
      </div>
    </button>
  );
};
