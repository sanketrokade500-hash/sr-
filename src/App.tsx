import React, { useState, useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Vehicle, ActiveTab, AdminProfile, PaymentStatus } from './types';
import { AndroidFrame } from './components/AndroidFrame';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AdminLoginModal, ModalStep } from './components/AdminLoginModal';
import { FlutterCodeModal } from './components/FlutterCodeModal';

import { SplashScreen } from './screens/SplashScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { VehiclesScreen } from './screens/VehiclesScreen';
import { AddVehicleScreen } from './screens/AddVehicleScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { DocumentsScreen } from './screens/DocumentsScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { getExpiryStatus } from './utils/helpers';
import { getAdminAuth } from './utils/auth';
import {
  getVehicles,
  saveVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  updatePayment
} from './services/dataService';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedVehicleForModal, setSelectedVehicleForModal] = useState<Vehicle | null>(null);

  // Vehicles persistent state using dataService abstraction
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => getVehicles());
  const [toastMessage, setToastMessage] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  // Admin Profile state
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    username: 'sanket123',
    adminMobile: '+91 8767132450',
    isLoggedIn: false,
    pushNotificationsEnabled: true,
    whatsAppRemindersEnabled: true,
    reminderDays: 5,
  });

  // Load auth state
  useEffect(() => {
    getAdminAuth().then((auth) => {
      setAdminProfile((prev) => ({
        ...prev,
        username: auth.username || 'sanket123',
        adminMobile: auth.adminMobile || '+91 8767132450',
        isLoggedIn: auth.isLoggedIn || false,
      }));
    });
  }, []);

  // Modals state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminModalStep, setAdminModalStep] = useState<ModalStep>('login');
  const [isFlutterCodeModalOpen, setIsFlutterCodeModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Hardware Back Button Handler for Native Android
  useEffect(() => {
    let listenerHandle: any = null;
    try {
      CapacitorApp.addListener('backButton', () => {
        if (isFlutterCodeModalOpen) {
          setIsFlutterCodeModalOpen(false);
        } else if (isAdminModalOpen) {
          setIsAdminModalOpen(false);
        } else if (editingVehicle) {
          setEditingVehicle(null);
        } else if (activeTab !== 'home') {
          setActiveTab('home');
        } else {
          CapacitorApp.exitApp();
        }
      }).then((h) => {
        listenerHandle = h;
      });
    } catch {
      // Ignore if running on web browser
    }

    return () => {
      if (listenerHandle && typeof listenerHandle.remove === 'function') {
        listenerHandle.remove();
      }
    };
  }, [isFlutterCodeModalOpen, isAdminModalOpen, editingVehicle, activeTab]);

  const handleOpenAdminLogin = (step: ModalStep = 'login') => {
    setAdminModalStep(step);
    setIsAdminModalOpen(true);
  };

  // Sync to dataService storage whenever vehicles state changes
  useEffect(() => {
    saveVehicles(vehicles);
  }, [vehicles]);

  // Count unread / expiring notifications count
  const unreadNotificationsCount = vehicles.filter((v) => {
    const insSt = getExpiryStatus(v.insuranceExpiry);
    const pucSt = getExpiryStatus(v.pucExpiry);
    const fitSt = getExpiryStatus(v.fitnessExpiry);
    return (
      insSt === 'expiring_soon' ||
      insSt === 'expired' ||
      pucSt === 'expiring_soon' ||
      pucSt === 'expired' ||
      fitSt === 'expiring_soon' ||
      fitSt === 'expired'
    );
  }).length;

  // Add or Update Vehicle handler
  const handleSaveVehicle = (vehicleData: Partial<Vehicle>) => {
    if (editingVehicle) {
      // Update existing
      const updatedItem: Vehicle = {
        ...editingVehicle,
        ...vehicleData,
        updatedAt: new Date().toISOString().split('T')[0],
      } as Vehicle;

      updateVehicle(updatedItem);
      setVehicles(getVehicles());
      setEditingVehicle(null);
      showToast(`Vehicle ${updatedItem.vehicleNumber} updated successfully!`);
    } else {
      // Create new
      const created = addVehicle({
        vehicleNumber: vehicleData.vehicleNumber || 'MH 12 XX 0000',
        vehicleType: vehicleData.vehicleType || 'Heavy Truck',
        vehicleModel: vehicleData.vehicleModel || 'Tata Truck',
        ownerName: vehicleData.ownerName || 'Owner',
        ownerMobile: vehicleData.ownerMobile || '+91 8767132450',
        driverName: vehicleData.driverName || 'Driver',
        driverMobile: vehicleData.driverMobile || '+91 8767132450',
        paymentAmount: vehicleData.paymentAmount || 25000,
        paidAmount: vehicleData.paidAmount || 0,
        paymentStatus: vehicleData.paymentStatus || 'unpaid',
        paymentMode: vehicleData.paymentMode || 'UPI',
        insuranceExpiry: vehicleData.insuranceExpiry || '',
        pucExpiry: vehicleData.pucExpiry || '',
        fitnessExpiry: vehicleData.fitnessExpiry || '',
        permitExpiry: vehicleData.permitExpiry || '',
        taxExpiry: vehicleData.taxExpiry || '',
        rcNumber: vehicleData.rcNumber || '',
        engineNumber: vehicleData.engineNumber || '',
        chassisNumber: vehicleData.chassisNumber || '',
        notes: vehicleData.notes || '',
        vehiclePhoto: vehicleData.vehiclePhoto,
      });

      setVehicles(getVehicles());
      showToast(`New vehicle ${created.vehicleNumber} added successfully!`);
    }

    setActiveTab('vehicles');
  };

  const handleDeleteVehicle = (id: string) => {
    const remaining = deleteVehicle(id);
    setVehicles(remaining);
    showToast('Vehicle deleted successfully');
  };

  const handleUpdateVehiclePayment = (
    vehicleId: string,
    paidAmount: number,
    status: PaymentStatus,
    paymentMode?: string
  ) => {
    updatePayment(vehicleId, paidAmount, status, paymentMode);
    setVehicles(getVehicles());
    showToast('Payment status updated successfully!');
  };

  if (showSplash) {
    return (
      <AndroidFrame
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isPhoneFrame={isPhoneFrame}
        setIsPhoneFrame={setIsPhoneFrame}
      >
        <SplashScreen onEnterApp={() => setShowSplash(false)} />
      </AndroidFrame>
    );
  }

  // App requires Admin Login before accessing application screens
  const showBlockingLogin = !adminProfile.isLoggedIn;

  return (
    <AndroidFrame
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      isPhoneFrame={isPhoneFrame}
      setIsPhoneFrame={setIsPhoneFrame}
    >
      {/* Top Header */}
      <Header
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setActiveTab('notifications')}
        onOpenFlutterCode={() => setIsFlutterCodeModalOpen(true)}
        onOpenAdminLogin={() => handleOpenAdminLogin('login')}
        isPhoneFrame={isPhoneFrame}
        setIsPhoneFrame={setIsPhoneFrame}
        adminProfile={adminProfile}
      />

      {/* Global Toast Notification Banner */}
      {toastMessage && (
        <div className="mx-4 mt-2 p-3 bg-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-xl border border-amber-300 flex items-center justify-between animate-bounce z-40">
          <span>⚡ {toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="text-slate-950 hover:opacity-80">
            ✕
          </button>
        </div>
      )}

      {/* Dynamic Screen View */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {activeTab === 'home' && (
          <DashboardScreen
            vehicles={vehicles}
            onSelectTab={setActiveTab}
            onSelectCategoryFilter={(filter) => setCategoryFilter(filter)}
            onOpenNotifications={() => setActiveTab('notifications')}
            unreadNotificationsCount={unreadNotificationsCount}
          />
        )}

        {activeTab === 'vehicles' && (
          <VehiclesScreen
            vehicles={vehicles}
            onSelectTab={setActiveTab}
            selectedCategoryFilter={categoryFilter}
            initialSelectedVehicle={selectedVehicleForModal}
            onClearInitialSelectedVehicle={() => setSelectedVehicleForModal(null)}
            onEditVehicle={(veh) => {
              setEditingVehicle(veh);
              setActiveTab('add');
            }}
            onDeleteVehicle={handleDeleteVehicle}
            onUpdateVehicle={(updated) =>
              setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)))
            }
          />
        )}

        {activeTab === 'add' && (
          <AddVehicleScreen
            editingVehicle={editingVehicle}
            onSaveVehicle={handleSaveVehicle}
            onCancel={() => {
              setEditingVehicle(null);
              setActiveTab('vehicles');
            }}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentScreen
            vehicles={vehicles}
            selectedCategoryFilter={categoryFilter}
            onUpdateVehiclePayment={handleUpdateVehiclePayment}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsScreen
            vehicles={vehicles}
            selectedCategoryFilter={categoryFilter}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsScreen
            vehicles={vehicles}
            onSelectVehicleForDetails={(veh) => {
              setSelectedVehicleForModal(veh);
              setActiveTab('vehicles');
            }}
            onRefreshNotifsCount={() => setVehicles(getVehicles())}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsScreen
            vehicles={vehicles}
            onImportVehicles={(imported) => setVehicles(imported)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            adminProfile={adminProfile}
            setAdminProfile={setAdminProfile}
            vehicles={vehicles}
            onOpenAdminLogin={handleOpenAdminLogin}
            onRestoreData={(restored) => setVehicles(restored)}
          />
        )}
      </main>

      {/* Bottom Material Design 3 Navigation Bar */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Gated Admin Login Modal (Blocking when not logged in, modal when logged in) */}
      <AdminLoginModal
        isOpen={showBlockingLogin || isAdminModalOpen}
        isBlocking={showBlockingLogin}
        initialStep={adminModalStep}
        onClose={() => setIsAdminModalOpen(false)}
        adminProfile={adminProfile}
        setAdminProfile={setAdminProfile}
        onLoginSuccess={() => {
          setIsAdminModalOpen(false);
        }}
      />

      <FlutterCodeModal
        isOpen={isFlutterCodeModalOpen}
        onClose={() => setIsFlutterCodeModalOpen(false)}
      />
    </AndroidFrame>
  );
}
