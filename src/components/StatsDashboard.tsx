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
    <div className="mb-4 px-1 md:px-0 w-full select-none">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 rounded-2xl border border-orange-200/70 dark:border-[var(--brand)]/20 bg-[#fff7f5] dark:bg-[#141415] px-5 py-3.5 shadow-2xs transition-all">
        {/* Left Side: Circular Progress Ring & Numbers */}
        <div className="flex flex-row items-center gap-3.5 sm:gap-4">
          {/* Circular Progress Gauge */}
          <div className="relative h-12 w-12 sm:h-13 sm:w-13 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 52 52">
              {/* Background circle track */}
              <circle
                cx="26"
                cy="26"
                r={radius}
                className="stroke-orange-200/60 dark:stroke-zinc-800"
                strokeWidth="3.5"
                fill="transparent"
              />
              {/* Animated Progress circle */}
              <circle
                cx="26"
                cy="26"
                r={radius}
                className="stroke-[#ea763f] transition-all duration-700 ease-out"
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-[13px] font-bold text-zinc-900 dark:text-white font-mono">
              {stats.percentage}%
            </div>
          </div>

          {/* Text: Overall Progress */}
          <div className="flex flex-col min-w-0">
            <span className="text-xs tracking-tight text-zinc-500 dark:text-zinc-400 font-normal">
              Overall Progress
            </span>
            <span className="text-base sm:text-lg leading-tight text-zinc-900 dark:text-white flex items-baseline font-mono font-medium">
              <span className="font-bold text-zinc-900 dark:text-white">{stats.solved}</span>
              <span className="mx-1 text-zinc-400 dark:text-zinc-500 font-normal text-sm">/</span>
              <span className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">{stats.total}</span>
            </span>
          </div>
        </div>

        {/* Right Side: Exact Difficulty breakdown matching screenshot */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-[13px]">
          {/* Easy */}
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#10b981] shrink-0"></span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Easy</span>
            <span className="text-zinc-500 dark:text-zinc-400 font-mono text-xs">
              <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{stats.easy.solved}</span>/{stats.easy.total}
            </span>
          </div>

          {/* Medium */}
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#f59e0b] shrink-0"></span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Medium</span>
            <span className="text-zinc-500 dark:text-zinc-400 font-mono text-xs">
              <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{stats.medium.solved}</span>/{stats.medium.total}
            </span>
          </div>

          {/* Hard */}
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ef4444] shrink-0"></span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Hard</span>
            <span className="text-zinc-500 dark:text-zinc-400 font-mono text-xs">
              <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{stats.hard.solved}</span>/{stats.hard.total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
