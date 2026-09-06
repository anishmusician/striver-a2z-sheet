import React from 'react';
import { Lock } from 'lucide-react';
import type { UserProfile } from '../types/dsa';

interface RightSidebarProps {
  currentProfile?: UserProfile;
  totalSolved?: number;
  totalProblems?: number;
  onOpenAuth?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  currentProfile,
  onOpenAuth,
}) => {
  return (
    <aside className="hidden xl:flex flex-col w-[290px] shrink-0 gap-3 select-none pb-8">
      {/* 1. Top Auth Banner */}
      <div className="rounded-2xl border border-orange-200/80 bg-[#fff9f6] dark:bg-zinc-900/90 dark:border-zinc-800 p-3.5 text-center shadow-xs">
        <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
          {currentProfile ? (
            <span>
              Learning as <span className="font-bold text-orange-600 dark:text-orange-400">{currentProfile.name}</span>{' '}
              <button 
                onClick={onOpenAuth}
                className="text-orange-600 hover:text-orange-700 underline font-semibold cursor-pointer ml-1"
              >
                (Switch)
              </button>
            </span>
          ) : (
            <span>
              You&apos;re just a step away —{' '}
              <button 
                onClick={onOpenAuth}
                className="text-orange-600 hover:text-orange-700 underline font-semibold cursor-pointer"
              >
                Login or Sign Up here
              </button>
            </span>
          )}
        </p>
      </div>

      {/* 2. Progress Card */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-[#141415] border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
          Progress
        </span>
        <button
          onClick={onOpenAuth}
          className="flex items-center justify-center w-7 h-7 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 hover:bg-orange-200 transition-colors cursor-pointer shadow-2xs"
          title="Progress tracking"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Calendar + Roadmap Card */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-[#141415] border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
          Calendar + Roadmap
        </span>
        <button
          onClick={onOpenAuth}
          className="flex items-center justify-center w-7 h-7 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 hover:bg-orange-200 transition-colors cursor-pointer shadow-2xs"
          title="Calendar and Roadmap"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. Iconic Striver Motivational Quote Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-md border border-zinc-800/80 bg-zinc-950 group">
        <img
          src="/striver-quote.png"
          alt="Don't cry in a corner if you want something, mehnat kar, best ban aur cheen le - Striver"
          className="w-full h-auto object-cover block transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      {/* 5. Sessions Card */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-[#141415] border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
          Sessions
        </span>
        <button
          onClick={onOpenAuth}
          className="flex items-center justify-center w-7 h-7 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 hover:bg-orange-200 transition-colors cursor-pointer shadow-2xs"
          title="1-on-1 Sessions"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6. Daily Planner Card */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-[#141415] border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
          Daily Planner
        </span>
        <button
          onClick={onOpenAuth}
          className="flex items-center justify-center w-7 h-7 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 hover:bg-orange-200 transition-colors cursor-pointer shadow-2xs"
          title="Daily Study Planner"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
