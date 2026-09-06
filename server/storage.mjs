import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const DATA_DIR = path.resolve(process.cwd(), 'server/data');
const BACKUPS_DIR = path.resolve(DATA_DIR, 'backups');
const USERS_FILE = path.resolve(DATA_DIR, 'users.json');
const PROGRESS_FILE = path.resolve(DATA_DIR, 'progress.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

// Atomic file write to avoid corruption
function atomicWriteJson(filePath, data) {
  const tempPath = `${filePath}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tempPath, filePath);
}

function readJsonFile(filePath, defaultValue) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error(`[Server Storage] Error reading ${filePath}:`, err);
  }
  return defaultValue;
}

export function hashPassword(password, salt) {
  return crypto.createHash('sha256').update(`${password}:${salt}`).digest('hex');
}

export function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

export function createEmptyProgress() {
  return {
    problems: {},
    activeStreak: 0,
    lastActiveDate: '',
    activityDates: [],
    version: 1,
    lastUpdated: Date.now(),
  };
}

// In-memory cache synced with disk
let usersCache = null;
let progressCache = null;

export function initStorage() {
  usersCache = readJsonFile(USERS_FILE, {});
  progressCache = readJsonFile(PROGRESS_FILE, {});

  let usersModified = false;
  let progressModified = false;

  // Ensure Anish default account
  if (!usersCache['anish']) {
    const salt = generateSalt();
    const hash = hashPassword('anish123', salt);
    usersCache['anish'] = {
      id: 'usr_anish',
      username: 'anish',
      name: 'Anish',
      avatarColor: 'from-orange-500 to-amber-500',
      passwordHash: hash,
      salt,
      createdAt: 1700000000000,
    };
    usersModified = true;
  }

  // Ensure Tanisha default account
  if (!usersCache['tanisha']) {
    const salt = generateSalt();
    const hash = hashPassword('tanisha123', salt);
    usersCache['tanisha'] = {
      id: 'usr_tanisha',
      username: 'tanisha',
      name: 'Tanisha',
      avatarColor: 'from-purple-500 to-pink-500',
      passwordHash: hash,
      salt,
      createdAt: 1700000000000,
    };
    usersModified = true;
  }

  // Ensure default progress records exist
  if (!progressCache['anish']) {
    progressCache['anish'] = createEmptyProgress();
    progressModified = true;
  }
  if (!progressCache['tanisha']) {
    progressCache['tanisha'] = createEmptyProgress();
    progressModified = true;
  }

  if (usersModified) {
    atomicWriteJson(USERS_FILE, usersCache);
  }
  if (progressModified) {
    atomicWriteJson(PROGRESS_FILE, progressCache);
  }

  console.log(`[Server Storage] Ready. Users: ${Object.keys(usersCache).length}, Storage dir: ${DATA_DIR}`);
}

// Initialize on module load
initStorage();

export function getUsers() {
  if (!usersCache) initStorage();
  return usersCache;
}

export function getUser(username) {
  if (!usersCache) initStorage();
  return usersCache[username.toLowerCase()] || null;
}

export function saveUser(userRecord) {
  if (!usersCache) initStorage();
  usersCache[userRecord.username.toLowerCase()] = userRecord;
  atomicWriteJson(USERS_FILE, usersCache);
  return userRecord;
}

export function getAllProgress() {
  if (!progressCache) initStorage();
  return progressCache;
}

export function getUserProgress(username) {
  if (!progressCache) initStorage();
  const key = username.toLowerCase();
  if (!progressCache[key]) {
    progressCache[key] = createEmptyProgress();
    atomicWriteJson(PROGRESS_FILE, progressCache);
  }
  return progressCache[key];
}

export function saveUserProgress(username, data) {
  if (!progressCache) initStorage();
  const key = username.toLowerCase();
  const existing = progressCache[key] || createEmptyProgress();

  const merged = {
    ...existing,
    ...data,
    problems: {
      ...(existing.problems || {}),
      ...(data.problems || {}),
    },
    activityDates: Array.from(new Set([
      ...(existing.activityDates || []),
      ...(data.activityDates || []),
    ])),
    activeStreak: typeof data.activeStreak === 'number' ? data.activeStreak : existing.activeStreak,
    lastActiveDate: data.lastActiveDate || existing.lastActiveDate,
    lastUpdated: Date.now(),
  };

  progressCache[key] = merged;
  atomicWriteJson(PROGRESS_FILE, progressCache);
  return merged;
}

export function resetUserProgress(username) {
  if (!progressCache) initStorage();
  const key = username.toLowerCase();
  progressCache[key] = createEmptyProgress();
  atomicWriteJson(PROGRESS_FILE, progressCache);
  return progressCache[key];
}
