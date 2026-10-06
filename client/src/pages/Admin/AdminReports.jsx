import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, CheckCircle, Clock, Save, Loader2 } from 'lucide-react';
import { reportService } from '../../services/api';
import { Badge, LoadingSpinner, Alert, EmptyState } from '../../components/UIPrimitives';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('RESOLVED');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportService.getReports({ status: statusFilter });
      if (res.data?.success) {
        setReports(res.data.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch incident reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleUpdate = async (reportId) => {
    try {
      setActionLoading(true);
      setError(null);
      const res = await reportService.updateReport(reportId, {
        status: editStatus,
        adminNotes: editNotes,
      });

      if (res.data?.success) {
        setFeedback('Report updated successfully.');
        setEditingId(null);
        fetchReports();
      }
    } catch (err) {
      setError(err.message || 'Failed to update report.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Safety & Conduct Incident Reports
          </h1>
          <p className="text-sm text-slate-500">
            Investigate reported driving concerns, vehicle conditions, and student conduct during commute trips.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white self-start sm:self-auto"
        >
          <option value="">All Report Statuses</option>
          <option value="PENDING">Pending Review</option>
          <option value="INVESTIGATING">Under Investigation</option>
          <option value="RESOLVED">Resolved</option>
          <option value="DISMISSED">Dismissed</option>
        </select>
      </div>

      {feedback && <Alert type="success" message={feedback} onClose={() => setFeedback(null)} />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {loading ? (
        <LoadingSpinner text="Fetching incident reports..." />
      ) : reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r._id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      r.status === 'PENDING'
                        ? 'danger'
                        : r.status === 'INVESTIGATING'
                        ? 'warning'
                        : 'success'
                    }
                  >
                    {r.status}
                  </Badge>
                  <span className="font-bold text-slate-900 text-sm">{r.reason}</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Logged on {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block font-medium">REPORTER</span>
                  <span className="font-bold text-slate-800">{r.reporter?.name}</span>
                  <p className="text-slate-500">{r.reporter?.email} • {r.reporter?.department}</p>
                </div>
                {r.reportedUser && (
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block font-medium">REPORTED MEMBER</span>
                    <span className="font-bold text-slate-800">{r.reportedUser?.name}</span>
                    <p className="text-slate-500">{r.reportedUser?.email} • {r.reportedUser?.department}</p>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-700 bg-rose-50/40 p-3.5 rounded-xl border border-rose-100">
                <span className="font-bold text-slate-900 block mb-1">Description:</span>
                <p className="leading-relaxed">{r.description}</p>
              </div>

              {r.adminNotes && (
                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Admin Action Note:</span>
                  <p>{r.adminNotes}</p>
                </div>
              )}

              {/* Action Resolution Form */}
              {editingId === r._id ? (
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="INVESTIGATING">INVESTIGATING</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="DISMISSED">DISMISSED</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Resolution Note</label>
                      <input
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Action taken (e.g. Warning issued, verified resolved)"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdate(r._id)}
                      disabled={actionLoading}
                      className="px-4 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                    >
                      Save Resolution
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setEditingId(r._id);
                      setEditNotes(r.adminNotes || '');
                      setEditStatus(r.status);
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Update / Resolve Incident →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={AlertTriangle}
          title="No incident reports logged"
          description="Campus commute community reports will appear here for administrative investigation."
        />
      )}
    </div>
  );
};

export default AdminReports;
