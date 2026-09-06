import React, { useState } from 'react';
import { Search, Shuffle, ChevronDown, X } from 'lucide-react';
import type { Difficulty, ProblemStatus } from '../types/dsa';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: 'all' | 'revision';
  onTabChange: (tab: 'all' | 'revision') => void;
  selectedStatus: 'all' | ProblemStatus;
  onStatusChange: (s: 'all' | ProblemStatus) => void;
  selectedDifficulty: 'all' | Difficulty;
  onDifficultyChange: (d: 'all' | Difficulty) => void;
  onPickRandom: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  selectedStatus,
  onStatusChange,
  selectedDifficulty,
  onDifficultyChange,
  onPickRandom,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="relative flex flex-row items-center justify-between gap-2 md:gap-4 py-2 px-1 md:px-0 flex-wrap md:flex-nowrap mb-2 select-none">
      {/* Left: Tab Switcher matching screenshot (All Problems / Revision) */}
      <div className="flex items-center bg-[#f4f4f5] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-1 shrink-0 h-10 shadow-2xs">
        <button
          onClick={() => onTabChange('all')}
          className={`h-8 px-3.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-white dark:bg-[#141415] text-zinc-900 dark:text-white shadow-xs border border-zinc-200/60 dark:border-zinc-700'
              : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'
          }`}
        >
          All Problems
        </button>
        <button
          onClick={() => onTabChange('revision')}
          className={`h-8 px-3.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'revision'
              ? 'bg-white dark:bg-[#141415] text-zinc-900 dark:text-white shadow-xs border border-zinc-200/60 dark:border-zinc-700'
              : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'
          }`}
        >
          Revision
        </button>
      </div>

      {/* Right: Search, Filter Dropdowns, Random Problem matching screenshot */}
      <div className="flex items-center gap-2 md:gap-2.5 justify-between flex-1 md:flex-none w-full md:w-auto">
        {/* Search input or expandable button */}
        <div className="relative flex items-center">
          {isSearchOpen || searchQuery ? (
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search problems..."
                className="h-9 pl-8 pr-7 text-xs bg-white dark:bg-[#141415] border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 w-48 sm:w-60 shadow-2xs"
              />
              <button
                onClick={() => {
                  onSearchChange('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="h-9 w-9 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#141415] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              title="Search problems"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* All problems (Status) Dropdown */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={e => onStatusChange(e.target.value as any)}
            className="h-9 pl-3.5 pr-8 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#141415] text-xs font-medium text-zinc-700 dark:text-zinc-300 appearance-none cursor-pointer focus:outline-none focus:border-orange-500 shadow-2xs hover:border-zinc-300"
          >
            <option value="all">All problems</option>
            <option value="solved">Solved</option>
            <option value="todo">Unsolved</option>
          </select>
          <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Difficulty Dropdown */}
        <div className="relative">
          <select
            value={selectedDifficulty}
            onChange={e => onDifficultyChange(e.target.value as any)}
            className="h-9 pl-3.5 pr-8 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#141415] text-xs font-medium text-zinc-700 dark:text-zinc-300 appearance-none cursor-pointer focus:outline-none focus:border-orange-500 shadow-2xs hover:border-zinc-300"
          >
            <option value="all">Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Random Problem Button */}
        <button
          onClick={onPickRandom}
          className="h-9 px-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#141415] text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer shadow-2xs"
          title="Pick a random problem"
        >
          <Shuffle className="w-3.5 h-3.5 opacity-70" />
          <span className="hidden sm:inline">Random Problem</span>
        </button>
      </div>
    </div>
  );
};
