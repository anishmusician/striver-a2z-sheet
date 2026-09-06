import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Step, Problem, ProblemStatus } from '../types/dsa';
import { ProblemTable } from './ProblemTable';

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
  // Step expansion state (step 1 expanded by default)
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({
    [steps[0]?.id || 'step-1']: true,
  });

  // Subcategory expansion state (first subcategory of step 1 expanded by default)
  const [expandedSubsteps, setExpandedSubsteps] = useState<Record<string, boolean>>({
    [steps[0]?.subcategories[0]?.id || 'sub-1-1']: true,
  });

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
                className="tuf-accordion-header hover:no-underline px-3 md:px-4 w-full select-none"
              >
                <div className="flex items-center gap-2 md:gap-3 min-w-0 w-full">
                  <ChevronRight className="lucide lucide-chevron-right tuf-accordion-icon shrink-0" />
                  <span className="tuf-accordion-title text-base flex-1 min-w-0 text-left font-medium">
                    {step.title}
                  </span>
                  <div className="flex items-center gap-2 md:gap-3 ml-auto shrink-0">
                    <div className="tuf-accordion-progress w-16 md:w-28">
                      <div className="tuf-accordion-progress-bar" style={{ width: `${stepPct}%` }} />
                    </div>
                    <span className="tuf-accordion-count text-sm md:text-base min-w-[3.5rem] text-right font-mono">
                      {stepSolved} / {stepTotal}
                    </span>
                  </div>
                </div>
              </button>
            </h3>

            {/* Step Expanded Content: Subcategories */}
            {isStepOpen && (
              <div className="tuf-accordion-body py-2 px-2 md:px-4 border-t border-[var(--border)] bg-[var(--accordion-body-bg)]">
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
                            <span className={`tuf-subrow-dot ${isAllSolved ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : ''}`} />
                          </div>

                          <button
                            type="button"
                            data-state={isSubOpen ? "open" : "closed"}
                            onClick={() => toggleSubstep(sub.id)}
                            className="tuf-subrow-btn px-2 rounded-lg hover:bg-orange-500/5 dark:hover:bg-zinc-800/40 select-none transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <ChevronRight className="tuf-accordion-icon w-4 h-4 text-zinc-400" />
                              <span className="tuf-accordion-title text-sm text-zinc-200">
                                {sub.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 ml-auto shrink-0">
                              <div className="tuf-accordion-progress w-14 md:w-24">
                                <div className="tuf-accordion-progress-bar" style={{ width: `${subPct}%` }} />
                              </div>
                              <span className="tuf-subrow-count text-xs font-mono min-w-[3rem] text-right text-zinc-400">
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
