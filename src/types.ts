export type PaymentStatus = 'paid' | 'unpaid' | 'partial' | 'pending';

export type DocumentType = 'insurance' | 'puc' | 'fitness' | 'permit' | 'tax';

export type ExpiryStatus = 'valid' | 'expiring_soon' | 'expired' | 'pending';

export interface VehicleDocument {
  id: string;
  type: DocumentType;
  title: string;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: 'pdf' | 'image';
  status: ExpiryStatus;
}

export type ServiceType =
  | 'Oil Change'
  | 'Tire Rotation'
  | 'Brake Service'
  | 'Engine Overhaul'
  | 'General Service'
  | 'Battery Replacement'
  | 'Wheel Alignment'
  | 'Transmission Fluid'
  | 'AC Repair'
  | 'Other';

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  serviceType: ServiceType;
  date: string;
  odometerKm: number;
  cost: number;
  serviceCenter: string;
  technicianNotes?: string;
  nextServiceDueDate?: string;
}

export interface PaymentRecord {
  id: string;
  vehicleId?: string;
  vehicleNumber?: string;
  receiptNo: string;
  date: string;
  amount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMode: string;
  status: PaymentStatus;
  notes?: string;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string; // e.g. "MH 12 AB 1234"
  vehicleType: 'Heavy Truck' | 'Bus' | 'Training Car' | 'Trailer / Container' | 'Tipper / Dumper' | 'Light Commercial';
  vehicleModel: string; // e.g. "Tata Prima 3525.K"
  ownerName: string;
  ownerMobile: string;
  driverName: string;
  driverMobile: string;
  paymentAmount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  paymentDate?: string;
  paymentTime?: string;
  registrationDate?: string;
  paymentMode?: string;
  
  insuranceNumber?: string;
  insuranceExpiry: string; // YYYY-MM-DD
  pucNumber?: string;
  pucExpiry: string;
  fitnessNumber?: string;
  fitnessExpiry: string;
  permitNumber?: string;
  permitExpiry: string;
  taxExpiry: string;
  
  rcNumber: string;
  engineNumber: string;
  chassisNumber: string;
  notes?: string;

  // Maintenance History
  maintenanceLogs?: MaintenanceRecord[];

  // Media
  vehiclePhoto?: string;
  rcPhoto?: string;
  insurancePdf?: string;
  pucPdf?: string;
  fitnessPdf?: string;

  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  ownerName: string;
  ownerMobile: string;
  type: DocumentType | 'payment';
  title: string;
  message: string;
  expiryDate: string;
  daysRemaining: number;
  urgency: 'today' | '1day' | '3days' | '5days' | 'expired';
  isRead: boolean;
  date: string;
}

export interface AdminProfile {
  username: string;
  adminMobile: string;
  isLoggedIn: boolean;
  pushNotificationsEnabled: boolean;
  whatsAppRemindersEnabled: boolean;
  reminderDays: number; // e.g., 5 days before
}

export type ActiveTab = 'home' | 'vehicles' | 'add' | 'payments' | 'documents' | 'notifications' | 'reports' | 'settings';
