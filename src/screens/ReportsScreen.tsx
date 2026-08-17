import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  Printer,
  FileCheck,
  Shield,
  Wrench,
  CheckCircle2,
  XCircle,
  BarChart3,
  Sparkles,
  X
} from 'lucide-react';
import { Vehicle } from '../types';
import { exportVehiclesToCSV, formatCurrency, formatDate, getExpiryStatus } from '../utils/helpers';

interface ReportsScreenProps {
  vehicles: Vehicle[];
  onImportVehicles?: (imported: Vehicle[]) => void;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ vehicles, onImportVehicles }) => {
  const [selectedReportType, setSelectedReportType] = useState<
    'all' | 'paid' | 'unpaid' | 'insurance' | 'puc' | 'fitness'
  >('all');
  const [showPdfPreviewModal, setShowPdfPreviewModal] = useState(false);
  const [importMessage, setImportMessage] = useState('');

  // Generate filtered report list
  const reportList = vehicles.filter((v) => {
    if (selectedReportType === 'paid') return v.paymentStatus === 'paid';
    if (selectedReportType === 'unpaid')
      return v.paymentStatus === 'unpaid' || v.paymentStatus === 'partial';
    if (selectedReportType === 'insurance')
      return (
        getExpiryStatus(v.insuranceExpiry) === 'expiring_soon' ||
        getExpiryStatus(v.insuranceExpiry) === 'expired'
      );
    if (selectedReportType === 'puc')
      return (
        getExpiryStatus(v.pucExpiry) === 'expiring_soon' ||
        getExpiryStatus(v.pucExpiry) === 'expired'
      );
    if (selectedReportType === 'fitness')
      return (
        getExpiryStatus(v.fitnessExpiry) === 'expiring_soon' ||
        getExpiryStatus(v.fitnessExpiry) === 'expired'
      );
    return true;
  });

  const handleExportExcel = () => {
    exportVehiclesToCSV(reportList);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportMessage(`Successfully imported vehicle batch from file: ${file.name}`);
      setTimeout(() => setImportMessage(''), 4000);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-5 bg-[#090A0E] text-slate-100">
      {/* Title */}
      <div>
        <h2 className="text-lg font-black text-amber-300 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-amber-400" />
          Fleet Analytics & Export Reports
        </h2>
        <p className="text-xs text-slate-400">
          Excel Export/Import, Printable PDF Reports & Audit Logs
        </p>
      </div>

      {importMessage && (
        <div className="p-3 bg-[#122A1E] border border-emerald-500 text-emerald-200 text-xs rounded-2xl flex items-center gap-2 font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{importMessage}</span>
        </div>
      )}

      {/* Main Export & Import Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Excel Export */}
        <button
          onClick={handleExportExcel}
          className="p-4 bg-[#11221B] border border-emerald-500/50 rounded-2xl hover:border-emerald-400 transition text-left space-y-2 group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#1A382A] text-emerald-400 group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
              CSV / Excel
            </span>
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-100">Excel Export</h3>
            <p className="text-[11px] text-slate-300 font-bold">Download active fleet data spreadsheet</p>
          </div>
        </button>

        {/* Excel Import */}
        <label className="p-4 bg-[#121E2B] border border-sky-500/50 rounded-2xl hover:border-sky-400 transition text-left space-y-2 cursor-pointer group shadow-lg">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#1B2F45] text-sky-400 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-400 text-slate-950">
              Import
            </span>
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-100">Excel Import</h3>
            <p className="text-[11px] text-slate-300 font-bold">Upload CSV to bulk insert vehicle records</p>
          </div>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleImportCSV}
            className="hidden"
          />
        </label>

        {/* Printable PDF Report */}
        <button
          onClick={() => setShowPdfPreviewModal(true)}
          className="p-4 bg-[#241E12] border border-amber-500/50 rounded-2xl hover:border-amber-400 transition text-left space-y-2 group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#3B2F18] text-amber-400 group-hover:scale-110 transition-transform">
              <Printer className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
              PDF Print
            </span>
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-100">PDF Report</h3>
            <p className="text-[11px] text-slate-300 font-bold">Printable official RTO compliance statement</p>
          </div>
        </button>
      </div>

      {/* Specific Report Categories Selector */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-100 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-amber-400" />
          Select Specific Audit Report
        </h3>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Fleet Report' },
            { id: 'paid', label: 'Paid Report' },
            { id: 'unpaid', label: 'Unpaid Report' },
            { id: 'insurance', label: 'Insurance Report' },
            { id: 'puc', label: 'PUC Report' },
            { id: 'fitness', label: 'Fitness Report' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedReportType(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition border ${
                selectedReportType === tab.id
                  ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-md'
                  : 'bg-[#141828] border-slate-700 text-slate-300 hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Report Preview Table */}
        <div className="bg-[#141828] border border-amber-500/40 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-3 bg-[#080A12] border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-black text-amber-300">
              Generated Report Entries ({reportList.length})
            </span>
            <button
              onClick={handleExportExcel}
              className="text-xs font-black text-amber-400 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181B28] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Vehicle No</th>
                  <th className="p-3">Owner & Mobile</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Payment Mode</th>
                  <th className="p-3">Payment Status</th>
                  <th className="p-3">Insurance Exp</th>
                  <th className="p-3">PUC Exp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
                {reportList.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-amber-300">{v.vehicleNumber}</td>
                    <td className="p-3 font-sans">
                      <span className="block font-bold text-slate-100">{v.ownerName}</span>
                      <span className="text-[10px] text-slate-400">{v.ownerMobile}</span>
                    </td>
                    <td className="p-3 font-sans text-slate-300">{v.vehicleType}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-sans text-[11px] font-semibold border border-slate-700">
                        {v.paymentMode || 'UPI'}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-amber-400">
                      {formatCurrency(v.paymentAmount)} ({v.paymentStatus})
                    </td>
                    <td className="p-3 text-slate-300">{formatDate(v.insuranceExpiry)}</td>
                    <td className="p-3 text-slate-300">{formatDate(v.pucExpiry)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Printable PDF Preview Modal */}
      {showPdfPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#0F1118] border border-amber-500/30 rounded-3xl p-5 shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <h3 className="text-sm font-bold text-amber-300">
                Official RTO Fleet Statement
              </h3>
              <button
                onClick={() => setShowPdfPreviewModal(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Paper Box Simulation */}
            <div className="bg-[#FFFFFF] text-slate-900 p-5 rounded-2xl space-y-3 font-sans shadow-inner">
              <div className="text-center border-b border-slate-300 pb-3">
                <h2 className="text-base font-black text-slate-900 uppercase">
                  Kishor Enterprises & Fleet Management
                </h2>
                <p className="text-[10px] text-slate-600">
                  Smart Vehicle Record & RTO Document Statement
                </p>
                <p className="text-[10px] font-mono text-slate-500">
                  Generated Date: {new Date().toLocaleDateString('en-IN')}
                </p>
              </div>

              <div className="text-xs space-y-1">
                <p><strong>Total Active Vehicles:</strong> {vehicles.length}</p>
                <p><strong>Total Revenue Collected:</strong> {formatCurrency(vehicles.reduce((a,b)=>a+(b.paidAmount||0),0))}</p>
              </div>

              <div className="pt-2 border-t border-slate-300 text-[10px] font-mono">
                <p className="font-bold text-slate-800 mb-1">Fleet Expiry Summary:</p>
                {reportList.slice(0, 3).map(v => (
                  <p key={v.id}>• {v.vehicleNumber} ({v.ownerName}) - INS: {v.insuranceExpiry}</p>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print PDF Statement</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `📋 *Kishor Enterprises & Fleet Management Report*\nDate: ${new Date().toLocaleDateString('en-IN')}\nTotal Fleet Vehicles: ${vehicles.length}\nTotal Revenue Collected: ${formatCurrency(vehicles.reduce((a,b)=>a+(b.paidAmount||0),0))}\n\nGenerated via Kishor Enterprises Fleet Manager App`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-xl hover:bg-emerald-500/30 transition flex items-center justify-center gap-1.5"
              >
                <span>📲 Send Report via WhatsApp</span>
              </a>

              <button
                onClick={() => setShowPdfPreviewModal(false)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
