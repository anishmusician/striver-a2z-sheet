export interface AuthUser {
  id: string;
  username: string;
  name: string;
  avatarColor: string;
  createdAt: number;
}

interface StoredUserRecord extends AuthUser {
  passwordHash: string;
  salt: string;
}

const USERS_STORAGE_KEY = 'strivers_a2z_auth_users_v1';
const SESSION_STORAGE_KEY = 'strivers_a2z_auth_session_v1';

// Private invite passcodes that grant registration access
export const VALID_INVITE_CODES = [
  'STRIKER-DSA-2026',
  'ANISH-DSA',
  'TUF-2026',
  'DSA-FRIENDS'
];

async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(password + ':' + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

import { idbSet, idbGet } from './storageService';

function getStoredUsers(): Record<string, StoredUserRecord> {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load stored users', e);
  }
  return {};
}

function saveStoredUsers(users: Record<string, StoredUserRecord>): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    // Asynchronous dual-write to IndexedDB for permanent protection
    idbSet(USERS_STORAGE_KEY, users).catch(() => {});
  } catch (e) {
    console.error('Failed to save stored users', e);
  }
}

export const authService = {
  // Initialize default dedicated accounts for Anish and Tanisha
  async initDefaultAccounts(): Promise<void> {
    let users = getStoredUsers();

    // If localStorage was cleared, attempt recovery from IndexedDB
    if (Object.keys(users).length === 0) {
      const idbUsers = await idbGet<Record<string, StoredUserRecord>>(USERS_STORAGE_KEY);
      if (idbUsers && Object.keys(idbUsers).length > 0) {
        users = idbUsers;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }
    }

    let modified = false;

    // Account 1: Anish
    if (!users['anish']) {
      const salt = generateSalt();
      const hash = await hashPassword('anish123', salt);
      users['anish'] = {
        id: 'usr_anish',
        username: 'anish',
        name: 'Anish',
        avatarColor: 'from-orange-500 to-amber-500',
        passwordHash: hash,
        salt,
        createdAt: 1700000000000,
      };
      modified = true;
    }

    // Account 2: Tanisha
    if (!users['tanisha']) {
      const salt = generateSalt();
      const hash = await hashPassword('tanisha123', salt);
      users['tanisha'] = {
        id: 'usr_tanisha',
        username: 'tanisha',
        name: 'Tanisha',
        avatarColor: 'from-purple-500 to-pink-500',
        passwordHash: hash,
        salt,
        createdAt: 1700000000000,
      };
      modified = true;
    }

    if (modified) {
      saveStoredUsers(users);
    }
  },

  // Check if active user session exists
  getCurrentUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const user = JSON.parse(raw);
        if (user && user.username) {
          return user;
        }
      }
    } catch {
      // ignore
    }
    return null;
  },

  isAuthenticated(): boolean {
    return authService.getCurrentUser() !== null;
  },

  // Sign In with username and password
  async login(usernameInput: string, passwordInput: string): Promise<{ success: boolean; message: string; user?: AuthUser }> {
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    if (!cleanUsername || !cleanPassword) {
      return { success: false, message: 'Please enter both username and password.' };
    }

    await authService.initDefaultAccounts();
    const users = getStoredUsers();
    const userRecord = users[cleanUsername];

    if (!userRecord) {
      return { success: false, message: `Account "@${cleanUsername}" does not exist. Please register with an invite code.` };
    }

    const calculatedHash = await hashPassword(cleanPassword, userRecord.salt);
    if (calculatedHash !== userRecord.passwordHash) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    const sessionUser: AuthUser = {
      id: userRecord.id,
      username: userRecord.username,
      name: userRecord.name,
      avatarColor: userRecord.avatarColor,
      createdAt: userRecord.createdAt,
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
    return { success: true, message: `Welcome back, ${sessionUser.name}!`, user: sessionUser };
  },

  // Register dedicated learner with invite code
  async register(
    usernameInput: string,
    passwordInput: string,
    nameInput: string,
    inviteCodeInput: string,
    avatarColor?: string
  ): Promise<{ success: boolean; message: string; user?: AuthUser }> {
    const cleanUsername = usernameInput.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    const cleanPassword = passwordInput.trim();
    const cleanName = nameInput.trim();
    const cleanInvite = inviteCodeInput.trim().toUpperCase();

    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, message: 'Username must be at least 3 alphanumeric characters.' };
    }

    if (!cleanPassword || cleanPassword.length < 5) {
      return { success: false, message: 'Password must be at least 5 characters.' };
    }

    if (!cleanName) {
      return { success: false, message: 'Please enter your name.' };
    }

    // Verify private invite code
    if (!VALID_INVITE_CODES.includes(cleanInvite)) {
      return { 
        success: false, 
        message: 'Invalid Invite Passcode. Access is restricted to dedicated learners. Ask Anish for the invite key.' 
      };
    }

    const users = getStoredUsers();
    if (users[cleanUsername]) {
      return { success: false, message: `Username "@${cleanUsername}" is already taken. Please choose another.` };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(cleanPassword, salt);

    const newUser: StoredUserRecord = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      username: cleanUsername,
      name: cleanName,
      avatarColor: avatarColor || 'from-sky-500 to-indigo-500',
      passwordHash,
      salt,
      createdAt: Date.now(),
    };

    users[cleanUsername] = newUser;
    saveStoredUsers(users);

    const sessionUser: AuthUser = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      avatarColor: newUser.avatarColor,
      createdAt: newUser.createdAt,
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
    return { success: true, message: `Account created successfully! Welcome, ${sessionUser.name}!`, user: sessionUser };
  },

  // Log out active user
  logout(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  },

  // Update profile details
  updateProfile(nameInput: string, avatarColor?: string): AuthUser | null {
    const current = authService.getCurrentUser();
    if (!current) return null;

    const users = getStoredUsers();
    const userRecord = users[current.username];
    if (userRecord) {
      userRecord.name = nameInput.trim() || userRecord.name;
      if (avatarColor) userRecord.avatarColor = avatarColor;
      saveStoredUsers(users);

      const updatedUser: AuthUser = {
        ...current,
        name: userRecord.name,
        avatarColor: userRecord.avatarColor,
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    }
    return null;
  }
};
