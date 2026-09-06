import React from 'react';
import { Check, Star, Code2, FileText } from 'lucide-react';
import type { Problem, ProblemStatus } from '../types/dsa';

interface ProblemRowProps {
  problem: Problem;
  index: number;
  status: ProblemStatus;
  isStarred: boolean;
  hasNotes: boolean;
  hasSavedCode: boolean;
  onToggleSolved: () => void;
  onToggleStarred: () => void;
  onStatusChange: (status: ProblemStatus) => void;
  onOpenWorkspace: () => void;
  onOpenVideo: (url: string, title: string) => void;
}

export const ProblemRow: React.FC<ProblemRowProps> = ({
  problem,
  index,
  status,
  isStarred,
  hasNotes,
  hasSavedCode,
  onToggleSolved,
  onToggleStarred,
  onOpenWorkspace,
  onOpenVideo,
}) => {
  const isSolved = status === 'solved';

  const difficultyBadge = {
    Easy: 'text-emerald-700 bg-emerald-50/90 border-emerald-200/90 hover:bg-emerald-100/80',
    Medium: 'text-amber-700 bg-amber-50/90 border-amber-200/90 hover:bg-amber-100/80',
    Hard: 'text-rose-700 bg-rose-50/90 border-rose-200/90 hover:bg-rose-100/80',
  }[problem.difficulty] || 'text-slate-700 bg-slate-100 border-slate-200';

  return (
    <div 
      className={`group flex items-center justify-between px-4 py-3 border-b border-slate-200/70 transition-all duration-150 ${
        isSolved 
          ? 'bg-emerald-50/30 hover:bg-emerald-50/50' 
          : 'hover:bg-orange-50/40 bg-white'
      }`}
    >
      {/* Left side: Checkbox, Star, Title, Indicators */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-4">
        {/* Solved Checkbox */}
        <button
          onClick={onToggleSolved}
          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 cursor-pointer border ${
            isSolved
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-transparent text-white shadow-xs scale-105 ring-2 ring-orange-200'
              : 'border-slate-300 hover:border-orange-500 hover:bg-orange-50/50 bg-white text-transparent active:scale-95'
          }`}
          title={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
        >
          <Check className={`w-3.5 h-3.5 stroke-[3] transition-transform duration-200 ${isSolved ? 'scale-100' : 'scale-0'}`} />
        </button>

        {/* Star for revision */}
        <button
          onClick={onToggleStarred}
          className={`p-1 rounded-md transition-all duration-200 cursor-pointer hover:scale-125 active:scale-90 ${
            isStarred
              ? 'text-amber-400'
              : 'text-slate-400 hover:text-amber-400 opacity-0 group-hover:opacity-100'
          }`}
          title={isStarred ? 'Remove star' : 'Star for revision'}
        >
          <Star className={`w-4 h-4 transition-transform duration-200 ${isStarred ? 'fill-amber-400 stroke-amber-400 scale-110' : ''}`} />
        </button>

        {/* Index number */}
        <span className="text-xs text-slate-400 font-mono w-6 text-right shrink-0 hidden sm:inline">
          {index + 1}.
        </span>

        {/* Problem Title & workspace opener */}
        <div className="min-w-0 flex-1 flex items-center gap-2">
          <button
            onClick={onOpenWorkspace}
            className={`text-left text-sm font-medium transition-all hover:text-orange-600 hover:translate-x-0.5 truncate cursor-pointer ${
              isSolved ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800'
            }`}
          >
            {problem.title}
          </button>

          {/* Indicators for user's notes and code */}
          {hasNotes && (
            <span 
              className="shrink-0 text-purple-600 bg-purple-50 p-1 rounded-md border border-purple-200/60 shadow-xs" 
              title="Has personal notes"
            >
              <FileText className="w-3 h-3" />
            </span>
          )}
          {hasSavedCode && (
            <span 
              className="shrink-0 text-emerald-600 bg-emerald-50 p-1 rounded-md border border-emerald-200/60 shadow-xs" 
              title="Has saved code solution"
            >
              <Code2 className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>

      {/* Right side: Difficulty, Practice Links, Quick Status */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Difficulty Badge */}
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition-all duration-200 ${difficultyBadge}`}>
          {problem.difficulty}
        </span>

        {/* Action icons with brand logos */}
        <div className="flex items-center gap-1.5">
          {/* YouTube Solution Logo */}
          {problem.youtube && (
            <button
              onClick={() => onOpenVideo(problem.youtube!, problem.title)}
              className="p-1.5 hover:bg-rose-50 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shadow-xs border border-transparent hover:border-rose-200/60"
              title="Watch YouTube Walkthrough"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="#FF0000"/>
                <polygon points="9.545 15.568 9.545 8.432 15.818 12" fill="#FFFFFF"/>
              </svg>
            </button>
          )}

          {/* LeetCode Official Brand Logo */}
          {problem.leetcode ? (
            <a
              href={problem.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-amber-50 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 shadow-xs border border-transparent hover:border-amber-200/60 flex items-center justify-center"
              title="Solve on LeetCode"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.821 5.83 5.83 0 0 0 1.572.016 5.766 5.766 0 0 0 3.738-1.78l3.07-3.11a1.442 1.442 0 0 0 0-2.023 1.408 1.408 0 0 0-2.01 0l-3.05 3.09a3.02 3.02 0 0 1-2.02.96 3.003 3.003 0 0 1-2.12-.86 3.044 3.044 0 0 1-.92-2.17c0-.82.32-1.6 1.02-2.18l3.95-4.23 5.38-5.76a1.396 1.396 0 0 0-.96-2.348z" fill="#FFA116"/>
                <path d="M9.86 15.42H20.4c.78 0 1.4-.62 1.4-1.4s-.62-1.4-1.4-1.4H9.86c-.78 0-1.4.62-1.4 1.4s.62 1.4 1.4 1.4z" fill="#71717A"/>
              </svg>
            </a>
          ) : null}

          {/* GeeksforGeeks Official Brand Logo */}
          {problem.gfg ? (
            <a
              href={problem.gfg}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-emerald-50 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 shadow-xs border border-transparent hover:border-emerald-200/60 flex items-center justify-center"
              title="Solve on GeeksforGeeks"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.48 0-4.5-2.02-4.5-4.5S10.52 7.5 13 7.5c1.19 0 2.27.46 3.09 1.22l-1.35 1.35c-.47-.44-1.09-.7-1.74-.7-1.45 0-2.63 1.18-2.63 2.63s1.18 2.63 2.63 2.63c1.23 0 2.27-.85 2.55-2.01h-2.55v-1.85h4.48c.06.31.09.63.09.96 0 2.69-1.92 4.77-4.57 4.77z" fill="#008A32"/>
              </svg>
            </a>
          ) : null}

          {/* takeUforward Article Logo */}
          {problem.article && (
            <a
              href={problem.article}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-sky-50 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 shadow-xs border border-transparent hover:border-sky-200/60 flex items-center justify-center text-sky-600"
              title="Read takeUforward Article"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </a>
          )}

          {/* Solve Button with Colorful Gradient & Hover Animation */}
          <button
            onClick={onOpenWorkspace}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl hover:shadow-md hover:shadow-orange-200/60 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer ml-1 shadow-xs"
            title="Open Code &amp; Notes Workspace"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Solve</span>
          </button>
        </div>
      </div>
    </div>
  );
};
