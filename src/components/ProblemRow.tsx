import React from 'react';
import { Check, Star, Video, BookOpen, Code2, FileText } from 'lucide-react';
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
    Easy: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    Medium: 'text-amber-700 bg-amber-50 border-amber-200',
    Hard: 'text-rose-700 bg-rose-50 border-rose-200',
  }[problem.difficulty] || 'text-slate-700 bg-slate-100 border-slate-200';

  return (
    <div 
      className={`group flex items-center justify-between px-4 py-3 border-b border-slate-200/80 transition-colors ${
        isSolved 
          ? 'bg-emerald-50/40 hover:bg-emerald-50/60' 
          : 'hover:bg-orange-50/50 bg-white'
      }`}
    >
      {/* Left side: Checkbox, Star, Title, Indicators */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-4">
        {/* Solved Checkbox */}
        <button
          onClick={onToggleSolved}
          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer border ${
            isSolved
              ? 'bg-orange-600 border-orange-600 text-white shadow-xs'
              : 'border-slate-300 hover:border-orange-500 bg-white text-transparent'
          }`}
          title={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        {/* Star for revision */}
        <button
          onClick={onToggleStarred}
          className={`p-1 rounded-md transition-colors cursor-pointer ${
            isStarred
              ? 'text-amber-400'
              : 'text-slate-600 hover:text-amber-400/80 opacity-0 group-hover:opacity-100'
          }`}
          title={isStarred ? 'Remove star' : 'Star for revision'}
        >
          <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400' : ''}`} />
        </button>

        {/* Index number */}
        <span className="text-xs text-slate-500 font-mono w-6 text-right shrink-0 hidden sm:inline">
          {index + 1}.
        </span>

        {/* Problem Title & workspace opener */}
        <div className="min-w-0 flex-1 flex items-center gap-2">
          <button
            onClick={onOpenWorkspace}
            className={`text-left text-sm font-medium transition-colors hover:text-orange-600 truncate cursor-pointer ${
              isSolved ? 'text-slate-400 line-through decoration-slate-400' : 'text-slate-900'
            }`}
          >
            {problem.title}
          </button>

          {/* Indicators for user's notes and code */}
          {hasNotes && (
            <span 
              className="shrink-0 text-purple-600 p-0.5" 
              title="Has personal notes"
            >
              <FileText className="w-3.5 h-3.5" />
            </span>
          )}
          {hasSavedCode && (
            <span 
              className="shrink-0 text-emerald-600 p-0.5" 
              title="Has saved code solution"
            >
              <Code2 className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>

      {/* Right side: Difficulty, Practice Links, Quick Status */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Difficulty Badge */}
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${difficultyBadge}`}>
          {problem.difficulty}
        </span>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {/* YouTube Solution */}
          {problem.youtube && (
            <button
              onClick={() => onOpenVideo(problem.youtube!, problem.title)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Watch Video Solution"
            >
              <Video className="w-4 h-4" />
            </button>
          )}

          {/* LeetCode practice */}
          {problem.leetcode ? (
            <a
              href={problem.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Solve on LeetCode"
            >
              <span className="font-bold text-xs tracking-tighter">LC</span>
            </a>
          ) : null}

          {/* GFG practice */}
          {problem.gfg ? (
            <a
              href={problem.gfg}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Solve on GeeksforGeeks"
            >
              <span className="font-bold text-xs tracking-tighter">GFG</span>
            </a>
          ) : null}

          {/* takeUforward Article */}
          {problem.article && (
            <a
              href={problem.article}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
              title="Read takeUforward Article"
            >
              <BookOpen className="w-4 h-4" />
            </a>
          )}

          {/* Code Workspace */}
          <button
            onClick={onOpenWorkspace}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg transition-colors cursor-pointer ml-1 shadow-xs"
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
