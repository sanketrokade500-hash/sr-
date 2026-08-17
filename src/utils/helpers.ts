import { ExpiryStatus, PaymentStatus, Vehicle } from '../types';

// Helper to determine status based on expiry date compared to today
export function getExpiryStatus(expiryDateStr: string): ExpiryStatus {
  if (!expiryDateStr) return 'pending';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDateStr);
  exp.setHours(0, 0, 0, 0);

  const diffTime = exp.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'expired';
  } else if (diffDays <= 15) {
    return 'expiring_soon';
  } else {
    return 'valid';
  }
}

export function getDaysRemaining(expiryDateStr: string): number {
  if (!expiryDateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDateStr);
  exp.setHours(0, 0, 0, 0);
  const diffTime = exp.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Color coding according to specifications:
// Green = Valid
// Yellow = Expiring Soon
// Red = Expired
// Blue = Paid
// Grey = Pending
export function getStatusBadgeConfig(status: ExpiryStatus | PaymentStatus) {
  switch (status) {
    case 'valid':
      return {
        bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
        dot: 'bg-emerald-400',
        text: 'Valid',
        colorHex: '#10B981'
      };
    case 'expiring_soon':
      return {
        bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
        dot: 'bg-amber-400',
        text: 'Expiring Soon',
        colorHex: '#F59E0B'
      };
    case 'expired':
      return {
        bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
        dot: 'bg-rose-500',
        text: 'Expired',
        colorHex: '#EF4444'
      };
    case 'paid':
      return {
        bg: 'bg-blue-600/20 border-blue-500 text-blue-400 font-extrabold',
        dot: 'bg-blue-500',
        text: 'PAID',
        colorHex: '#3B82F6'
      };
    case 'unpaid':
      return {
        bg: 'bg-slate-500/20 border-slate-500 text-slate-300 font-extrabold',
        dot: 'bg-slate-400',
        text: 'PENDING',
        colorHex: '#94A3B8'
      };
    case 'partial':
      return {
        bg: 'bg-orange-500/20 border-orange-500 text-orange-400 font-extrabold',
        dot: 'bg-orange-500',
        text: 'PARTIAL',
        colorHex: '#F97316'
      };
    case 'pending':
    default:
      return {
        bg: 'bg-slate-500/20 border-slate-500 text-slate-300 font-extrabold',
        dot: 'bg-slate-400',
        text: 'PENDING',
        colorHex: '#94A3B8'
      };
  }
}

// Generate pre-formatted WhatsApp message link
export function generateWhatsAppLink(
  phone: string,
  ownerName: string,
  vehicleNumber: string,
  docType: string,
  expiryDate: string,
  daysLeft: number
): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  
  let msg = `*KISHORE DRIVING SCHOOL & VEHICLE MANAGEMENT*\n\n`;
  msg += `Dear *${ownerName}*,\n`;
  msg += `This is an official automated reminder regarding your vehicle *${vehicleNumber}*.\n\n`;
  
  if (daysLeft < 0) {
    msg += `🚨 *URGENT*: Your *${docType.toUpperCase()}* EXPIRED on *${expiryDate}* (${Math.abs(daysLeft)} days ago).\n`;
    msg += `Please renew immediately to prevent heavy transport penalties and RTO fines.\n`;
  } else if (daysLeft === 0) {
    msg += `⚠️ *ATTENTION*: Your *${docType.toUpperCase()}* EXPIRES TODAY (*${expiryDate}*).\n`;
    msg += `Kindly process the renewal at the earliest.\n`;
  } else {
    msg += `⏰ *REMINDER*: Your *${docType.toUpperCase()}* will expire in *${daysLeft} days* (Expiry Date: *${expiryDate}*).\n`;
    msg += `Please prepare necessary documents for hassle-free renewal.\n`;
  }

  msg += `\nFor assistance, contact Kishor Enterprises Admin:\n📞 +91 98765 43210 / +91 94220 12345`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
}

// Format Currency INR
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format Date nicely
export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

// Export Vehicles to CSV
export function exportVehiclesToCSV(vehicles: Vehicle[]) {
  const headers = [
    'Vehicle Number',
    'Vehicle Type',
    'Vehicle Model',
    'Owner Name',
    'Owner Mobile',
    'Driver Name',
    'Driver Mobile',
    'Payment Amount',
    'Paid Amount',
    'Payment Status',
    'Payment Mode',
    'Insurance Expiry',
    'PUC Expiry',
    'Fitness Expiry',
    'Permit Expiry',
    'Tax Expiry',
    'RC Number',
    'Engine Number',
    'Chassis Number'
  ];

  const rows = vehicles.map(v => [
    `"${v.vehicleNumber}"`,
    `"${v.vehicleType}"`,
    `"${v.vehicleModel}"`,
    `"${v.ownerName}"`,
    `"${v.ownerMobile}"`,
    `"${v.driverName}"`,
    `"${v.driverMobile}"`,
    v.paymentAmount,
    v.paidAmount,
    `"${v.paymentStatus}"`,
    `"${v.paymentMode || 'UPI'}"`,
    `"${v.insuranceExpiry}"`,
    `"${v.pucExpiry}"`,
    `"${v.fitnessExpiry}"`,
    `"${v.permitExpiry}"`,
    `"${v.taxExpiry}"`,
    `"${v.rcNumber}"`,
    `"${v.engineNumber}"`,
    `"${v.chassisNumber}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Kishor_Enterprises_Fleet_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
