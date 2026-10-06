import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Users,
  Route,
  AlertTriangle,
  Info,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { LoadingSpinner, EmptyState } from '../components/UIPrimitives';

const Notifications = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'POOL_JOIN':
      case 'POOL_LEAVE':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'TRIP_START':
      case 'TRIP_COMPLETE':
        return <Route className="w-5 h-5 text-emerald-600" />;
      case 'SAFETY_ALERT':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      default:
        return <Info className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-1">
            <Bell className="w-3.5 h-3.5" />
            Alerts & Ride Updates
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications ({unreadCount} unread)
          </h1>
          <p className="text-sm text-slate-500">
            Real-time notifications regarding your pool requests, trip departures, and safety notices.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold self-start sm:self-auto transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner text="Loading your notifications..." />
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => !notif.read && markAsRead(notif._id)}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
                notif.read
                  ? 'bg-white border-slate-200 text-slate-600'
                  : 'bg-blue-50/40 border-blue-200 shadow-sm'
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-xs shrink-0">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm ${notif.read ? 'font-semibold text-slate-800' : 'font-bold text-slate-900'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>

                {notif.actionUrl && (
                  <div className="pt-1">
                    <Link
                      to={notif.actionUrl}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                    >
                      View Details <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>

              {!notif.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-1.5 ring-2 ring-white" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="You'll receive alerts when members join your pool or when your trips start."
        />
      )}
    </div>
  );
};

export default Notifications;
