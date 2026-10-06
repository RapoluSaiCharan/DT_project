import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, ShieldCheck, X, Loader2 } from 'lucide-react';
import { safetyService } from '../services/api';

const EmergencyModal = ({ isOpen, onClose, activeTripId }) => {
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState(null);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleTriggerSOS = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await safetyService.triggerSOS({
        tripId: activeTripId,
        note: note || 'Immediate SOS alert triggered from mobile application',
      });

      if (res.data?.success) {
        setSuccessData(res.data.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to dispatch SOS alert. Please dial campus security immediately!');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessData(null);
    setError(null);
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-rose-100">
        {/* Header */}
        <div className="bg-rose-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <h3 className="font-bold text-lg">Emergency SOS Alert</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-rose-100 hover:text-white rounded-lg p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!successData ? (
            <div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Triggering SOS will instantly notify <strong>Campus Security</strong>, <strong>Transport Administrators</strong>, and your active ride members with your identity and route coordinates.
              </p>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Optional Note (e.g. Near Metro Pillar, Flat tyre, Need help)
                </label>
                <input
                  type="text"
                  placeholder="Describe emergency if possible..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">
                  {error}
                </div>
              )}

              <div className="bg-rose-50 rounded-xl p-3 mb-6 border border-rose-200">
                <div className="text-xs font-semibold text-rose-900 mb-2 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" />
                  Direct Campus Emergency Hotlines:
                </div>
                <div className="text-xs text-rose-800 space-y-1">
                  <p>• Security Desk: <strong>+91 40 2345 6789</strong></p>
                  <p>• Transport Helpline: <strong>+91 98765 43210</strong></p>
                  <p>• Women Safety Helpline: <strong>+91 98765 11223</strong></p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleTriggerSOS}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Alerting...
                    </>
                  ) : (
                    'CONFIRM SOS'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-800 text-lg">Alert Dispatched!</h4>
              <p className="text-emerald-700 font-medium text-sm mt-1 mb-4">
                {successData.dispatchedNotice || 'Emergency alert sent to configured college contacts.'}
              </p>
              <div className="text-left bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1 mb-6">
                <p><strong>Incident Ref:</strong> #{successData.emergency?._id?.slice(-6)}</p>
                <p><strong>Status:</strong> Active Dispatch</p>
                <p><strong>Security Notified:</strong> Yes, priority notification sent to control desk.</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Close & Return
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyModal;
