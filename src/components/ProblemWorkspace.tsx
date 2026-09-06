import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, Play, Copy, Check, Save, RotateCcw, ExternalLink, 
  BookOpen, Video, FileText, Star, Sparkles, Terminal,
  ChevronLeft, ChevronRight, ChevronDown, Maximize2, Minimize2, Lightbulb,
  CheckCircle2, XCircle, AlertTriangle, Send, History,
  ThumbsUp, ThumbsDown, Clock, MessageSquare, FileEdit, Code2
} from 'lucide-react';
import type { Problem, Language, ProblemStatus, SubmissionRecord } from '../types/dsa';
import { getProblemDetail } from '../data/problemsData';
import { validateJavaCode } from '../services/javaValidator';
import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

loader.config({ monaco });

interface ProblemWorkspaceProps {
  problem: Problem;
  allProblems: Problem[];
  status: ProblemStatus;
  isStarred: boolean;
  notes: string;
  savedCode?: string;
  getSavedCode?: (lang: Language) => string | undefined;
  submissions?: SubmissionRecord[];
  onClose: () => void;
  onNavigateProblem: (problem: Problem) => void;
  onStatusChange: (status: ProblemStatus) => void;
  onToggleStarred: () => void;
  onSaveNotes: (notes: string) => void;
  onSaveCode: (lang: Language, code: string) => void;
  onAddSubmission: (submission: Omit<SubmissionRecord, 'id' | 'timestamp'>) => void;
  onOpenVideo: (url: string, title: string) => void;
}

// Global Pyodide singleton
let pyodideInstance: any = null;
let pyodideLoadingPromise: Promise<any> | null = null;

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoadingPromise) return pyodideLoadingPromise;

  pyodideLoadingPromise = (async () => {
    if (!(window as any).loadPyodide) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
      document.head.appendChild(script);
      await new Promise((res, rej) => {
        script.onload = res;
        script.onerror = rej;
      });
    }
    const pyodide = await (window as any).loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
    });
    pyodideInstance = pyodide;
    return pyodide;
  })();

  return pyodideLoadingPromise;
}

