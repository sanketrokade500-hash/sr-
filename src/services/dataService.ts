import { Vehicle, PaymentStatus, DocumentType, ExpiryStatus, AppNotification, AdminProfile, PaymentRecord } from '../types';
import { INITIAL_VEHICLES, INITIAL_PAYMENTS } from '../data/initialData';
import { getDaysRemaining, getExpiryStatus } from '../utils/helpers';

export const VEHICLES_STORAGE_KEY = 'kds_vehicles_v1';
export const PAYMENTS_STORAGE_KEY = 'kds_payments_v1';
export const DISMISSED_NOTIFS_KEY = 'kds_dismissed_notifs_v1';
export const READ_NOTIFS_KEY = 'kds_read_notifs_v1';
export const SETTINGS_STORAGE_KEY = 'kds_settings_v1';

/**
 * Data Storage Abstraction Layer for Kishor Enterprises Fleet Manager
 * Handles all persistent CRUD operations on vehicle records, payments, notifications, and settings.
 */

// 1. Get all vehicles
export const getVehicles = (): Vehicle[] => {
  try {
    const saved = localStorage.getItem(VEHICLES_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(INITIAL_VEHICLES));
      return INITIAL_VEHICLES;
    }
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length >= 0) {
      return parsed;
    }
    return INITIAL_VEHICLES;
  } catch (error) {
    console.error('Failed to load vehicles from localStorage:', error);
    return INITIAL_VEHICLES;
  }
};

// 2. Save all vehicles array
export const saveVehicles = (vehicles: Vehicle[]): void => {
  try {
    localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
  } catch (error) {
    console.error('Failed to save vehicles to localStorage:', error);
  }
};

// 3. Get single vehicle by unique ID
export const getVehicleById = (id: string): Vehicle | undefined => {
  const list = getVehicles();
  return list.find((v) => v.id === id);
};

// 4. Add new vehicle record
export const addVehicle = (
  vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string }
): Vehicle => {
  const list = getVehicles();
  const now = new Date().toISOString().split('T')[0];
  const newVehicle: Vehicle = {
    ...vehicleData,
    id: vehicleData.id || `veh-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: vehicleData.createdAt || now,
    updatedAt: now,
  };

  const updatedList = [newVehicle, ...list];
  saveVehicles(updatedList);
  return newVehicle;
};

// 5. Update existing vehicle record
export const updateVehicle = (updatedVehicle: Vehicle): Vehicle => {
  const list = getVehicles();
  const now = new Date().toISOString().split('T')[0];
  const itemToSave = { ...updatedVehicle, updatedAt: now };

  const updatedList = list.map((v) => (v.id === updatedVehicle.id ? itemToSave : v));
  saveVehicles(updatedList);
  return itemToSave;
};

// 6. Permanently delete vehicle by unique ID & clean up associated payments
export const deleteVehicle = (id: string): Vehicle[] => {
  const list = getVehicles();
  const filtered = list.filter((v) => v.id !== id);
  saveVehicles(filtered);

  // Clean up associated payments
  try {
    const payments = getPaymentRecords();
    const filteredPayments = payments.filter((p) => p.vehicleId !== id);
    savePaymentRecords(filteredPayments);
  } catch (err) {
    console.error('Error removing vehicle payments:', err);
  }

  return filtered;
};

// 7. Payment Records Persistence
export const getPaymentRecords = (): PaymentRecord[] => {
  try {
    const saved = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(INITIAL_PAYMENTS));
      return INITIAL_PAYMENTS;
    }
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_PAYMENTS;
  } catch (error) {
    console.error('Failed to load payments from localStorage:', error);
    return INITIAL_PAYMENTS;
  }
};

export const savePaymentRecords = (records: PaymentRecord[]): void => {
  try {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Failed to save payments to localStorage:', error);
  }
};

export const addPaymentRecord = (record: Omit<PaymentRecord, 'id'> & { id?: string }): PaymentRecord => {
  const records = getPaymentRecords();
  const newRec: PaymentRecord = {
    ...record,
    id: record.id || `pay-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
  };
  const updated = [newRec, ...records];
  savePaymentRecords(updated);
  return newRec;
};

export const updatePaymentRecord = (updatedRecord: PaymentRecord): PaymentRecord[] => {
  const records = getPaymentRecords();
  const updated = records.map((r) => (r.id === updatedRecord.id ? updatedRecord : r));
  savePaymentRecords(updated);
  return updated;
};

export const deletePaymentRecord = (id: string): PaymentRecord[] => {
  const records = getPaymentRecords();
  const updated = records.filter((r) => r.id !== id);
  savePaymentRecords(updated);
  return updated;
};

