import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Step, Problem, ProblemStatus } from '../types/dsa';
import { ProblemTable } from './ProblemTable';

const EXPANDED_STEPS_KEY = 'strivers_a2z_expanded_steps';
const EXPANDED_SUBSTEPS_KEY = 'strivers_a2z_expanded_substeps';

interface StepAccordionProps {
  steps: Step[];
  getStatus: (problemId: string) => ProblemStatus;
  isStarred: (problemId: string) => boolean;
  getNotes: (problemId: string) => string;
  onToggleSolved: (problemId: string) => void;
  onToggleStarred: (problemId: string) => void;
  onOpenWorkspace: (problem: Problem) => void;
  onOpenVideo: (url: string, title: string) => void;
}

export const StepAccordion: React.FC<StepAccordionProps> = ({
  steps,
  getStatus,
  isStarred,
  getNotes,
  onToggleSolved,
  onToggleStarred,
  onOpenWorkspace,
  onOpenVideo,
}) => {
  // Step expansion state (persisted to localStorage)
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(EXPANDED_STEPS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { [steps[0]?.id || 'step-1']: true };
  });

  // Subcategory expansion state (persisted to localStorage)
  const [expandedSubsteps, setExpandedSubsteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(EXPANDED_SUBSTEPS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { [steps[0]?.subcategories[0]?.id || 'sub-1-1']: true };
  });

  useEffect(() => {
    try {
      localStorage.setItem(EXPANDED_STEPS_KEY, JSON.stringify(expandedSteps));
    } catch {}
  }, [expandedSteps]);

  useEffect(() => {
    try {
      localStorage.setItem(EXPANDED_SUBSTEPS_KEY, JSON.stringify(expandedSubsteps));
    } catch {}
  }, [expandedSubsteps]);

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const toggleSubstep = (subId: string) => {
    setExpandedSubsteps(prev => ({ ...prev, [subId]: !prev[subId] }));
  };

  return (
    <div data-slot="accordion" className="tuf-accordion" data-orientation="vertical">
      {steps.map(step => {
        const isStepOpen = !!expandedSteps[step.id];

        // Calculate step progress
        let stepTotal = 0;
        let stepSolved = 0;
        step.subcategories.forEach(sub => {
          sub.problems.forEach(p => {
            stepTotal++;
            if (getStatus(p.id) === 'solved') {
              stepSolved++;
            }
          });
        });

        const stepPct = stepTotal > 0 ? Math.round((stepSolved / stepTotal) * 100) : 0;

        return (
          <div
            key={step.id}
            data-state={isStepOpen ? "open" : "closed"}
            data-orientation="vertical"
            data-slot="accordion-item"
            className="border-b last:border-b-0 tuf-accordion-row"
          >
            {/* Step Trigger Header */}
            <h3 data-orientation="vertical" data-state={isStepOpen ? "open" : "closed"} className="flex m-0">
              <button
                type="button"
                data-state={isStepOpen ? "open" : "closed"}
                data-orientation="vertical"
                data-slot="accordion-trigger"
                onClick={() => toggleStep(step.id)}
                className="tuf-accordion-header hover:no-underline px-3.5 md:px-5 py-3.5 w-full select-none"
              >
                <div className="flex items-center gap-2.5 md:gap-3.5 min-w-0 w-full">
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 shrink-0 ${isStepOpen ? 'rotate-90 text-orange-600' : 'text-slate-400'}`} />
                  <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-orange-100/70 text-orange-700 border border-orange-200/80 font-mono shrink-0 hidden sm:inline">
                    Step {step.stepNo}
                  </span>
                  <span className="text-sm sm:text-[15px] flex-1 min-w-0 text-left font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {step.title}
                  </span>
                  <div className="flex items-center gap-3 md:gap-4 ml-auto shrink-0">
                    <div className="w-20 md:w-32 h-2 bg-slate-100 border border-slate-200/80 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500 shadow-xs" 
                        style={{ width: `${stepPct}%` }} 
                      />
                    </div>
                    <span className="text-xs sm:text-[13px] min-w-[3.5rem] text-right font-mono text-slate-600 font-semibold">
                      <span className={stepSolved > 0 ? "text-orange-600 font-bold" : "text-slate-600"}>{stepSolved}</span>
                      <span className="text-slate-400 font-normal mx-0.5">/</span>
                      <span className="text-slate-500">{stepTotal}</span>
                    </span>
                  </div>
                </div>
              </button>
            </h3>

            {/* Step Expanded Content: Subcategories */}
            {isStepOpen && (
              <div className="tuf-accordion-body py-2 px-2 md:px-4 border-t border-slate-200 bg-[#fafbfc]">
                <div className="space-y-2 py-1">
                  {step.subcategories.map(sub => {
                    const isSubOpen = !!expandedSubsteps[sub.id];
                    const subSolved = sub.problems.filter(p => getStatus(p.id) === 'solved').length;
                    const subTotal = sub.problems.length;
                    const subPct = subTotal > 0 ? Math.round((subSolved / subTotal) * 100) : 0;
                    const isAllSolved = subSolved === subTotal && subTotal > 0;

                    return (
                      <div key={sub.id} className="tuf-subrow">
                        {/* Sub-step Trigger */}
                        <div className="tuf-subrow-row">
                          <div className="tuf-subrow-gutter">
                            <span className={`tuf-subrow-dot ${isAllSolved ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-slate-300'}`} />
                          </div>

                          <button
                            type="button"
                            data-state={isSubOpen ? "open" : "closed"}
                            onClick={() => toggleSubstep(sub.id)}
                            className="tuf-subrow-btn px-2.5 py-2 rounded-xl hover:bg-orange-50/80 select-none transition-all duration-150 group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${isSubOpen ? 'rotate-90 text-orange-600' : 'text-slate-400'}`} />
                              <span className="text-[11px] font-bold text-slate-500 font-mono px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200/70 group-hover:border-orange-200 group-hover:text-orange-600 transition-colors">
                                {step.stepNo}.{sub.subStepNo}
                              </span>
                              <span className="tuf-accordion-title text-sm font-medium text-slate-800 group-hover:text-orange-600 transition-colors">
                                {sub.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 ml-auto shrink-0">
                              <div className="w-16 md:w-24 h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-300" style={{ width: `${subPct}%` }} />
                              </div>
                              <span className="tuf-subrow-count text-xs font-mono min-w-[3rem] text-right text-slate-500 font-medium">
                                {subSolved} / {subTotal}
                              </span>
                            </div>
                          </button>
                        </div>

                        {/* Sub-step Problems Table */}
                        {isSubOpen && (
                          <div className="pl-6 sm:pl-8 pr-1 py-1">
                            <ProblemTable
                              problems={sub.problems}
                              getStatus={getStatus}
                              isStarred={isStarred}
                              getNotes={getNotes}
                              onToggleSolved={onToggleSolved}
                              onToggleStarred={onToggleStarred}
                              onOpenWorkspace={onOpenWorkspace}
                              onOpenVideo={onOpenVideo}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
