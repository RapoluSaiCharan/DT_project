import React, { useState } from 'react';
import {
  AlertTriangle,
  Shield,
  PhoneCall,
  Send,
  Loader2,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { reportService, safetyService } from '../services/api';
import { Alert } from '../components/UIPrimitives';
import EmergencyModal from '../components/EmergencyModal';

const Safety = () => {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    reason: 'DANGEROUS_DRIVING',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const reportReasons = [
    { value: 'DANGEROUS_DRIVING', label: 'Reckless or Dangerous Driving' },
    { value: 'HARASSMENT', label: 'Harassment / Inappropriate Conduct' },
    { value: 'NO_SHOW', label: 'Driver / Passenger Repeated No-Show' },
    { value: 'INAPPROPRIATE_BEHAVIOR', label: 'Disrespectful Behavior' },
    { value: 'OVERCHARGING', label: 'Fare Dispute / Overcharging' },
    { value: 'VEHICLE_CONDITION', label: 'Unsafe Vehicle Condition' },
    { value: 'OTHER', label: 'Other Safety Concern' },
  ];

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await reportService.createReport(formData);
      if (res.data?.success) {
        setFeedback('Your report has been submitted confidentially to Campus Transport Administration.');
        setFormData({ reason: 'DANGEROUS_DRIVING', description: '' });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-1">
          <Shield className="w-3.5 h-3.5" />
          Campus Mobility Safety Hub
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Safety, SOS & Incident Reporting
        </h1>
        <p className="text-sm text-slate-500">
          CampusPool is strictly for verified college members. Immediate emergency assistance and disciplinary reporting are always accessible.
        </p>
      </div>

      {feedback && <Alert type="success" message={feedback} onClose={() => setFeedback(null)} />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Emergency SOS Banner */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/40 text-rose-100 text-xs font-bold border border-rose-400/30">
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" /> Emergency Assistance
          </div>
          <h2 className="text-2xl font-extrabold">Instant SOS Route Dispatch</h2>
          <p className="text-xs text-rose-100 max-w-md leading-relaxed">
            If you ever feel unsafe during a pool commute, tap SOS to instantly broadcast your college identity and route coordinates to campus security.
          </p>
        </div>

        <button
          onClick={() => setSosModalOpen(true)}
          className="px-8 py-4 rounded-2xl bg-white text-rose-700 hover:bg-rose-50 font-black text-sm tracking-wider uppercase shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          Trigger SOS Now
        </button>
      </div>

      {/* Campus Emergency Helplines Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-blue-600" /> Campus Emergency Direct Contacts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block font-medium">Campus Security Desk</span>
            <span className="text-sm font-bold text-slate-800 block mt-1">+91 40 2345 6789</span>
            <span className="text-[10px] text-emerald-600">24/7 Patrol Available</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block font-medium">Transport Operations</span>
            <span className="text-sm font-bold text-slate-800 block mt-1">+91 98765 43210</span>
            <span className="text-[10px] text-slate-500">Fleet & Route Support</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block font-medium">Women Safety Cell</span>
            <span className="text-sm font-bold text-slate-800 block mt-1">+91 98765 11223</span>
            <span className="text-[10px] text-purple-600">Confidential Desk</span>
          </div>
        </div>
      </div>

      {/* Incident / Conduct Reporting Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileText className="w-5 h-5 text-purple-600" />
          <h2 className="font-bold text-slate-900 text-base">Report a Commute Incident or Member</h2>
        </div>

        <p className="text-xs text-slate-500">
          Reports are reviewed by Transport Administrators. Disciplinary actions including pool suspensions may be taken against violators.
        </p>

        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Reason for Report
            </label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData((p) => ({ ...p, reason: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
            >
              {reportReasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Incident Description
            </label>
            <textarea
              rows={4}
              required
              minLength={10}
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Provide specific details about date, approximate location, what happened, and any vehicle numbers..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit Confidential Report
            </button>
          </div>
        </form>
      </div>

      <EmergencyModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
    </div>
  );
};

export default Safety;
