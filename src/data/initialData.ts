import { Vehicle } from '../types';

// Helper to construct dynamic offset dates relative to current date so the preview is always alive
const getOffsetDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    vehicleNumber: 'MH 12 QX 4080',
    vehicleType: 'Heavy Truck',
    vehicleModel: 'Tata Prima 3525.K Heavy Tipper',
    ownerName: 'Kishor Patil',
    ownerMobile: '+91 98220 12345',
    driverName: 'Ramesh Singh',
    driverMobile: '+91 98501 22334',
    paymentAmount: 25000,
    paidAmount: 25000,
    paymentStatus: 'paid',
    insuranceExpiry: getOffsetDate(45), // Valid Green
    pucExpiry: getOffsetDate(3),      // Expiring in 3 days - Yellow
    fitnessExpiry: getOffsetDate(12),   // Expiring in 12 days - Yellow
    permitExpiry: getOffsetDate(90),    // Valid Green
    taxExpiry: getOffsetDate(-5),      // Expired - Red
    rcNumber: 'MH1220210045892',
    engineNumber: '6BT5.9G32098',
    chassisNumber: 'MAT425028N00918',
    notes: 'Heavy training & transport tipper. Requires quarterly grease check.',
    maintenanceLogs: [
      {
        id: 'maint-1-1',
        vehicleId: 'veh-1',
        serviceType: 'Oil Change',
        date: getOffsetDate(-30),
        odometerKm: 42500,
        cost: 6500,
        serviceCenter: 'Kishor Workshop Heavy Unit',
        technicianNotes: 'Replaced Mobil Delvac 15W-40 heavy engine oil and replaced oil & fuel filters.',
        nextServiceDueDate: getOffsetDate(120),
      },
      {
        id: 'maint-1-2',
        vehicleId: 'veh-1',
        serviceType: 'Tire Rotation',
        date: getOffsetDate(-75),
        odometerKm: 38000,
        cost: 2200,
        serviceCenter: 'Apollo Tyres Service Center, Pune',
        technicianNotes: 'Rotated rear dual axles & balanced front steering tires.',
        nextServiceDueDate: getOffsetDate(45),
      },
      {
        id: 'maint-1-3',
        vehicleId: 'veh-1',
        serviceType: 'Brake Service',
        date: getOffsetDate(-120),
        odometerKm: 33200,
        cost: 8500,
        serviceCenter: 'Tata Motors Authorized Service',
        technicianNotes: 'Replaced front brake drum shoes and bled air brake lines.',
      },
    ],
    vehiclePhoto: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
    createdAt: getOffsetDate(-180),
    updatedAt: getOffsetDate(-2)
  },
  {
    id: 'veh-2',
    vehicleNumber: 'MH 14 HG 8821',
    vehicleType: 'Training Car',
    vehicleModel: 'Maruti Suzuki Swift Tour Dual-Control',
    ownerName: 'Kishor Enterprises',
    ownerMobile: '+91 98765 43210',
    driverName: 'Suresh Instructor',
    driverMobile: '+91 97631 88990',
    paymentAmount: 12000,
    paidAmount: 12000,
    paymentStatus: 'paid',
    insuranceExpiry: getOffsetDate(120), // Valid Green
    pucExpiry: getOffsetDate(45),      // Valid Green
    fitnessExpiry: getOffsetDate(180),   // Valid Green
    permitExpiry: getOffsetDate(200),   // Valid Green
    taxExpiry: getOffsetDate(150),      // Valid Green
    rcNumber: 'MH1420220011223',
    engineNumber: 'K12M987612',
    chassisNumber: 'MBHC123456789',
    notes: 'Primary Dual-Pedal Driving School Training Vehicle - Batch A.',
    maintenanceLogs: [
      {
        id: 'maint-2-1',
        vehicleId: 'veh-2',
        serviceType: 'General Service',
        date: getOffsetDate(-15),
        odometerKm: 28400,
        cost: 3800,
        serviceCenter: 'Chowgule Maruti Suzuki Arena',
        technicianNotes: 'Complete 30,000 km periodic service, dual-clutch adjustment & synthetic oil top-up.',
        nextServiceDueDate: getOffsetDate(165),
      },
      {
        id: 'maint-2-2',
        vehicleId: 'veh-2',
        serviceType: 'Wheel Alignment',
        date: getOffsetDate(-60),
        odometerKm: 25100,
        cost: 850,
        serviceCenter: 'MRF Alignment Hub',
        technicianNotes: '4-wheel laser alignment & camber correction for training car.',
      },
    ],
    vehiclePhoto: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    createdAt: getOffsetDate(-300),
    updatedAt: getOffsetDate(-10)
  },
  {
    id: 'veh-3',
    vehicleNumber: 'MH 12 AB 9009',
    vehicleType: 'Bus',
    vehicleModel: 'Ashok Leyland Viking 54-Seater Staff Bus',
    ownerName: 'Vikram Transport Co.',
    ownerMobile: '+91 94220 55667',
    driverName: 'Mahesh Gaikwad',
    driverMobile: '+91 91580 44332',
    paymentAmount: 38000,
    paidAmount: 18000,
    paymentStatus: 'partial',
    insuranceExpiry: getOffsetDate(-10), // Expired - Red
    pucExpiry: getOffsetDate(-2),       // Expired - Red
    fitnessExpiry: getOffsetDate(2),     // Expiring in 2 days - Yellow
    permitExpiry: getOffsetDate(15),     // Expiring in 15 days - Yellow
    taxExpiry: getOffsetDate(40),       // Valid Green
    rcNumber: 'MH1220190077889',
    engineNumber: 'H6E4N12345',
    chassisNumber: 'ALBUS99001122',
    notes: 'Pending ₹20,000 balance payment from Vikram Transport. Insurance renewal pending.',
    vehiclePhoto: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
    createdAt: getOffsetDate(-120),
    updatedAt: getOffsetDate(-1)
  },
  {
    id: 'veh-4',
    vehicleNumber: 'MH 12 PN 5544',
    vehicleType: 'Trailer / Container',
    vehicleModel: 'BharatBenz 5528T 40-ft Multi-Axle',
    ownerName: 'Rajesh Logistics Ltd.',
    ownerMobile: '+91 98900 11223',
    driverName: 'Dharma Rao',
    driverMobile: '+91 90110 33445',
    paymentAmount: 45000,
    paidAmount: 0,
    paymentStatus: 'unpaid',
    insuranceExpiry: getOffsetDate(1),  // Expiring Tomorrow - Yellow
    pucExpiry: getOffsetDate(0),      // Expiring Today - Red/Yellow
    fitnessExpiry: getOffsetDate(-15), // Expired - Red
    permitExpiry: getOffsetDate(-40),  // Expired - Red
    taxExpiry: getOffsetDate(5),       // Expiring in 5 days - Yellow
    rcNumber: 'MH1220200033445',
    engineNumber: 'OM926LA1290',
    chassisNumber: 'BB5528T99887766',
    notes: 'Urgent fitness and permit renewal required. Unpaid invoice sent on WhatsApp.',
    vehiclePhoto: 'https://images.unsplash.com/photo-1586191582056-a3371f655e8c?auto=format&fit=crop&w=600&q=80',
    createdAt: getOffsetDate(-90),
    updatedAt: getOffsetDate(-3)
  },
  {
    id: 'veh-5',
    vehicleNumber: 'MH 14 FC 1212',
    vehicleType: 'Tipper / Dumper',
    vehicleModel: 'Eicher Pro 6028T Heavy Dumper',
    ownerName: 'Ganesh Mining Works',
    ownerMobile: '+91 97620 99887',
    driverName: 'Pandurang Kadam',
    driverMobile: '+91 93250 11990',
    paymentAmount: 22000,
    paidAmount: 22000,
    paymentStatus: 'paid',
    insuranceExpiry: getOffsetDate(80),
    pucExpiry: getOffsetDate(100),
    fitnessExpiry: getOffsetDate(60),
    permitExpiry: getOffsetDate(110),
    taxExpiry: getOffsetDate(90),
    rcNumber: 'MH1420230088990',
    engineNumber: 'VEDX5E289',
    chassisNumber: 'ECHR6028T1234',
    notes: 'All documents verified & fully compliant. Mining permit active.',
    vehiclePhoto: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=600&q=80',
    createdAt: getOffsetDate(-200),
    updatedAt: getOffsetDate(-15)
  },
  {
    id: 'veh-6',
    vehicleNumber: 'MH 12 EV 7070',
    vehicleType: 'Training Car',
    vehicleModel: 'Tata Nexon EV Max Commercial Edition',
    ownerName: 'Kishor Enterprises',
    ownerMobile: '+91 98765 43210',
    driverName: 'Aarti Female Instructor',
    driverMobile: '+91 98221 44556',
    paymentAmount: 15000,
    paidAmount: 15000,
    paymentStatus: 'paid',
    insuranceExpiry: getOffsetDate(210),
    pucExpiry: getOffsetDate(300), // EV green
    fitnessExpiry: getOffsetDate(250),
    permitExpiry: getOffsetDate(310),
    taxExpiry: getOffsetDate(365),
    rcNumber: 'MH1220240099112',
    engineNumber: 'EVMOTOR9910',
    chassisNumber: 'TATANEXONEV12',
    notes: 'Electric Dual-Control Training Vehicle for Automatic Driving License.',
    vehiclePhoto: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    createdAt: getOffsetDate(-60),
    updatedAt: getOffsetDate(-5)
  }
];

