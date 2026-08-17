import React, { useState } from 'react';
import {
  Settings,
  Lock,
  Download,
  Upload,
  Bell,
  Smartphone,
  Info,
  LogOut,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { AdminProfile, Vehicle } from '../types';
import { ModalStep } from '../components/AdminLoginModal';

interface SettingsScreenProps {
  adminProfile: AdminProfile;
  setAdminProfile: React.Dispatch<React.SetStateAction<AdminProfile>>;
  vehicles: Vehicle[];
  onOpenAdminLogin: (step?: ModalStep) => void;
  onRestoreData: (restoredVehicles: Vehicle[]) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  adminProfile,
  setAdminProfile,
  vehicles,
  onOpenAdminLogin,
  onRestoreData,
}) => {
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const handleBackupDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(vehicles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Kishor_Enterprises_Backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleRestoreJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsedData = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsedData)) {
            onRestoreData(parsedData);
            setSaveSuccessMsg('JSON Backup restored successfully!');
            setTimeout(() => setSaveSuccessMsg(''), 3000);
          }
        } catch {
          alert('Invalid JSON backup file format.');
        }
      };
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-5 bg-[#090A0E] text-slate-100">
      {/* Title */}
      <div>
        <h2 className="text-lg font-black text-amber-300 flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-400" />
          App Settings & Administrative Controls
        </h2>
        <p className="text-xs text-slate-400">
          Admin account credentials, mobile verification, backup/restore & notifications
        </p>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 1. Admin Profile Overview Card */}
      <div className="bg-[#121522] border border-amber-500/30 rounded-3xl p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Admin Account Information
          </h3>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
            Active Admin
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-[#181C2B] p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-extrabold text-slate-400 block mb-0.5">
              Admin Username
            </span>
            <span className="font-mono font-bold text-amber-300 text-sm">
              {adminProfile.username || 'sanket123'}
            </span>
          </div>

          <div className="bg-[#181C2B] p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-extrabold text-slate-400 block mb-0.5">
              Registered Mobile
            </span>
            <span className="font-mono font-bold text-amber-300 text-sm">
              {adminProfile.adminMobile || '+91 8767132450'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Admin Account Management Security Actions */}
      <div className="bg-[#121522] border border-amber-500/20 rounded-3xl p-4 space-y-3">
        <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
          <KeyRound className="w-4 h-4 text-amber-400" />
          Credential & Security Management
        </h3>

        <div className="space-y-2">
          {/* Change Registered Mobile Number */}
          <div className="p-3 bg-[#1A1E2D] border border-amber-500/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-100">Change Mobile Number</h4>
                <p className="text-[11px] text-slate-400">Requires Password + 2FA OTP verification</p>
              </div>
            </div>
            <button
              onClick={() => onOpenAdminLogin('change_mobile_start')}
              className="px-3 py-1.5 bg-amber-400 text-slate-950 font-black text-xs rounded-xl hover:bg-amber-300 transition shadow"
            >
              Update No.
            </button>
          </div>

          {/* Change Username */}
          <div className="p-3 bg-[#1A1E2D] border border-amber-500/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-100">Change Username</h4>
                <p className="text-[11px] text-slate-400">Update default username (sanket123)</p>
              </div>
            </div>
            <button
              onClick={() => onOpenAdminLogin('change_username_start')}
              className="px-3 py-1.5 bg-amber-400 text-slate-950 font-black text-xs rounded-xl hover:bg-amber-300 transition shadow"
            >
              Change Name
            </button>
          </div>

          {/* Change Password */}
          <div className="p-3 bg-[#1A1E2D] border border-amber-500/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-100">Change Password</h4>
                <p className="text-[11px] text-slate-400">Update default password (Sanket-123)</p>
              </div>
            </div>
            <button
              onClick={() => onOpenAdminLogin('change_pass_start')}
              className="px-3 py-1.5 bg-amber-400 text-slate-950 font-black text-xs rounded-xl hover:bg-amber-300 transition shadow"
            >
              Change Pass
            </button>
          </div>
        </div>
      </div>

      {/* 3. Backup & Restore Data */}
      <div className="bg-[#121522] border border-amber-500/20 rounded-3xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
          <Download className="w-4 h-4 text-amber-400" />
          Database Backup & Restore
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleBackupDownload}
            className="p-3 bg-[#1A1D2B] border border-amber-500/20 hover:border-amber-400/50 rounded-2xl flex flex-col items-center justify-center text-center transition group"
          >
            <Download className="w-5 h-5 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Backup Data</span>
            <span className="text-[10px] text-slate-400">Download JSON</span>
          </button>

          <label className="p-3 bg-[#1A1D2B] border border-amber-500/20 hover:border-amber-400/50 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition group">
            <Upload className="w-5 h-5 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Restore Data</span>
            <span className="text-[10px] text-slate-400">Upload JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleRestoreJSON}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 4. Notification Settings */}
      <div className="bg-[#121522] border border-amber-500/20 rounded-3xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
          <Bell className="w-4 h-4 text-amber-400" />
          Notification Settings
        </h3>

        <div className="space-y-2 text-xs">
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#1A1D2B]">
            <span className="font-semibold text-slate-200">Push Notifications</span>
            <input
              type="checkbox"
              checked={adminProfile.pushNotificationsEnabled}
              onChange={(e) =>
                setAdminProfile((prev) => ({
                  ...prev,
                  pushNotificationsEnabled: e.target.checked,
                }))
              }
              className="w-4 h-4 accent-amber-400"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#1A1D2B]">
            <span className="font-semibold text-slate-200">WhatsApp Automated Reminders</span>
            <input
              type="checkbox"
              checked={adminProfile.whatsAppRemindersEnabled}
              onChange={(e) =>
                setAdminProfile((prev) => ({
                  ...prev,
                  whatsAppRemindersEnabled: e.target.checked,
                }))
              }
              className="w-4 h-4 accent-amber-400"
            />
          </label>
        </div>
      </div>

      {/* 5. About App */}
      <div className="bg-[#121522] border border-amber-500/20 rounded-3xl p-4 space-y-2 text-xs">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
          <Info className="w-4 h-4 text-amber-400" />
          About Kishor Enterprises App
        </h3>
        <p className="text-slate-300 font-semibold">
          Application: <span className="text-amber-300">Kishor Enterprises Fleet Manager</span>
        </p>
        <p className="text-slate-400">Version: 3.5.0 (Material Design 3 Build)</p>
        <p className="text-slate-400">
          Features: Smart Vehicle Record & RTO Document Management System with automated WhatsApp notifications.
        </p>
      </div>

      {/* 6. Logout Button */}
      <button
        onClick={() => {
          setAdminProfile((prev) => ({ ...prev, isLoggedIn: false }));
          alert('Logged out from Kishor Enterprises Admin Portal');
          onOpenAdminLogin('login');
        }}
        className="w-full py-3.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold text-xs rounded-2xl hover:bg-rose-500/25 transition flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4 text-rose-400" />
        <span>Logout Admin Session</span>
      </button>
    </div>
  );
};
