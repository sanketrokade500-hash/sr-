import React, { useState } from 'react';
import {
  FileText,
  Shield,
  FileCheck,
  Wrench,
  FileSpreadsheet,
  Coins,
  Download,
  Upload,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  X
} from 'lucide-react';
import { Vehicle, DocumentType } from '../types';
import { formatDate, getExpiryStatus, getStatusBadgeConfig } from '../utils/helpers';

interface DocumentsScreenProps {
  vehicles: Vehicle[];
  selectedCategoryFilter?: string;
}

export const DocumentsScreen: React.FC<DocumentsScreenProps> = ({
  vehicles,
  selectedCategoryFilter = 'all',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | DocumentType | 'expired'
  >((selectedCategoryFilter as any) || 'all');

  React.useEffect(() => {
    if (selectedCategoryFilter) {
      setSelectedCategory((selectedCategoryFilter as any) || 'all');
    }
  }, [selectedCategoryFilter]);
  const [docSearch, setDocSearch] = useState('');
  const [previewDocModal, setPreviewDocModal] = useState<{
    title: string;
    vehicleNo: string;
    owner: string;
    type: string;
    expiry: string;
    status: string;
  } | null>(null);

  // Extract all document items across vehicles
  const allDocs = vehicles.flatMap((v) => {
    return [
      {
        id: `${v.id}-ins`,
        vehicleId: v.id,
        vehicleNumber: v.vehicleNumber,
        ownerName: v.ownerName,
        type: 'insurance' as DocumentType,
        title: 'Motor Vehicle Insurance Policy',
        expiryDate: v.insuranceExpiry,
        status: getExpiryStatus(v.insuranceExpiry),
        fileUrl: v.insurancePdf,
      },
      {
        id: `${v.id}-puc`,
        vehicleId: v.id,
        vehicleNumber: v.vehicleNumber,
        ownerName: v.ownerName,
        type: 'puc' as DocumentType,
        title: 'PUC Pollution Certificate',
        expiryDate: v.pucExpiry,
        status: getExpiryStatus(v.pucExpiry),
        fileUrl: v.pucPdf,
      },
      {
        id: `${v.id}-fit`,
        vehicleId: v.id,
        vehicleNumber: v.vehicleNumber,
        ownerName: v.ownerName,
        type: 'fitness' as DocumentType,
        title: 'RTO Vehicle Fitness Certificate',
        expiryDate: v.fitnessExpiry,
        status: getExpiryStatus(v.fitnessExpiry),
        fileUrl: v.fitnessPdf,
      },
      {
        id: `${v.id}-perm`,
        vehicleId: v.id,
        vehicleNumber: v.vehicleNumber,
        ownerName: v.ownerName,
        type: 'permit' as DocumentType,
        title: 'Goods / Passenger Transport Permit',
        expiryDate: v.permitExpiry,
        status: getExpiryStatus(v.permitExpiry),
      },
      {
        id: `${v.id}-tax`,
        vehicleId: v.id,
        vehicleNumber: v.vehicleNumber,
        ownerName: v.ownerName,
        type: 'tax' as DocumentType,
        title: 'Road Tax Receipt',
        expiryDate: v.taxExpiry,
        status: getExpiryStatus(v.taxExpiry),
      },
    ];
  });

  const filteredDocs = allDocs.filter((doc) => {
    // Category filter
    let matchesCat = true;
    if (selectedCategory === 'expired') {
      matchesCat = doc.status === 'expired';
    } else if (selectedCategory !== 'all') {
      matchesCat = doc.type === selectedCategory;
    }

    // Search filter
    const searchLower = docSearch.toLowerCase();
    const matchesSearch =
      doc.vehicleNumber.toLowerCase().includes(searchLower) ||
      doc.ownerName.toLowerCase().includes(searchLower) ||
      doc.title.toLowerCase().includes(searchLower);

    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-4 bg-[#090A0E] text-slate-100">
      {/* Title */}
      <div>
        <h2 className="text-lg font-black text-amber-300 flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" />
          RTO Documents & Certificates Vault
        </h2>
        <p className="text-xs text-slate-400">
          Digital repository for Insurance, PUC, Fitness, Permits & Tax Certificates
        </p>
      </div>

      {/* Fast Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={docSearch}
          onChange={(e) => setDocSearch(e.target.value)}
          placeholder="Search Document Vault by Vehicle No, Owner..."
          className="w-full bg-[#141828] border border-amber-500/40 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 shadow-md"
        />
      </div>

      {/* Categories Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Vault' },
          { id: 'insurance', label: 'Insurance' },
          { id: 'puc', label: 'PUC' },
          { id: 'fitness', label: 'Fitness' },
          { id: 'permit', label: 'Permit' },
          { id: 'tax', label: 'Road Tax' },
          { id: 'expired', label: 'Expired Documents' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition border ${
              selectedCategory === tab.id
                ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-md'
                : 'bg-[#141828] border-slate-700 text-slate-300 hover:text-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Document Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredDocs.map((doc) => {
          const stConfig = getStatusBadgeConfig(doc.status);

          return (
            <div
              key={doc.id}
              className="bg-[#141828] border border-amber-500/40 rounded-2xl p-3.5 shadow-md hover:border-amber-400 transition flex flex-col justify-between space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-300 font-mono">
                      {doc.vehicleNumber}
                    </span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${stConfig.bg}`}>
                      {stConfig.text}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 mt-1">{doc.title}</h4>
                  <p className="text-[11px] text-slate-300 font-semibold">Owner: {doc.ownerName}</p>
                </div>

                <div className="p-2 rounded-xl bg-[#241E12] border border-amber-500/40 text-amber-400">
                  <FileText className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[11px]">
                <span className="font-mono text-slate-200 font-bold">
                  Expiry: {formatDate(doc.expiryDate)}
                </span>

                <button
                  onClick={() =>
                    setPreviewDocModal({
                      title: doc.title,
                      vehicleNo: doc.vehicleNumber,
                      owner: doc.ownerName,
                      type: doc.type.toUpperCase(),
                      expiry: formatDate(doc.expiryDate),
                      status: stConfig.text,
                    })
                  }
                  className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black hover:bg-amber-300 transition flex items-center gap-1 shadow-sm"
                >
                  <Eye className="w-3 h-3 text-slate-950" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Document Modal */}
      {previewDocModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#10131E] border border-amber-500/50 rounded-3xl p-5 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
              <h3 className="text-sm font-black text-amber-300">
                RTO Certificate Document
              </h3>
              <button
                onClick={() => setPreviewDocModal(null)}
                className="p-1.5 rounded-full bg-[#1C2030] text-slate-200 hover:bg-[#252A3F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Document Certificate Box */}
            <div className="bg-[#1A1D2B] border-2 border-dashed border-amber-500/40 rounded-2xl p-4 text-center space-y-2">
              <Shield className="w-10 h-10 text-amber-400 mx-auto" />
              <h4 className="text-sm font-black text-amber-200">{previewDocModal.title}</h4>
              <p className="text-xs font-mono text-slate-300">
                Vehicle Registration No: <strong className="text-amber-300">{previewDocModal.vehicleNo}</strong>
              </p>
              <p className="text-xs text-slate-400">Registered Owner: {previewDocModal.owner}</p>
              <div className="pt-2 border-t border-slate-700">
                <span className="text-xs text-amber-400 font-bold block">
                  Status: {previewDocModal.status} (Expiry: {previewDocModal.expiry})
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  alert(`Downloading official PDF for ${previewDocModal.vehicleNo}...`);
                }}
                className="flex-1 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition flex items-center justify-center gap-1"
              >
                <Download className="w-4 h-4" />
                <span>Download Copy</span>
              </button>
              <button
                onClick={() => setPreviewDocModal(null)}
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
