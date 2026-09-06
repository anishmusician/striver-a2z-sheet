import React from 'react';
import { House, FileText, Code2, Download, Upload, RotateCcw, Flame, LogOut } from 'lucide-react';
import type { UserProfile } from '../types/dsa';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  streak: number;
  currentProfile?: UserProfile;
  onExport: () => void;
  onImportClick: () => void;
  onReset: () => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  streak,
  currentProfile,
  onExport,
  onImportClick,
  onReset,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <aside className="hidden lg:flex flex-col justify-between w-[74px] h-screen sticky top-0 bg-[#0e0e0f] border-r border-[var(--border)] py-3 px-2 z-30 shrink-0 select-none">
      {/* Top section: Logo & Nav items */}
      <div className="flex flex-col items-center w-full">
        {/* takeUforward Official Logo */}
        <div className="mb-3 p-1">
          <a href="#" className="flex items-center justify-center">
            <svg width="34" height="34" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M5.41326 0.469971C4.60826 0.469971 3.83447 0.578399 3.12147 0.695042C2.36576 0.821542 1.76119 1.3144 1.35376 1.91404C0.925012 2.57142 0.67424 3.32883 0.625971 4.11219C0.552042 5.14554 0.486328 6.22326 0.486328 7.33054C0.486328 8.43783 0.552042 9.51554 0.625971 10.5473C0.686757 11.3687 0.943042 12.1408 1.35376 12.7454C1.76119 13.3467 2.36411 13.8395 3.12147 13.9644C3.83447 14.081 4.6099 14.1895 5.41326 14.1895C6.21826 14.1895 6.99369 14.081 7.70669 13.9644C8.4624 13.8395 9.06697 13.3467 9.4744 12.7454C9.90325 12.0882 10.1535 11.3306 10.2005 10.5473C10.2761 9.5139 10.3418 8.43618 10.3418 7.33054C10.3418 6.2249 10.2761 5.14554 10.2005 4.11219C10.1535 3.32884 9.90325 2.57126 9.4744 1.91404C9.06697 1.31276 8.46404 0.819899 7.70504 0.695042C6.94851 0.557783 6.18204 0.48251 5.41326 0.469971ZM17.5786 22.5303C18.3836 22.5303 19.1623 22.4218 19.8753 22.3052C20.6327 22.182 21.2373 21.6891 21.6463 21.0895C22.057 20.4816 22.315 19.7128 22.3741 18.8897C22.4497 17.858 22.5154 16.7803 22.5154 15.6746C22.5154 14.569 22.4497 13.4913 22.3741 12.4595C22.3273 11.6759 22.0764 10.9181 21.6463 10.2614C21.2356 9.66011 20.6327 9.16726 19.8753 9.04404C19.1168 8.9093 18.3489 8.83404 17.5786 8.81897C16.7736 8.81897 15.9949 8.9274 15.2819 9.04404C14.5245 9.16726 13.92 9.66011 13.5109 10.2598C13.0812 10.9173 12.8304 11.6755 12.7831 12.4595C12.6971 13.5292 12.65 14.6016 12.6418 15.6746C12.6418 16.7803 12.7075 17.858 12.7831 18.8897C12.8423 19.7111 13.0985 20.4833 13.5109 21.0878C13.9216 21.6891 14.5245 22.182 15.2819 22.3052C16.0404 22.4399 16.8083 22.5152 17.5786 22.5303Z" 
                fill="#EA763F" 
              />
            </svg>
          </a>
        </div>

        {/* Separator */}
        <div className="w-8 h-[1px] bg-zinc-800 my-2"></div>

        {/* Nav list */}
        <nav className="flex flex-col items-center gap-2 w-full mt-1">
          {/* Home */}
          <button 
            className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors group cursor-pointer"
            title="Home"
          >
            <House className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium leading-none text-zinc-400 group-hover:text-white">Home</span>
          </button>

          {/* Plus */}
          <button 
            className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-zinc-400 hover:text-[var(--brand)] hover:bg-zinc-800/60 transition-colors group cursor-pointer"
            title="Plus (Unlocked)"
          >
            <span className="font-bold text-sm leading-none text-[var(--brand)] mb-0.5">+</span>
            <span className="text-[10px] font-medium leading-none text-zinc-400 group-hover:text-[var(--brand)]">Plus</span>
          </button>

          {/* Track (Active) */}
          <button 
            className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-[var(--brand)] bg-[var(--brand-bg-10)] border border-[var(--brand-bg-30)] shadow-sm transition-colors cursor-pointer"
            title="Track / Sheets"
          >
            <FileText className="w-5 h-5 mb-0.5 stroke-[2.2]" />
            <span className="text-[10px] font-bold leading-none">Track</span>
          </button>

          {/* Practice */}
          <button 
            className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors group cursor-pointer"
            title="Practice & Code Sandbox"
          >
            <Code2 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium leading-none text-zinc-400 group-hover:text-white">Code</span>
          </button>
        </nav>
      </div>

      {/* Bottom section: Streak, Backup, Reset */}
      <div className="flex flex-col items-center gap-3 w-full pb-2">
        {/* Streak */}
        <div 
          className="flex flex-col items-center justify-center w-11 py-1 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400"
          title={`${streak} Days Streak`}
        >
          <Flame className="w-4 h-4 fill-orange-400" />
          <span className="text-[10px] font-bold font-mono mt-0.5">{streak}d</span>
        </div>

        {/* Export */}
        <button
          onClick={onExport}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Export Progress Backup (JSON)"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Import */}
        <button
          onClick={onImportClick}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Import Progress (JSON)"
        >
          <Upload className="w-4 h-4" />
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          title="Reset Progress"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Theme Toggle Button */}
        <div className="my-0.5">
          <ThemeToggle variant="icon" />
        </div>

        {/* User profile avatar button */}
        <button
          onClick={onOpenAuth}
          className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${currentProfile?.avatarColor || 'from-orange-500 to-amber-500'} flex items-center justify-center text-xs font-bold text-white shadow-sm mt-1 cursor-pointer hover:scale-110 transition-transform`}
          title={`${currentProfile?.name || 'User'} (@${currentProfile?.username || 'user'}) - Click to switch profile / learn with friend`}
        >
          {currentProfile?.name?.charAt(0).toUpperCase() || 'A'}
        </button>

        {/* Logout button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="p-1.5 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer mt-0.5"
            title="Log Out of Dedicated Session"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
};
