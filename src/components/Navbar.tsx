import React, { useRef } from 'react';
import { Download, Upload, RotateCcw, Flame, BookCheck } from 'lucide-react';

interface NavbarProps {
  streak: number;
  totalSolved: number;
  totalProblems: number;
  onExport: () => void;
  onImport: (jsonStr: string) => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  streak,
  totalSolved,
  totalProblems,
  onExport,
  onImport,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        onImport(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white">
            <BookCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-100 leading-tight">
                Striver&apos;s A2Z DSA
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Free
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Zero credits • Free LeetCode &amp; GFG links • In-browser code runner
            </p>
          </div>
        </div>

        {/* Right: Actions, Streak, Backup */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Indicator */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300"
            title={`${streak} day study streak`}
          >
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400/20" />
            <span className="font-mono">{streak}d</span>
          </div>

          {/* Solved pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-xl text-xs font-semibold text-sky-400 font-mono">
            <span>{totalSolved}/{totalProblems}</span>
            <span className="text-slate-400 text-[10px]">({Math.round((totalSolved / totalProblems) * 100)}%)</span>
          </div>

          {/* Export JSON */}
          <button
            onClick={onExport}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            title="Export your progress &amp; notes as JSON backup"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Import JSON */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            title="Import progress from a JSON backup"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Import</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
            title="Reset all progress"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
