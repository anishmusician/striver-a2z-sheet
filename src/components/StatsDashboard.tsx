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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 rounded-2xl border border-orange-200/90 bg-gradient-to-r from-[#fff7f2] via-white to-[#fef6ee] px-5 py-3.5 shadow-xs transition-all">
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
                className="stroke-orange-100"
                strokeWidth="3.5"
                fill="transparent"
              />
              {/* Animated Progress circle */}
              <circle
                cx="26"
                cy="26"
                r={radius}
                className="stroke-[#ea580c] transition-all duration-700 ease-out"
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-[13px] font-bold text-slate-900 font-mono">
              {stats.percentage}%
            </div>
          </div>

          {/* Text: Overall Progress */}
          <div className="flex flex-col min-w-0">
            <span className="text-xs tracking-tight text-slate-500 font-normal">
              Overall Progress
            </span>
            <span className="text-base sm:text-lg leading-tight text-slate-900 flex items-baseline font-mono font-medium">
              <span className="font-bold text-slate-900">{stats.solved}</span>
              <span className="mx-1 text-slate-400 font-normal text-sm">/</span>
              <span className="text-slate-500 text-xs sm:text-sm">{stats.total}</span>
            </span>
          </div>
        </div>

        {/* Right Side: Difficulty breakdown */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-[13px]">
          {/* Easy */}
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#10b981] shrink-0"></span>
            <span className="font-semibold text-emerald-800">Easy</span>
            <span className="text-slate-500 font-mono text-xs">
              <span className="text-slate-800 font-semibold">{stats.easy.solved}</span>/{stats.easy.total}
            </span>
          </div>

          {/* Medium */}
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#f59e0b] shrink-0"></span>
            <span className="font-semibold text-amber-800">Medium</span>
            <span className="text-slate-500 font-mono text-xs">
              <span className="text-slate-800 font-semibold">{stats.medium.solved}</span>/{stats.medium.total}
            </span>
          </div>

          {/* Hard */}
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ef4444] shrink-0"></span>
            <span className="font-semibold text-rose-800">Hard</span>
            <span className="text-slate-500 font-mono text-xs">
              <span className="text-slate-800 font-semibold">{stats.hard.solved}</span>/{stats.hard.total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
