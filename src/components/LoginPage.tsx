import React, { useState, useEffect } from 'react';
import { 
  Lock, User, KeyRound, Eye, EyeOff, ArrowRight, 
  ShieldCheck, Sparkles, AlertCircle 
} from 'lucide-react';
import { authService, type AuthUser } from '../services/authService';
import { ThemeToggle } from './ThemeToggle';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

const AVATAR_GRADIENTS = [
  'from-orange-500 to-amber-500',
  'from-sky-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-purple-500 to-indigo-600',
  'from-yellow-400 to-orange-500',
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');

  // Sign In Form
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);

  // Register Form
  const [regName, setRegName] = useState<string>('');
  const [regUsername, setRegUsername] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regInviteCode, setRegInviteCode] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(AVATAR_GRADIENTS[0]);
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);

  // Feedback & Loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    authService.initDefaultAccounts().catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await authService.login(loginUsername, loginPassword);
      if (res.success && res.user) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          onLoginSuccess(res.user!);
        }, 300);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (u: string, p: string) => {
    setLoginUsername(u);
    setLoginPassword(p);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await authService.login(u, p);
      if (res.success && res.user) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          onLoginSuccess(res.user!);
        }, 300);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.register(
        regUsername,
        regPassword,
        regName,
        regInviteCode,
        selectedColor
      );

      if (res.success && res.user) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          onLoginSuccess(res.user!);
        }, 500);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] flex flex-col items-center justify-center p-4 relative overflow-hidden font-firaSans text-zinc-100 selection:bg-[#ea763f]/30">
      {/* Top Right Theme Toggle */}
      <div className="absolute top-4 right-4 z-30">
        <ThemeToggle variant="switch" />
      </div>

      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-orange-600/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#141416] border border-white/10 shadow-2xl mb-3.5">
            <svg width="34" height="34" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M5.41326 0.469971C4.60826 0.469971 3.83447 0.578399 3.12147 0.695042C2.36576 0.821542 1.76119 1.3144 1.35376 1.91404C0.925012 2.57142 0.67424 3.32883 0.625971 4.11219C0.552042 5.14554 0.486328 6.22326 0.486328 7.33054C0.486328 8.43783 0.552042 9.51554 0.625971 10.5473C0.686757 11.3687 0.943042 12.1408 1.35376 12.7454C1.76119 13.3467 2.36411 13.8395 3.12147 13.9644C3.83447 14.081 4.6099 14.1895 5.41326 14.1895C6.21826 14.1895 6.99369 14.081 7.70669 13.9644C8.4624 13.8395 9.06697 13.3467 9.4744 12.7454C9.90325 12.0882 10.1535 11.3306 10.2005 10.5473C10.2761 9.5139 10.3418 8.43618 10.3418 7.33054C10.3418 6.2249 10.2761 5.14554 10.2005 4.11219C10.1535 3.32884 9.90325 2.57126 9.4744 1.91404C9.06697 1.31276 8.46404 0.819899 7.70504 0.695042C6.94851 0.557783 6.18204 0.48251 5.41326 0.469971ZM17.5786 22.5303C18.3836 22.5303 19.1623 22.4218 19.8753 22.3052C20.6327 22.182 21.2373 21.6891 21.6463 21.0895C22.057 20.4816 22.315 19.7128 22.3741 18.8897C22.4497 17.858 22.5154 16.7803 22.5154 15.6746C22.5154 14.569 22.4497 13.4913 22.3741 12.4595C22.3273 11.6759 22.0764 10.9181 21.6463 10.2614C21.2356 9.66011 20.6327 9.16726 19.8753 9.04404C19.1168 8.9093 18.3489 8.83404 17.5786 8.81897C16.7736 8.81897 15.9949 8.9274 15.2819 9.04404C14.5245 9.16726 13.92 9.66011 13.5109 10.2598C13.0812 10.9173 12.8304 11.6755 12.7831 12.4595C12.6971 13.5292 12.65 14.6016 12.6418 15.6746C12.6418 16.7803 12.7075 17.858 12.7831 18.8897C12.8423 19.7111 13.0985 20.4833 13.5109 21.0878C13.9216 21.6891 14.5245 22.182 15.2819 22.3052C16.0404 22.4399 16.8083 22.5152 17.5786 22.5303Z" 
                fill="#EA763F" 
              />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Striver&apos;s A2Z Sheet
          </h1>
          <div className="flex items-center justify-center gap-1.5 mt-1.5">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-medium flex items-center gap-1">
              <Lock className="w-3 h-3" /> Dedicated Learner Gate
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 100% Free
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto">
            Protected workspace for dedicated learners. Sign in with your username and password.
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-[#121214] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-7 backdrop-blur-xl">
          {/* Tab Switcher */}
          <div className="flex p-1 bg-[#1a1a1d] border border-white/5 rounded-xl mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setActiveTab('signin'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-[#ea763f] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-[#ea763f] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Register (Invite Code)
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {activeTab === 'signin' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Username
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={e => setLoginUsername(e.target.value)}
                    placeholder="Enter your username (e.g. anish)"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#18181b] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ea763f] font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 pointer-events-none" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#18181b] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ea763f] font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(p => !p)}
                    className="absolute right-3 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#ea763f] hover:bg-[#d9622b] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Dedicated Learner 1-Click Access for Anish and Tanisha */}
              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="text-[11px] text-zinc-400 text-center font-medium">
                  Dedicated Learner 1-Click Sign In:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('anish', 'anish123')}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 rounded-xl text-xs font-medium transition-all cursor-pointer shadow-sm hover:scale-[1.02] disabled:opacity-50"
                  >
                    <User className="w-3.5 h-3.5 text-orange-400" />
                    <span>Anish (1-Click)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('tanisha', 'tanisha123')}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-medium transition-all cursor-pointer shadow-sm hover:scale-[1.02] disabled:opacity-50"
                  >
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span>Tanisha (1-Click)</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* TAB 2: REGISTER (INVITE CODE) */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 bg-[#18181b] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ea763f]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Desired Username
                </label>
                <div className="flex items-center bg-[#18181b] border border-white/10 rounded-xl px-3 py-2 text-xs">
                  <span className="text-zinc-500 mr-1 font-mono">@</span>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={e => setRegUsername(e.target.value)}
                    placeholder="rahul_dsa"
                    className="w-full bg-transparent text-white focus:outline-none font-mono text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-zinc-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(p => !p)}
                      className="text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    >
                      {showRegPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-[#18181b] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ea763f] font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Confirm Password
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-[#18181b] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ea763f] font-mono"
                    required
                  />
                </div>
              </div>

              {/* Private Invite Passcode */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-orange-400 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Private Invite Passcode</span>
                  </label>
                  <span className="text-[10px] text-zinc-500">Required</span>
                </div>
                <input
                  type="text"
                  value={regInviteCode}
                  onChange={e => setRegInviteCode(e.target.value)}
                  placeholder="e.g. STRIKER-DSA-2026"
                  className="w-full px-3 py-2 bg-[#18181b] border border-orange-500/30 rounded-xl text-xs text-orange-300 focus:outline-none focus:ring-1 focus:ring-[#ea763f] font-mono uppercase"
                  required
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  Ask Anish for the invite passcode (e.g. <code className="text-orange-400">STRIKER-DSA-2026</code>). Random people cannot register without this key.
                </p>
              </div>

              {/* Avatar Color */}
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Avatar Color</label>
                <div className="flex items-center gap-2">
                  {AVATAR_GRADIENTS.map((grad, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedColor(grad)}
                      className={`w-6 h-6 rounded-full bg-gradient-to-tr ${grad} transition-transform cursor-pointer ${
                        selectedColor === grad ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-[#121214]' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#ea763f] hover:bg-[#d9622b] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Creating Account...' : 'Register Dedicated Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Security Notice Footer */}
        <div className="mt-5 p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-xs text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Protected with cryptographic SHA-256 password salting. All data is completely private to you and your study partner.</span>
        </div>
      </div>
    </div>
  );
};
