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
    Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Hard: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  }[problem.difficulty] || 'text-slate-400 bg-slate-800 border-slate-700';

  return (
    <div 
      className={`group flex items-center justify-between px-4 py-3 border-b border-slate-800/60 transition-colors ${
        isSolved 
          ? 'bg-slate-900/30 hover:bg-slate-900/50' 
          : 'hover:bg-slate-800/40 bg-slate-950/40'
      }`}
    >
      {/* Left side: Checkbox, Star, Title, Indicators */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-4">
        {/* Solved Checkbox */}
        <button
          onClick={onToggleSolved}
          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer border ${
            isSolved
              ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm shadow-emerald-500/20'
              : 'border-slate-700 hover:border-slate-500 bg-slate-900/80 text-transparent'
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
            className={`text-left text-sm font-medium transition-colors hover:text-sky-400 truncate cursor-pointer ${
              isSolved ? 'text-slate-400 line-through decoration-slate-600' : 'text-slate-200'
            }`}
          >
            {problem.title}
          </button>

          {/* Indicators for user's notes and code */}
          {hasNotes && (
            <span 
              className="shrink-0 text-sky-400 p-0.5" 
              title="Has personal notes"
            >
              <FileText className="w-3.5 h-3.5" />
            </span>
          )}
          {hasSavedCode && (
            <span 
              className="shrink-0 text-emerald-400 p-0.5" 
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
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
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
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
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
              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
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
              className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors"
              title="Read takeUforward Article"
            >
              <BookOpen className="w-4 h-4" />
            </a>
          )}

          {/* Code Workspace */}
          <button
            onClick={onOpenWorkspace}
            className="flex items-center gap-1 px-2 py-1 text-xs text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 rounded-lg transition-colors cursor-pointer font-medium ml-1"
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
