import React, { useState } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  XCircle,
  Shield,
  FileCheck,
  Wrench,
  FileSpreadsheet,
  Coins,
  Bell,
  ArrowRight,
  Plus,
  Send,
  Download,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Vehicle, ActiveTab } from '../types';
import { formatCurrency, getExpiryStatus, getStatusBadgeConfig } from '../utils/helpers';

interface DashboardScreenProps {
  vehicles: Vehicle[];
  onSelectTab: (tab: ActiveTab) => void;
  onSelectCategoryFilter?: (filter: string) => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  vehicles,
  onSelectTab,
  onSelectCategoryFilter,
  onOpenNotifications,
  unreadNotificationsCount,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate metrics
  const totalVehicles = vehicles.length;
  const paidVehicles = vehicles.filter((v) => v.paymentStatus === 'paid').length;
  const unpaidVehicles = vehicles.filter((v) => v.paymentStatus === 'unpaid' || v.paymentStatus === 'pending').length;
  const partialVehicles = vehicles.filter((v) => v.paymentStatus === 'partial').length;

  const insuranceExpiring = vehicles.filter((v) => {
    const st = getExpiryStatus(v.insuranceExpiry);
    return st === 'expiring_soon' || st === 'expired';
  }).length;

  const pucExpiring = vehicles.filter((v) => {
    const st = getExpiryStatus(v.pucExpiry);
    return st === 'expiring_soon' || st === 'expired';
  }).length;

  const fitnessExpiring = vehicles.filter((v) => {
    const st = getExpiryStatus(v.fitnessExpiry);
    return st === 'expiring_soon' || st === 'expired';
  }).length;

  const permitExpiring = vehicles.filter((v) => {
    const st = getExpiryStatus(v.permitExpiry);
    return st === 'expiring_soon' || st === 'expired';
  }).length;

  const taxExpiring = vehicles.filter((v) => {
    const st = getExpiryStatus(v.taxExpiry);
    return st === 'expiring_soon' || st === 'expired';
  }).length;

  // Filter vehicles if search typed
  const searchFilteredVehicles = vehicles.filter(
    (v) =>
      v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cardsData = [
    {
      id: 'total',
      title: 'Total Vehicles',
      count: totalVehicles,
      icon: Truck,
      cardBg: 'bg-[#151928] border-amber-500/40 text-amber-300',
      badgeBg: 'bg-amber-400 text-slate-950',
      subtext: 'Registered Fleet',
      onClick: () => {
        onSelectCategoryFilter?.('all');
        onSelectTab('vehicles');
      },
    },
    {
      id: 'paid',
      title: 'Paid Vehicles',
      count: paidVehicles,
      icon: CheckCircle2,
      cardBg: 'bg-[#121E2B] border-blue-500/40 text-blue-300',
      badgeBg: 'bg-blue-500 text-white',
      subtext: 'Full Clearance',
      onClick: () => {
        onSelectCategoryFilter?.('paid');
        onSelectTab('payments');
      },
    },
    {
      id: 'unpaid',
      title: 'Pending/Unpaid',
      count: unpaidVehicles,
      icon: XCircle,
      cardBg: 'bg-[#22131A] border-rose-500/40 text-rose-300',
      badgeBg: 'bg-rose-500 text-white',
      subtext: 'Pending Fees',
      onClick: () => {
        onSelectCategoryFilter?.('unpaid');
        onSelectTab('payments');
      },
    },
    {
      id: 'partial',
      title: 'Partial Payment',
      count: partialVehicles,
      icon: Coins,
      cardBg: 'bg-[#241E10] border-orange-500/40 text-orange-300',
      badgeBg: 'bg-orange-400 text-slate-950',
      subtext: 'Balance Remaining',
      onClick: () => {
        onSelectCategoryFilter?.('partial');
        onSelectTab('payments');
      },
    },
    {
      id: 'insurance',
      title: 'Insurance Expiring',
      count: insuranceExpiring,
      icon: Shield,
      cardBg: 'bg-[#221A10] border-amber-500/40 text-amber-300',
      badgeBg: 'bg-amber-400 text-slate-950',
      subtext: 'Policy Renewal',
      onClick: () => {
        onSelectCategoryFilter?.('insurance');
        onSelectTab('documents');
      },
    },
    {
      id: 'puc',
      title: 'PUC Expiring',
      count: pucExpiring,
      icon: FileCheck,
      cardBg: 'bg-[#221C12] border-yellow-500/40 text-yellow-300',
      badgeBg: 'bg-yellow-400 text-slate-950',
      subtext: 'Pollution Check',
      onClick: () => {
        onSelectCategoryFilter?.('puc');
        onSelectTab('documents');
      },
    },
    {
      id: 'fitness',
      title: 'Fitness Expiring',
      count: fitnessExpiring,
      icon: Wrench,
      cardBg: 'bg-[#1D1429] border-purple-500/40 text-purple-300',
      badgeBg: 'bg-purple-500 text-white',
      subtext: 'RTO Fitness Cert',
      onClick: () => {
        onSelectCategoryFilter?.('fitness');
        onSelectTab('documents');
      },
    },
    {
      id: 'permit',
      title: 'Permit Expiring',
      count: permitExpiring,
      icon: FileSpreadsheet,
      cardBg: 'bg-[#11221B] border-emerald-500/40 text-emerald-300',
      badgeBg: 'bg-emerald-400 text-slate-950',
      subtext: 'National / State',
      onClick: () => {
        onSelectCategoryFilter?.('permit');
        onSelectTab('documents');
      },
    },
    {
      id: 'tax',
      title: 'Tax Expiring',
      count: taxExpiring,
      icon: Coins,
      cardBg: 'bg-[#102029] border-cyan-500/40 text-cyan-300',
      badgeBg: 'bg-cyan-400 text-slate-950',
      subtext: 'Road Tax Due',
      onClick: () => {
        onSelectCategoryFilter?.('tax');
        onSelectTab('documents');
      },
    },
    {
      id: 'notifications',
      title: "Today's Alerts",
      count: unreadNotificationsCount,
      icon: Bell,
      cardBg: 'bg-[#241712] border-orange-500/40 text-orange-300',
      badgeBg: 'bg-orange-400 text-slate-950',
      subtext: 'Alerts & Reminders',
      onClick: onOpenNotifications,
    },
  ];

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 bg-[#090A0E] text-slate-100">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-amber-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Vehicle Number (e.g. MH 12), Owner, Driver..."
          className="w-full bg-[#141828] border border-amber-500/40 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition shadow-md"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-3 text-xs text-amber-400 hover:underline font-bold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Immediate Alert Bar if documents expiring */}
      {(insuranceExpiring > 0 || pucExpiring > 0 || fitnessExpiring > 0) && (
        <div className="bg-[#241512] border border-amber-500/50 p-3.5 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950">
              <AlertTriangle className="w-5 h-5 font-bold" />
            </div>
            <div>
              <p className="text-xs font-black text-amber-300">
                Action Required: Fleet Document Expiry
              </p>
              <p className="text-[11px] font-bold text-slate-200">
                {insuranceExpiring + pucExpiring + fitnessExpiring} documents require immediate renewal attention.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('notifications')}
            className="px-3.5 py-1.5 bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow hover:bg-amber-300 transition whitespace-nowrap"
          >
            Send WhatsApps
          </button>
        </div>
      )}

