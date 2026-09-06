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
      <div className="rounded-2xl border border-orange-200/80 bg-orange-50/70 p-3.5 text-center shadow-xs">
        <p className="text-xs text-slate-700 font-medium">
          {currentProfile ? (
            <span>
              Learning as <span className="font-bold text-orange-600">{currentProfile.name}</span>{' '}
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
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
        <span className="text-xs font-semibold text-slate-800">
          Progress
        </span>
        <button
          onClick={onOpenAuth}
          className="flex items-center justify-center w-7 h-7 rounded-xl bg-orange-50 border border-orange-200/60 text-orange-600 hover:bg-orange-100 transition-colors cursor-pointer shadow-xs"
          title="Progress tracking"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Calendar + Roadmap Card */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
        <span className="text-xs font-semibold text-slate-800">
          Calendar + Roadmap
        </span>
        <button
          onClick={onOpenAuth}
          className="flex items-center justify-center w-7 h-7 rounded-xl bg-orange-50 border border-orange-200/60 text-orange-600 hover:bg-orange-100 transition-colors cursor-pointer shadow-xs"
          title="Calendar and Roadmap"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. Iconic Striver Motivational Quote Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200 bg-slate-900 group">
        <img
          src="/striver-quote.png"
          alt="Don't cry in a corner if you want something, mehnat kar, best ban aur cheen le - Striver"
          className="w-full h-auto object-cover block transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      {/* 5. Sessions Card */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
        <span className="text-xs font-semibold text-slate-800">
          Sessions
        </span>
        <button
          onClick={onOpenAuth}
          className="flex items-center justify-center w-7 h-7 rounded-xl bg-orange-50 border border-orange-200/60 text-orange-600 hover:bg-orange-100 transition-colors cursor-pointer shadow-xs"
          title="1-on-1 Sessions"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6. Daily Planner Card */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
        <span className="text-xs font-semibold text-slate-800">
          Daily Planner
        </span>
        <button
          onClick={onOpenAuth}
          className="flex items-center justify-center w-7 h-7 rounded-xl bg-orange-50 border border-orange-200/60 text-orange-600 hover:bg-orange-100 transition-colors cursor-pointer shadow-xs"
          title="Daily Study Planner"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
