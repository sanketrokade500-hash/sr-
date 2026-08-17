import React, { useState, useEffect } from 'react';
import {
  Coins,
  CheckCircle2,
  Receipt,
  Download,
  TrendingUp,
  X,
  Edit2,
  Trash2,
  PlusCircle,
  Clock,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';
import { Vehicle, PaymentStatus, PaymentRecord } from '../types';
import { formatCurrency, formatDate, getStatusBadgeConfig } from '../utils/helpers';
import { CustomDropdown } from '../components/CustomDropdown';
import {
  getPaymentRecords,
  addPaymentRecord,
  updatePaymentRecord,
  deletePaymentRecord,
} from '../services/dataService';

interface PaymentScreenProps {
  vehicles: Vehicle[];
  onUpdateVehiclePayment: (vehicleId: string, paidAmount: number, status: PaymentStatus, paymentMode?: string) => void;
  selectedCategoryFilter?: string;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  vehicles,
  onUpdateVehiclePayment,
  selectedCategoryFilter = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<
    'all' | 'paid' | 'unpaid' | 'partial' | 'history' | 'monthly'
  >((selectedCategoryFilter as any) || 'all');

  useEffect(() => {
    if (selectedCategoryFilter) {
      setActiveTab((selectedCategoryFilter as any) || 'all');
    }
  }, [selectedCategoryFilter]);

  // Central Persistent Payment History
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedVehicleForPayment, setSelectedVehicleForPayment] = useState<Vehicle | null>(null);
  const [editingRecord, setEditingRecord] = useState<PaymentRecord | null>(null);
  const [isManualPaymentOpen, setIsManualPaymentOpen] = useState(false);

  // Form Fields for Record / Update Payment
  const [manualVehicleId, setManualVehicleId] = useState('');
  const [totalAmountInput, setTotalAmountInput] = useState<number | ''>(25000);
  const [paidAmountInput, setPaidAmountInput] = useState<number | ''>(25000);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('paid');
  const [paymentMode, setPaymentMode] = useState<string>('UPI');
  const [customPaymentMode, setCustomPaymentMode] = useState<string>('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Toast feedback
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const standardPaymentModes = ['UPI', 'Cash', 'NEFT', 'Cheque'];

  // Load payments from centralized dataService
  useEffect(() => {
    const records = getPaymentRecords();
    setPaymentHistory(records);
  }, []);

  const refreshHistory = () => {
    const records = getPaymentRecords();
    setPaymentHistory(records);
  };

  // Helper to recalculate status automatically
  const computePaymentStatus = (total: number, paid: number): PaymentStatus => {
    if (paid >= total && total > 0) return 'paid';
    if (paid > 0 && paid < total) return 'partial';
    return 'unpaid';
  };

  // Synchronize inputs when total or paid changes
  const handleAmountChange = (total: number | '', paid: number | '') => {
    const t = Number(total) || 0;
    const p = Math.max(0, Number(paid) || 0);
    setTotalAmountInput(total);
    setPaidAmountInput(paid);
    setPaymentStatus(computePaymentStatus(t, p));
  };

  // Open modal for a specific fleet vehicle
  const handleOpenRecordPayment = (veh: Vehicle) => {
    setSelectedVehicleForPayment(veh);
    setManualVehicleId(veh.id);
    setTotalAmountInput(veh.paymentAmount || 25000);
    
    const currentPaid = veh.paidAmount ?? (veh.paymentStatus === 'paid' ? veh.paymentAmount : 0);
    setPaidAmountInput(currentPaid);
    setPaymentStatus(veh.paymentStatus || 'paid');

    const mode = veh.paymentMode || 'UPI';
    if (standardPaymentModes.includes(mode)) {
      setPaymentMode(mode);
      setCustomPaymentMode('');
    } else {
      setPaymentMode('Other');
      setCustomPaymentMode(mode);
    }

    setPaymentNotes(`Fee collection for ${veh.vehicleNumber}`);
    setPaymentDate(new Date().toISOString().split('T')[0]);
  };

  // Open manual add payment modal
  const handleOpenManualPayment = () => {
    setSelectedVehicleForPayment(null);
    setEditingRecord(null);
    if (vehicles.length > 0) {
      setManualVehicleId(vehicles[0].id);
      setTotalAmountInput(vehicles[0].paymentAmount || 25000);
      setPaidAmountInput(vehicles[0].paidAmount || 0);
      setPaymentStatus(vehicles[0].paymentStatus || 'unpaid');
    } else {
      setManualVehicleId('');
      setTotalAmountInput(25000);
      setPaidAmountInput(25000);
      setPaymentStatus('paid');
    }
    setPaymentMode('UPI');
    setCustomPaymentMode('');
    setPaymentNotes('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setIsManualPaymentOpen(true);
  };

  // Open edit record modal
  const handleOpenEditRecord = (record: PaymentRecord) => {
    setEditingRecord(record);
    setManualVehicleId(record.vehicleId || '');
    setTotalAmountInput(record.amount);
    setPaidAmountInput(record.paidAmount);
    setPaymentStatus(record.status);

    if (standardPaymentModes.includes(record.paymentMode)) {
      setPaymentMode(record.paymentMode);
      setCustomPaymentMode('');
    } else {
      setPaymentMode('Other');
      setCustomPaymentMode(record.paymentMode);
    }

    setPaymentNotes(record.notes || '');
    setPaymentDate(record.date);
  };

  // Delete payment record
  const handleDeleteRecord = (id: string) => {
    if (confirm('Are you sure you want to delete this payment record?')) {
      const updated = deletePaymentRecord(id);
      setPaymentHistory(updated);
      setSuccessToast('Payment record removed successfully.');
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  // Save payment handler (handles Vehicle updates and History log)
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();

    const targetVehicle = selectedVehicleForPayment || vehicles.find((v) => v.id === manualVehicleId);
    const total = Number(totalAmountInput) || 0;
    const paid = Math.max(0, Number(paidAmountInput) || 0);
    const balance = Math.max(0, total - paid);
    const calculatedStatus = computePaymentStatus(total, paid);
    const finalMode = paymentMode === 'Other' ? (customPaymentMode.trim() || 'Other') : paymentMode;

    if (editingRecord) {
      // Update existing record
      const updatedRecord: PaymentRecord = {
        ...editingRecord,
        vehicleId: targetVehicle?.id || editingRecord.vehicleId,
        vehicleNumber: targetVehicle?.vehicleNumber || editingRecord.vehicleNumber,
        date: paymentDate,
        amount: total,
        paidAmount: paid,
        balanceAmount: balance,
        paymentMode: finalMode,
        status: calculatedStatus,
        notes: paymentNotes || `Payment record updated`,
      };

      const updatedHistory = updatePaymentRecord(updatedRecord);
      setPaymentHistory(updatedHistory);

      if (targetVehicle) {
        onUpdateVehiclePayment(targetVehicle.id, paid, calculatedStatus, finalMode);
      }

      setEditingRecord(null);
      setSuccessToast('Payment record updated successfully!');
    } else {
      // New payment record
      const newRec = addPaymentRecord({
        vehicleId: targetVehicle?.id,
        vehicleNumber: targetVehicle?.vehicleNumber,
        receiptNo: `KDS/2026/${Math.floor(1000 + Math.random() * 9000)}`,
        date: paymentDate,
        amount: total,
        paidAmount: paid,
        balanceAmount: balance,
        paymentMode: finalMode,
        status: calculatedStatus,
        notes: paymentNotes || `Fee received for ${targetVehicle?.vehicleNumber || 'fleet vehicle'}`,
      });

      refreshHistory();

      if (targetVehicle) {
        onUpdateVehiclePayment(targetVehicle.id, paid, calculatedStatus, finalMode);
      }

      setSelectedVehicleForPayment(null);
      setIsManualPaymentOpen(false);
      setSuccessToast(`Payment of ${formatCurrency(paid)} saved successfully!`);
    }

    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Metric Totals
  const totalDemand = vehicles.reduce((acc, v) => acc + (v.paymentAmount || 0), 0);
  const totalCollected = vehicles.reduce((acc, v) => acc + (v.paidAmount || 0), 0);
  const totalPending = Math.max(0, totalDemand - totalCollected);

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchSearch =
      v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;

    if (activeTab === 'paid') return v.paymentStatus === 'paid';
    if (activeTab === 'unpaid') return v.paymentStatus === 'unpaid' || v.paymentStatus === 'pending';
    if (activeTab === 'partial') return v.paymentStatus === 'partial';
    return true;
  });

  // Filter history
  const filteredHistory = paymentHistory.filter((rec) => {
    return (
      (rec.vehicleNumber && rec.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rec.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.paymentMode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.notes && rec.notes.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const isModalOpen = Boolean(selectedVehicleForPayment || isManualPaymentOpen || editingRecord);

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-5 bg-[#090A0E] text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
        <div>
          <h2 className="text-lg font-black text-amber-300 flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Fee & Payment Management
          </h2>
          <p className="text-xs text-slate-400">
            Track payments, receipt histories, partial balances & collection reports
          </p>
        </div>

        <button
          onClick={handleOpenManualPayment}
          className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition shadow flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Payment Receipt</span>
        </button>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="bg-[#102A1E] border border-emerald-500 text-emerald-200 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Summary Collection Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#141828] border border-amber-500/40 p-4 rounded-2xl shadow-md">
          <span className="text-[10px] uppercase font-bold text-slate-300 block">Total Demand</span>
          <span className="text-base sm:text-xl font-black text-amber-300 font-mono mt-1 block">
            {formatCurrency(totalDemand)}
          </span>
          <span className="text-[10px] text-slate-400">{vehicles.length} Total Vehicles</span>
        </div>

        <div className="bg-[#101F33] border border-sky-500/40 p-4 rounded-2xl shadow-md">
          <span className="text-[10px] uppercase font-bold text-sky-200 block">Total Collected</span>
          <span className="text-base sm:text-xl font-black text-sky-300 font-mono mt-1 block">
            {formatCurrency(totalCollected)}
          </span>
          <span className="text-[10px] text-sky-400 font-semibold">
            {totalDemand > 0 ? `${Math.round((totalCollected / totalDemand) * 100)}% Recovered` : '0%'}
          </span>
        </div>

        <div className="bg-[#2E1417] border border-rose-500/40 p-4 rounded-2xl shadow-md">
          <span className="text-[10px] uppercase font-bold text-rose-200 block">Pending Balance</span>
          <span className="text-base sm:text-xl font-black text-rose-300 font-mono mt-1 block">
            {formatCurrency(totalPending)}
          </span>
          <span className="text-[10px] text-rose-400 font-semibold">Outstanding Dues</span>
        </div>
      </div>

      {/* Search and Category Tabs */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by vehicle number, owner, receipt no, payment mode..."
            className="w-full bg-[#141828] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Payments' },
            { id: 'paid', label: 'Paid Vehicles (Blue)' },
            { id: 'unpaid', label: 'Unpaid Vehicles (Grey)' },
            { id: 'partial', label: 'Partial Payment (Orange)' },
            { id: 'history', label: `Payment History (${paymentHistory.length})` },
            { id: 'monthly', label: 'Monthly Collection' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition border ${
                activeTab === tab.id
                  ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-md'
                  : 'bg-[#141828] border-slate-700 text-slate-300 hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* View 1: Vehicles Payment List */}
      {activeTab !== 'history' && activeTab !== 'monthly' && (
        <div className="space-y-3">
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-10 bg-[#121522] rounded-3xl border border-slate-800 text-slate-400 text-xs">
              No vehicle payment records found matching this filter.
            </div>
          ) : (
            filteredVehicles.map((veh) => {
              const payStatus = getStatusBadgeConfig(veh.paymentStatus);
              const paidVal = veh.paidAmount ?? (veh.paymentStatus === 'paid' ? veh.paymentAmount : 0);
              const balance = Math.max(0, (veh.paymentAmount || 0) - paidVal);

              return (
                <div
                  key={veh.id}
                  className="bg-[#121522] border border-amber-500/20 rounded-2xl p-4 shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-500/40 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-amber-300 font-mono tracking-wider">
                        {veh.vehicleNumber}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${payStatus.bg}`}>
                        {payStatus.text}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-200 border border-slate-700 font-semibold">
                        Mode: {veh.paymentMode || 'UPI'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Owner: <strong className="text-slate-100">{veh.ownerName}</strong> ({veh.ownerMobile})
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Type: {veh.vehicleType} • {veh.vehicleModel}
                    </p>
                    {veh.paymentDate && (
                      <p className="text-[10px] text-sky-400 font-mono">
                        Last Transaction: {veh.paymentDate} {veh.paymentTime ? `at ${veh.paymentTime}` : ''}
                      </p>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400 block">Total: {formatCurrency(veh.paymentAmount)}</span>
                      <span className="text-xs font-extrabold text-sky-400 block">Paid: {formatCurrency(paidVal)}</span>
                      {balance > 0 ? (
                        <span className="text-xs font-extrabold text-orange-400 font-mono block">
                          Remaining: {formatCurrency(balance)}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-400 block">✓ No Dues</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenRecordPayment(veh)}
                      className="mt-2 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold hover:bg-amber-400 transition shadow flex items-center gap-1.5"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Update / Collect</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* View 2: Payment History Log */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Central Payment History & Transaction Receipts
            </h3>
            <span className="text-xs text-slate-400">{filteredHistory.length} Records</span>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="text-center py-10 bg-[#121522] rounded-3xl border border-slate-800 text-slate-400 text-xs">
              No payment receipts found in history.
            </div>
          ) : (
            filteredHistory.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#121522] border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-amber-500/40 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Receipt className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300 font-mono">
                      {rec.receiptNo}
                    </span>
                    {rec.vehicleNumber && (
                      <span className="text-xs font-mono font-bold text-sky-300 bg-sky-950/40 border border-sky-500/30 px-2 py-0.5 rounded-md">
                        {rec.vehicleNumber}
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-200 border border-slate-700 font-semibold">
                      Mode: {rec.paymentMode}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        rec.status === 'paid'
                          ? 'bg-blue-500/20 text-blue-300'
                          : rec.status === 'partial'
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{rec.notes || 'Fleet payment record'}</p>
                  <p className="text-[10px] text-slate-400">Date: {formatDate(rec.date)}</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right font-mono">
                    <span className="text-sm font-black text-emerald-400 block">
                      + {formatCurrency(rec.paidAmount)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Total: {formatCurrency(rec.amount)} {rec.balanceAmount > 0 && `| Bal: ${formatCurrency(rec.balanceAmount)}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditRecord(rec)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 transition"
                      title="Edit Payment"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(rec.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-rose-400 transition"
                      title="Delete Payment Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* View 3: Monthly Collection Progress */}
      {activeTab === 'monthly' && (
        <div className="bg-[#121522] border border-amber-500/20 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-amber-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Monthly Revenue & Collection Analysis
              </h3>
              <p className="text-xs text-slate-400">Total Fleet Demand: {formatCurrency(totalDemand)}</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {totalDemand > 0 ? `${Math.round((totalCollected / totalDemand) * 100)}% Collected` : '100%'}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Target Progress</span>
              <span className="text-amber-300 font-mono font-bold">
                {formatCurrency(totalCollected)} / {formatCurrency(totalDemand)}
              </span>
            </div>
            <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden border border-amber-500/20">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${totalDemand > 0 ? Math.min(100, (totalCollected / totalDemand) * 100) : 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3.5 bg-[#0B0D14] rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Received</span>
              <span className="font-bold text-emerald-400 font-mono text-base mt-0.5 block">{formatCurrency(totalCollected)}</span>
            </div>
            <div className="p-3.5 bg-[#0B0D14] rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Pending Recovery</span>
              <span className="font-bold text-rose-400 font-mono text-base mt-0.5 block">{formatCurrency(totalPending)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog: Add / Record / Edit Payment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-[#0F1118] border border-amber-500/30 rounded-3xl p-5 shadow-2xl space-y-4 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                {editingRecord
                  ? 'Edit Payment Receipt'
                  : selectedVehicleForPayment
                  ? `Record Payment: ${selectedVehicleForPayment.vehicleNumber}`
                  : 'Add New Payment Receipt'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedVehicleForPayment(null);
                  setIsManualPaymentOpen(false);
                  setEditingRecord(null);
                }}
                className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-3.5">
              {/* Vehicle Selection if manual add */}
              {!selectedVehicleForPayment && !editingRecord && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Select Vehicle
                  </label>
                  <CustomDropdown
                    value={manualVehicleId}
                    onChange={(val) => {
                      setManualVehicleId(val);
                      const target = vehicles.find((v) => v.id === val);
                      if (target) {
                        setTotalAmountInput(target.paymentAmount || 25000);
                        setPaidAmountInput(target.paidAmount || 0);
                        setPaymentStatus(target.paymentStatus || 'unpaid');
                      }
                    }}
                    options={vehicles.map((v) => ({
                      value: v.id,
                      label: `${v.vehicleNumber} (${v.ownerName})`,
                    }))}
                    placeholder="Choose fleet vehicle"
                  />
                </div>
              )}

              {/* Amount Fields */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Total Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={totalAmountInput}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : '';
                      handleAmountChange(val, paidAmountInput);
                    }}
                    placeholder="Total Fee"
                    className="w-full bg-[#161922] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Paid Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={paidAmountInput}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : '';
                      handleAmountChange(totalAmountInput, val);
                    }}
                    placeholder="Amount Paid"
                    className="w-full bg-[#161922] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-emerald-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Calculated Remaining & Status */}
              <div className="p-3 bg-[#141828] rounded-2xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Remaining Amount</span>
                  <span className="text-sm font-black text-rose-400">
                    {formatCurrency(Math.max(0, (Number(totalAmountInput) || 0) - (Number(paidAmountInput) || 0)))}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Calculated Status</span>
                  <span
                    className={`text-xs font-black uppercase px-2 py-0.5 rounded-md inline-block ${
                      paymentStatus === 'paid'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : paymentStatus === 'partial'
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        : 'bg-slate-700 text-slate-300 border border-slate-600'
                    }`}
                  >
                    {paymentStatus}
                  </span>
                </div>
              </div>

              {/* Payment Mode with CustomDropdown */}
              <div>
                <CustomDropdown
                  id="payment-screen-mode-dropdown"
                  label="Payment Mode"
                  value={paymentMode}
                  onChange={(val) => setPaymentMode(val)}
                  allowOther={true}
                  otherValue={customPaymentMode}
                  onOtherChange={setCustomPaymentMode}
                  otherPlaceholder="Enter Payment Mode (e.g., DD / NetBanking / POS)"
                  options={[
                    { value: 'UPI', label: '1. UPI (GPay / PhonePe / Paytm)' },
                    { value: 'Cash', label: '2. Cash' },
                    { value: 'NEFT', label: '3. NEFT / RTGS' },
                    { value: 'Cheque', label: '4. Cheque' },
                    { value: 'Other', label: '5. Other' },
                  ]}
                  placeholder="Select payment mode"
                />
              </div>

              {/* Date & Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full bg-[#161922] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Remarks / Note
                  </label>
                  <input
                    type="text"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="e.g. Cleared via UPI"
                    className="w-full bg-[#161922] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVehicleForPayment(null);
                    setIsManualPaymentOpen(false);
                    setEditingRecord(null);
                  }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow transition flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Payment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
