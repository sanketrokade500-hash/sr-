import React, { useEffect, useState } from 'react';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import appIconLogo from '../assets/images/app_icon_logo_1786471617978.jpg';

interface SplashScreenProps {
  onEnterApp: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnterApp }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 5;
      });
    }, 80);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-[#000000] flex flex-col items-center justify-between p-6 relative overflow-hidden text-slate-100 font-sans">
      {/* Background Sharp Accent Gradients */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600"></div>

      {/* Top Tag */}
      <div className="mt-4 flex items-center gap-2 bg-[#12141F] border border-amber-500/40 px-4 py-1.5 rounded-full shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
        <span className="text-xs font-black tracking-wider text-amber-300 uppercase">
          Material Design 3 • Fleet Edition
        </span>
      </div>

      {/* Central Hero Logo & Animations */}
      <div className="flex flex-col items-center text-center my-auto px-4 z-10 max-w-sm">
        {/* Crisp App Icon Logo */}
        <div className="relative mb-8 group cursor-pointer" onClick={onEnterApp}>
          <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-600 p-1 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center transform group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#08090E] rounded-[22px] overflow-hidden relative border border-amber-500/30">
              <img
                src={appIconLogo}
                alt="Kishor Enterprises App Icon"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Brand Names */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-500 bg-clip-text text-transparent mb-2">
          Kishor Enterprises
        </h1>

        <p className="text-xs sm:text-sm font-semibold text-slate-300 max-w-xs mb-6 leading-relaxed">
          Fleet Management & Vehicle RTO Document Tracking System
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 border border-amber-500/20 text-amber-300">
            ✓ Fleet Records
          </span>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 border border-amber-500/20 text-amber-300">
            ✓ RTO Reminders
          </span>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 border border-amber-500/20 text-amber-300">
            ✓ WhatsApp Alerts
          </span>
        </div>

        {/* Enter App Button */}
        <button
          onClick={onEnterApp}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-98 transition flex items-center justify-center gap-2"
        >
          <span>Launch Fleet Dashboard</span>
          <ArrowRight className="w-4 h-4 text-slate-950 font-bold" />
        </button>
      </div>

      {/* Bottom Loading Progress Bar */}
      <div className="w-full max-w-xs mb-6 text-center">
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-amber-500/20 mb-2">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-400 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 font-mono">
          System Initialized • Kishor Enterprises v3.5.0
        </p>
      </div>
    </div>
  );
};
