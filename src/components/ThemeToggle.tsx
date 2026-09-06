import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  variant?: 'switch' | 'icon' | 'pill';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'switch',
  className = '' 
}) => {
  const { isDark, toggleTheme } = useTheme();

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-xl border border-[var(--surface-border-muted)] bg-[var(--surface-1)] hover:bg-[var(--surface-2)] text-zinc-400 hover:text-white transition-all cursor-pointer shadow-sm group ${className}`}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-sky-500 group-hover:-rotate-12 transition-transform duration-300" />
        )}
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--surface-border-muted)] bg-[var(--surface-1)] hover:bg-[var(--surface-2)] text-xs font-medium text-zinc-300 transition-all cursor-pointer shadow-sm ${className}`}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-orange-400" />
            <span>Dark</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-zinc-800">Light</span>
          </>
        )}
      </button>
    );
  }

  // Default: 'switch' - Beautiful animated sliding pill switch
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!isDark}
      onClick={toggleTheme}
      className={`relative inline-flex items-center h-7 w-[54px] rounded-full p-0.5 cursor-pointer transition-colors duration-300 ease-in-out border select-none shrink-0 ${
        isDark 
          ? 'bg-[#18181b] border-zinc-700/80 hover:border-orange-500/40 shadow-inner' 
          : 'bg-amber-100/90 border-amber-300 hover:border-amber-400 shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {/* Track Icons (Sun on Left, Moon on Right) */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
        <Sun 
          className={`w-3.5 h-3.5 transition-opacity duration-200 ${
            isDark ? 'text-zinc-600 opacity-40' : 'text-amber-600 opacity-100'
          }`} 
        />
        <Moon 
          className={`w-3 h-3 transition-opacity duration-200 ${
            isDark ? 'text-orange-400 opacity-100' : 'text-zinc-400 opacity-30'
          }`} 
        />
      </div>

      {/* Sliding Knob */}
      <span
        className={`inline-flex items-center justify-center w-[22px] h-[22px] rounded-full shadow-md transform transition-transform duration-300 ease-spring z-10 ${
          isDark 
            ? 'translate-x-[26px] bg-[#27272a] text-orange-400 border border-zinc-600/50' 
            : 'translate-x-0.5 bg-white text-amber-500 border border-amber-200'
        }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3 fill-orange-400/20" />
        ) : (
          <Sun className="w-3 h-3 fill-amber-400/20" />
        )}
      </span>
    </button>
  );
};
