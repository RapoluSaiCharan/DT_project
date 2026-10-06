import React, { useState, useEffect } from 'react';
import { Bus, Plus, Trash2, Edit2, Loader2, Save, X, Phone, Users, Clock } from 'lucide-react';
import { busService } from '../../services/api';
import { Badge, LoadingSpinner, Alert } from '../../components/UIPrimitives';

const AdminBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    busNumber: '',
    routeName: '',
    driverName: '',
    driverPhone: '',
    capacity: 45,
    morningDeparture: '07:20',
    eveningReturn: '17:15',
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const res = await busService.getBuses();
      if (res.data?.success) {
        setBuses(res.data.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load buses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setError(null);
      const res = await busService.createBus(formData);
      if (res.data?.success) {
        setFeedback('Bus route added successfully!');
        setShowAddForm(false);
        setFormData({
          busNumber: '',
          routeName: '',
          driverName: '',
          driverPhone: '',
          capacity: 45,
          morningDeparture: '07:20',
          eveningReturn: '17:15',
        });
        fetchBuses();
      }
    } catch (err) {
      setError(err.message || 'Failed to add bus.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (busId, newStatus) => {
    try {
      const res = await busService.updateBus(busId, { currentStatus: newStatus });
      if (res.data?.success) {
        setFeedback(`Bus status updated to ${newStatus}.`);
        fetchBuses();
      }
    } catch (err) {
      setError(err.message || 'Failed to update bus status.');
    }
  };

  const handleDelete = async (busId) => {
    if (!window.confirm('Deactivate this bus route?')) return;
    try {
      const res = await busService.deleteBus(busId);
      if (res.data?.success) {
        setFeedback('Bus route deactivated.');
        fetchBuses();
      }
    } catch (err) {
      setError(err.message || 'Failed to deactivate.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            College Bus Fleet Operations
          </h1>
          <p className="text-sm text-slate-500">
            Manage institutional transit buses, driver contacts, schedules, and real-time status.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors self-start sm:self-auto"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Cancel' : 'Add New Bus'}
        </button>
      </div>

      {feedback && <Alert type="success" message={feedback} onClose={() => setFeedback(null)} />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Add Bus Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Add New College Bus Route</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bus Number / Code</label>
              <input
                type="text"
                required
                placeholder="e.g. BUS-112"
                value={formData.busNumber}
                onChange={(e) => setFormData((p) => ({ ...p, busNumber: e.target.value.toUpperCase() }))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Route Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Route 15: Uppal - Tarnaka - Campus"
                value={formData.routeName}
                onChange={(e) => setFormData((p) => ({ ...p, routeName: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Passenger Capacity</label>
              <input
                type="number"
                min="10"
                max="80"
                value={formData.capacity}
                onChange={(e) => setFormData((p) => ({ ...p, capacity: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Driver Name</label>
              <input
                type="text"
                required
                placeholder="Driver full name"
                value={formData.driverName}
                onChange={(e) => setFormData((p) => ({ ...p, driverName: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Driver Phone</label>
              <input
                type="tel"
                required
                placeholder="+91 94400 00000"
                value={formData.driverPhone}
                onChange={(e) => setFormData((p) => ({ ...p, driverPhone: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Morning Departure</label>
              <input
                type="text"
                placeholder="07:20"
                value={formData.morningDeparture}
                onChange={(e) => setFormData((p) => ({ ...p, morningDeparture: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Evening Return</label>
              <input
                type="text"
                placeholder="17:15"
                value={formData.eveningReturn}
                onChange={(e) => setFormData((p) => ({ ...p, eveningReturn: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Bus Fleet Route
            </button>
          </div>
        </form>
      )}

      {/* Buses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Fetching fleet data..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Bus ID</th>
                  <th className="py-3 px-4">Route Name</th>
                  <th className="py-3 px-4">Driver & Contact</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {buses.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.busNumber}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{b.routeName}</td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>{b.driverName}</div>
                      <div className="text-[10px] text-slate-400">{b.driverPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {b.morningDeparture} AM / {b.eveningReturn} PM
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={b.currentStatus}
                        onChange={(e) => handleUpdateStatus(b._id, e.target.value)}
                        className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white font-medium"
                      >
                        <option value="ON_SCHEDULE">ON_SCHEDULE</option>
                        <option value="DELAYED">DELAYED</option>
                        <option value="MAINTENANCE">MAINTENANCE</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="text-rose-600 hover:text-rose-800 font-semibold"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBuses;