      {/* Fast Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => onSelectTab('add')}
          className="p-3 rounded-2xl bg-[#141828] border border-amber-500/30 hover:border-amber-400 flex items-center gap-2.5 transition group shadow-md"
        >
          <div className="p-2 rounded-xl bg-amber-400 text-slate-950 group-hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold text-slate-100">Add Vehicle</span>
            <span className="text-[10px] text-slate-400">New Record</span>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('notifications')}
          className="p-3 rounded-2xl bg-[#141828] border border-amber-500/30 hover:border-amber-400 flex items-center gap-2.5 transition group shadow-md"
        >
          <div className="p-2 rounded-xl bg-emerald-400 text-slate-950 group-hover:scale-105 transition-transform">
            <Send className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold text-slate-100">Reminders</span>
            <span className="text-[10px] text-slate-400">WhatsApp Alert</span>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('reports')}
          className="p-3 rounded-2xl bg-[#141828] border border-amber-500/30 hover:border-amber-400 flex items-center gap-2.5 transition group shadow-md"
        >
          <div className="p-2 rounded-xl bg-blue-400 text-slate-950 group-hover:scale-105 transition-transform">
            <Download className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold text-slate-100">Export Excel</span>
            <span className="text-[10px] text-slate-400">CSV & PDF</span>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('payments')}
          className="p-3 rounded-2xl bg-[#141828] border border-amber-500/30 hover:border-amber-400 flex items-center gap-2.5 transition group shadow-md"
        >
          <div className="p-2 rounded-xl bg-yellow-400 text-slate-950 group-hover:scale-105 transition-transform">
            <Coins className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold text-slate-100">Collections</span>
            <span className="text-[10px] text-slate-400">Fee Status</span>
          </div>
        </button>
      </div>

      {/* Screen 3 Dashboard Cards Grid (9 Metric Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black text-slate-100 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Fleet Dashboard Metrics
          </h2>
          <span className="text-[11px] font-bold text-slate-400">Real-time status</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {cardsData.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={card.onClick}
                className={`${card.cardBg} border rounded-2xl p-3.5 shadow-md hover:scale-[1.02] active:scale-98 transition duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden group`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-[#080A12] border border-slate-700">
                    <Icon className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                  </div>
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${card.badgeBg}`}>
                    {card.count}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-100 line-clamp-1">{card.title}</h3>
                  <p className="text-[10px] text-slate-300 mt-0.5">{card.subtext}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search results or Fleet Overview list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-slate-200 tracking-tight">
            {searchTerm ? `Search Results (${searchFilteredVehicles.length})` : 'Recent Fleet Activity'}
          </h2>
          <button
            onClick={() => onSelectTab('vehicles')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {searchFilteredVehicles.slice(0, 4).map((veh) => {
            const payConfig = getStatusBadgeConfig(veh.paymentStatus);
            const insConfig = getStatusBadgeConfig(getExpiryStatus(veh.insuranceExpiry));
            const pucConfig = getStatusBadgeConfig(getExpiryStatus(veh.pucExpiry));

            return (
              <div
                key={veh.id}
                onClick={() => onSelectTab('vehicles')}
                className="bg-[#141828] border border-amber-500/40 rounded-2xl p-4 shadow-md hover:border-amber-400 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#241E12] border border-amber-500/40 flex items-center justify-center shrink-0">
                    <Truck className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-amber-300 font-mono tracking-wider">
                        {veh.vehicleNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${payConfig.bg}`}>
                        {payConfig.text}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-200 mt-0.5">
                      {veh.ownerName} • <span className="text-slate-400">{veh.vehicleModel}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className={`px-2 py-0.5 rounded-lg border ${insConfig.bg}`}>
                    INS: {insConfig.text}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg border ${pucConfig.bg}`}>
                    PUC: {pucConfig.text}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
