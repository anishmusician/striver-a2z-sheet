import React, { useState } from 'react';
import { 
  X, User, Users, Check, Copy, Plus, Trash2, Flame, 
  ArrowRightLeft, Share2, ShieldCheck 
} from 'lucide-react';
import type { UserProfile, FriendSummary } from '../types/dsa';

interface AuthModalProps {
  currentProfile: UserProfile;
  profiles: UserProfile[];
  friends: FriendSummary[];
  totalSolved: number;
  activeStreak: number;
  isOpen: boolean;
  onClose: () => void;
  onSwitchProfile: (profileId: string) => void;
  onCreateProfile: (name: string, username: string, color?: string) => void;
  onUpdateProfile: (name: string, username: string, color?: string) => void;
  onDeleteProfile: (profileId: string) => void;
  onGetShareCode: () => string;
  onImportFriendCode: (code: string) => { success: boolean; message: string; friend?: FriendSummary };
  onRemoveFriend: (friendId: string) => void;
  onExportProgress?: () => void;
}

const AVATAR_GRADIENTS = [
  'from-orange-500 to-amber-500',
  'from-sky-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-purple-500 to-indigo-600',
  'from-yellow-400 to-orange-500',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  currentProfile,
  profiles,
  friends,
  totalSolved,
  activeStreak,
  isOpen,
  onClose,
  onSwitchProfile,
  onCreateProfile,
  onUpdateProfile,
  onDeleteProfile,
  onGetShareCode,
  onImportFriendCode,
  onRemoveFriend,
  onExportProgress,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'friends'>('profile');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Edit / Create form state
  const [name, setName] = useState<string>(currentProfile.name);
  const [username, setUsername] = useState<string>(currentProfile.username);
  const [selectedColor, setSelectedColor] = useState<string>(currentProfile.avatarColor || AVATAR_GRADIENTS[0]);

  // Friend import state
  const [friendCodeInput, setFriendCodeInput] = useState<string>('');
  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [hasCopiedShareCode, setHasCopiedShareCode] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateProfile(name, username, selectedColor);
    setIsCreating(false);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onUpdateProfile(name, username, selectedColor);
    setIsEditing(false);
  };

  const handleCopyShareCode = () => {
    const code = onGetShareCode();
    navigator.clipboard.writeText(code);
    setHasCopiedShareCode(true);
    setTimeout(() => setHasCopiedShareCode(false), 2500);
  };

  const handleImportFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendCodeInput.trim()) return;
    const res = onImportFriendCode(friendCodeInput);
    setImportStatus({ message: res.message, isError: !res.success });
    if (res.success) {
      setFriendCodeInput('');
    }
    setTimeout(() => setImportStatus(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-600" />
              <span>Learner Account &amp; Friends</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Zero server errors • Isolated profiles for you and your friend
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'text-orange-600 border-orange-600 font-bold'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Profiles ({profiles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('friends')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'friends'
                ? 'text-orange-600 border-orange-600 font-bold'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Learn with Friends {friends.length > 0 && `(${friends.length})`}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-800">
          {/* TAB 1: PROFILES */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Active Profile Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentProfile.avatarColor} flex items-center justify-center text-lg font-bold text-white shadow-xs shrink-0`}>
                    {currentProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900 truncate">{currentProfile.name}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        Active
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      User ID: @{currentProfile.username}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-1.5 font-mono">
                      <span className="text-emerald-700 font-semibold">{totalSolved} / 474 Solved</span>
                      <span>•</span>
                      <span className="text-orange-600 flex items-center gap-1 font-semibold">
                        <Flame className="w-3 h-3 fill-orange-500" />
                        {activeStreak}d Streak
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setName(currentProfile.name);
                    setUsername(currentProfile.username);
                    setSelectedColor(currentProfile.avatarColor);
                    setIsEditing(prev => !prev);
                    setIsCreating(false);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  {isEditing ? 'Cancel' : 'Edit ID'}
                </button>
              </div>

              {/* Edit Form */}
              {isEditing && (
                <form onSubmit={handleUpdateSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-fadeIn">
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Edit Profile &amp; User ID
                  </h4>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Display Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="e.g. Anish Kumar"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 block mb-1">User ID (Username)</label>
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs">
                      <span className="text-slate-400 mr-1">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full bg-transparent text-slate-900 focus:outline-none"
                        placeholder="anish"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 block mb-1.5">Avatar Color</label>
                    <div className="flex items-center gap-2">
                      {AVATAR_GRADIENTS.map((grad, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedColor(grad)}
                          className={`w-7 h-7 rounded-full bg-gradient-to-tr ${grad} transition-transform cursor-pointer ${
                            selectedColor === grad ? 'scale-125 ring-2 ring-orange-500 ring-offset-2 ring-offset-white' : 'opacity-70 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold shadow-xs"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {/* Profiles Switcher List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Switch Learner Account
                  </h3>
                  <button
                    onClick={() => {
                      setIsCreating(prev => !prev);
                      setIsEditing(false);
                      setName('');
                      setUsername('');
                    }}
                    className="flex items-center gap-1 text-xs text-orange-600 hover:underline cursor-pointer font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isCreating ? 'Cancel' : 'Add Friend / New Account'}</span>
                  </button>
                </div>

                {/* Create New Profile Form */}
                {isCreating && (
                  <form onSubmit={handleCreateSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-fadeIn">
                    <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Create Friend / Second Account
                    </h4>
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Friend / Learner Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        placeholder="e.g. Rahul Sharma"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-600 block mb-1">User ID</label>
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs">
                        <span className="text-slate-400 mr-1">@</span>
                        <input
                          type="text"
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                          className="w-full bg-transparent text-slate-900 focus:outline-none"
                          placeholder="rahul_dsa"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-600 block mb-1.5">Avatar Color</label>
                      <div className="flex items-center gap-2">
                        {AVATAR_GRADIENTS.map((grad, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedColor(grad)}
                            className={`w-7 h-7 rounded-full bg-gradient-to-tr ${grad} transition-transform cursor-pointer ${
                              selectedColor === grad ? 'scale-125 ring-2 ring-orange-500 ring-offset-2 ring-offset-white' : 'opacity-70 hover:opacity-100'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold shadow-xs"
                      >
                        Create Account
                      </button>
                    </div>
                  </form>
                )}

                {/* List of profiles */}
                <div className="space-y-2">
                  {profiles.map(p => {
                    const isSelected = p.id === currentProfile.id;
                    return (
                      <div
                        key={p.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                          isSelected
                            ? 'bg-orange-50/50 border-orange-300 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${p.avatarColor} flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs`}>
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-900 truncate">{p.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">@{p.username}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isSelected ? (
                            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-semibold">
                              Logged In
                            </span>
                          ) : (
                            <button
                              onClick={() => onSwitchProfile(p.id)}
                              className="flex items-center gap-1 px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer border border-slate-200"
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                              <span>Switch</span>
                            </button>
                          )}

                          {profiles.length > 1 && (
                            <button
                              onClick={() => onDeleteProfile(p.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                              title="Delete Profile"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Permanent Storage & Backup */}
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-emerald-900 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Permanent Storage Active (IndexedDB + Eviction Protection)</span>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                  All solved problems, code solutions, revision notes, and streaks for both Anish and Tanisha are permanently preserved.
                </p>
                {onExportProgress && (
                  <button
                    type="button"
                    onClick={onExportProgress}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <span>💾 Download Progress Backup (JSON)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LEARN WITH FRIENDS */}
          {activeTab === 'friends' && (
            <div className="space-y-6">
              {/* Share My Code Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-orange-600" />
                    <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Share Progress with Friend
                    </h3>
                  </div>
                  <button
                    onClick={handleCopyShareCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    {hasCopiedShareCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{hasCopiedShareCode ? 'Copied Code!' : 'Copy Friend Sync Code'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Send this code to your friend via WhatsApp, Discord, or Telegram. When they paste it below, they can track your solved count and streak live without needing any account or database!
                </p>
              </div>

              {/* Import Friend Code Form */}
              <form onSubmit={handleImportFriend} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Add / Sync Friend&apos;s Code
                </h3>
                <p className="text-xs text-slate-600">
                  Paste the sync code provided by your friend to compare progress and keep each other accountable.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={friendCodeInput}
                    onChange={e => setFriendCodeInput(e.target.value)}
                    placeholder="Paste friend sync code here..."
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono shadow-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
                  >
                    Connect
                  </button>
                </div>

                {importStatus && (
                  <div className={`p-2.5 rounded-lg text-xs ${
                    importStatus.isError ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {importStatus.message}
                  </div>
                )}
              </form>

              {/* Friends Leaderboard / Side-by-Side List */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Connected Friends ({friends.length})
                </h3>

                {friends.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 border border-dashed border-slate-300 rounded-xl text-xs bg-slate-50/50">
                    No friends connected yet. Share your code with your study buddy to compete and learn together!
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {friends.map(f => (
                      <div
                        key={f.profile.id}
                        className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${f.profile.avatarColor} flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-xs`}>
                            {f.profile.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-900 truncate">{f.profile.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">@{f.profile.username}</div>
                            <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 font-mono">
                              <span className="text-emerald-700 font-bold">{f.totalSolved} / {f.totalProblems} Solved</span>
                              <span>•</span>
                              <span className="text-orange-600 flex items-center gap-1 font-semibold">
                                <Flame className="w-3 h-3 fill-orange-500" />
                                {f.activeStreak}d
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveFriend(f.profile.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Remove Friend"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
