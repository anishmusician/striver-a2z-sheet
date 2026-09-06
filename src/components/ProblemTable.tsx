import React from 'react';
import { FileEdit } from 'lucide-react';
import type { Problem, ProblemStatus } from '../types/dsa';

interface ProblemTableProps {
  problems: Problem[];
  getStatus: (problemId: string) => ProblemStatus;
  isStarred: (problemId: string) => boolean;
  getNotes: (problemId: string) => string;
  onToggleSolved: (problemId: string) => void;
  onToggleStarred: (problemId: string) => void;
  onOpenWorkspace: (problem: Problem) => void;
  onOpenVideo: (url: string, title: string) => void;
}

export const ProblemTable: React.FC<ProblemTableProps> = ({
  problems,
  getStatus,
  isStarred,
  getNotes,
  onToggleSolved,
  onToggleStarred,
  onOpenWorkspace,
  onOpenVideo,
}) => {
  return (
    <div className="font-firaSans relative my-2">
      <div className="bg-[var(--surface-1)] border border-[var(--surface-border-muted)] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="table-auto w-full min-w-[850px] font-firaSans divide-y divide-[var(--surface-border-muted)]">
            {/* Exact takeUforward Table Header */}
            <thead className="text-xs font-semibold leading-snug text-[var(--sheet-header-text)] bg-slate-50/90 dark:bg-[var(--surface-1)] h-12 select-none">
              <tr>
                <th className="px-3 py-3 w-[5%] text-center">
                  <p>Status</p>
                </th>
                <th className="px-4 py-3 w-[30%] text-left">
                  <p>Problem</p>
                </th>
                <th className="w-[8%] text-center">
                  <div className="flex justify-center">
                    <div className="tuf-plus-badge">
                      <span className="text-white text-[10px] font-bold leading-none">Plus</span>
                    </div>
                  </div>
                </th>
                <th className="w-[10%] text-center">
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <span>Resource</span>
                    <div className="tuf-plus-badge py-0 px-1">
                      <span className="text-white text-[8px] font-bold leading-none">Plus</span>
                    </div>
                  </div>
                </th>
                <th className="w-[10%] text-center">
                  <p className="text-xs">Resource</p>
                </th>
                <th className="w-[12%] text-center">
                  <p className="text-xs">Practice</p>
                </th>
                <th className="w-[8%] text-center">
                  <p className="text-xs">Note</p>
                </th>
                <th className="w-[8%] text-center">
                  <p className="text-xs">Revision</p>
                </th>
                <th className="w-[9%] text-center">
                  <p className="text-xs">Difficulty</p>
                </th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody className="divide-y divide-[var(--surface-border-muted)] bg-[var(--surface-1)]">
              {problems.map((p) => {
                const isSolved = getStatus(p.id) === 'solved';
                const starred = isStarred(p.id);
                const hasNotes = !!getNotes(p.id);

                const hasResource = Boolean(p.article || p.youtube);
                const hasPractice = Boolean(p.leetcode || p.gfg);

                const difficultyColor = {
                  Easy: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/90 dark:border-emerald-500/30',
                  Medium: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200/90 dark:border-amber-500/30',
                  Hard: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200/90 dark:border-rose-500/30',
                }[p.difficulty] || 'text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors hover:bg-orange-50/50 dark:hover:bg-[var(--base-bg-hover)] ${
                      isSolved ? 'bg-emerald-50/30 dark:bg-[#121213]/80' : ''
                    }`}
                  >
                    {/* Status Checkbox */}
                    <td className="px-3 py-3 w-[5%] text-center align-middle">
                      <div className="flex justify-center items-center">
                        <input
                          type="checkbox"
                          checked={isSolved}
                          onChange={() => onToggleSolved(p.id)}
                          className="sheet-checkbox"
                          title={isSolved ? "Mark as incomplete" : "Mark as completed"}
                        />
                      </div>
                    </td>

                    {/* Problem Title */}
                    <td className="px-4 py-3 w-[30%] text-left align-middle">
                      <button
                        onClick={() => onOpenWorkspace(p)}
                        className={`text-left text-sm font-medium transition-colors hover:text-[var(--brand)] hover:underline cursor-pointer line-clamp-2 ${
                          isSolved ? 'text-zinc-400 line-through decoration-zinc-400' : 'text-zinc-900 dark:text-[var(--base-text-primary)]'
                        }`}
                      >
                        {p.title}
                      </button>
                    </td>

                    {/* Plus Solve Link */}
                    <td className="w-[8%] text-center align-middle">
                      {p.plus ? (
                        <button
                          onClick={() => onOpenWorkspace(p)}
                          className="font-semibold text-xs px-2.5 py-1 rounded-md transition-all cursor-pointer bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs hover:from-orange-600 hover:to-amber-600 hover:shadow-sm active:scale-95 dark:bg-none dark:bg-orange-500/10 dark:text-[var(--brand)] dark:border dark:border-orange-500/30 dark:hover:bg-orange-500/20"
                          title="Free In-Browser Solve (0 Credits)"
                        >
                          Solve
                        </button>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-600 text-xs select-none">---</span>
                      )}
                    </td>

                    {/* Resource Plus (Editorial Video Modal) */}
                    <td className="w-[10%] text-center align-middle">
                      {p.editorial && p.youtube ? (
                        <button
                          onClick={() => onOpenVideo(p.youtube!, p.title)}
                          className="inline-flex items-center justify-center p-1.5 rounded-lg bg-orange-50 dark:bg-transparent hover:bg-orange-100 dark:hover:bg-zinc-800 border border-orange-200/60 dark:border-transparent transition-all cursor-pointer group shadow-xs dark:shadow-none"
                          title="Watch Video Editorial"
                        >
                          <svg width="22" height="16" viewBox="0 0 24 18" fill="none" className="text-red-500 group-hover:scale-110 transition-transform">
                            <rect width="24" height="18" rx="4" fill="#EA763F" fillOpacity="0.25"/>
                            <polygon points="10 5 16 9 10 13" fill="#EA763F"/>
                          </svg>
                        </button>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-600 text-xs select-none">---</span>
                      )}
                    </td>

                    {/* Resource (Article & YouTube) */}
                    <td className="w-[10%] text-center align-middle">
                      {hasResource ? (
                        <div className="flex justify-center items-center gap-1.5">
                          {/* Article icon - only rendered if article link exists */}
                          {p.article ? (
                            <a
                              href={p.article}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky-600 dark:text-zinc-400 bg-sky-50 dark:bg-transparent border border-sky-200/70 dark:border-transparent hover:bg-sky-100 dark:hover:bg-zinc-800 hover:text-sky-500 dark:hover:text-sky-400 transition-all p-1.5 rounded-lg shadow-xs dark:shadow-none"
                              title="Read Editorial Article"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <line x1="10" y1="9" x2="8" y2="9"/>
                              </svg>
                            </a>
                          ) : null}

                          {/* YouTube icon - only rendered if youtube link exists */}
                          {p.youtube ? (
                            <button
                              onClick={() => onOpenVideo(p.youtube!, p.title)}
                              className="text-red-600 dark:text-zinc-400 bg-red-50 dark:bg-transparent border border-red-200/70 dark:border-transparent hover:bg-red-100 dark:hover:bg-zinc-800 hover:text-red-500 dark:hover:text-red-400 transition-all p-1.5 rounded-lg cursor-pointer shadow-xs dark:shadow-none"
                              title="Watch Video Solution"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                              </svg>
                            </button>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-600 text-xs select-none">---</span>
                      )}
                    </td>

                    {/* Practice (LeetCode & GFG) */}
                    <td className="w-[12%] text-center align-middle">
                      {hasPractice ? (
                        <div className="flex justify-center items-center gap-1.5">
                          {/* LeetCode icon */}
                          {p.leetcode ? (
                            <a
                              href={p.leetcode}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-amber-50 dark:bg-transparent border border-amber-200/70 dark:border-transparent hover:bg-amber-100 dark:hover:bg-zinc-800 transition-all shadow-xs dark:shadow-none"
                              title="Practice on LeetCode"
                            >
                              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-amber-500 hover:scale-110 transition-transform">
                                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .666-1.795l3.855-4.126 5.406-5.788a1.374 1.374 0 0 0-.97-2.327z"/>
                                <path d="m19.67 11.23-8.877-.002a1.38 1.38 0 0 0-1.38 1.38 1.38 1.38 0 0 0 1.38 1.38l8.877.002a1.38 1.38 0 0 0 1.38-1.38 1.38 1.38 0 0 0-1.38-1.38z"/>
                              </svg>
                            </a>
                          ) : null}

                          {/* GFG badge */}
                          {p.gfg ? (
                            <a
                              href={p.gfg}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-lg bg-emerald-50 dark:bg-transparent border border-emerald-200/70 dark:border-transparent hover:bg-emerald-100 dark:hover:bg-zinc-800 transition-all shadow-xs dark:shadow-none"
                              title="Practice on GeeksforGeeks"
                            >
                              <span className="font-bold text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-200 dark:hover:bg-emerald-500/20">
                                GFG
                              </span>
                            </a>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-600 text-xs select-none">---</span>
                      )}
                    </td>

                    {/* Note Button */}
                    <td className="w-[8%] text-center align-middle">
                      <div className="flex justify-center">
                        <button
                          onClick={() => onOpenWorkspace(p)}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer shadow-xs dark:shadow-none ${
                            hasNotes
                              ? 'bg-purple-50 dark:bg-transparent text-purple-600 dark:text-[var(--brand)] border border-purple-200 dark:border-transparent hover:bg-purple-100 dark:hover:bg-zinc-800'
                              : 'text-zinc-400 dark:text-zinc-500 hover:text-purple-600 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                          }`}
                          title={hasNotes ? "Edit Note" : "Add Note"}
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    {/* Revision Star */}
                    <td className="w-[8%] text-center align-middle">
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => onToggleStarred(p.id)}
                          className="p-1.5 cursor-pointer transition-transform active:scale-125 rounded-lg hover:bg-amber-50 dark:hover:bg-transparent"
                          title={starred ? "Remove from Revision" : "Mark for Revision"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={starred ? "fill-amber-400 stroke-amber-500 filter drop-shadow-xs" : "stroke-zinc-400 dark:stroke-zinc-600 fill-transparent hover:stroke-amber-400"}>
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14 18.18 21.19 12 17.27 5.82 21.19 7 14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>
                      </div>
                    </td>

                    {/* Difficulty Pill */}
                    <td className="w-[9%] text-center align-middle">
                      <div className="flex justify-center">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border text-center min-w-[62px] shadow-xs dark:shadow-none ${difficultyColor}`}>
                          {p.difficulty}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
