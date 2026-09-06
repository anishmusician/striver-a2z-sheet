import React from 'react';
import type { StatsSummary } from '../types/dsa';

interface StatsDashboardProps {
  stats: StatsSummary;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  // Compute SVG circular stroke dash offset
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.percentage / 100) * circumference;

  return (
    <div className="mb-3 px-1 md:px-0 w-full select-none">
      <div className="tuf-stats-banner flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 rounded-xl border border-[var(--brand)]/20 bg-[var(--brand)]/10 px-4 py-3 shadow-sm transition-all">
        {/* Left Side: Circular Progress Ring & Numbers */}
        <div className="flex flex-row items-center gap-3 sm:gap-4">
          {/* Circular Progress Gauge */}
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 52 52">
              {/* Background circle track */}
              <circle
                cx="26"
                cy="26"
                r={radius}
                className="stroke-orange-200/50 dark:stroke-zinc-800"
                strokeWidth="4"
                fill="transparent"
              />
              {/* Animated Progress circle */}
              <circle
                cx="26"
                cy="26"
                r={radius}
                className="stroke-[var(--brand)] transition-all duration-700 ease-out"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold text-zinc-900 dark:text-white font-mono">
              {stats.percentage}%
            </div>
          </div>

          {/* Text: Overall Progress */}
          <div className="flex flex-col min-w-0 sm:min-w-[160px]">
            <span className="text-xs sm:text-sm tracking-wide text-zinc-500 dark:text-zinc-400 font-medium">
              Overall Progress
            </span>
            <span className="text-sm sm:text-base leading-tight text-zinc-900 dark:text-white flex items-baseline font-mono font-semibold">
              <span className="text-orange-600 dark:text-orange-400 font-bold">{stats.solved}</span>
              <span className="mx-1 text-zinc-400 dark:text-zinc-500 font-normal">/</span>
              <span className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">{stats.total}</span>
            </span>
          </div>
        </div>

        {/* Right Side: Difficulty breakdown with rich colorful badge pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
          {/* Easy Pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50 shrink-0"></span>
            <span className="font-semibold">Easy</span>
            <span className="text-emerald-950 dark:text-zinc-300 font-mono font-medium">
              {stats.easy.solved} / <span className="text-emerald-700/80 dark:text-zinc-500 text-xs">{stats.easy.total}</span>
            </span>
          </div>

          {/* Medium Pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-amber-500 shadow-xs shadow-amber-500/50 shrink-0"></span>
            <span className="font-semibold">Medium</span>
            <span className="text-amber-950 dark:text-zinc-300 font-mono font-medium">
              {stats.medium.solved} / <span className="text-amber-700/80 dark:text-zinc-500 text-xs">{stats.medium.total}</span>
            </span>
          </div>

          {/* Hard Pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 text-rose-800 dark:text-rose-300 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-rose-500 shadow-xs shadow-rose-500/50 shrink-0"></span>
            <span className="font-semibold">Hard</span>
            <span className="text-rose-950 dark:text-zinc-300 font-mono font-medium">
              {stats.hard.solved} / <span className="text-rose-700/80 dark:text-zinc-500 text-xs">{stats.hard.total}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
