import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Calendar,
  Gauge,
  IndianRupee,
  Building2,
  FileText,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  RotateCw,
  Sliders,
  ShieldCheck,
  Disc,
  BatteryCharging,
  Flame,
  ChevronRight
} from 'lucide-react';
import { Vehicle, MaintenanceRecord, ServiceType } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';

interface MaintenanceLogTabProps {
  vehicle: Vehicle;
  onUpdateVehicle: (updatedVehicle: Vehicle) => void;
}

const SERVICE_TYPES: { type: ServiceType; label: string; icon: any; color: string }[] = [
  { type: 'Oil Change', label: 'Engine Oil & Filter', icon: Flame, color: 'text-amber-300 bg-[#241E12] border-amber-500/40' },
  { type: 'Tire Rotation', label: 'Tire Rotation & Alignment', icon: RotateCw, color: 'text-sky-300 bg-[#121E2B] border-sky-500/40' },
  { type: 'Brake Service', label: 'Brake Service & Pads', icon: Disc, color: 'text-rose-300 bg-[#22131A] border-rose-500/40' },
  { type: 'General Service', label: 'Periodic General Service', icon: Wrench, color: 'text-emerald-300 bg-[#11221B] border-emerald-500/40' },
  { type: 'Battery Replacement', label: 'Battery Check & Replacement', icon: BatteryCharging, color: 'text-purple-300 bg-[#1D1429] border-purple-500/40' },
  { type: 'Wheel Alignment', label: 'Wheel Alignment & Balancing', icon: Sliders, color: 'text-indigo-300 bg-[#17162E] border-indigo-500/40' },
  { type: 'Engine Overhaul', label: 'Engine Major Overhaul', icon: ShieldCheck, color: 'text-amber-300 bg-[#241E12] border-amber-500/40' },
  { type: 'Transmission Fluid', label: 'Gearbox & Transmission Fluid', icon: Gauge, color: 'text-teal-300 bg-[#112220] border-teal-500/40' },
  { type: 'AC Repair', label: 'Air Conditioning Service', icon: Sparkles, color: 'text-cyan-300 bg-[#102029] border-cyan-500/40' },
  { type: 'Other', label: 'Other Repair / Servicing', icon: Clock, color: 'text-slate-200 bg-[#1C2030] border-slate-700' },
];

