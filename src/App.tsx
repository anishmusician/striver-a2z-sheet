import { useState, useMemo, useRef, useEffect } from 'react';
import sheetDataRaw from './data/a2z-sheet.json';
import type { SheetData, Problem, Step, ProblemStatus, Difficulty, StatsSummary } from './types/dsa';
import { useDSAProgress } from './hooks/useDSAProgress';
import { Sidebar } from './components/Sidebar';
import { StatsDashboard } from './components/StatsDashboard';
import { FilterBar } from './components/FilterBar';
import { StepAccordion } from './components/StepAccordion';
import { ProblemWorkspace } from './components/ProblemWorkspace';
import { VideoModal } from './components/VideoModal';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { authService, type AuthUser } from './services/authService';
import { LogOut } from 'lucide-react';

const sheetData = sheetDataRaw as SheetData;

export function App() {
  const {
    currentProfile,
    profiles,
    switchProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    friends,
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
  } = useDSAProgress();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter states
  const [activeTab, setActiveTab] = useState<'all' | 'revision'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ProblemStatus>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | Difficulty>('all');

  // Dedicated user authentication
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => authService.getCurrentUser());

  // Modal states
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const [showKnowMore, setShowKnowMore] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync authUser with active profile
  useEffect(() => {
    if (authUser) {
      const match = profiles.find(p => p.username === authUser.username);
      if (match) {
        if (currentProfile.id !== match.id) {
          switchProfile(match.id);
        }
      } else {
        createProfile(authUser.name, authUser.username, authUser.avatarColor);
      }
    }
  }, [authUser, profiles, currentProfile.id, switchProfile, createProfile]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of your session?')) {
      authService.logout();
      setAuthUser(null);
    }
  };

  // Flat list of all problems for consecutive navigation
  const allProblemsList: Problem[] = useMemo(() => {
    const list: Problem[] = [];
    sheetData.steps.forEach(step => {
      step.subcategories.forEach(sub => {
        sub.problems.forEach(p => {
          list.push(p);
        });
      });
    });
    return list;
  }, []);

  // Hash-based deep linking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#solve=')) {
        const target = hash.replace('#solve=', '').trim();
        const found = allProblemsList.find(p => p.id === target || (p.plus && p.plus.includes(target)));
        if (found) {
          setActiveProblem(found);
        }
      } else if (hash === '#friends' || hash.startsWith('#friends')) {
        setShowAuthModal(true);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [allProblemsList]);

  // Sync active problem with hash
  useEffect(() => {
    if (activeProblem) {
      const slug = activeProblem.plus ? activeProblem.plus.replace('/plus/dsa/problems/', '').split('?')[0].replace(/^\/+|\/+$/g, '') : activeProblem.id;
      window.location.hash = `solve=${slug}`;
    } else if (window.location.hash.startsWith('#solve=')) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [activeProblem]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const res = importProgress(content);
        showToast(res.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Calculate Overall Statistics
  const stats: StatsSummary = useMemo(() => {
    let total = 0;
    let solved = 0;
    let inProgress = 0;
    let revision = 0;
    let starred = 0;

    let easyTotal = 0;
    let easySolved = 0;
    let medTotal = 0;
    let medSolved = 0;
    let hardTotal = 0;
    let hardSolved = 0;

    sheetData.steps.forEach(step => {
      step.subcategories.forEach(sub => {
        sub.problems.forEach(p => {
          total++;
          const st = getStatus(p.id);
          const star = isStarred(p.id);

          if (st === 'solved') solved++;
          if (st === 'in_progress') inProgress++;
          if (st === 'revision') revision++;
          if (star) starred++;

          if (p.difficulty === 'Easy') {
            easyTotal++;
            if (st === 'solved') easySolved++;
          } else if (p.difficulty === 'Medium') {
            medTotal++;
            if (st === 'solved') medSolved++;
          } else if (p.difficulty === 'Hard') {
            hardTotal++;
            if (st === 'solved') hardSolved++;
          }
        });
      });
    });

    return {
      total,
      solved,
      inProgress,
      revision,
      starred,
      percentage: total > 0 ? Math.round((solved / total) * 100) : 0,
      easy: { solved: easySolved, total: easyTotal },
      medium: { solved: medSolved, total: medTotal },
      hard: { solved: hardSolved, total: hardTotal },
      streak: progress.activeStreak || 0,
    };
  }, [getStatus, isStarred, progress.activeStreak]);

  // Filtered Steps & Problems
  const filteredSteps: Step[] = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return sheetData.steps
      .map(step => {
        const filteredSubcategories = step.subcategories
          .map(sub => {
            const matchingProblems = sub.problems.filter(p => {
              // Tab filter
              if (activeTab === 'revision' && !isStarred(p.id)) {
                return false;
              }

              // Status dropdown filter
              if (selectedStatus !== 'all' && getStatus(p.id) !== selectedStatus) {
                return false;
              }

              // Difficulty filter
              if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty) {
                return false;
              }

              // Search query filter
              if (query) {
                const matchTitle = p.title.toLowerCase().includes(query);
                const matchSub = sub.title.toLowerCase().includes(query);
                const matchStep = step.title.toLowerCase().includes(query);
                if (!matchTitle && !matchSub && !matchStep) return false;
              }

              return true;
            });

            return {
              ...sub,
              problems: matchingProblems,
            };
          })
          .filter(sub => sub.problems.length > 0);

        return {
          ...step,
          subcategories: filteredSubcategories,
          totalProblems: filteredSubcategories.reduce((acc, sub) => acc + sub.problems.length, 0),
        };
      })
      .filter(step => step.subcategories.length > 0);
  }, [searchQuery, activeTab, selectedStatus, selectedDifficulty, getStatus, isStarred]);

  // Pick a random unsolved problem
  const handlePickRandom = () => {
    const unsolvedList: Problem[] = [];
    const allList: Problem[] = [];

    sheetData.steps.forEach(step => {
      step.subcategories.forEach(sub => {
        sub.problems.forEach(p => {
          allList.push(p);
          if (getStatus(p.id) !== 'solved') {
            unsolvedList.push(p);
          }
        });
      });
    });

    const pool = unsolvedList.length > 0 ? unsolvedList : allList;
    if (pool.length === 0) return;

    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];
    setActiveProblem(chosen);
    showToast(`Picked: "${chosen.title}" (${chosen.difficulty})`);
  };

  // Guard unauthenticated visitors: Must login with username & password
  if (!authUser) {
    return <LoginPage onLoginSuccess={user => setAuthUser(user)} />;
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-white font-firaSans">
      {/* Hidden File Input for JSON import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1f1f20] border border-zinc-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm animate-fadeIn">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Exact Left Sidebar */}
      <Sidebar
        streak={stats.streak}
        currentProfile={currentProfile}
        onExport={exportProgress}
        onImportClick={() => fileInputRef.current?.click()}
        onReset={resetProgress}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Header container */}
        <main className="flex-1 max-w-[1240px] mx-auto w-full px-3 sm:px-6 py-4 md:py-6">
          {/* Exact takeUforward Hero Section */}
          <div className="px-1 md:px-0 mb-4">
            <div className="w-full flex flex-col justify-start items-start gap-2">
              <div className="w-full flex items-center justify-between gap-3 pt-0">
                <h1 className="text-lg md:text-2xl font-bold font-firaSans leading-tight text-[var(--base-text-primary)]">
                  Striver&apos;s A2Z Sheet - Learn DSA from A to Z
                </h1>
                <div className="flex items-center gap-2 justify-end w-fit">
                  {/* User Profile / Learner Account Pill */}
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--surface-border-muted)] bg-[var(--surface-1)] hover:bg-[var(--surface-2)] text-xs text-zinc-200 transition-colors cursor-pointer shadow-sm"
                    title="Switch Learner Profile / Learn with Friend"
                  >
                    <div className={`w-5 h-5 rounded-md bg-gradient-to-tr ${currentProfile.avatarColor} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
                      {currentProfile.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-white">{currentProfile.name}</span>
                    <span className="text-zinc-500 font-mono hidden sm:inline">@{currentProfile.username}</span>
                    <span className="text-[10px] font-medium text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20 hidden md:inline">
                      Learn Together
                    </span>
                  </button>

                  {/* Log Out Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--surface-border-muted)] bg-[var(--surface-1)] hover:bg-rose-500/10 hover:border-rose-500/30 text-xs text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer shadow-sm"
                    title="Log Out of Dedicated Session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Log Out</span>
                  </button>

                  <span className="hidden md:inline-flex shrink-0 items-center rounded-lg border border-[var(--surface-border-muted)] bg-[var(--surface-1)] px-3 py-1.5 text-xs text-[var(--base-text-muted)] shadow-sm">
                    Last updated : December 13, 2025
                  </span>
                </div>
              </div>

              {/* Subtitle & Know More */}
              <div className="self-stretch justify-start text-sm">
                <span className="text-[var(--base-text-muted)] font-normal font-firaSans leading-tight">
                  This course is made for people who want to learn DSA from A to Z for free in a well-organised and structured manner.
                </span>{' '}
                <button
                  onClick={() => setShowKnowMore(prev => !prev)}
                  className="text-[var(--brand)] font-normal font-firaSans leading-tight hover:underline cursor-pointer"
                >
                  {showKnowMore ? 'Show less' : 'Know more'}
                </button>
              </div>

              {/* Collapsible Know More Info */}
              {showKnowMore && (
                <div className="w-full p-4 mt-2 rounded-xl bg-[var(--surface-1)] border border-[var(--surface-border-muted)] text-xs text-zinc-300 space-y-2 animate-fadeIn">
                  <p className="font-semibold text-white">Why use this 100% Free Clone?</p>
                  <p>
                    • <strong>Zero Credits &amp; No Login:</strong> Practice all 474 problems freely with no paywalls or gated compilers.
                  </p>
                  <p>
                    • <strong>Direct Practice Links:</strong> Instant 1-click links to LeetCode, GeeksforGeeks, and Coding Ninjas.
                  </p>
                  <p>
                    • <strong>In-Browser Code Runner:</strong> Run Python &amp; JavaScript locally in your browser with zero latency.
                  </p>
                  <p>
                    • <strong>Privacy &amp; Data Ownership:</strong> Your progress, code, and notes are saved directly in your browser. Export or restore anytime via JSON backup.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Exact Filter Bar */}
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
            onPickRandom={handlePickRandom}
          />

          {/* Exact Overall Progress Card */}
          <StatsDashboard stats={stats} />

          {/* Exact Step Accordion with Problems Table */}
          {filteredSteps.length > 0 ? (
            <StepAccordion
              steps={filteredSteps}
              getStatus={getStatus}
              isStarred={isStarred}
              getNotes={getNotes}
              onToggleSolved={toggleSolved}
              onToggleStarred={toggleStarred}
              onOpenWorkspace={setActiveProblem}
              onOpenVideo={(url, title) => setActiveVideo({ url, title })}
            />
          ) : (
            <div className="bg-[var(--surface-1)] border border-[var(--surface-border-muted)] rounded-xl p-12 text-center my-4">
              <p className="text-zinc-300 font-medium mb-1">No problems found.</p>
              <p className="text-xs text-zinc-500 mb-4">Try clearing your search query or filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('all');
                  setSelectedDifficulty('all');
                  setActiveTab('all');
                }}
                className="px-4 py-2 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Problem Coding & Notes Workspace (Exact 1:1 takeUforward Plus IDE) */}
      {activeProblem && (
        <ProblemWorkspace
          problem={activeProblem}
          allProblems={allProblemsList}
          status={getStatus(activeProblem.id)}
          isStarred={isStarred(activeProblem.id)}
          notes={getNotes(activeProblem.id)}
          getSavedCode={lang => getSavedCode(activeProblem.id, lang)}
          submissions={getSubmissions(activeProblem.id)}
          onClose={() => setActiveProblem(null)}
          onNavigateProblem={prob => setActiveProblem(prob)}
          onStatusChange={st => setStatus(activeProblem.id, st)}
          onToggleStarred={() => toggleStarred(activeProblem.id)}
          onSaveNotes={n => saveNotes(activeProblem.id, n)}
          onSaveCode={(lang, c) => saveCode(activeProblem.id, lang, c)}
          onAddSubmission={sub => addSubmission(activeProblem.id, sub)}
          onOpenVideo={(url, title) => setActiveVideo({ url, title })}
        />
      )}

      {/* YouTube Video Modal */}
      {activeVideo && (
        <VideoModal
          url={activeVideo.url}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      )}

      {/* Learner Account & Friend Sync Modal */}
      <AuthModal
        currentProfile={currentProfile}
        profiles={profiles}
        friends={friends}
        totalSolved={stats.solved}
        activeStreak={stats.streak}
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSwitchProfile={switchProfile}
        onCreateProfile={createProfile}
        onUpdateProfile={updateProfile}
        onDeleteProfile={deleteProfile}
        onGetShareCode={getShareCode}
        onImportFriendCode={importFriendCode}
        onRemoveFriend={removeFriend}
      />
    </div>
  );
}

export default App;
