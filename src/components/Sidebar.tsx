import React from 'react';
import { Flame, LogOut } from 'lucide-react';
import type { UserProfile } from '../types/dsa';

interface SidebarProps {
  streak: number;
  currentProfile?: UserProfile;
  onExport?: () => void;
  onImportClick?: () => void;
  onReset?: () => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  streak,
  currentProfile,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <aside className="hidden lg:flex flex-col justify-between w-[78px] h-screen sticky top-0 bg-white border-r border-slate-200/80 py-3 px-2 z-30 shrink-0 select-none shadow-xs">
      {/* Top section: Logo & Nav items */}
      <div className="flex flex-col items-center w-full">
        {/* takeUforward Official Logo */}
        <div className="mb-2">
          <a 
            href="#" 
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-50 via-white to-amber-50/70 border border-orange-200/70 shadow-xs hover:shadow-md hover:shadow-orange-200/50 hover:scale-105 active:scale-95 transition-all duration-200 group"
            title="takeUforward"
          >
            <svg width="28" height="28" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:rotate-6">
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
        <div className="w-8 h-[1px] bg-slate-200 my-2 rounded-full"></div>

        {/* Nav list: ONLY "Sheet" as requested */}
        <nav className="flex flex-col items-center w-full mt-1">
          <button 
            className="w-[58px] h-[64px] rounded-2xl flex flex-col items-center justify-center bg-[#fff8f3] border-2 border-[#fed7aa] shadow-sm hover:shadow-md hover:shadow-orange-200/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
            title="Striver's A2Z Sheet (Active)"
          >
            {/* Exact TUF Sheet Document Icon with folded corner and lines */}
            <svg 
              width="26" 
              height="26" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#EA580C" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mb-1 transition-transform duration-200 group-hover:-translate-y-0.5"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="16" y2="17" />
            </svg>
            <span className="text-[12px] font-extrabold text-[#EA580C] leading-none tracking-tight">Sheet</span>
          </button>
        </nav>
      </div>

      {/* Bottom section: Streak, Profile, Logout */}
      <div className="flex flex-col items-center gap-2.5 w-full pb-3">
        {/* Animated Streak */}
        <div 
          className="flex flex-col items-center justify-center w-12 py-1.5 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50 border border-orange-200/90 text-orange-600 shadow-xs hover:scale-105 transition-transform duration-200 cursor-default"
          title={`${streak} Days Streak`}
        >
          <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
          <span className="text-[10px] font-extrabold font-mono mt-0.5 tracking-tight text-orange-600">{streak}d</span>
        </div>

        {/* User profile avatar button */}
        <button
          onClick={onOpenAuth}
          className="w-10 h-10 rounded-2xl border border-slate-200 bg-white hover:border-orange-400 hover:shadow-md hover:shadow-orange-200/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-slate-600 cursor-pointer shadow-xs group"
          title={`${currentProfile?.name || 'User'} (@${currentProfile?.username || 'user'}) - Click to switch profile / learn with friend`}
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-xs font-bold text-white shadow-xs">
            {currentProfile?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
        </button>

        {/* Logout button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
            title="Log Out of Dedicated Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
