import React from 'react';
import { Bell, Smartphone, Monitor, Code2, ShieldCheck, UserCheck } from 'lucide-react';
import { AdminProfile } from '../types';
import appIconLogo from '../assets/images/app_icon_logo_1786471617978.jpg';

interface HeaderProps {
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenFlutterCode: () => void;
  onOpenAdminLogin: () => void;
  isPhoneFrame: boolean;
  setIsPhoneFrame: (val: boolean) => void;
  adminProfile: AdminProfile;
}

export const Header: React.FC<HeaderProps> = ({
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenFlutterCode,
  onOpenAdminLogin,
  isPhoneFrame,
  setIsPhoneFrame,
  adminProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#08090E] border-b border-amber-500/30 px-4 py-3 flex items-center justify-between shadow-md">
      {/* Brand Title with App Icon Logo */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl border border-amber-500/50 overflow-hidden shadow-md flex items-center justify-center bg-black">
            <img
              src={appIconLogo}
              alt="Kishor Enterprises App Icon"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#08090E]"></span>
        </div>

        <div>
          <h1 className="text-sm font-black tracking-tight text-amber-300 flex items-center gap-1.5">
            Kishor Enterprises
          </h1>
          <p className="text-[10px] font-bold text-slate-300 tracking-wide flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400 inline" />
            Fleet & Vehicle Manager
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Flutter Source Code Modal Trigger */}
        <button
          onClick={onOpenFlutterCode}
          title="View Flutter Material 3 Source Code"
          className="p-2 rounded-xl bg-[#181C2B] hover:bg-[#202538] border border-amber-500/40 text-amber-300 transition flex items-center justify-center shadow-md"
        >
          <Code2 className="w-4 h-4 text-amber-400" />
        </button>

        {/* Device Frame Toggle */}
        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          title={isPhoneFrame ? "Switch to Desktop Workspace View" : "Switch to Android Phone View"}
          className="p-2 rounded-xl bg-[#181C2B] hover:bg-[#202538] border border-amber-500/40 text-slate-100 transition flex items-center justify-center shadow-md"
        >
          {isPhoneFrame ? (
            <Monitor className="w-4 h-4 text-amber-400" />
          ) : (
            <Smartphone className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="p-2 rounded-xl bg-[#181C2B] hover:bg-[#202538] border border-amber-500/40 text-slate-100 transition relative shadow-md"
          title="View Expiry Notifications"
        >
          <Bell className="w-4 h-4 text-amber-400" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Admin Login Status Badge */}
        <button
          onClick={onOpenAdminLogin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs font-black transition shadow-md"
        >
          <UserCheck className="w-3.5 h-3.5 text-slate-950" />
          <span className="hidden sm:inline">
            {adminProfile.isLoggedIn ? 'Admin Active' : 'Admin Login'}
          </span>
        </button>
      </div>
    </header>
  );
};
