import React, { useState } from 'react';
import {
  Bell,
  MessageSquare,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  Send,
  Sparkles,
  ExternalLink,
  Check,
  CheckCheck,
  Trash2,
  Info,
  Truck
} from 'lucide-react';
import { Vehicle } from '../types';
import {
  formatDate,
  generateWhatsAppLink,
  getStatusBadgeConfig
} from '../utils/helpers';
import {
  getNotifications,
  markNotifAsRead,
  markAllNotifsAsRead,
  deleteNotif
} from '../services/dataService';

interface NotificationsScreenProps {
  vehicles: Vehicle[];
  onSelectVehicleForDetails?: (vehicle: Vehicle) => void;
  onRefreshNotifsCount?: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  vehicles,
  onSelectVehicleForDetails,
  onRefreshNotifsCount,
}) => {
  const [filterUrgency, setFilterUrgency] = useState<
    'all' | 'expired' | 'today' | '1day' | '3days' | '5days' | 'payment'
  >('all');
  const [pushSuccessMsg, setPushSuccessMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Get notifications dynamically
  const notifsList = getNotifications();

  const filteredNotifications = notifsList.filter((item) => {
    if (filterUrgency === 'all') return true;
    if (filterUrgency === 'payment') return item.type === 'payment';
    return item.urgency === filterUrgency;
  });

  const unreadCount = notifsList.filter((n) => !n.isRead).length;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markNotifAsRead(id);
    onRefreshNotifsCount?.();
    showToast('Marked as read');
  };

  const handleMarkAllRead = () => {
    markAllNotifsAsRead(notifsList.map((n) => n.id));
    onRefreshNotifsCount?.();
    showToast('All notifications marked as read');
  };

  const handleDeleteNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotif(id);
    onRefreshNotifsCount?.();
    showToast('Notification deleted');
  };

  const handleTriggerSimulatedPushNotification = () => {
    setPushSuccessMsg(
      `📢 Android Push Notification broadcasted to Kishor Enterprises Admin Mobile for ${notifsList.length} alerts!`
    );
    setTimeout(() => setPushSuccessMsg(''), 4000);
  };

  const handleWhatsAppClick = (phone: string, url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      alert('Mobile number is missing or invalid for this record. Please update the owner/driver phone number.');
      return;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-4 bg-[#090A0E] text-slate-100">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-black text-amber-300 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            Automated Expiry Alerts & Reminders
            {unreadCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white font-black">
                {unreadCount} Unread
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400">
            Scheduled Push Notifications & Direct WhatsApp dispatch to owners
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-xl hover:bg-amber-500/25 transition flex items-center gap-1 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-amber-400" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {toastMsg && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {pushSuccessMsg && (
        <div className="p-3 bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs rounded-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{pushSuccessMsg}</span>
        </div>
      )}

      {/* Trigger Broadcast Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <button
          onClick={handleTriggerSimulatedPushNotification}
          className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:bg-amber-400 transition flex items-center justify-center gap-1.5"
        >
          <Smartphone className="w-4 h-4 text-slate-950" />
          <span>Simulate Android Push Notification</span>
        </button>

        <button
          onClick={() => {
            alert(
              `Bulk WhatsApp Reminders dispatched to ${notifsList.length} registered vehicle owners!`
            );
          }}
          className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl hover:bg-emerald-500/30 transition flex items-center justify-center gap-1.5"
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>Dispatch All WhatsApp Reminders</span>
        </button>
      </div>

      {/* Filter Tabs as required: Expired, Today, 1 Day, 3 Days, 5 Days */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: `All Alerts (${notifsList.length})` },
          { id: 'expired', label: 'Expired' },
          { id: 'today', label: 'Expiry Today' },
          { id: '1day', label: '1 Day' },
          { id: '3days', label: '3 Days' },
          { id: '5days', label: '5 Days' },
          { id: 'payment', label: 'Payment Alerts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterUrgency(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
              filterUrgency === tab.id
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                : 'bg-[#121522] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center bg-[#121522] rounded-3xl border border-slate-800 my-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-200">No expiring alerts in this interval</p>
            <p className="text-xs text-slate-500 mt-1">
              All fleet vehicle documents are up to date!
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const isToday = item.daysRemaining === 0;
            const isExpired = item.daysRemaining < 0;

            const targetVehicle = vehicles.find((v) => v.id === item.vehicleId);

            const whatsappUrl = generateWhatsAppLink(
              item.ownerMobile,
              item.ownerName,
              item.vehicleNumber,
              item.title,
              item.expiryDate,
              item.daysRemaining
            );

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (targetVehicle && onSelectVehicleForDetails) {
                    onSelectVehicleForDetails(targetVehicle);
                  }
                }}
                className={`bg-[#121522] border rounded-2xl p-4 shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:border-amber-400 transition relative ${
                  !item.isRead ? 'ring-1 ring-amber-500/50' : ''
                } ${
                  isExpired
                    ? 'border-rose-500/40 bg-rose-500/5'
                    : isToday
                    ? 'border-amber-500/50 bg-amber-500/5'
                    : 'border-amber-500/20'
                }`}
              >
                {!item.isRead && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" title="Unread Alert" />
                )}

                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl text-amber-400 shrink-0 ${
                      isExpired ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-amber-300 font-mono">
                        {item.vehicleNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isExpired
                            ? 'bg-rose-500 text-white'
                            : isToday
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {isExpired
                          ? `EXPIRED (${Math.abs(item.daysRemaining)} days ago)`
                          : isToday
                          ? 'EXPIRES TODAY'
                          : `Expires in ${item.daysRemaining} days`}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-200 mt-1">{item.title}</h4>
                    <p className="text-xs text-slate-400">
                      Owner: <strong className="text-slate-200">{item.ownerName}</strong> (
                      {item.ownerMobile})
                    </p>
                    <p className="text-[11px] text-slate-300 mt-0.5 font-medium">{item.message}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      Expiry Date: {formatDate(item.expiryDate)}
                    </p>
                  </div>
                </div>

                {/* Direct Actions: Mark Read, WhatsApp, Delete */}
                <div className="flex items-center gap-2 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {!item.isRead && (
                    <button
                      onClick={(e) => handleMarkAsRead(item.id, e)}
                      title="Mark as Read"
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-amber-400 transition"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={(e) => handleWhatsAppClick(item.ownerMobile, whatsappUrl, e)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition shadow flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-950" />
                    <span>WhatsApp</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </button>

                  <button
                    onClick={(e) => handleDeleteNotif(item.id, e)}
                    title="Delete Alert"
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
