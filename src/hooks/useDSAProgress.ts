import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { UserProgressState, ProblemStatus, ProblemUserData, Language, SubmissionRecord } from '../types/dsa';

const STORAGE_KEY = 'strivers_a2z_progress_v1';

const getInitialState = (): UserProgressState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load DSA progress from localStorage', e);
  }
  return {
    problems: {},
    activeStreak: 0,
    lastActiveDate: '',
    activityDates: [],
    version: 1,
  };
};

const getTodayString = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getYesterdayString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const useDSAProgress = () => {
  const [progress, setProgress] = useState<UserProgressState>(getInitialState);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save DSA progress to localStorage', e);
    }
  }, [progress]);

  const updateStreakOnSolve = (prevState: UserProgressState): Pick<UserProgressState, 'activeStreak' | 'lastActiveDate' | 'activityDates'> => {
    const today = getTodayString();
    const yesterday = getYesterdayString();
    let newStreak = prevState.activeStreak;

    if (!prevState.lastActiveDate) {
      newStreak = 1;
    } else if (prevState.lastActiveDate === today) {
      newStreak = prevState.activeStreak || 1;
    } else if (prevState.lastActiveDate === yesterday) {
      newStreak = (prevState.activeStreak || 0) + 1;
    } else {
      newStreak = 1;
    }

    const activityDates = prevState.activityDates.includes(today)
      ? prevState.activityDates
      : [...prevState.activityDates, today];

    return {
      activeStreak: newStreak,
      lastActiveDate: today,
      activityDates,
    };
  };

  const fireCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#38bdf8', '#34d399', '#f59e0b', '#a855f7'],
      });
    } catch {
      // ignore in non-browser env
    }
  }, []);

  const getStatus = useCallback((problemId: string): ProblemStatus => {
    return progress.problems[problemId]?.status || 'todo';
  }, [progress.problems]);

  const isStarred = useCallback((problemId: string): boolean => {
    return !!progress.problems[problemId]?.starred;
  }, [progress.problems]);

  const getNotes = useCallback((problemId: string): string => {
    return progress.problems[problemId]?.notes || '';
  }, [progress.problems]);

  const getSavedCode = useCallback((problemId: string, lang: Language): string | undefined => {
    return progress.problems[problemId]?.code?.[lang];
  }, [progress.problems]);

  const toggleSolved = useCallback((problemId: string) => {
    setProgress(prev => {
      const current = prev.problems[problemId]?.status || 'todo';
      const isNowSolved = current !== 'solved';

      const existingData: ProblemUserData = prev.problems[problemId] || {
        status: 'todo',
        starred: false,
        notes: '',
        code: {},
        updatedAt: Date.now(),
      };

      const updatedProblem: ProblemUserData = {
        ...existingData,
        status: isNowSolved ? 'solved' : 'todo',
        updatedAt: Date.now(),
      };

      let streakUpdates = {};
      if (isNowSolved) {
        streakUpdates = updateStreakOnSolve(prev);
        setTimeout(fireCelebration, 50);
      }

      return {
        ...prev,
        ...streakUpdates,
        problems: {
          ...prev.problems,
          [problemId]: updatedProblem,
        },
      };
    });
  }, [fireCelebration]);

  const setStatus = useCallback((problemId: string, status: ProblemStatus) => {
    setProgress(prev => {
      const existingData: ProblemUserData = prev.problems[problemId] || {
        status: 'todo',
        starred: false,
        notes: '',
        code: {},
        updatedAt: Date.now(),
      };

      let streakUpdates = {};
      if (status === 'solved' && existingData.status !== 'solved') {
        streakUpdates = updateStreakOnSolve(prev);
        setTimeout(fireCelebration, 50);
      }

      return {
        ...prev,
        ...streakUpdates,
        problems: {
          ...prev.problems,
          [problemId]: {
            ...existingData,
            status,
            updatedAt: Date.now(),
          },
        },
      };
    });
  }, [fireCelebration]);

  const toggleStarred = useCallback((problemId: string) => {
    setProgress(prev => {
      const existingData: ProblemUserData = prev.problems[problemId] || {
        status: 'todo',
        starred: false,
        notes: '',
        code: {},
        updatedAt: Date.now(),
      };

      return {
        ...prev,
        problems: {
          ...prev.problems,
          [problemId]: {
            ...existingData,
            starred: !existingData.starred,
            updatedAt: Date.now(),
          },
        },
      };
    });
  }, []);

  const saveNotes = useCallback((problemId: string, notes: string) => {
    setProgress(prev => {
      const existingData: ProblemUserData = prev.problems[problemId] || {
        status: 'todo',
        starred: false,
        notes: '',
        code: {},
        updatedAt: Date.now(),
      };

      return {
        ...prev,
        problems: {
          ...prev.problems,
          [problemId]: {
            ...existingData,
            notes,
            updatedAt: Date.now(),
          },
        },
      };
    });
  }, []);

  const saveCode = useCallback((problemId: string, lang: Language, code: string) => {
    setProgress(prev => {
      const existingData: ProblemUserData = prev.problems[problemId] || {
        status: 'todo',
        starred: false,
        notes: '',
        code: {},
        updatedAt: Date.now(),
      };

      return {
        ...prev,
        problems: {
          ...prev.problems,
          [problemId]: {
            ...existingData,
            code: {
              ...existingData.code,
              [lang]: code,
            },
            updatedAt: Date.now(),
          },
        },
      };
    });
  }, []);

  const getSubmissions = useCallback((problemId: string): SubmissionRecord[] => {
    return progress.problems[problemId]?.submissions || [];
  }, [progress.problems]);

  const addSubmission = useCallback((problemId: string, submission: Omit<SubmissionRecord, 'id' | 'timestamp'>) => {
    setProgress(prev => {
      const existingData: ProblemUserData = prev.problems[problemId] || {
        status: 'todo',
        starred: false,
        notes: '',
        code: {},
        updatedAt: Date.now(),
      };

      const newRecord: SubmissionRecord = {
        ...submission,
        id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        problemId,
        timestamp: Date.now(),
      };

      const existingSubs = existingData.submissions || [];
      const updatedSubs = [newRecord, ...existingSubs].slice(0, 50);

      let streakUpdates = {};
      const isNowSolved = submission.status === 'Accepted';
      if (isNowSolved && existingData.status !== 'solved') {
        streakUpdates = updateStreakOnSolve(prev);
        setTimeout(fireCelebration, 50);
      }

      return {
        ...prev,
        ...streakUpdates,
        problems: {
          ...prev.problems,
          [problemId]: {
            ...existingData,
            status: isNowSolved ? 'solved' : existingData.status,
            submissions: updatedSubs,
            updatedAt: Date.now(),
          },
        },
      };
    });
  }, [fireCelebration]);

  const resetProgress = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
      const resetState: UserProgressState = {
        problems: {},
        activeStreak: 0,
        lastActiveDate: '',
        activityDates: [],
        version: 1,
      };
      setProgress(resetState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resetState));
    }
  }, []);

  const exportProgress = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(progress, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dsa_progress_backup_${getTodayString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [progress]);

  const importProgress = useCallback((jsonStr: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || typeof parsed !== 'object' || !parsed.problems) {
        return { success: false, message: 'Invalid backup file format: missing problems object' };
      }
      const imported: UserProgressState = {
        problems: parsed.problems || {},
        activeStreak: Number(parsed.activeStreak) || 0,
        lastActiveDate: parsed.lastActiveDate || '',
        activityDates: Array.isArray(parsed.activityDates) ? parsed.activityDates : [],
        version: 1,
      };
      setProgress(imported);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(imported));
      return { success: true, message: `Successfully restored progress for ${Object.keys(imported.problems).length} problems!` };
    } catch (e: any) {
      return { success: false, message: 'Failed to parse JSON: ' + (e?.message || 'Syntax error') };
    }
  }, []);

  return {
    progress,
    getStatus,
    isStarred,
    getNotes,
    getSavedCode,
    getSubmissions,
    addSubmission,
    toggleSolved,
    setStatus,
    toggleStarred,
    saveNotes,
    saveCode,
    resetProgress,
    exportProgress,
    importProgress,
  };
};
