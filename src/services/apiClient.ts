import type { UserProgressState, UserProfile } from '../types/dsa';
import type { AuthUser } from './authService';

export interface ServerAuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  progress?: UserProgressState;
}

export interface ServerProgressResponse {
  success: boolean;
  message?: string;
  username?: string;
  user?: UserProfile | null;
  progress?: UserProgressState;
}

export const apiClient = {
  // Check if server API is reachable
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch('/api/health', { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Log in to dedicated account and receive server-stored progress
  async login(username: string, password: string): Promise<ServerAuthResponse> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Failed to connect to authentication server.',
      };
    }
  },

  // Register a new dedicated learner on the server
  async register(
    username: string,
    password: string,
    name: string,
    inviteCode: string,
    avatarColor?: string
  ): Promise<ServerAuthResponse> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name, inviteCode, avatarColor }),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Failed to connect to registration server.',
      };
    }
  },

  // Fetch full progress for a user from server disk
  async getUserProgress(username: string): Promise<ServerProgressResponse> {
    try {
      const clean = username.trim().toLowerCase();
      const res = await fetch(`/api/progress/${clean}`, { method: 'GET' });
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Failed to fetch progress from server.',
      };
    }
  },

  // Save/sync full progress for a user directly to server disk
  async saveUserProgress(username: string, progress: UserProgressState): Promise<ServerProgressResponse> {
    try {
      const clean = username.trim().toLowerCase();
      const res = await fetch(`/api/progress/${clean}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress }),
      });
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Failed to save progress to server.',
      };
    }
  },

  // Reset user progress on server
  async resetUserProgress(username: string): Promise<boolean> {
    try {
      const clean = username.trim().toLowerCase();
      const res = await fetch(`/api/progress/${clean}/reset`, { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Sync multi-user storage batch
  async syncAll(progressMap: Record<string, UserProgressState>): Promise<boolean> {
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: progressMap }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
