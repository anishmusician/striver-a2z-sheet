import React from 'react';
import type { StatsSummary } from '../types/dsa';
import { Sparkles, Trophy } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 rounded-2xl border border-orange-200/80 bg-gradient-to-r from-[#fff7f2] via-white to-[#fef6ee] px-5 py-4 shadow-xs hover:shadow-md hover:shadow-orange-100/50 transition-all duration-300">
        {/* Left Side: Circular Progress Ring & Numbers */}
        <div className="flex flex-row items-center gap-4">
          {/* Circular Progress Gauge */}
          <div className="relative h-13 w-13 shrink-0 flex items-center justify-center group cursor-default">
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
                className="stroke-[#ea580c] transition-all duration-1000 ease-out"
                strokeWidth="3.8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[13px] font-extrabold text-slate-900 font-mono tracking-tight group-hover:scale-110 transition-transform">
              {stats.percentage}%
            </div>
          </div>

          {/* Text: Overall Progress */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 text-xs tracking-tight text-slate-500 font-medium">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Overall Curriculum Progress</span>
            </div>
            <span className="text-lg leading-tight text-slate-900 flex items-baseline font-mono font-medium mt-0.5">
              <span className="font-extrabold text-slate-900 text-xl">{stats.solved}</span>
              <span className="mx-1 text-slate-400 font-normal text-sm">/</span>
              <span className="text-slate-500 text-sm font-semibold">{stats.total} Solved</span>
              <span className="ml-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100/70 text-orange-700 border border-orange-200/80 font-sans">
                <Sparkles className="w-2.5 h-2.5 text-orange-600" />
                Free &amp; Unlocked
              </span>
            </span>
          </div>
        </div>

        {/* Right Side: Difficulty breakdown colorful pills */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-[13px]">
          {/* Easy Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 hover:bg-emerald-100/70 hover:scale-105 transition-all duration-200 shadow-xs cursor-default">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
            <span className="font-bold text-emerald-800">Easy</span>
            <span className="text-slate-500 font-mono text-xs">
              <span className="text-emerald-900 font-extrabold">{stats.easy.solved}</span>/{stats.easy.total}
            </span>
          </div>

          {/* Medium Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/80 hover:bg-amber-100/70 hover:scale-105 transition-all duration-200 shadow-xs cursor-default">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0"></span>
            <span className="font-bold text-amber-800">Medium</span>
            <span className="text-slate-500 font-mono text-xs">
              <span className="text-amber-900 font-extrabold">{stats.medium.solved}</span>/{stats.medium.total}
            </span>
          </div>

          {/* Hard Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50/80 border border-rose-200/80 hover:bg-rose-100/70 hover:scale-105 transition-all duration-200 shadow-xs cursor-default">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0"></span>
            <span className="font-bold text-rose-800">Hard</span>
            <span className="text-slate-500 font-mono text-xs">
              <span className="text-rose-900 font-extrabold">{stats.hard.solved}</span>/{stats.hard.total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
