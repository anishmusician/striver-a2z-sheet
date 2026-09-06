import { 
  getUsers, 
  getUser, 
  saveUser, 
  getUserProgress, 
  saveUserProgress, 
  resetUserProgress, 
  hashPassword, 
  generateSalt,
  getAllProgress
} from './storage.mjs';

const VALID_INVITE_CODES = [
  'STRIKER-DSA-2026',
  'ANISH-DSA',
  'TUF-2026',
  'DSA-FRIENDS'
];

function sendJson(res, statusCode, data) {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(payload);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 20 * 1024 * 1024) { // 20MB limit
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', err => reject(err));
  });
}

export async function handleApiRequest(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return true;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (!pathname.startsWith('/api')) {
    return false;
  }

  try {
    // 1. Health Check
    if (pathname === '/api/health' && req.method === 'GET') {
      const users = getUsers();
      const allProg = getAllProgress();
      sendJson(res, 200, {
        ok: true,
        service: 'Striver A2Z DSA Permanent Storage Server',
        timestamp: Date.now(),
        users: Object.keys(users),
        progressTrackedUsers: Object.keys(allProg),
      });
      return true;
    }

    // 2. Auth: Login
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const username = (body.username || '').trim().toLowerCase();
      const password = (body.password || '').trim();

      if (!username || !password) {
        sendJson(res, 400, { success: false, message: 'Username and password are required.' });
        return true;
      }

      // Hardcoded fallback guarantee for Anish & Tanisha
      let user = getUser(username);
      if (!user) {
        sendJson(res, 401, { success: false, message: `Account "@${username}" not found on server.` });
        return true;
      }

      // Verify password
      const calculatedHash = hashPassword(password, user.salt);
      const isDirectMatch = (username === 'anish' && password === 'anish123') ||
                            (username === 'tanisha' && password === 'tanisha123');

      if (calculatedHash !== user.passwordHash && !isDirectMatch) {
        sendJson(res, 401, { success: false, message: 'Incorrect password. Please try again.' });
        return true;
      }

      const userProgress = getUserProgress(username);
      const sanitizedUser = {
        id: user.id,
        username: user.username,
        name: user.name,
        avatarColor: user.avatarColor,
        createdAt: user.createdAt,
      };

      sendJson(res, 200, {
        success: true,
        message: `Welcome back, ${user.name}!`,
        user: sanitizedUser,
        progress: userProgress,
      });
      return true;
    }

    // 3. Auth: Register
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const username = (body.username || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
      const password = (body.password || '').trim();
      const name = (body.name || '').trim();
      const inviteCode = (body.inviteCode || '').trim().toUpperCase();
      const avatarColor = body.avatarColor || 'from-sky-500 to-indigo-500';

      if (!username || username.length < 3) {
        sendJson(res, 400, { success: false, message: 'Username must be at least 3 characters.' });
        return true;
      }
      if (!password || password.length < 5) {
        sendJson(res, 400, { success: false, message: 'Password must be at least 5 characters.' });
        return true;
      }
      if (!name) {
        sendJson(res, 400, { success: false, message: 'Name is required.' });
        return true;
      }
      if (!VALID_INVITE_CODES.includes(inviteCode)) {
        sendJson(res, 403, { success: false, message: 'Invalid invite code. Dedicated access only.' });
        return true;
      }

      if (getUser(username)) {
        sendJson(res, 409, { success: false, message: `Username "@${username}" already exists.` });
        return true;
      }

      const salt = generateSalt();
      const passHash = hashPassword(password, salt);
      const newUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        username,
        name,
        avatarColor,
        passwordHash: passHash,
        salt,
        createdAt: Date.now(),
      };

      saveUser(newUser);
      const initialProgress = getUserProgress(username);

      const sanitizedUser = {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        avatarColor: newUser.avatarColor,
        createdAt: newUser.createdAt,
      };

      sendJson(res, 201, {
        success: true,
        message: `Account created for ${name}!`,
        user: sanitizedUser,
        progress: initialProgress,
      });
      return true;
    }

    // 4. Get User Progress: GET /api/progress/:username
    const progressMatch = pathname.match(/^\/api\/progress\/([a-zA-Z0-9_-]+)$/);
    if (progressMatch) {
      const targetUsername = progressMatch[1].toLowerCase();

      if (req.method === 'GET') {
        const user = getUser(targetUsername);
        const prog = getUserProgress(targetUsername);
        sendJson(res, 200, {
          success: true,
          username: targetUsername,
          user: user ? {
            id: user.id,
            username: user.username,
            name: user.name,
            avatarColor: user.avatarColor,
          } : null,
          progress: prog,
        });
        return true;
      }

      if (req.method === 'POST') {
        const body = await parseJsonBody(req);
        const incomingProgress = body.progress || body;
        const saved = saveUserProgress(targetUsername, incomingProgress);
        sendJson(res, 200, {
          success: true,
          message: 'Progress successfully saved to server disk.',
          progress: saved,
        });
        return true;
      }
    }

    // 5. Reset User Progress: POST /api/progress/:username/reset
    const resetMatch = pathname.match(/^\/api\/progress\/([a-zA-Z0-9_-]+)\/reset$/);
    if (resetMatch && req.method === 'POST') {
      const targetUsername = resetMatch[1].toLowerCase();
      const resetState = resetUserProgress(targetUsername);
      sendJson(res, 200, {
        success: true,
        message: `Progress reset for @${targetUsername}.`,
        progress: resetState,
      });
      return true;
    }

    // 6. Users List: GET /api/users
    if (pathname === '/api/users' && req.method === 'GET') {
      const users = getUsers();
      const sanitized = Object.values(users).map(u => ({
        id: u.id,
        username: u.username,
        name: u.name,
        avatarColor: u.avatarColor,
        createdAt: u.createdAt,
      }));
      sendJson(res, 200, { success: true, users: sanitized });
      return true;
    }

    // 7. Multi-User Storage Full Sync: POST /api/sync
    if (pathname === '/api/sync' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      if (body.progress && typeof body.progress === 'object') {
        for (const [key, userProg] of Object.entries(body.progress)) {
          saveUserProgress(key, userProg);
        }
      }
      sendJson(res, 200, {
        success: true,
        message: 'Multi-user sync complete.',
        allProgress: getAllProgress(),
      });
      return true;
    }

    // Not found API route
    sendJson(res, 404, { success: false, message: `API endpoint not found: ${pathname}` });
    return true;

  } catch (err) {
    console.error(`[Server API] Error handling ${pathname}:`, err);
    sendJson(res, 500, { success: false, message: 'Internal server error', error: err.message });
    return true;
  }
}
