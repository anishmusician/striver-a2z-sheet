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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 rounded-xl border border-[var(--brand)]/20 bg-[var(--brand)]/10 px-4 py-3 shadow-sm">
        {/* Left Side: Circular Progress Ring & Numbers */}
        <div className="flex flex-row items-center gap-3 sm:gap-4">
          {/* Circular Progress Gauge */}
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 52 52">
              {/* Background circle */}
              <circle
                cx="26"
                cy="26"
                r={radius}
                className="stroke-zinc-800"
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
            <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold text-white font-mono">
              {stats.percentage}%
            </div>
          </div>

          {/* Text: Overall Progress */}
          <div className="flex flex-col min-w-0 sm:min-w-[160px]">
            <span className="text-xs sm:text-sm tracking-wide text-zinc-400 font-medium">
              Overall Progress
            </span>
            <span className="text-sm sm:text-base leading-tight text-white flex items-baseline font-mono font-semibold">
              <span>{stats.solved}</span>
              <span className="mx-1 text-zinc-500 font-normal">/</span>
              <span className="text-zinc-400 text-xs sm:text-sm">{stats.total}</span>
            </span>
          </div>
        </div>

        {/* Right Side: Difficulty breakdown with colored dots & dividers */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-zinc-200">
          {/* Easy */}
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0"></span>
            <span className="font-medium">Easy</span>
            <span className="text-zinc-400 font-mono">
              {stats.easy.solved} / <span className="text-zinc-500 text-xs">{stats.easy.total}</span>
            </span>
          </div>

          <span className="hidden sm:block h-4 w-px bg-zinc-700 shrink-0"></span>

          {/* Medium */}
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shrink-0"></span>
            <span className="font-medium">Medium</span>
            <span className="text-zinc-400 font-mono">
              {stats.medium.solved} / <span className="text-zinc-500 text-xs">{stats.medium.total}</span>
            </span>
          </div>

          <span className="hidden sm:block h-4 w-px bg-zinc-700 shrink-0"></span>

          {/* Hard */}
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0"></span>
            <span className="font-medium">Hard</span>
            <span className="text-zinc-400 font-mono">
              {stats.hard.solved} / <span className="text-zinc-500 text-xs">{stats.hard.total}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