export const INITIAL_PAYMENTS: import('../types').PaymentRecord[] = [
  {
    id: 'pay-1',
    vehicleId: 'veh-1',
    vehicleNumber: 'MH 12 QX 4080',
    receiptNo: 'KDS/2026/1042',
    date: getOffsetDate(0),
    amount: 25000,
    paidAmount: 25000,
    balanceAmount: 0,
    paymentMode: 'UPI',
    status: 'paid',
    notes: 'Full payment received via Google Pay for MH 12 QX 4080',
  },
  {
    id: 'pay-2',
    vehicleId: 'veh-3',
    vehicleNumber: 'MH 12 AB 9009',
    receiptNo: 'KDS/2026/1041',
    date: getOffsetDate(-3),
    amount: 38000,
    paidAmount: 18000,
    balanceAmount: 20000,
    paymentMode: 'NEFT',
    status: 'partial',
    notes: 'Partial payment received for Bus MH 12 AB 9009',
  },
  {
    id: 'pay-3',
    vehicleId: 'veh-2',
    vehicleNumber: 'MH 14 HG 8821',
    receiptNo: 'KDS/2026/1039',
    date: getOffsetDate(-10),
    amount: 12000,
    paidAmount: 12000,
    balanceAmount: 0,
    paymentMode: 'Cash',
    status: 'paid',
    notes: 'Cash payment received for Swift Tour MH 14 HG 8821',
  },
  {
    id: 'pay-4',
    vehicleId: 'veh-5',
    vehicleNumber: 'MH 14 FC 1212',
    receiptNo: 'KDS/2026/1035',
    date: getOffsetDate(-18),
    amount: 22000,
    paidAmount: 22000,
    balanceAmount: 0,
    paymentMode: 'Cheque',
    status: 'paid',
    notes: 'HDFC Cheque cleared for Eicher Dumper MH 14 FC 1212',
  },
];

