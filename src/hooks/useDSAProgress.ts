import { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type { 
  UserProgressState, 
  ProblemStatus, 
  ProblemUserData, 
  Language, 
  SubmissionRecord,
  UserProfile,
  FriendSummary,
  MultiUserStorage
} from '../types/dsa';

const MULTI_USER_STORAGE_KEY = 'strivers_a2z_multi_user_v1';
const LEGACY_STORAGE_KEY = 'strivers_a2z_progress_v1';

import { idbSet, idbGet, requestPersistentStorage } from '../services/storageService';

export const ANISH_PROFILE: UserProfile = {
  id: 'usr_anish',
  name: 'Anish',
  username: 'anish',
  avatarColor: 'from-orange-500 to-amber-500',
  createdAt: 1700000000000,
};

export const TANISHA_PROFILE: UserProfile = {
  id: 'usr_tanisha',
  name: 'Tanisha',
  username: 'tanisha',
  avatarColor: 'from-purple-500 to-pink-500',
  createdAt: 1700000000000,
};

const DEFAULT_PROFILE = ANISH_PROFILE;

const createEmptyProgressState = (): UserProgressState => ({
  problems: {},
  activeStreak: 0,
  lastActiveDate: '',
  activityDates: [],
  version: 1,
});

const getInitialStorage = (): MultiUserStorage => {
  try {
    const saved = localStorage.getItem(MULTI_USER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.profiles && parsed.progress) {
        // Ensure Anish profile & progress exists
        if (!parsed.profiles['usr_anish']) {
          const oldAnishProg = parsed.progress['usr_default_anish'];
          parsed.profiles['usr_anish'] = ANISH_PROFILE;
          parsed.progress['usr_anish'] = oldAnishProg || createEmptyProgressState();
        }
        // Ensure Tanisha profile & progress exists
        if (!parsed.profiles['usr_tanisha']) {
          parsed.profiles['usr_tanisha'] = TANISHA_PROFILE;
          parsed.progress['usr_tanisha'] = createEmptyProgressState();
        }

        if (!parsed.activeProfileId || !parsed.profiles[parsed.activeProfileId]) {
          parsed.activeProfileId = 'usr_anish';
        }

        return parsed;
      }
    }

    // Check for legacy progress migration
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    let migratedProgress: UserProgressState = createEmptyProgressState();
    if (legacy) {
      try {
        const parsedLegacy = JSON.parse(legacy);
        if (parsedLegacy && parsedLegacy.problems) {
          migratedProgress = parsedLegacy;
        }
      } catch {
        // ignore legacy parse error
      }
    }

    return {
      activeProfileId: ANISH_PROFILE.id,
      profiles: {
        [ANISH_PROFILE.id]: ANISH_PROFILE,
        [TANISHA_PROFILE.id]: TANISHA_PROFILE,
      },
      progress: {
        [ANISH_PROFILE.id]: migratedProgress,
        [TANISHA_PROFILE.id]: createEmptyProgressState(),
      },
      friends: {},
      version: 1,
    };
  } catch (e) {
    console.error('Failed to load multi-user progress from localStorage', e);
    return {
      activeProfileId: ANISH_PROFILE.id,
      profiles: {
        [ANISH_PROFILE.id]: ANISH_PROFILE,
        [TANISHA_PROFILE.id]: TANISHA_PROFILE,
      },
      progress: {
        [ANISH_PROFILE.id]: createEmptyProgressState(),
        [TANISHA_PROFILE.id]: createEmptyProgressState(),
      },
      friends: {},
      version: 1,
    };
  }
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
  const [storage, setStorage] = useState<MultiUserStorage>(getInitialStorage);

  // Sync with localStorage AND IndexedDB (dual-write permanent persistence)
  useEffect(() => {
    try {
      localStorage.setItem(MULTI_USER_STORAGE_KEY, JSON.stringify(storage));
      idbSet(MULTI_USER_STORAGE_KEY, storage).catch(() => {});

      // Also sync active progress to legacy key for backwards compatibility
      if (storage.progress[storage.activeProfileId]) {
        localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(storage.progress[storage.activeProfileId]));
      }
    } catch (e) {
      console.error('Failed to save multi-user progress to localStorage', e);
    }
  }, [storage]);

  // Request browser storage persistence and verify IDB backup on initial mount
  useEffect(() => {
    requestPersistentStorage();
    idbGet<MultiUserStorage>(MULTI_USER_STORAGE_KEY).then(idbData => {
      if (idbData && idbData.profiles && idbData.progress) {
        setStorage(prev => {
          const mergedProfiles = { ...idbData.profiles, ...prev.profiles };
          const mergedProgress = { ...idbData.progress, ...prev.progress };
          return {
            ...prev,
            profiles: mergedProfiles,
            progress: mergedProgress,
          };
        });
      }
    }).catch(() => {});
  }, []);

  // Current active profile
  const currentProfile: UserProfile = useMemo(() => {
    return storage.profiles[storage.activeProfileId] || DEFAULT_PROFILE;
  }, [storage.profiles, storage.activeProfileId]);

  // List of all local profiles
  const profilesList: UserProfile[] = useMemo(() => {
    return Object.values(storage.profiles);
  }, [storage.profiles]);

  // Current active progress state
  const progress: UserProgressState = useMemo(() => {
    return storage.progress[storage.activeProfileId] || createEmptyProgressState();
  }, [storage.progress, storage.activeProfileId]);

  // List of friends
  const friendsList: FriendSummary[] = useMemo(() => {
    return Object.values(storage.friends || {});
  }, [storage.friends]);

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
      // ignore
    }
  }, []);

  // Update progress for active profile helper
  const updateCurrentProgress = useCallback((updater: (prev: UserProgressState) => UserProgressState) => {
    setStorage(prev => {
      const activeId = prev.activeProfileId;
      const currentProg = prev.progress[activeId] || createEmptyProgressState();
      const updatedProg = updater(currentProg);
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [activeId]: updatedProg,
        },
      };
    });
  }, []);

  // Profile Management Actions
  const switchProfile = useCallback((profileId: string) => {
    if (storage.profiles[profileId]) {
      setStorage(prev => ({
        ...prev,
        activeProfileId: profileId,
      }));
    }
  }, [storage.profiles]);

  const createProfile = useCallback((name: string, username: string, avatarColor?: string): UserProfile => {
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') || `user_${Date.now().toString().slice(-4)}`;
    const newProfile: UserProfile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim() || 'DSA Learner',
      username: cleanUsername,
      avatarColor: avatarColor || 'from-sky-500 to-indigo-500',
      createdAt: Date.now(),
    };

    setStorage(prev => ({
      ...prev,
      activeProfileId: newProfile.id,
      profiles: {
        ...prev.profiles,
        [newProfile.id]: newProfile,
      },
      progress: {
        ...prev.progress,
        [newProfile.id]: createEmptyProgressState(),
      },
    }));

    return newProfile;
  }, []);

  const updateProfile = useCallback((name: string, username: string, avatarColor?: string) => {
    setStorage(prev => {
      const activeId = prev.activeProfileId;
      const existing = prev.profiles[activeId];
      if (!existing) return prev;

      const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') || existing.username;
      const updated: UserProfile = {
        ...existing,
        name: name.trim() || existing.name,
        username: cleanUsername,
        avatarColor: avatarColor || existing.avatarColor,
      };

      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [activeId]: updated,
        },
      };
    });
  }, []);

  const deleteProfile = useCallback((profileId: string) => {
    setStorage(prev => {
      if (Object.keys(prev.profiles).length <= 1) {
        alert('You must keep at least one profile.');
        return prev;
      }

      const nextProfiles = { ...prev.profiles };
      delete nextProfiles[profileId];

      const nextProgress = { ...prev.progress };
      delete nextProgress[profileId];

      const remainingIds = Object.keys(nextProfiles);
      const newActiveId = prev.activeProfileId === profileId ? remainingIds[0] : prev.activeProfileId;

      return {
        ...prev,
        activeProfileId: newActiveId,
        profiles: nextProfiles,
        progress: nextProgress,
      };
    });
  }, []);

  // Friend Sharing & Sync
  const getShareCode = useCallback((): string => {
    const solvedIds = Object.entries(progress.problems)
      .filter(([, data]) => data.status === 'solved')
      .map(([id]) => id);

    const shareData = {
      type: 'tuf_friend_share_v1',
      profile: currentProfile,
      totalSolved: solvedIds.length,
      activeStreak: progress.activeStreak || 0,
      solvedProblemIds: solvedIds,
      updatedAt: Date.now(),
    };

    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(shareData))));
    } catch {
      return JSON.stringify(shareData);
    }
  }, [currentProfile, progress]);

  const importFriendCode = useCallback((codeStr: string): { success: boolean; message: string; friend?: FriendSummary } => {
    try {
      let rawJson = codeStr.trim();
      if (!rawJson.startsWith('{')) {
        rawJson = decodeURIComponent(escape(atob(rawJson)));
      }
      const parsed = JSON.parse(rawJson);

      if (!parsed || !parsed.profile || !Array.isArray(parsed.solvedProblemIds)) {
        return { success: false, message: 'Invalid friend code format. Please check the code.' };
      }

      const friendSummary: FriendSummary = {
        profile: parsed.profile,
        totalSolved: parsed.totalSolved || parsed.solvedProblemIds.length,
        totalProblems: 474,
        activeStreak: parsed.activeStreak || 0,
        solvedProblemIds: parsed.solvedProblemIds,
        updatedAt: parsed.updatedAt || Date.now(),
      };

      setStorage(prev => ({
        ...prev,
        friends: {
          ...(prev.friends || {}),
          [parsed.profile.id]: friendSummary,
        },
      }));

      return {
        success: true,
        message: `Successfully connected with ${parsed.profile.name} (@${parsed.profile.username})! Solved: ${friendSummary.totalSolved}/474`,
        friend: friendSummary,
      };
    } catch (e: any) {
      return { success: false, message: 'Failed to read friend code: ' + (e?.message || 'Syntax error') };
    }
  }, []);

  const removeFriend = useCallback((friendId: string) => {
    setStorage(prev => {
      const nextFriends = { ...(prev.friends || {}) };
      delete nextFriends[friendId];
      return {
        ...prev,
        friends: nextFriends,
      };
    });
  }, []);

  // Problem State Operations
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

  const getSubmissions = useCallback((problemId: string): SubmissionRecord[] => {
    return progress.problems[problemId]?.submissions || [];
  }, [progress.problems]);

  const toggleSolved = useCallback((problemId: string) => {
    updateCurrentProgress(prev => {
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
  }, [updateCurrentProgress, fireCelebration]);

  const setStatus = useCallback((problemId: string, status: ProblemStatus) => {
    updateCurrentProgress(prev => {
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
  }, [updateCurrentProgress, fireCelebration]);

  const toggleStarred = useCallback((problemId: string) => {
    updateCurrentProgress(prev => {
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
  }, [updateCurrentProgress]);

  const saveNotes = useCallback((problemId: string, notes: string) => {
    updateCurrentProgress(prev => {
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
  }, [updateCurrentProgress]);

  const saveCode = useCallback((problemId: string, lang: Language, code: string) => {
    updateCurrentProgress(prev => {
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
  }, [updateCurrentProgress]);

  const addSubmission = useCallback((problemId: string, submission: Omit<SubmissionRecord, 'id' | 'timestamp'>) => {
    updateCurrentProgress(prev => {
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
  }, [updateCurrentProgress, fireCelebration]);

  const resetProgress = useCallback(() => {
    if (window.confirm(`Reset all progress for profile "${currentProfile.name}"? This cannot be undone.`)) {
      updateCurrentProgress(() => createEmptyProgressState());
    }
  }, [currentProfile.name, updateCurrentProgress]);

  const exportProgress = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(storage, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dsa_${currentProfile.username}_backup_${getTodayString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [storage, currentProfile.username]);

  const importProgress = useCallback((jsonStr: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonStr);
      // Support importing full multi-user storage or single progress state
      if (parsed.profiles && parsed.activeProfileId && parsed.progress) {
        setStorage(parsed);
        return { success: true, message: `Successfully restored full backup with ${Object.keys(parsed.profiles).length} profiles!` };
      } else if (parsed.problems) {
        updateCurrentProgress(() => ({
          problems: parsed.problems || {},
          activeStreak: Number(parsed.activeStreak) || 0,
          lastActiveDate: parsed.lastActiveDate || '',
          activityDates: Array.isArray(parsed.activityDates) ? parsed.activityDates : [],
          version: 1,
        }));
        return { success: true, message: `Successfully restored progress for ${Object.keys(parsed.problems).length} problems into "${currentProfile.name}"!` };
      }
      return { success: false, message: 'Unrecognized file format' };
    } catch (e: any) {
      return { success: false, message: 'Failed to parse JSON: ' + (e?.message || 'Syntax error') };
    }
  }, [updateCurrentProgress, currentProfile.name]);

  return {
    storage,
    currentProfile,
    profiles: profilesList,
    switchProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    friends: friendsList,
    getShareCode,
    importFriendCode,
    removeFriend,
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