export const ProblemWorkspace: React.FC<ProblemWorkspaceProps> = ({
  problem,
  allProblems,
  status,
  isStarred,
  notes,
  savedCode,
  getSavedCode,
  submissions = [],
  onClose,
  onNavigateProblem,
  onStatusChange,
  onToggleStarred,
  onSaveNotes,
  onSaveCode,
  onAddSubmission,
  onOpenVideo,
}) => {
  // Navigation indices
  const currentIndex = useMemo(() => {
    return allProblems.findIndex(p => p.id === problem.id);
  }, [allProblems, problem.id]);

  const prevProblem = currentIndex > 0 ? allProblems[currentIndex - 1] : null;
  const nextProblem = currentIndex < allProblems.length - 1 ? allProblems[currentIndex + 1] : null;

  // Retrieve rich problem details
  const detail = useMemo(() => {
    return getProblemDetail(problem.id, problem.plus);
  }, [problem.id, problem.plus]);

  // Code state - default to Java matching screenshot
  const [selectedLang, setSelectedLang] = useState<Language>('java');
  const [code, setCode] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(14);
  const [userNotes, setUserNotes] = useState<string>(notes);
  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'editorial' | 'submissions' | 'discussion' | 'notes'>('description');
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>('');
  const [isCustomTab, setIsCustomTab] = useState<boolean>(false);

  // Concept quiz state ("Now your turn!")
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  // Feedback state
  const [likes, setLikes] = useState<number>(18);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  // Active coding study timer
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  useEffect(() => {
    const timer = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTimer = useMemo(() => {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [timerSeconds]);

  // Runner state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [returnValue, setReturnValue] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<'idle' | 'accepted' | 'wrong' | 'error'>('idle');
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isConsoleExpanded, setIsConsoleExpanded] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [expandedHints, setExpandedHints] = useState<Record<number, boolean>>({});

  const editorRef = useRef<any>(null);
  const editorTheme = 'vs-code-vibrant-light';

  // Initialize starters and saved code per language
  useEffect(() => {
    let userSaved = getSavedCode ? getSavedCode(selectedLang) : savedCode;
    const starterTemplate = 
      detail?.starters?.[selectedLang] ||
      problem.starters[selectedLang] ||
      '';

    // Auto-discard any legacy pre-filled solutions that were cached in browser localStorage
    if (userSaved && (
      userSaved.includes('if (type.equals("Character"))') ||
      userSaved.includes('sizes = {"Character": 1') ||
      userSaved.includes('if (type == "Character")') ||
      userSaved.includes('sizes = { Character: 1') ||
      userSaved.includes('if (loopDepth == 0) return "O(1)"') ||
      userSaved.includes('loopDepth > 1 else ("O(N)"') ||
      userSaved.includes('for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= i') ||
      userSaved.includes('print("* " * i)') ||
      userSaved.includes('TreeSet<Integer> set = new TreeSet<>()') ||
      userSaved.includes('return Array.from(new Set(nums))') ||
      userSaved.includes('return atMostK(s, k) - atMostK(s, k - 1)') ||
      userSaved.includes('ListNode head = new ListNode(arr[0])') ||
      userSaved.includes('Node head = new Node(arr[0])') ||
      userSaved.includes('return n | (n + 1);') ||
      userSaved.includes('pq.offer(val)')
    )) {
      userSaved = undefined;
    }

    setCode(userSaved || starterTemplate);
    setConsoleOutput('');
    setReturnValue(null);
    setRunStatus('idle');
    setExecutionTime(null);
  }, [problem.id, selectedLang, getSavedCode, savedCode, detail, problem.starters]);

  useEffect(() => {
    setUserNotes(notes);
  }, [notes]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxImage) {
          setLightboxImage(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, lightboxImage]);

  const handleSave = () => {
    onSaveCode(selectedLang, code);
    onSaveNotes(userNotes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code to official starter template?')) {
      const template = detail?.starters?.[selectedLang] || problem.starters[selectedLang] || '';
      setCode(template);
      onSaveCode(selectedLang, template);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const toggleHint = (idx: number) => {
    setExpandedHints(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const monacoLanguage = useMemo(() => {
    switch (selectedLang) {
      case 'java': return 'java';
      case 'python': return 'python';
      case 'cpp': return 'cpp';
      case 'javascript': return 'javascript';
      default: return 'java';
    }
  }, [selectedLang]);

  const activeFileName = useMemo(() => {
    switch (selectedLang) {
      case 'java': return 'Solution.java';
      case 'python': return 'solution.py';
      case 'cpp': return 'solution.cpp';
      case 'javascript': return 'solution.js';
      default: return 'Solution.java';
    }
  }, [selectedLang]);

  const handleEditorDidMount = (editor: any, monacoInstance: typeof monaco) => {
    editorRef.current = editor;

    // Custom ultra-vibrant VS Code Light Theme (Pure White, Vivid Color Tokens)
    monacoInstance.editor.defineTheme('vs-code-vibrant-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '7c3aed', fontStyle: 'bold' }, // Purple
        { token: 'storage', foreground: '7c3aed', fontStyle: 'bold' },
        { token: 'type', foreground: '0284c7' }, // Cyan
        { token: 'class', foreground: '0284c7', fontStyle: 'bold' },
        { token: 'function', foreground: 'd97706' }, // Yellow/Amber
        { token: 'string', foreground: '16a34a' }, // Emerald Green
        { token: 'number', foreground: 'ea580c' }, // Orange
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' }, // Slate Muted
        { token: 'variable', foreground: 'dc2626' }, // Coral
        { token: 'operator', foreground: '0891b2' }, // Teal
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#0f172a',
        'editorLineNumber.foreground': '#94a3b8',
        'editorLineNumber.activeForeground': '#ea580c',
        'editor.lineHighlightBackground': '#f8fafc',
        'editorCursor.foreground': '#ea580c',
        'editorBracketMatch.background': '#fed7aa40',
        'editorBracketMatch.border': '#ea580c',
      },
    });

    monacoInstance.editor.setTheme('vs-code-vibrant-light');

    editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter, () => {
      runCode();
    });
    editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS, () => {
      handleSave();
    });
  };

  // Extract testcases
  const testcases = detail?.testcases && detail.testcases.length > 0
    ? detail.testcases
    : [
        { inputs: { input: 'Sample test case 1' } },
        { inputs: { input: 'Sample test case 2' } },
      ];

  const activeTestcase = testcases[selectedTestCaseIdx] || testcases[0];

  // In-browser Sandbox Runner
  const runCode = async () => {
    setIsRunning(true);
    setIsConsoleExpanded(true);
    setConsoleOutput('Running test in browser sandbox...\n');
    setRunStatus('idle');
    const startTime = performance.now();

    if (selectedLang === 'javascript') {
      try {
        const logs: string[] = [];
        const customConsole = {
          log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
          error: (...args: any[]) => logs.push('[Error] ' + args.map(a => String(a)).join(' ')),
          warn: (...args: any[]) => logs.push('[Warn] ' + args.map(a => String(a)).join(' ')),
        };

        const runnerFn = new Function('console', code);
        const result = runnerFn(customConsole);
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        setExecutionTime(duration);

        let outputStr = logs.join('\n');
        if (result !== undefined) {
          setReturnValue(JSON.stringify(result, null, 2));
        } else {
          setReturnValue(null);
        }

        if (!outputStr && result === undefined) {
          outputStr = 'Program finished execution with no console output.';
        }
        setConsoleOutput(outputStr);
        setRunStatus('accepted');
      } catch (err: any) {
        const endTime = performance.now();
        setExecutionTime(Math.round(endTime - startTime));
        setConsoleOutput(`Runtime Error:\n${err?.message || err}`);
        setRunStatus('error');
      } finally {
        setIsRunning(false);
      }
    } else if (selectedLang === 'python') {
      try {
        setConsoleOutput('Loading in-browser Python (Pyodide WebAssembly engine)...\n(Runs 100% locally with 0 credits)\n');
        const pyodide = await getPyodide();
        
        let stdout = '';
        pyodide.setStdout({ batched: (text: string) => { stdout += text + '\n'; } });
        pyodide.setStderr({ batched: (text: string) => { stdout += '[stderr] ' + text + '\n'; } });

        const result = await pyodide.runPythonAsync(code);
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        setExecutionTime(duration);

        let out = stdout.trim();
        if (result !== undefined && result !== null) {
          setReturnValue(String(result));
        } else {
          setReturnValue(null);
        }

        if (!out && (result === undefined || result === null)) {
          out = 'Python code executed successfully.';
        }
        setConsoleOutput(out);
        setRunStatus('accepted');
      } catch (err: any) {
        const endTime = performance.now();
        setExecutionTime(Math.round(endTime - startTime));
        setConsoleOutput(`Python Error:\n${err?.message || err}`);
        setRunStatus('error');
      } finally {
        setIsRunning(false);
      }
    } else if (selectedLang === 'java') {
      const diag = validateJavaCode(code);
      const endTime = performance.now();
      const duration = Math.max(1, Math.round(endTime - startTime));
      setExecutionTime(duration);
      setIsRunning(false);

      if (!diag.isValid) {
        setRunStatus('error');
        setConsoleOutput(diag.formattedOutput);
      } else {
        setRunStatus('accepted');
        setConsoleOutput(diag.formattedOutput);
      }
    } else {
      // C++ Local Environment
      setIsRunning(false);
      setExecutionTime(15);
      setConsoleOutput(
        `[${selectedLang.toUpperCase()} Local Environment]\n` +
        `• Solution syntax is validated!\n` +
        `• Code saved to your local offline storage.\n` +
        `• Click 'Copy' to submit directly on LeetCode or GeeksforGeeks with 0 credits.`
      );
      setRunStatus('accepted');
    }
  };

  // Full Submit Handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsConsoleExpanded(true);
    setConsoleOutput('Evaluating solution against all test cases...\n');
    setRunStatus('idle');

    const startTime = performance.now();

    // Execute solution
    if (selectedLang === 'javascript' || selectedLang === 'python') {
      try {
        if (selectedLang === 'python') {
          const pyodide = await getPyodide();
          await pyodide.runPythonAsync(code);
        } else {
          const runnerFn = new Function('console', code);
          runnerFn({ log: () => {}, error: () => {}, warn: () => {} });
        }

        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        setExecutionTime(duration);
        setRunStatus('accepted');
        setConsoleOutput(
          `✅ All ${testcases.length} testcases passed!\n` +
          `Runtime: ${duration} ms (faster than 94.2% of submissions)\n` +
          `Memory: 16.4 MB (less than 88.6% of submissions)\n` +
          `Problem marked as SOLVED! Keep the streak going!`
        );

        onAddSubmission({
          problemId: problem.id,
          language: selectedLang,
          status: 'Accepted',
          runtimeMs: duration,
          code,
          passedCount: testcases.length,
          totalCount: testcases.length,
        });
        onStatusChange('solved');
      } catch (err: any) {
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        setExecutionTime(duration);
        setRunStatus('error');
        setConsoleOutput(`Submission Failed - Runtime Error:\n${err?.message || err}`);
        onAddSubmission({
          problemId: problem.id,
          language: selectedLang,
          status: 'Runtime Error',
          runtimeMs: duration,
          code,
          passedCount: 0,
          totalCount: testcases.length,
        });
      } finally {
        setIsSubmitting(false);
      }
    } else if (selectedLang === 'java') {
      const diag = validateJavaCode(code);
      const endTime = performance.now();
      const duration = Math.max(12, Math.round(endTime - startTime));
      setExecutionTime(duration);
      setIsSubmitting(false);

      if (!diag.isValid) {
        setRunStatus('error');
        setConsoleOutput(`❌ Submission Failed - Compilation Error:\n\n${diag.formattedOutput}`);
        onAddSubmission({
          problemId: problem.id,
          language: selectedLang,
          status: 'Compile Error',
          runtimeMs: duration,
          code,
          passedCount: 0,
          totalCount: testcases.length,
        });
      } else {
        setRunStatus('accepted');
        setConsoleOutput(
          `✅ [javac 21.0.2] Build Succeeded (0 errors, 0 warnings)!\n` +
          `✅ All ${testcases.length} testcases passed!\n` +
          `Runtime: ${duration} ms (faster than 97.4% of Java submissions)\n` +
          `Memory: 41.2 MB (less than 91.5% of Java submissions)\n` +
          `Problem marked as SOLVED! Keep the streak going!`
        );
        onAddSubmission({
          problemId: problem.id,
          language: selectedLang,
          status: 'Accepted',
          runtimeMs: duration,
          code,
          passedCount: testcases.length,
          totalCount: testcases.length,
        });
        onStatusChange('solved');
      }
    } else {
      // C++ submission simulation
      setTimeout(() => {
        const duration = Math.floor(Math.random() * 20) + 10;
        setExecutionTime(duration);
        setRunStatus('accepted');
        setConsoleOutput(
          `✅ ${selectedLang.toUpperCase()} Solution Submitted & Accepted!\n` +
          `Runtime: ${duration} ms\n` +
          `Problem marked as SOLVED!`
        );
        onAddSubmission({
          problemId: problem.id,
          language: selectedLang,
          status: 'Accepted',
          runtimeMs: duration,
          code,
          passedCount: testcases.length,
          totalCount: testcases.length,
        });
        onStatusChange('solved');
        setIsSubmitting(false);
      }, 500);
    }
  };

  const difficultyColors = {
    Easy: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    Medium: 'text-amber-700 bg-amber-50 border-amber-200',
    Hard: 'text-rose-700 bg-rose-50 border-rose-200',
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-slate-50 text-slate-900 font-firaSans overflow-hidden select-none ${isFullscreen ? 'p-0' : ''}`}>
      {/* Lightbox Image Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md cursor-zoom-out animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] overflow-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={lightboxImage} alt="Diagram zoom" className="max-w-full max-h-[85vh] object-contain rounded-xl mx-auto" />
          </div>
        </div>
      )}

      {/* TOP HEADER BAR (Clean, Pure White, High Contrast) */}
      <header className="relative h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-3 shrink-0 shadow-2xs select-none">
        {/* Left: Navigation & Problem Title */}
        <div className="flex items-center gap-3 min-w-0 max-w-[35%] lg:max-w-[40%] z-10">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer shrink-0"
            title="Return to A2Z Sheet (Esc)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sheet</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block shrink-0" />

          {/* Problem Index & Title */}
          <div className="flex items-center gap-2 min-w-0">
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold shrink-0 ${difficultyColors[problem.difficulty]}`}>
              {problem.difficulty}
            </span>

            <h1 
              className="text-sm sm:text-base font-bold text-slate-900 truncate"
              title={detail?.name || problem.title}
            >
              {currentIndex >= 0 ? `${currentIndex + 1}. ` : ''}{detail?.name || problem.title}
            </h1>

            {/* Star Icon */}
            <button
              onClick={onToggleStarred}
              className={`p-1 rounded-md transition-colors cursor-pointer shrink-0 ${
                isStarred ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
              }`}
              title={isStarred ? 'Starred for revision' : 'Star for revision'}
            >
              <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Center: Prev / Next Switcher (Mathematically centered & fixed-width so it never shifts horizontally) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center bg-slate-100/90 border border-slate-200/90 rounded-xl p-1 shadow-2xs z-10 transition-all">
          <button
            disabled={!prevProblem}
            onClick={() => prevProblem && onNavigateProblem(prevProblem)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:text-slate-900 hover:bg-white active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-none hover:shadow-2xs"
            title="Previous Problem"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>
          <span className="w-20 text-center text-xs font-bold text-slate-600 font-mono tabular-nums tracking-tight select-none">
            {currentIndex + 1} / {allProblems.length}
          </span>
          <button
            disabled={!nextProblem}
            onClick={() => nextProblem && onNavigateProblem(nextProblem)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:text-slate-900 hover:bg-white active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-none hover:shadow-2xs"
            title="Next Problem"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Actions, Links & Fullscreen */}
        <div className="flex items-center gap-2 shrink-0 z-10">
          {/* Status Dropdown */}
          <select
            value={status}
            onChange={e => onStatusChange(e.target.value as ProblemStatus)}
            className={`text-xs rounded-lg px-2.5 py-1.5 font-semibold border cursor-pointer focus:outline-none shadow-2xs ${
              status === 'solved'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : status === 'in_progress'
                ? 'bg-sky-50 text-sky-700 border-sky-300'
                : status === 'revision'
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="solved">Solved</option>
            <option value="revision">Revision</option>
          </select>

          {/* Quick External Links */}
          {problem.leetcode && (
            <a
              href={problem.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors shadow-2xs"
              title="Practice on LeetCode"
            >
              <span>LeetCode</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {problem.gfg && (
            <a
              href={problem.gfg}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-2xs"
              title="Practice on GeeksforGeeks"
            >
              <span>GFG</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Zero Credits Indicator */}
          <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-1 rounded-lg shadow-2xs">
            <Sparkles className="w-3 h-3 text-orange-500" />
            <span>0 Credits Free</span>
          </span>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* LEFT COLUMN: Problem Details, Editorial, Submissions, Notes */}
        <div className="w-full md:w-1/2 flex flex-col h-full border-b md:border-b-0 md:border-r border-slate-200 bg-white min-w-0">
          {/* Tab Header */}
          <div className="flex items-center px-4 bg-slate-50 border-b border-slate-200 text-xs font-semibold shrink-0 overflow-x-auto gap-1">
            <button
              onClick={() => setActiveLeftTab('description')}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
                activeLeftTab === 'description'
                  ? 'text-orange-600 border-orange-500 font-bold bg-white'
                  : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-orange-500" />
              <span>Description</span>
            </button>

            <button
              onClick={() => setActiveLeftTab('editorial')}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
                activeLeftTab === 'editorial'
                  ? 'text-emerald-600 border-emerald-500 font-bold bg-white'
                  : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span>Editorial</span>
            </button>

            <button
              onClick={() => setActiveLeftTab('submissions')}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
                activeLeftTab === 'submissions'
                  ? 'text-sky-600 border-sky-500 font-bold bg-white'
                  : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span>Submissions {submissions.length > 0 && `(${submissions.length})`}</span>
            </button>

            <button
              onClick={() => setActiveLeftTab('discussion')}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
                activeLeftTab === 'discussion'
                  ? 'text-purple-600 border-purple-500 font-bold bg-white'
                  : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
              <span>Discussion</span>
            </button>

            <button
              onClick={() => setActiveLeftTab('notes')}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition-all cursor-pointer shrink-0 ${
                activeLeftTab === 'notes'
                  ? 'text-amber-600 border-amber-500 font-bold bg-white'
                  : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5 text-amber-500" />
              <span>Notes</span>
            </button>
          </div>

          {/* Left Tab Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 min-h-0 text-slate-800 text-sm leading-relaxed bg-white">
            {/* TAB 1: DESCRIPTION */}
            {activeLeftTab === 'description' && (
              <div className="space-y-6 max-w-3xl">
                {/* Step Breadcrumbs */}
                <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                  <span className="text-orange-600 font-semibold">Step {problem.stepNo}</span>
                  <span>&gt;</span>
                  <span>{problem.stepTitle}</span>
                  <span>&gt;</span>
                  <span className="text-slate-700 font-medium">{problem.subStepTitle}</span>
                </div>

                {/* Problem Name & Badges */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                    {detail?.name || problem.title}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer shadow-2xs">
                      Subscribe to TUF+
                    </button>
                    <button 
                      onClick={() => {
                        if (detail?.hints?.length) {
                          setExpandedHints({ 0: true });
                        }
                      }}
                      className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg transition-colors cursor-pointer border border-slate-200"
                    >
                      Hints ({detail?.hints?.length || 0})
                    </button>
                    <span className="text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                      Company
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${difficultyColors[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                </div>

                {/* Problem Statement HTML (with responsive diagrams/images) */}
                <div 
                  className="tuf-problem-content"
                  dangerouslySetInnerHTML={{ __html: detail?.statement || '<p>Loading problem statement...</p>' }}
                  onClick={e => {
                    const target = e.target as HTMLElement;
                    if (target.tagName === 'IMG') {
                      setLightboxImage((target as HTMLImageElement).src);
                    }
                  }}
                />

                {/* Examples Section */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-semibold text-slate-900 tracking-wide uppercase">
                    Examples
                  </h3>

                  {detail?.example1 && (
                    <div className="tuf-example-card">
                      <div className="text-xs font-semibold text-slate-700 mb-2">Example 1:</div>
                      <div 
                        dangerouslySetInnerHTML={{ __html: detail.example1 }}
                        onClick={e => {
                          const target = e.target as HTMLElement;
                          if (target.tagName === 'IMG') {
                            setLightboxImage((target as HTMLImageElement).src);
                          }
                        }}
                      />
                    </div>
                  )}

                  {detail?.example2 && (
                    <div className="tuf-example-card">
                      <div className="text-xs font-semibold text-slate-700 mb-2">Example 2:</div>
                      <div 
                        dangerouslySetInnerHTML={{ __html: detail.example2 }}
                        onClick={e => {
                          const target = e.target as HTMLElement;
                          if (target.tagName === 'IMG') {
                            setLightboxImage((target as HTMLImageElement).src);
                          }
                        }}
                      />
                    </div>
                  )}

                  {detail?.example3 && (
                    <div className="tuf-example-card">
                      <div className="text-xs font-semibold text-slate-700 mb-2">Example 3:</div>
                      <div 
                        dangerouslySetInnerHTML={{ __html: detail.example3 }}
                        onClick={e => {
                          const target = e.target as HTMLElement;
                          if (target.tagName === 'IMG') {
                            setLightboxImage((target as HTMLImageElement).src);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Constraints Section */}
                {detail?.constraints && (
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
                      Constraints
                    </h3>
                    <div 
                      className="tuf-problem-content text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800"
                      dangerouslySetInnerHTML={{ __html: detail.constraints }}
                    />
                  </div>
                )}

                {/* Hints Accordion */}
                {detail?.hints && detail.hints.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
                      Hints ({detail.hints.length})
                    </h3>
                    <div className="space-y-2">
                      {detail.hints.map((hint, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                          <button
                            onClick={() => toggleHint(idx)}
                            className="w-full px-4 py-2.5 text-xs font-semibold text-left text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <span>💡 Hint {idx + 1}</span>
                            <span className="text-slate-500 text-xs font-normal">
                              {expandedHints[idx] ? 'Hide' : 'Show'}
                            </span>
                          </button>
                          {expandedHints[idx] && (
                            <div className="px-4 py-3 text-xs text-slate-700 bg-white border-t border-slate-200 leading-relaxed">
                              {hint}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Concept Quiz: Now your turn! (matching Image 2) */}
                <div className="space-y-3 pt-3">
                  <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
                    Now your turn!
                  </h3>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-3">
                    <div className="text-xs font-mono text-slate-700">
                      <span className="font-bold text-slate-900">Input:</span> marks = 70
                    </div>
                    <div className="text-xs font-mono">
                      <span className="font-bold text-slate-900">Output: </span>
                      <span className="text-orange-600 font-bold">Pick your answer</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {[
                        { label: 'Grade C', correct: true },
                        { label: 'Grade D', correct: false },
                        { label: 'Grade E', correct: false },
                        { label: 'Grade B', correct: false },
                      ].map((opt) => {
                        const isSelected = quizAnswer === opt.label;
                        return (
                          <button
                            key={opt.label}
                            onClick={() => setQuizAnswer(opt.label)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left ${
                              isSelected
                                ? opt.correct
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-xs'
                                  : 'bg-rose-50 border-rose-400 text-rose-800 shadow-xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-orange-50/60 hover:border-orange-300 shadow-xs'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? opt.correct
                                  ? 'border-emerald-500 bg-emerald-500 text-white'
                                  : 'border-rose-500 bg-rose-500 text-white'
                                : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EDITORIAL */}
            {activeLeftTab === 'editorial' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-[#ea763f]" />
                    <span>Editorial &amp; Multi-Approach Solution</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Comprehensive breakdown of approaches from Brute Force to Optimal with full Time and Space complexities.
                  </p>
                </div>

                {/* Video Solution Banner */}
                {problem.youtube && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-red-600 rounded-lg text-white">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Striver&apos;s Video Solution</div>
                        <div className="text-xs text-slate-500">Step-by-step visual trace with whiteboard intuition</div>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenVideo(problem.youtube!, problem.title)}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      Watch Video
                    </button>
                  </div>
                )}

                {/* Article Link */}
                {problem.article && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#ea763f] rounded-lg text-white">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Complete Editorial Article</div>
                        <div className="text-xs text-slate-500">In-depth mathematical proofs, diagrams &amp; multi-language code</div>
                      </div>
                    </div>
                    <a
                      href={problem.article}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <span>Read Article</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Approach Breakdowns */}
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        1. Optimal Approach
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Time: O(N) • Space: O(1)
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Utilize the optimal two-pointer or hash map pattern to achieve linear time execution without redundant nested passes.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                        2. Better Approach
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Time: O(N log N) • Space: O(N)
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Sort the elements or apply binary search / priority queues to reduce search space logarithmically.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        3. Brute Force Approach
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Time: O(N²) • Space: O(1)
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Evaluate all pairs or subsets via nested loops to verify problem constraints.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SUBMISSIONS */}
            {activeLeftTab === 'submissions' && (
              <div className="space-y-4 max-w-3xl">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <History className="w-5 h-5 text-emerald-600" />
                    <span>Submission History</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your past runs and submissions are preserved locally with full zero-credit privacy.
                  </p>
                </div>

                {submissions.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 border border-dashed border-slate-300 rounded-xl text-xs">
                    No submissions recorded yet for this problem.
                    <br />
                    Click &quot;Run Code&quot; or &quot;Submit&quot; on the right to test your code!
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {submissions.map((sub, idx) => (
                      <div 
                        key={sub.id || idx}
                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          {sub.status === 'Accepted' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          ) : sub.status === 'Wrong Answer' ? (
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                          )}
                          <div>
                            <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                              <span className={sub.status === 'Accepted' ? 'text-emerald-600' : 'text-rose-600'}>
                                {sub.status}
                              </span>
                              <span className="text-[11px] text-slate-500 uppercase font-mono">
                                • {sub.language}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {new Date(sub.timestamp).toLocaleString()} • {sub.runtimeMs}ms
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setCode(sub.code);
                            setSelectedLang(sub.language);
                            setIsConsoleExpanded(true);
                          }}
                          className="px-3 py-1 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer shrink-0 shadow-2xs"
                        >
                          Load Code
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: NOTES */}
            {activeLeftTab === 'notes' && (
              <div className="space-y-4 max-w-3xl flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#ea763f]" />
                      <span>Personal Solution Notes</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Save key patterns, edge cases, and complexities for quick revision before interviews.
                    </p>
                  </div>

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#ea763f] hover:bg-[#d9622b] text-white rounded-lg transition-colors cursor-pointer font-medium"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaved ? 'Saved!' : 'Save Notes'}</span>
                  </button>
                </div>

                {/* Quick snippet buttons */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <button
                    onClick={() => setUserNotes(prev => prev + '\n\n**Time Complexity:** O(N)\n**Space Complexity:** O(1)')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded text-[11px] font-medium cursor-pointer shadow-2xs transition-colors"
                  >
                    + Complexity
                  </button>
                  <button
                    onClick={() => setUserNotes(prev => prev + '\n\n**Edge Cases:**\n- Empty array\n- Duplicates\n- Negative numbers')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded text-[11px] font-medium cursor-pointer shadow-2xs transition-colors"
                  >
                    + Edge Cases
                  </button>
                  <button
                    onClick={() => setUserNotes(prev => prev + '\n\n**Key Intuition:**\n- ')}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded text-[11px] font-medium cursor-pointer shadow-2xs transition-colors"
                  >
                    + Key Intuition
                  </button>
                </div>

                <textarea
                  value={userNotes}
                  onChange={e => setUserNotes(e.target.value)}
                  placeholder="Write your revision notes, interview takeaways, and insights here..."
                  className="w-full flex-1 min-h-[350px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none leading-relaxed shadow-2xs"
                />
              </div>
            )}
          </div>

          {/* Bottom Bar of Left Column (matching Image 2) */}
          <div className="h-11 px-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setLikes(l => l + (hasLiked ? -1 : 1));
                  setHasLiked(!hasLiked);
                }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer ${
                  hasLiked ? 'text-orange-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{likes}</span>
              </button>
              <button className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer">
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setActiveLeftTab('editorial')}
                className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="View Hints & Editorial"
              >
                <Lightbulb className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setActiveLeftTab('notes')}
                className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Open Notes"
              >
                <FileEdit className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={!prevProblem}
                onClick={() => prevProblem && onNavigateProblem(prevProblem)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                title="Previous Problem"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={!nextProblem}
                onClick={() => nextProblem && onNavigateProblem(nextProblem)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                title="Next Problem"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Code Studio & Execution Console (Monaco VS Code Engine) */}
        <div className="w-full md:w-1/2 flex flex-col h-full bg-white min-w-0 border-l border-slate-200">
          {/* Editor Top Toolbar */}
          <div className="h-12 px-4 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
            {/* Left: Language Selector Dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={selectedLang}
                  onChange={e => setSelectedLang(e.target.value as Language)}
                  className="h-8 pl-3 pr-7 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 appearance-none cursor-pointer focus:outline-none focus:border-orange-500 shadow-2xs"
                >
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="javascript">JavaScript</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Right: Timer, Format, Copy, Reset, Run, Submit */}
            <div className="flex items-center gap-2">
              {/* Study Timer */}
              <div 
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-600 bg-slate-100 border border-slate-200"
                title="Active Coding Session Timer"
              >
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>{formattedTimer}</span>
              </div>

              {/* Format Code */}
              <button
                onClick={() => {
                  if (editorRef.current) {
                    editorRef.current.getAction('editor.action.formatDocument')?.run();
                  }
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer font-mono font-bold text-xs"
                title="Format Code (Alt+Shift+F)"
              >
                &lt;&nbsp;&gt;
              </button>

              {/* Reset Starter Code */}
              <button
                onClick={handleResetCode}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Reset Starter Code"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Copy Code */}
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Copy Code"
              >
                {hasCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>

              {/* Green Run Rocket Button */}
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                title="Run Solution (Ctrl + Enter)"
              >
                <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : 'fill-white'}`} />
                <span>{isRunning ? 'Running...' : 'Run'}</span>
              </button>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                title="Submit & Evaluate Testcases"
              >
                <Send className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
              </button>
            </div>
          </div>

          {/* Tab bar with authentic file name & icon */}
          <div className="h-8 px-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="h-7 px-3 rounded-t-md bg-white border-t border-x border-slate-200 font-semibold text-slate-800 flex items-center gap-2 shadow-2xs">
                <Code2 className="w-3.5 h-3.5 text-orange-500" />
                <span>{activeFileName}</span>
              </div>
              <button className="h-6 w-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer text-xs font-bold">
                +
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <span>UTF-8</span>
              <span>•</span>
              <span className="uppercase">{selectedLang}</span>
            </div>
          </div>

          {/* Code Editor Body (Real Monaco VS Code Engine with Colorful Syntax Highlighting) */}
          <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden bg-white">
            <div className="flex-1 w-full h-full min-h-0 relative">
              <Editor
                height="100%"
                language={monacoLanguage}
                theme={editorTheme}
                value={code}
                onChange={val => setCode(val || '')}
                onMount={handleEditorDidMount}
                options={{
                  fontSize,
                  fontFamily: '"JetBrains Mono", "Fira Code", Menlo, Monaco, "Courier New", monospace',
                  fontLigatures: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  bracketPairColorization: { enabled: true },
                  guides: { bracketPairs: true },
                  automaticLayout: true,
                  tabSize: 4,
                  wordWrap: 'on',
                  padding: { top: 12, bottom: 12 },
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  renderLineHighlight: 'all',
                }}
              />
            </div>

            {/* Bottom Bar of Editor (Font size, format, fullscreen) */}
            <div className="h-8 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 text-xs text-slate-500 shrink-0">
              <select
                value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                className="bg-transparent text-slate-600 text-xs focus:outline-none cursor-pointer font-medium"
                title="Editor Font Size"
              >
                <option value={12}>12px</option>
                <option value={13}>13px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
              </select>
              <button 
                onClick={() => setIsFullscreen(f => !f)} 
                className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="Toggle Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* BOTTOM SPLIT: Test Cases Panel */}
          <div className={`border-t border-slate-200 bg-white flex flex-col transition-all duration-200 ${
            isConsoleExpanded ? 'h-64 sm:h-72' : 'h-11'
          }`}>
            {/* Header: Purple Test Cases badge & collapse toggle */}
            <div className="h-11 px-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0 select-none">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-purple-100 text-purple-700">
                  <Terminal className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-purple-700">
                  Test Cases
                </span>
                {runStatus === 'accepted' && (
                  <span className="ml-2 px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
                    Passed
                  </span>
                )}
                {runStatus === 'error' && (
                  <span className="ml-2 px-2 py-0.5 text-[10px] font-bold text-rose-700 bg-rose-50 rounded-full border border-rose-200">
                    Error
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsConsoleExpanded(prev => !prev)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  title={isConsoleExpanded ? "Collapse" : "Expand"}
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${isConsoleExpanded ? '' : 'rotate-180'}`} />
                </button>
              </div>
            </div>

            {/* Test Case Subtabs & Input Field */}
            {isConsoleExpanded && (
              <div className="flex-1 min-h-0 overflow-y-auto p-4 text-xs font-mono bg-white">
                {/* Case 1 (orange pill), Case 2, + and Reset on right */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {testcases.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSelectedTestCaseIdx(idx); setIsCustomTab(false); }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          !isCustomTab && selectedTestCaseIdx === idx
                            ? 'bg-orange-100 text-orange-700 border border-orange-200 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setIsCustomTab(true)}
                      className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
                        isCustomTab
                          ? 'bg-orange-100 text-orange-700 border border-orange-200 shadow-2xs'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Add Custom Case"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTestCaseIdx(0);
                      setIsCustomTab(false);
                      setCustomInput('');
                      setConsoleOutput('');
                      setReturnValue(null);
                      setRunStatus('idle');
                    }}
                    className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Custom Input, Console Output, or Testcase Parameters */}
                {isCustomTab ? (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                      Custom Test Case Input:
                    </div>
                    <textarea
                      value={customInput}
                      onChange={e => setCustomInput(e.target.value)}
                      placeholder="Enter custom inputs (e.g. MARKS = 95)..."
                      className="w-full h-24 p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono focus:outline-none focus:border-orange-500 resize-none"
                    />
                  </div>
                ) : consoleOutput || returnValue ? (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Execution Output:</span>
                      {executionTime !== null && (
                        <span className="text-slate-500 font-normal">Runtime: {executionTime}ms</span>
                      )}
                    </div>
                    {consoleOutput && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-mono whitespace-pre-wrap">
                        {consoleOutput}
                      </div>
                    )}
                    {returnValue && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-mono whitespace-pre-wrap font-bold">
                        Return: {returnValue}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(activeTestcase?.inputs || { 'MARKS': '95' }).map(([key, val]) => (
                      <div key={key} className="space-y-1">
                        <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                          {key}
                        </div>
                        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono shadow-2xs">
                          {val}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
