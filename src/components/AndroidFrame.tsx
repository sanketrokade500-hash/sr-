import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Battery, Wifi, Signal } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeTab: string;
  onSelectTab: (tab: any) => void;
  isPhoneFrame: boolean;
  setIsPhoneFrame: (val: boolean) => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isPhoneFrame,
  setIsPhoneFrame,
}) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isPhoneFrame) {
    return (
      <div className="min-h-screen bg-[#0A0B0E] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-300">
        <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto shadow-2xl bg-[#0F1117] border-x border-amber-500/10 relative">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col items-center justify-center p-2 sm:p-6 font-sans">
      {/* Top Controller Bar */}
      <div className="w-full max-w-sm mb-3 flex items-center justify-between text-xs text-amber-300 bg-[#121522] px-4 py-2 rounded-full border border-amber-500/40 shadow-xl">
        <div className="flex items-center gap-1.5 font-bold text-slate-100">
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span>Android 15 Device Mode</span>
        </div>
        <button
          onClick={() => setIsPhoneFrame(false)}
          className="flex items-center gap-1 bg-amber-400 text-slate-950 hover:bg-amber-300 px-3 py-1 rounded-full text-[11px] font-black transition"
        >
          <Monitor className="w-3.5 h-3.5" />
          Full View
        </button>
      </div>

      {/* Realistic Android Device Frame */}
      <div className="w-full max-w-[410px] h-[850px] bg-[#000000] rounded-[48px] p-3 shadow-2xl border-[3px] border-amber-500/40 relative flex flex-col overflow-hidden">
        {/* Hardware Frame Side Buttons Simulation */}
        <div className="absolute -right-[7px] top-28 w-[4px] h-12 bg-amber-500/80 rounded-r-md"></div>
        <div className="absolute -right-[7px] top-44 w-[4px] h-20 bg-amber-500/80 rounded-r-md"></div>

        {/* Inner Screen Container */}
        <div className="w-full h-full bg-[#08090E] rounded-[38px] flex flex-col overflow-hidden relative border border-slate-800">
          {/* Android Status Bar */}
          <div className="h-9 px-6 pt-1 flex items-center justify-between bg-[#10131E] text-[12px] font-bold text-amber-300 z-50 select-none border-b border-amber-500/20">
            <span>{time || '09:41'}</span>
            
            {/* Punch hole camera / Dynamic pill */}
            <div className="w-20 h-4 bg-black rounded-full border border-amber-500/40 flex items-center justify-center gap-1">
              <div className="w-2.5 h-2.5 bg-[#181C2B] rounded-full border border-amber-400"></div>
            </div>

            <div className="flex items-center gap-1.5 text-amber-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <div className="flex items-center gap-0.5 font-mono text-[10px]">
                <span>85%</span>
                <Battery className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 flex flex-col overflow-y-auto relative scrollbar-thin scrollbar-thumb-amber-500">
            {children}
          </div>

          {/* Android Gesture Navigation Bar */}
          <div className="h-5 bg-[#10131E] flex items-center justify-center z-50 border-t border-amber-500/20">
            <div className="w-28 h-1.5 bg-amber-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
