import React, { useState, useEffect } from 'react';
import {
  Save,
  Truck,
  UploadCloud,
  FileText,
  CheckCircle2,
  Calendar,
  AlertCircle,
  X,
  FileCheck,
  Shield,
  Coins
} from 'lucide-react';
import { Vehicle, PaymentStatus } from '../types';
import { CustomDropdown } from '../components/CustomDropdown';

interface AddVehicleScreenProps {
  onSaveVehicle: (vehicleData: Partial<Vehicle>) => void;
  editingVehicle?: Vehicle | null;
  onCancel?: () => void;
}

export const AddVehicleScreen: React.FC<AddVehicleScreenProps> = ({
  onSaveVehicle,
  editingVehicle,
  onCancel,
}) => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<Vehicle['vehicleType']>('Heavy Truck');
  const [vehicleModel, setVehicleModel] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerMobile, setOwnerMobile] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverMobile, setDriverMobile] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number | ''>(25000);
  const [paidAmount, setPaidAmount] = useState<number | ''>(25000);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('paid');
  const [paymentMode, setPaymentMode] = useState<string>('UPI');
  const [customPaymentMode, setCustomPaymentMode] = useState<string>('');
  
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');
  const [pucNumber, setPucNumber] = useState('');
  const [pucExpiry, setPucExpiry] = useState('');
  const [fitnessNumber, setFitnessNumber] = useState('');
  const [fitnessExpiry, setFitnessExpiry] = useState('');
  const [permitNumber, setPermitNumber] = useState('');
  const [permitExpiry, setPermitExpiry] = useState('');
  const [taxExpiry, setTaxExpiry] = useState('');
  
  const [rcNumber, setRcNumber] = useState('');
  const [engineNumber, setEngineNumber] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Uploaded File Previews
  const [vehiclePhoto, setVehiclePhoto] = useState<string | undefined>('');
  const [rcPhoto, setRcPhoto] = useState<string | undefined>('');
  const [insurancePdf, setInsurancePdf] = useState<string | undefined>('');
  const [pucPdf, setPucPdf] = useState<string | undefined>('');
  const [fitnessPdf, setFitnessPdf] = useState<string | undefined>('');

  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const standardPaymentModes = ['UPI', 'Cash', 'NEFT', 'Cheque'];

  useEffect(() => {
    if (editingVehicle) {
      setVehicleNumber(editingVehicle.vehicleNumber);
      setVehicleType(editingVehicle.vehicleType);
      setVehicleModel(editingVehicle.vehicleModel);
      setOwnerName(editingVehicle.ownerName);
      setOwnerMobile(editingVehicle.ownerMobile);
      setDriverName(editingVehicle.driverName);
      setDriverMobile(editingVehicle.driverMobile);
      setRegistrationDate(editingVehicle.registrationDate || '');
      setPaymentAmount(editingVehicle.paymentAmount);
      setPaidAmount(editingVehicle.paidAmount ?? (editingVehicle.paymentStatus === 'paid' ? editingVehicle.paymentAmount : 0));
      setPaymentStatus(editingVehicle.paymentStatus);
      
      const mode = editingVehicle.paymentMode || 'UPI';
      if (standardPaymentModes.includes(mode)) {
        setPaymentMode(mode);
        setCustomPaymentMode('');
      } else {
        setPaymentMode('Other');
        setCustomPaymentMode(mode);
      }

      setInsuranceNumber(editingVehicle.insuranceNumber || '');
      setInsuranceExpiry(editingVehicle.insuranceExpiry);
      setPucNumber(editingVehicle.pucNumber || '');
      setPucExpiry(editingVehicle.pucExpiry);
      setFitnessNumber(editingVehicle.fitnessNumber || '');
      setFitnessExpiry(editingVehicle.fitnessExpiry);
      setPermitNumber(editingVehicle.permitNumber || '');
      setPermitExpiry(editingVehicle.permitExpiry);
      setTaxExpiry(editingVehicle.taxExpiry);
      setRcNumber(editingVehicle.rcNumber);
      setEngineNumber(editingVehicle.engineNumber);
      setChassisNumber(editingVehicle.chassisNumber);
      setNotes(editingVehicle.notes || '');
      setVehiclePhoto(editingVehicle.vehiclePhoto);
    } else {
      // Default future expiry dates for easy input
      const today = new Date();
      setRegistrationDate(today.toISOString().split('T')[0]);
      const in6Months = new Date(today.setMonth(today.getMonth() + 6)).toISOString().split('T')[0];
      setInsuranceExpiry(in6Months);
      setPucExpiry(in6Months);
      setFitnessExpiry(in6Months);
      setPermitExpiry(in6Months);
      setTaxExpiry(in6Months);
      setPaymentMode('UPI');
      setCustomPaymentMode('');
    }
  }, [editingVehicle]);

  // Automatically recalculate paymentStatus when paymentAmount or paidAmount changes
  const handleAmountChange = (totalVal: number | '', paidVal: number | '') => {
    const total = Number(totalVal) || 0;
    const paid = Number(paidVal) || 0;

    if (paid >= total && total > 0) {
      setPaymentStatus('paid');
    } else if (paid > 0 && paid < total) {
      setPaymentStatus('partial');
    } else {
      setPaymentStatus('unpaid');
    }
  };

  // Mock File Upload Simulator
  const handleSimulatedFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    defaultType: 'image' | 'pdf'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (defaultType === 'image') {
        const url = URL.createObjectURL(file);
        setter(url);
      } else {
        setter(file.name);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!vehicleNumber.trim()) {
      setFormError('Please enter Vehicle Number (e.g., MH 12 AB 1234).');
      return;
    }
    if (!ownerName.trim()) {
      setFormError('Please enter Owner Name.');
      return;
    }
    if (!ownerMobile.trim()) {
      setFormError('Please enter Owner Mobile Number.');
      return;
    }

    const finalPaymentMode = paymentMode === 'Other' ? (customPaymentMode.trim() || 'Other') : paymentMode;
    const totalFee = Number(paymentAmount) || 0;
    const paidFee = Math.max(0, Math.min(totalFee, Number(paidAmount) || 0));

    const payload: Partial<Vehicle> = {
      vehicleNumber: vehicleNumber.toUpperCase().trim(),
      vehicleType,
      vehicleModel: vehicleModel || 'Tata Truck',
      ownerName: ownerName.trim(),
      ownerMobile: ownerMobile.trim(),
      driverName: driverName.trim() || 'N/A',
      driverMobile: driverMobile.trim() || ownerMobile.trim(),
      registrationDate,
      paymentAmount: totalFee,
      paidAmount: paymentStatus === 'paid' ? totalFee : (paymentStatus === 'unpaid' ? 0 : paidFee),
      paymentStatus,
      paymentMode: finalPaymentMode,
      insuranceNumber,
      insuranceExpiry,
      pucNumber,
      pucExpiry,
      fitnessNumber,
      fitnessExpiry,
      permitNumber,
      permitExpiry,
      taxExpiry,
      rcNumber,
      engineNumber,
      chassisNumber,
      notes,
      vehiclePhoto: vehiclePhoto || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
      rcPhoto,
      insurancePdf,
      pucPdf,
      fitnessPdf,
    };

    onSaveVehicle(payload);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      if (onCancel) onCancel();
    }, 1200);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 bg-[#090A0E] text-slate-100">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div>
          <h2 className="text-lg font-extrabold text-amber-300 flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            {editingVehicle ? 'Edit Vehicle Record' : 'Add New Fleet Vehicle'}
          </h2>
          <p className="text-xs text-slate-400">
            Kishor Enterprises Vehicle & RTO Document Entry Form
          </p>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {formError && (
        <div className="p-3 bg-[#2E1417] border border-rose-500 text-rose-200 text-xs rounded-2xl flex items-center gap-2 font-bold">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {formSuccess && (
        <div className="p-4 bg-[#122A1E] border border-emerald-500 text-emerald-200 text-sm font-bold rounded-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Vehicle details successfully saved to fleet database!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: Vehicle & Owner Basics */}
        <div className="bg-[#141828] border border-amber-500/40 rounded-3xl p-4 space-y-4 shadow-lg">
          <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Truck className="w-4 h-4 text-amber-400" />
            1. Vehicle & Owner Identification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-200 mb-1 block">
                Vehicle Number *
              </label>
              <input
                type="text"
                required
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="e.g. MH 12 AB 1234"
                className="w-full bg-[#181C2B] border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 mb-1 block">
                Vehicle Type
              </label>
              <CustomDropdown
                value={vehicleType}
                onChange={(val) => setVehicleType(val as any)}
                options={[
                  { value: 'Heavy Truck', label: 'Heavy Truck / Goods Carrier' },
                  { value: 'Bus', label: 'Passenger Bus / Staff Bus' },
                  { value: 'Training Car', label: 'Driving School Training Car' },
                  { value: 'Trailer / Container', label: 'Trailer / Container Multi-Axle' },
                  { value: 'Tipper / Dumper', label: 'Tipper / Dumper' },
                  { value: 'Light Commercial', label: 'Light Commercial Vehicle (LCV)' },
                ]}
                placeholder="Select vehicle type"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Vehicle Model
              </label>
              <input
                type="text"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="e.g. Tata Prima 3525.K / Swift Dual-Control"
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Owner Name *
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Owner Full Name"
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Owner Mobile *
              </label>
              <input
                type="tel"
                required
                value={ownerMobile}
                onChange={(e) => setOwnerMobile(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Driver Name
              </label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Assigned Driver Name"
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Driver Mobile
              </label>
              <input
                type="tel"
                value={driverMobile}
                onChange={(e) => setDriverMobile(e.target.value)}
                placeholder="Driver Phone Number"
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Registration Date
              </label>
              <input
                type="date"
                value={registrationDate}
                onChange={(e) => setRegistrationDate(e.target.value)}
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Fee & Payment Details */}
        <div className="bg-[#121522] border border-amber-500/20 rounded-3xl p-4 space-y-4">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Coins className="w-4 h-4" />
            2. Payment & Service Charges
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Total Fee Amount (₹)
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : '';
                  setPaymentAmount(val);
                  if (paymentStatus === 'paid') {
                    setPaidAmount(val);
                  }
                  handleAmountChange(val, paidAmount);
                }}
                placeholder="e.g. 25000"
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-sm text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Paid Amount (₹)
              </label>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : '';
                  setPaidAmount(val);
                  handleAmountChange(paymentAmount, val);
                }}
                placeholder="e.g. 25000"
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-sm text-emerald-300 font-mono font-bold focus:outline-none focus:border-amber-400"
              />
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                Remaining: ₹{Math.max(0, (Number(paymentAmount) || 0) - (Number(paidAmount) || 0)).toLocaleString('en-IN')}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Payment Status
              </label>
              <CustomDropdown
                value={paymentStatus}
                onChange={(val) => {
                  const st = val as PaymentStatus;
                  setPaymentStatus(st);
                  if (st === 'paid') {
                    setPaidAmount(paymentAmount);
                  } else if (st === 'unpaid') {
                    setPaidAmount(0);
                  }
                }}
                options={[
                  { value: 'paid', label: 'Paid (Full Clearance)', badge: 'Blue' },
                  { value: 'unpaid', label: 'Unpaid (Pending Fee)', badge: 'Grey' },
                  { value: 'partial', label: 'Partial Payment', badge: 'Orange' },
                ]}
                placeholder="Select payment status"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Payment Mode
              </label>
              <CustomDropdown
                value={paymentMode}
                onChange={(val) => setPaymentMode(val)}
                allowOther={true}
                otherValue={customPaymentMode}
                onOtherChange={setCustomPaymentMode}
                otherPlaceholder="Enter Payment Mode (e.g., NetBanking / DD)"
                options={[
                  { value: 'UPI', label: 'UPI / GPay / PhonePe' },
                  { value: 'Cash', label: 'Cash' },
                  { value: 'NEFT', label: 'NEFT / RTGS Bank Transfer' },
                  { value: 'Cheque', label: 'Cheque' },
                  { value: 'Other', label: 'Other (Custom Mode)' },
                ]}
                placeholder="Select payment mode"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Document Numbers & Expiry Dates */}
        <div className="bg-[#121522] border border-amber-500/20 rounded-3xl p-4 space-y-4">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Calendar className="w-4 h-4" />
            3. RTO Document Numbers & Expiry Dates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-[#181C2B] rounded-2xl space-y-2 border border-slate-800">
              <span className="text-xs font-black text-amber-300 block">Motor Insurance Policy</span>
              <input
                type="text"
                value={insuranceNumber}
                onChange={(e) => setInsuranceNumber(e.target.value)}
                placeholder="Insurance Policy No. (e.g. POL-998811)"
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3 py-2 text-xs font-mono text-slate-100"
              />
              <label className="text-[11px] font-semibold text-slate-400 block">Insurance Expiry Date</label>
              <input
                type="date"
                value={insuranceExpiry}
                onChange={(e) => setInsuranceExpiry(e.target.value)}
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-slate-100"
              />
            </div>

            <div className="p-3 bg-[#181C2B] rounded-2xl space-y-2 border border-slate-800">
              <span className="text-xs font-black text-yellow-300 block">PUC Pollution Certificate</span>
              <input
                type="text"
                value={pucNumber}
                onChange={(e) => setPucNumber(e.target.value)}
                placeholder="PUC Certificate No. (e.g. PUC-443322)"
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3 py-2 text-xs font-mono text-slate-100"
              />
              <label className="text-[11px] font-semibold text-slate-400 block">PUC Expiry Date</label>
              <input
                type="date"
                value={pucExpiry}
                onChange={(e) => setPucExpiry(e.target.value)}
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-slate-100"
              />
            </div>

            <div className="p-3 bg-[#181C2B] rounded-2xl space-y-2 border border-slate-800">
              <span className="text-xs font-black text-purple-300 block">RTO Fitness Certificate</span>
              <input
                type="text"
                value={fitnessNumber}
                onChange={(e) => setFitnessNumber(e.target.value)}
                placeholder="Fitness Cert No. (e.g. FIT-887766)"
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3 py-2 text-xs font-mono text-slate-100"
              />
              <label className="text-[11px] font-semibold text-slate-400 block">Fitness Expiry Date</label>
              <input
                type="date"
                value={fitnessExpiry}
                onChange={(e) => setFitnessExpiry(e.target.value)}
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-slate-100"
              />
            </div>

            <div className="p-3 bg-[#181C2B] rounded-2xl space-y-2 border border-slate-800">
              <span className="text-xs font-black text-emerald-300 block">National / State Transport Permit</span>
              <input
                type="text"
                value={permitNumber}
                onChange={(e) => setPermitNumber(e.target.value)}
                placeholder="Permit No. (e.g. PERM-112233)"
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3 py-2 text-xs font-mono text-slate-100"
              />
              <label className="text-[11px] font-semibold text-slate-400 block">Permit Expiry Date</label>
              <input
                type="date"
                value={permitExpiry}
                onChange={(e) => setPermitExpiry(e.target.value)}
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-slate-100"
              />
            </div>

            <div className="p-3 bg-[#181C2B] rounded-2xl space-y-2 border border-slate-800">
              <span className="text-xs font-black text-cyan-300 block">Road Tax Payment</span>
              <label className="text-[11px] font-semibold text-slate-400 block">Road Tax Expiry Date</label>
              <input
                type="date"
                value={taxExpiry}
                onChange={(e) => setTaxExpiry(e.target.value)}
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Section 4: RC, Engine, Chassis & Notes */}
        <div className="bg-[#121522] border border-amber-500/20 rounded-3xl p-4 space-y-4">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <FileText className="w-4 h-4" />
            4. Chassis & Registration Numbers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                RC Number
              </label>
              <input
                type="text"
                value={rcNumber}
                onChange={(e) => setRcNumber(e.target.value)}
                placeholder="RC Registration Number"
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Engine Number
              </label>
              <input
                type="text"
                value={engineNumber}
                onChange={(e) => setEngineNumber(e.target.value)}
                placeholder="Engine Number"
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Chassis Number
              </label>
              <input
                type="text"
                value={chassisNumber}
                onChange={(e) => setChassisNumber(e.target.value)}
                placeholder="Chassis Number"
                className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              Notes & Special Instructions
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter special maintenance, training batch, or payment remarks..."
              className="w-full bg-[#1A1E2D] border border-amber-500/20 rounded-xl p-3 text-sm text-slate-100"
            />
          </div>
        </div>

        {/* Section 5: Document & Media Upload Area */}
        <div className="bg-[#121522] border border-amber-500/20 rounded-3xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <UploadCloud className="w-4 h-4" />
            5. Document Attachments & Uploads
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
            {/* Vehicle Photo Upload */}
            <label className="p-3 bg-[#1A1E2D] border border-dashed border-amber-500/30 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400 transition">
              <UploadCloud className="w-5 h-5 text-amber-400 mb-1" />
              <span className="font-bold text-slate-200">Vehicle Photo</span>
              <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                {vehiclePhoto ? 'Uploaded' : 'Browse Photo'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleSimulatedFileUpload(e, setVehiclePhoto, 'image')}
              />
            </label>

            {/* RC Photo */}
            <label className="p-3 bg-[#1A1E2D] border border-dashed border-amber-500/30 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400 transition">
              <FileCheck className="w-5 h-5 text-amber-400 mb-1" />
              <span className="font-bold text-slate-200">RC Photo</span>
              <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                {rcPhoto ? 'Attached' : 'Upload Image'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleSimulatedFileUpload(e, setRcPhoto, 'image')}
              />
            </label>

            {/* Insurance PDF */}
            <label className="p-3 bg-[#1A1E2D] border border-dashed border-amber-500/30 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400 transition">
              <Shield className="w-5 h-5 text-amber-400 mb-1" />
              <span className="font-bold text-slate-200">Insurance PDF</span>
              <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                {insurancePdf ? insurancePdf : 'Upload PDF'}
              </span>
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => handleSimulatedFileUpload(e, setInsurancePdf, 'pdf')}
              />
            </label>

            {/* PUC PDF */}
            <label className="p-3 bg-[#1A1E2D] border border-dashed border-amber-500/30 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400 transition">
              <FileText className="w-5 h-5 text-amber-400 mb-1" />
              <span className="font-bold text-slate-200">PUC PDF</span>
              <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                {pucPdf ? pucPdf : 'Upload PDF'}
              </span>
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => handleSimulatedFileUpload(e, setPucPdf, 'pdf')}
              />
            </label>

            {/* Fitness PDF */}
            <label className="p-3 bg-[#1A1E2D] border border-dashed border-amber-500/30 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400 transition">
              <FileText className="w-5 h-5 text-amber-400 mb-1" />
              <span className="font-bold text-slate-200">Fitness PDF</span>
              <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                {fitnessPdf ? fitnessPdf : 'Upload PDF'}
              </span>
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => handleSimulatedFileUpload(e, setFitnessPdf, 'pdf')}
              />
            </label>
          </div>
        </div>

        {/* Submit Save Button */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.4)] text-sm uppercase tracking-wider transition flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          <span>Save Vehicle & Documents</span>
        </button>
      </form>
    </div>
  );
};