// 8. Update payment status & history on Vehicle
export const updatePayment = (
  vehicleId: string,
  paidAmount: number,
  paymentStatus: PaymentStatus,
  paymentMode?: string
): Vehicle | undefined => {
  const list = getVehicles();
  const target = list.find((v) => v.id === vehicleId);
  if (!target) return undefined;

  const now = new Date();
  const dateFormatted = `${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  const timeFormatted = `${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

  const updated: Vehicle = {
    ...target,
    paidAmount,
    paymentStatus,
    paymentMode: paymentMode || target.paymentMode || 'UPI',
    paymentDate: dateFormatted,
    paymentTime: timeFormatted,
    updatedAt: now.toISOString().split('T')[0],
  };

  saveVehicles(list.map((v) => (v.id === vehicleId ? updated : v)));
  return updated;
};

// 8. Get document expiry list across all fleet vehicles
export interface ExpiringDocumentItem {
  vehicle: Vehicle;
  documentType: DocumentType;
  documentName: string;
  expiryDate: string;
  daysRemaining: number;
  status: ExpiryStatus;
}

export const getExpiringDocuments = (): ExpiringDocumentItem[] => {
  const list = getVehicles();
  const expiringItems: ExpiringDocumentItem[] = [];

  const docFields: Array<{ type: DocumentType; name: string; key: keyof Vehicle }> = [
    { type: 'insurance', name: 'Insurance Policy', key: 'insuranceExpiry' },
    { type: 'puc', name: 'PUC Certificate', key: 'pucExpiry' },
    { type: 'fitness', name: 'Fitness Certificate', key: 'fitnessExpiry' },
    { type: 'permit', name: 'RTO Permit', key: 'permitExpiry' },
    { type: 'tax', name: 'Road Tax', key: 'taxExpiry' },
  ];

  list.forEach((v) => {
    docFields.forEach((doc) => {
      const expDate = v[doc.key] as string;
      if (expDate) {
        const status = getExpiryStatus(expDate);
        if (status === 'expired' || status === 'expiring_soon') {
          expiringItems.push({
            vehicle: v,
            documentType: doc.type,
            documentName: doc.name,
            expiryDate: expDate,
            daysRemaining: getDaysRemaining(expDate),
            status,
          });
        }
      }
    });
  });

  return expiringItems.sort((a, b) => a.daysRemaining - b.daysRemaining);
};

// 9. Notifications Management
export const getDismissedNotifIds = (): string[] => {
  try {
    const saved = localStorage.getItem(DISMISSED_NOTIFS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const getReadNotifIds = (): string[] => {
  try {
    const saved = localStorage.getItem(READ_NOTIFS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const markNotifAsRead = (id: string): void => {
  const reads = getReadNotifIds();
  if (!reads.includes(id)) {
    reads.push(id);
    localStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(reads));
  }
};

export const markAllNotifsAsRead = (ids: string[]): void => {
  const reads = Array.from(new Set([...getReadNotifIds(), ...ids]));
  localStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(reads));
};

export const deleteNotif = (id: string): void => {
  const dismissed = getDismissedNotifIds();
  if (!dismissed.includes(id)) {
    dismissed.push(id);
    localStorage.setItem(DISMISSED_NOTIFS_KEY, JSON.stringify(dismissed));
  }
};

export const getNotifications = (): AppNotification[] => {
  const vehicles = getVehicles();
  const dismissed = getDismissedNotifIds();
  const reads = getReadNotifIds();
  const notifs: AppNotification[] = [];

  vehicles.forEach((v) => {
    // Document expiry notifications
    const docFields: Array<{ type: DocumentType; title: string; expiry: string }> = [
      { type: 'insurance', title: 'Motor Insurance Policy', expiry: v.insuranceExpiry },
      { type: 'puc', title: 'PUC Certificate', expiry: v.pucExpiry },
      { type: 'fitness', title: 'RTO Fitness Certificate', expiry: v.fitnessExpiry },
      { type: 'permit', title: 'Goods Permit', expiry: v.permitExpiry },
      { type: 'tax', title: 'Road Tax Receipt', expiry: v.taxExpiry },
    ];

    docFields.forEach((df) => {
      if (!df.expiry) return;
      const days = getDaysRemaining(df.expiry);
      if (days <= 15) {
        const notifId = `${v.id}-${df.type}`;
        if (dismissed.includes(notifId)) return;

        let urgency: AppNotification['urgency'] = '5days';
        if (days < 0) urgency = 'expired';
        else if (days === 0) urgency = 'today';
        else if (days === 1) urgency = '1day';
        else if (days <= 3) urgency = '3days';

        notifs.push({
          id: notifId,
          vehicleId: v.id,
          vehicleNumber: v.vehicleNumber,
          ownerName: v.ownerName,
          ownerMobile: v.ownerMobile,
          type: df.type,
          title: `${df.title} Alert`,
          message:
            days < 0
              ? `${df.title} expired on ${df.expiry} (${Math.abs(days)} days ago). Renew immediately.`
              : days === 0
              ? `${df.title} expires TODAY (${df.expiry}).`
              : `${df.title} expires in ${days} days (${df.expiry}).`,
          expiryDate: df.expiry,
          daysRemaining: days,
          urgency,
          isRead: reads.includes(notifId),
          date: new Date().toISOString().split('T')[0],
        });
      }
    });

    // Payment pending notifications
    if (v.paymentStatus === 'unpaid' || v.paymentStatus === 'pending' || v.paymentStatus === 'partial') {
      const payNotifId = `${v.id}-payment`;
      if (!dismissed.includes(payNotifId)) {
        notifs.push({
          id: payNotifId,
          vehicleId: v.id,
          vehicleNumber: v.vehicleNumber,
          ownerName: v.ownerName,
          ownerMobile: v.ownerMobile,
          type: 'payment',
          title: 'Fee Payment Pending Alert',
          message: `Pending fee balance of ₹${(v.paymentAmount || 0) - (v.paidAmount || 0)} for ${v.vehicleNumber}.`,
          expiryDate: v.paymentDate || 'Pending',
          daysRemaining: 0,
          urgency: 'today',
          isRead: reads.includes(payNotifId),
          date: new Date().toISOString().split('T')[0],
        });
      }
    }
  });

  return notifs.sort((a, b) => a.daysRemaining - b.daysRemaining);
};

// 10. Backup & Restore
export const backupData = (): string => {
  const vehicles = getVehicles();
  return JSON.stringify(vehicles, null, 2);
};

export const restoreData = (jsonData: string | Vehicle[]): Vehicle[] => {
  let list: Vehicle[] = [];
  if (typeof jsonData === 'string') {
    list = JSON.parse(jsonData);
  } else {
    list = jsonData;
  }
  if (Array.isArray(list)) {
    saveVehicles(list);
    return list;
  }
  throw new Error('Invalid vehicle backup data format');
};