export const MaintenanceLogTab: React.FC<MaintenanceLogTabProps> = ({
  vehicle,
  onUpdateVehicle,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [successMsg, setSuccessMsg] = useState('');

  // New Maintenance Form State
  const [serviceType, setServiceType] = useState<ServiceType>('Oil Change');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [odometerKm, setOdometerKm] = useState<number | ''>(45000);
  const [cost, setCost] = useState<number | ''>(3500);
  const [serviceCenter, setServiceCenter] = useState('Kishor Workshop');
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [nextServiceDueDate, setNextServiceDueDate] = useState('');

  const logs = vehicle.maintenanceLogs || [];

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (filterType === 'all') return true;
    return log.serviceType === filterType;
  });

  // Calculate Summary
  const totalSpend = logs.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const sortedByDate = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const lastService = sortedByDate[0];
  const upcomingService = sortedByDate.find(
    (l) => l.nextServiceDueDate && new Date(l.nextServiceDueDate).getTime() >= new Date().getTime()
  );

  const handleAddMaintenance = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord: MaintenanceRecord = {
      id: `maint-${Date.now()}`,
      vehicleId: vehicle.id,
      serviceType,
      date: date || new Date().toISOString().split('T')[0],
      odometerKm: Number(odometerKm) || 0,
      cost: Number(cost) || 0,
      serviceCenter: serviceCenter || 'Kishor Workshop',
      technicianNotes,
      nextServiceDueDate,
    };

    const updatedLogs = [newRecord, ...logs];
    const updatedVehicle: Vehicle = {
      ...vehicle,
      maintenanceLogs: updatedLogs,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onUpdateVehicle(updatedVehicle);

    // Reset Form
    setShowAddForm(false);
    setTechnicianNotes('');
    setNextServiceDueDate('');
    setSuccessMsg(`New ${serviceType} log record added for ${vehicle.vehicleNumber}!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteLog = (logId: string) => {
    if (confirm('Are you sure you want to remove this maintenance entry?')) {
      const updatedLogs = logs.filter((l) => l.id !== logId);
      const updatedVehicle: Vehicle = {
        ...vehicle,
        maintenanceLogs: updatedLogs,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      onUpdateVehicle(updatedVehicle);
      setSuccessMsg('Maintenance log entry deleted.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Alert Banner */}
      {successMsg && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="bg-[#121522] border border-amber-500/20 p-3 rounded-2xl space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Total Service Spend
          </span>
          <span className="text-base font-black text-amber-300 font-mono">
            {formatCurrency(totalSpend)}
          </span>
          <span className="text-[10px] text-slate-400 block">{logs.length} logged services</span>
        </div>

        <div className="bg-[#121522] border border-amber-500/20 p-3 rounded-2xl space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Last Service Date
          </span>
          <span className="text-sm font-extrabold text-slate-100 font-mono">
            {lastService ? formatDate(lastService.date) : 'No service log'}
          </span>
          <span className="text-[10px] text-amber-400 font-mono block">
            {lastService ? `${lastService.odometerKm.toLocaleString('en-IN')} km` : '0 km'}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-[#121522] border border-amber-500/20 p-3 rounded-2xl space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Next Service Due
          </span>
          <span className="text-sm font-extrabold text-emerald-400 font-mono">
            {upcomingService?.nextServiceDueDate
              ? formatDate(upcomingService.nextServiceDueDate)
              : 'As scheduled'}
          </span>
          <span className="text-[10px] text-slate-400 block">
            {upcomingService ? upcomingService.serviceType : 'Regular inspection'}
          </span>
        </div>
      </div>

      {/* Add Maintenance Button */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <h4 className="font-extrabold text-slate-200 text-xs flex items-center gap-1.5">
          <Wrench className="w-4 h-4 text-amber-400" />
          Maintenance Log History ({filteredLogs.length})
        </h4>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[11px] shadow hover:from-amber-400 hover:to-yellow-300 transition flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Cancel Entry' : 'Log Maintenance'}</span>
        </button>
      </div>

      {/* New Maintenance Form Drawer / Box */}
      {showAddForm && (
        <form
          onSubmit={handleAddMaintenance}
          className="bg-[#141827] border border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-xl animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
            <h4 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-amber-400" />
              Add Maintenance / Service Record
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">{vehicle.vehicleNumber}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Service Type */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Service Type *
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ServiceType)}
                className="w-full bg-[#0F111A] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-400"
              >
                {SERVICE_TYPES.map((st) => (
                  <option key={st.type} value={st.type}>
                    {st.label} ({st.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Service Date */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Service Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#0F111A] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            {/* Odometer KM */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Odometer Reading (KM)
              </label>
              <input
                type="number"
                value={odometerKm}
                onChange={(e) => setOdometerKm(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 45000"
                className="w-full bg-[#0F111A] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            {/* Cost (₹) */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Service Cost (₹)
              </label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 3500"
                className="w-full bg-[#0F111A] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            {/* Workshop / Service Center */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Workshop / Service Center
              </label>
              <input
                type="text"
                value={serviceCenter}
                onChange={(e) => setServiceCenter(e.target.value)}
                placeholder="e.g. Kishor Workshop"
                className="w-full bg-[#0F111A] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Next Due Date */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Next Recommended Service Due Date
              </label>
              <input
                type="date"
                value={nextServiceDueDate}
                onChange={(e) => setNextServiceDueDate(e.target.value)}
                className="w-full bg-[#0F111A] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          {/* Technician Notes */}
          <div>
            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Technician Remarks / Parts Replaced
            </label>
            <textarea
              rows={2}
              value={technicianNotes}
              onChange={(e) => setTechnicianNotes(e.target.value)}
              placeholder="e.g. Replaced Mobil 1 15W-40 engine oil, oil filter & adjusted clutch linkage..."
              className="w-full bg-[#0F111A] border border-amber-500/20 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-500 text-slate-950 font-black text-xs rounded-xl hover:bg-amber-400 transition"
            >
              Save Maintenance Log Entry
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Service Type Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilterType('all')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition border ${
            filterType === 'all'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
              : 'bg-[#121522] border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          All Types ({logs.length})
        </button>
        {SERVICE_TYPES.slice(0, 5).map((st) => {
          const count = logs.filter((l) => l.serviceType === st.type).length;
          return (
            <button
              key={st.type}
              onClick={() => setFilterType(st.type)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition border ${
                filterType === st.type
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                  : 'bg-[#121522] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st.type} ({count})
            </button>
          );
        })}
      </div>

      {/* Logs Timeline List */}
      <div className="space-y-2.5">
        {filteredLogs.length === 0 ? (
          <div className="p-6 text-center bg-[#121522] rounded-2xl border border-slate-800">
            <Wrench className="w-8 h-8 text-amber-400/40 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-300">No maintenance records logged yet</p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Click &quot;Log Maintenance&quot; above to log oil changes, tire rotations & service history.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const config =
              SERVICE_TYPES.find((st) => st.type === log.serviceType) || SERVICE_TYPES[9];
            const IconComponent = config.icon;

            return (
              <div
                key={log.id}
                className="bg-[#121522] border border-slate-800 rounded-2xl p-3.5 space-y-2 shadow hover:border-amber-500/30 transition relative group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border ${config.color} shrink-0`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-100 text-xs block">
                        {log.serviceType}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {formatDate(log.date)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-300 font-bold">
                          <Gauge className="w-3 h-3 text-amber-400" />
                          {log.odometerKm.toLocaleString('en-IN')} km
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-2">
                    <div>
                      <span className="font-black text-amber-400 font-mono text-sm block">
                        {formatCurrency(log.cost)}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        {log.serviceCenter}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      title="Delete Entry"
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition opacity-80 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {log.technicianNotes && (
                  <div className="bg-[#0B0D14] p-2.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
                    <span className="text-slate-400 font-bold text-[10px] uppercase block">
                      Technician Notes / Parts:
                    </span>
                    <p className="mt-0.5">{log.technicianNotes}</p>
                  </div>
                )}

                {log.nextServiceDueDate && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 inline-flex">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>Next Due Service: {formatDate(log.nextServiceDueDate)}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
