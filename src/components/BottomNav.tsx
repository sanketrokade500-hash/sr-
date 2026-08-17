import React from 'react';
import { Home, Truck, Plus, FileBarChart, Settings } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'vehicles' as ActiveTab, label: 'Vehicles', icon: Truck },
    { id: 'add' as ActiveTab, label: 'Add', icon: Plus, isFab: true },
    { id: 'reports' as ActiveTab, label: 'Reports', icon: FileBarChart },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-[#08090E] border-t border-amber-500/30 px-3 py-2 flex items-center justify-around shadow-[0_-5px_20px_rgba(0,0,0,0.9)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        if (item.isFab) {
          return (
            <div key={item.id} className="relative -top-5 flex flex-col items-center">
              <button
                onClick={() => onSelectTab(item.id)}
                className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.5)] active:scale-95 transition-all flex items-center justify-center group"
              >
                <div className="w-full h-full bg-[#0D0F18] group-hover:bg-[#121522] rounded-[14px] flex items-center justify-center transition">
                  <Plus className="w-7 h-7 text-amber-400 font-extrabold group-hover:rotate-90 transition-transform duration-300" />
                </div>
              </button>
              <span className="text-[10px] font-bold text-amber-400 mt-1">Add Vehicle</span>
            </div>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 relative ${
              isActive
                ? 'text-amber-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {/* Active MD3 Pill Indicator */}
            {isActive && (
              <div className="absolute top-1 w-12 h-7 bg-amber-500/20 rounded-full border border-amber-500/30 -z-10 animate-fade-in" />
            )}

            <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-amber-400' : ''}`} />
            <span className={`text-[11px] font-semibold tracking-tight ${isActive ? 'text-amber-300 font-bold' : ''}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
