import React, { useState } from 'react';
import {
  Search,
  Plus,
  Phone,
  MessageSquare,
  FileText,
  Edit2,
  Trash2,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  FileCheck,
  Wrench,
  ChevronDown,
  X,
  Coins
} from 'lucide-react';
import { Vehicle, ActiveTab } from '../types';
import {
  formatCurrency,
  formatDate,
  getExpiryStatus,
  getStatusBadgeConfig,
  generateWhatsAppLink,
  getDaysRemaining
} from '../utils/helpers';
import { MaintenanceLogTab } from '../components/MaintenanceLogTab';

interface VehiclesScreenProps {
  vehicles: Vehicle[];
  onSelectTab: (tab: ActiveTab) => void;
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
  onUpdateVehicle?: (vehicle: Vehicle) => void;
  selectedCategoryFilter?: string;
  initialSelectedVehicle?: Vehicle | null;
  onClearInitialSelectedVehicle?: () => void;
}

export const VehiclesScreen: React.FC<VehiclesScreenProps> = ({
  vehicles,
  onSelectTab,
  onEditVehicle,
  onDeleteVehicle,
  onUpdateVehicle,
  selectedCategoryFilter = 'all',
  initialSelectedVehicle = null,
  onClearInitialSelectedVehicle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState(selectedCategoryFilter);
  const [selectedVehicleModal, setSelectedVehicleModal] = useState<Vehicle | null>(initialSelectedVehicle);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [modalTab, setModalTab] = useState<'overview' | 'maintenance'>('overview');

  // Update modal if initialSelectedVehicle changes from outside
  React.useEffect(() => {
    if (initialSelectedVehicle) {
      setSelectedVehicleModal(initialSelectedVehicle);
    }
  }, [initialSelectedVehicle]);

  const handleCloseModal = () => {
    setSelectedVehicleModal(null);
    if (onClearInitialSelectedVehicle) {
      onClearInitialSelectedVehicle();
    }
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    // Search match
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      v.vehicleNumber.toLowerCase().includes(searchLower) ||
      v.ownerName.toLowerCase().includes(searchLower) ||
      v.ownerMobile.toLowerCase().includes(searchLower) ||
      v.driverName.toLowerCase().includes(searchLower) ||
      v.driverMobile.toLowerCase().includes(searchLower) ||
      v.vehicleModel.toLowerCase().includes(searchLower);

    // Type filter
    const matchesType = typeFilter === 'all' || v.vehicleType === typeFilter;

    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'paid') {
      matchesStatus = v.paymentStatus === 'paid';
    } else if (statusFilter === 'unpaid') {
      matchesStatus = v.paymentStatus === 'unpaid' || v.paymentStatus === 'pending';
    } else if (statusFilter === 'partial') {
      matchesStatus = v.paymentStatus === 'partial';
    } else if (statusFilter === 'expiring') {
      const insSt = getExpiryStatus(v.insuranceExpiry);
      const pucSt = getExpiryStatus(v.pucExpiry);
      const fitSt = getExpiryStatus(v.fitnessExpiry);
      matchesStatus =
        insSt === 'expiring_soon' ||
        pucSt === 'expiring_soon' ||
        fitSt === 'expiring_soon';
    } else if (statusFilter === 'expired') {
      const insSt = getExpiryStatus(v.insuranceExpiry);
      const pucSt = getExpiryStatus(v.pucExpiry);
      const fitSt = getExpiryStatus(v.fitnessExpiry);
      matchesStatus =
        insSt === 'expired' || pucSt === 'expired' || fitSt === 'expired';
    }

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-4 bg-[#090A0E] text-slate-100">
      {/* Top Header & Add Vehicle Button */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-black text-amber-300 tracking-tight flex items-center gap-2">
            All Fleet Vehicles
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {filteredVehicles.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400">Search, filter & manage vehicle records</p>
        </div>

        <button
          onClick={() => onSelectTab('add')}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-xs shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:from-amber-400 hover:to-yellow-300 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Fast Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Fast Search Vehicle No., Owner Name, Driver No., Model..."
          className="w-full bg-[#141828] border border-amber-500/40 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition shadow-md"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-3 text-xs text-amber-400 font-bold hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Fleet' },
          { id: 'paid', label: 'Paid (Blue)' },
          { id: 'unpaid', label: 'Pending (Grey)' },
          { id: 'partial', label: 'Partial (Orange)' },
          { id: 'expiring', label: 'Expiring Soon' },
          { id: 'expired', label: 'Expired Docs' },
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setStatusFilter(chip.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition border ${
              statusFilter === chip.id
                ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-md'
                : 'bg-[#141828] border-slate-700 text-slate-300 hover:text-slate-100'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Vehicle Cards List */}
      <div className="space-y-4">
        {filteredVehicles.length === 0 ? (
          <div className="p-8 text-center bg-[#121522] rounded-3xl border border-slate-800 my-6">
            <Filter className="w-10 h-10 text-amber-400/50 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-300">No matching vehicles found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing search or filters</p>
          </div>
        ) : (
          filteredVehicles.map((veh) => {
            const payStatus = getStatusBadgeConfig(veh.paymentStatus);
            const insStatus = getStatusBadgeConfig(getExpiryStatus(veh.insuranceExpiry));
            const pucStatus = getStatusBadgeConfig(getExpiryStatus(veh.pucExpiry));
            const fitStatus = getStatusBadgeConfig(getExpiryStatus(veh.fitnessExpiry));

            const insDays = getDaysRemaining(veh.insuranceExpiry);

            return (
              <div
                key={veh.id}
                className="bg-[#141828] border border-amber-500/40 rounded-3xl p-4 shadow-xl hover:border-amber-400 transition flex flex-col space-y-3 relative overflow-hidden"
              >
                {/* Header Row: Vehicle No. + Payment Status Badge */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-amber-300 font-mono tracking-wider">
                        {veh.vehicleNumber}
                      </span>
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${payStatus.bg}`}>
                        {payStatus.text}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 font-bold mt-0.5">
                      {veh.vehicleType} • <span className="text-slate-400">{veh.vehicleModel}</span>
                    </p>
                  </div>

                  {/* Fee Amount */}
                  <div className="text-right">
                    <span className="text-xs font-black text-amber-400 font-mono">
                      {formatCurrency(veh.paymentAmount)}
                    </span>
                    <span className="block text-[10px] text-slate-300 font-bold">
                      Paid: {formatCurrency(veh.paidAmount)}
                    </span>
                  </div>
                </div>

                {/* Owner & Driver Info Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-[#080A12] p-3 rounded-2xl border border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                      Owner Name & Mobile
                    </span>
                    <span className="font-bold text-slate-200 block">{veh.ownerName}</span>
                    <a
                      href={`tel:${veh.ownerMobile}`}
                      className="text-amber-400 font-mono text-[11px] hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3 text-amber-400 inline" />
                      {veh.ownerMobile}
                    </a>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                      Driver Name & Mobile
                    </span>
                    <span className="font-bold text-slate-200 block">{veh.driverName}</span>
                    <a
                      href={`tel:${veh.driverMobile}`}
                      className="text-amber-400 font-mono text-[11px] hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3 text-amber-400 inline" />
                      {veh.driverMobile}
                    </a>
                  </div>
                </div>

                {/* Mandatory Dates Grid: Insurance, PUC, Fitness */}
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className={`p-2 rounded-xl border ${insStatus.bg}`}>
                    <span className="block text-[9px] uppercase font-bold text-slate-300">
                      Insurance Date
                    </span>
                    <span className="font-extrabold font-mono text-[11px]">
                      {formatDate(veh.insuranceExpiry)}
                    </span>
                    <span className="block text-[9px] font-bold mt-0.5">
                      {insStatus.text}
                    </span>
                  </div>

                  <div className={`p-2 rounded-xl border ${pucStatus.bg}`}>
                    <span className="block text-[9px] uppercase font-bold text-slate-300">
                      PUC Date
                    </span>
                    <span className="font-extrabold font-mono text-[11px]">
                      {formatDate(veh.pucExpiry)}
                    </span>
                    <span className="block text-[9px] font-bold mt-0.5">
                      {pucStatus.text}
                    </span>
                  </div>

                  <div className={`p-2 rounded-xl border ${fitStatus.bg}`}>
                    <span className="block text-[9px] uppercase font-bold text-slate-300">
                      Fitness Date
                    </span>
                    <span className="font-extrabold font-mono text-[11px]">
                      {formatDate(veh.fitnessExpiry)}
                    </span>
                    <span className="block text-[9px] font-bold mt-0.5">
                      {fitStatus.text}
                    </span>
                  </div>
                </div>

                {/* Quick Actions Footer Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* VIEW */}
                    <button
                      onClick={() => {
                        setSelectedVehicleModal(veh);
                        setModalTab('overview');
                      }}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-bold hover:bg-slate-700 transition flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>VIEW</span>
                    </button>

                    {/* EDIT */}
                    <button
                      onClick={() => onEditVehicle(veh)}
                      className="px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-bold hover:bg-amber-500/25 transition flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>EDIT</span>
                    </button>

                    {/* PAYMENT */}
                    <button
                      onClick={() => onSelectTab('payments')}
                      className="px-2.5 py-1 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[11px] font-bold hover:bg-blue-500/25 transition flex items-center gap-1"
                    >
                      <Coins className="w-3.5 h-3.5 text-blue-400" />
                      <span>PAYMENT</span>
                    </button>

                    {/* DOCUMENTS */}
                    <button
                      onClick={() => onSelectTab('documents')}
                      className="px-2.5 py-1 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[11px] font-bold hover:bg-purple-500/25 transition flex items-center gap-1"
                    >
                      <Shield className="w-3.5 h-3.5 text-purple-400" />
                      <span>DOCUMENTS</span>
                    </button>

                    {/* WHATSAPP */}
                    <a
                      href={generateWhatsAppLink(
                        veh.ownerMobile,
                        veh.ownerName,
                        veh.vehicleNumber,
                        'Insurance & Document Renewal',
                        veh.insuranceExpiry,
                        insDays
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold hover:bg-emerald-500/30 transition inline-flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WHATSAPP</span>
                    </a>
                  </div>

                  {/* DELETE */}
                  <button
                    onClick={() => setVehicleToDelete(veh)}
                    title="Delete Record"
                    className="px-2.5 py-1 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[11px] font-bold hover:bg-rose-500/25 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>DELETE</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Vehicle Confirmation Modal */}
      {vehicleToDelete && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-[#121522] border border-rose-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-100">Delete Vehicle Record</h3>
                <p className="text-xs text-rose-400 font-bold font-mono">
                  {vehicleToDelete.vehicleNumber} • {vehicleToDelete.ownerName}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-medium bg-[#1A1D2B] p-3.5 rounded-2xl border border-slate-800 leading-relaxed">
              Are you sure you want to delete this vehicle?
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setVehicleToDelete(null)}
                className="flex-1 py-2.5 bg-slate-800 text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const idToDelete = vehicleToDelete.id;
                  setVehicleToDelete(null);
                  if (selectedVehicleModal?.id === idToDelete) {
                    setSelectedVehicleModal(null);
                  }
                  onDeleteVehicle(idToDelete);
                }}
                className="flex-1 py-2.5 bg-rose-500 text-slate-950 text-xs font-black rounded-xl hover:bg-rose-400 shadow-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Full Details Modal */}
      {selectedVehicleModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#0F1118] border border-amber-500/30 rounded-3xl p-5 shadow-[0_0_50px_rgba(245,158,11,0.25)] max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div>
                <h3 className="text-base font-black text-amber-300 font-mono">
                  {selectedVehicleModal.vehicleNumber}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedVehicleModal.vehicleType} • {selectedVehicleModal.vehicleModel}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs: Overview vs Maintenance Log */}
            <div className="flex items-center gap-2 p-1 bg-[#141724] rounded-2xl border border-slate-800">
              <button
                onClick={() => setModalTab('overview')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                  modalTab === 'overview'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Overview & Docs</span>
              </button>

              <button
                onClick={() => setModalTab('maintenance')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                  modalTab === 'maintenance'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Maintenance Log ({selectedVehicleModal.maintenanceLogs?.length || 0})</span>
              </button>
            </div>

            {modalTab === 'maintenance' ? (
              <MaintenanceLogTab
                vehicle={selectedVehicleModal}
                onUpdateVehicle={(updated) => {
                  setSelectedVehicleModal(updated);
                  if (onUpdateVehicle) {
                    onUpdateVehicle(updated);
                  }
                }}
              />
            ) : (
              <>
                {/* Photo Preview if available */}
                {selectedVehicleModal.vehiclePhoto && (
                  <div className="w-full h-40 rounded-2xl overflow-hidden border border-amber-500/20 relative">
                    <img
                      src={selectedVehicleModal.vehiclePhoto}
                      alt={selectedVehicleModal.vehicleNumber}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Complete Data Details */}
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 bg-[#141724] p-3 rounded-2xl">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Owner Name</span>
                      <span className="font-bold text-slate-200">{selectedVehicleModal.ownerName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Owner Mobile</span>
                      <span className="font-bold text-amber-300 font-mono">{selectedVehicleModal.ownerMobile}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Driver Name</span>
                      <span className="font-bold text-slate-200">{selectedVehicleModal.driverName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Driver Mobile</span>
                      <span className="font-bold text-amber-300 font-mono">{selectedVehicleModal.driverMobile}</span>
                    </div>
                  </div>

                  {/* RTO Document Expiries */}
                  <div className="space-y-2 bg-[#141724] p-3 rounded-2xl border border-slate-800">
                    <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">
                      RTO Document Dates
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Insurance Expiry:</span>
                        <span className="font-mono font-bold text-slate-200">{formatDate(selectedVehicleModal.insuranceExpiry)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">PUC Expiry:</span>
                        <span className="font-mono font-bold text-slate-200">{formatDate(selectedVehicleModal.pucExpiry)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Fitness Expiry:</span>
                        <span className="font-mono font-bold text-slate-200">{formatDate(selectedVehicleModal.fitnessExpiry)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Permit Expiry:</span>
                        <span className="font-mono font-bold text-slate-200">{formatDate(selectedVehicleModal.permitExpiry)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Tax Expiry:</span>
                        <span className="font-mono font-bold text-slate-200">{formatDate(selectedVehicleModal.taxExpiry)}</span>
                      </div>
                    </div>
                  </div>

                  {/* RC & Engine Numbers */}
                  <div className="bg-[#141724] p-3 rounded-2xl space-y-1 font-mono text-[11px]">
                    <p><span className="text-slate-400">RC Number:</span> <strong className="text-amber-300">{selectedVehicleModal.rcNumber || 'N/A'}</strong></p>
                    <p><span className="text-slate-400">Engine Number:</span> <strong className="text-slate-200">{selectedVehicleModal.engineNumber || 'N/A'}</strong></p>
                    <p><span className="text-slate-400">Chassis Number:</span> <strong className="text-slate-200">{selectedVehicleModal.chassisNumber || 'N/A'}</strong></p>
                    {selectedVehicleModal.notes && (
                      <p className="pt-2 text-slate-300 font-sans border-t border-slate-800">
                        <span className="text-amber-400 font-bold block">Notes:</span> {selectedVehicleModal.notes}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  const target = selectedVehicleModal;
                  setVehicleToDelete(target);
                }}
                className="py-2.5 px-4 bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-bold rounded-xl hover:bg-rose-500/25 transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <button
                onClick={() => setSelectedVehicleModal(null)}
                className="flex-1 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
