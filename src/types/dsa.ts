export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ProblemStatus = 'todo' | 'in_progress' | 'solved' | 'revision';

export type Language = 'python' | 'cpp' | 'java' | 'javascript';

export interface Problem {
  id: string;
  title: string;
  stepNo: number;
  stepTitle: string;
  subStepNo: number;
  subStepTitle: string;
  difficulty: Difficulty;
  leetcode: string | null;
  gfg: string | null;
  code360: string | null;
  article: string | null;
  youtube: string | null;
  plus: string | null;
  editorial: string | null;
  starters: Record<Language, string>;
}

export interface ProblemTestcase {
  inputs: Record<string, string>;
}

export interface ProblemDetail {
  slug: string;
  name: string;
  statement: string;
  example1?: string;
  example2?: string;
  example3?: string;
  constraints?: string;
  hints?: string[];
  testcases?: ProblemTestcase[];
  starters?: Partial<Record<Language, string>>;
}

export interface SubmissionRecord {
  id: string;
  problemId: string;
  timestamp: number;
  language: Language;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Compile Error';
  runtimeMs: number;
  code: string;
  passedCount?: number;
  totalCount?: number;
}

export interface SubCategory {
  id: string;
  title: string;
  subStepNo: number;
  problems: Problem[];
}

export interface Step {
  id: string;
  stepNo: number;
  title: string;
  subcategories: SubCategory[];
  totalProblems: number;
}

export interface SheetData {
  title: string;
  description: string;
  totalSteps: number;
  totalProblems: number;
  steps: Step[];
}

export interface ProblemUserData {
  status: ProblemStatus;
  starred: boolean;
  notes: string;
  code: Partial<Record<Language, string>>;
  submissions?: SubmissionRecord[];
  updatedAt: number;
}

export interface UserProgressState {
  problems: Record<string, ProblemUserData>;
  activeStreak: number;
  lastActiveDate: string;
  activityDates: string[];
  version: number;
}

export interface StatsSummary {
  total: number;
  solved: number;
  inProgress: number;
  revision: number;
  starred: number;
  percentage: number;
  easy: { solved: number; total: number };
  medium: { solved: number; total: number };
  hard: { solved: number; total: number };
  streak: number;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatarColor: string;
  createdAt: number;
}

export interface FriendSummary {
  profile: UserProfile;
  totalSolved: number;
  totalProblems: number;
  activeStreak: number;
  solvedProblemIds: string[];
  updatedAt: number;
}

export interface MultiUserStorage {
  activeProfileId: string;
  profiles: Record<string, UserProfile>;
  progress: Record<string, UserProgressState>;
  friends: Record<string, FriendSummary>;
  version: number;
}

