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
    <div className="relative flex flex-row items-center justify-between gap-2 md:gap-4 py-2 md:py-3 px-1 md:px-0 flex-wrap md:flex-nowrap mb-2 select-none">
      {/* Left: tuf Tabs (All Problems / Revision) */}
      <div className="flex tuf-tab-container shrink-0">
        <button
          onClick={() => onTabChange('all')}
          className={`tuf-tab ${activeTab === 'all' ? 'tuf-tab-active' : 'tuf-tab-inactive'}`}
        >
          All Problems
        </button>
        <button
          onClick={() => onTabChange('revision')}
          className={`tuf-tab ${activeTab === 'revision' ? 'tuf-tab-active' : 'tuf-tab-inactive'}`}
        >
          Revision
        </button>
      </div>

      {/* Right: Search, Filter Dropdowns, Random Problem */}
      <div className="flex items-center gap-2 md:gap-3 justify-between flex-1 md:flex-none w-full md:w-auto">
        {/* Search input or expandable button */}
        <div className="relative flex items-center">
          {isSearchOpen || searchQuery ? (
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search problems..."
                className="h-9 pl-8 pr-7 text-xs bg-[var(--surface-1)] border border-[var(--surface-border-muted)] rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-[var(--brand)] w-48 sm:w-64"
              />
              <button
                onClick={() => {
                  onSearchChange('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="tuf-chip-btn h-9 w-9 p-0 flex items-center justify-center rounded-xl"
              title="Search problems"
            >
              <Search className="w-4 h-4 text-zinc-400" />
            </button>
          )}
        </div>

        {/* All problems (Status) Dropdown */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={e => onStatusChange(e.target.value as any)}
            className="tuf-chip-btn h-9 appearance-none pr-8 cursor-pointer focus:outline-none focus:border-[var(--brand)]"
          >
            <option value="all">All problems</option>
            <option value="solved">Solved</option>
            <option value="todo">Unsolved</option>
          </select>
          <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
        </div>

        {/* Difficulty Dropdown */}
        <div className="relative">
          <select
            value={selectedDifficulty}
            onChange={e => onDifficultyChange(e.target.value as any)}
            className="tuf-chip-btn h-9 appearance-none pr-8 cursor-pointer focus:outline-none focus:border-[var(--brand)]"
          >
            <option value="all">Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
        </div>

        {/* Random Problem Button */}
        <button
          onClick={onPickRandom}
          className="tuf-chip-btn h-9 cursor-pointer hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
          title="Pick a random problem"
        >
          <Shuffle className="w-3.5 h-3.5 opacity-70" />
          <span className="hidden sm:inline">Random Problem</span>
        </button>
      </div>
    </div>
  );
};
