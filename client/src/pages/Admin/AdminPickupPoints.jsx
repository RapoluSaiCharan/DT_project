import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Edit2, Loader2, Save, X } from 'lucide-react';
import { pickupService } from '../../services/api';
import { LoadingSpinner, Alert } from '../../components/UIPrimitives';

const AdminPickupPoints = () => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    area: '',
    landmark: '',
    latitude: 17.385,
    longitude: 78.4867,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const fetchPoints = async () => {
    try {
      setLoading(true);
      const res = await pickupService.getPickupPoints();
      if (res.data?.success) {
        setPoints(res.data.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch pickup points.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setError(null);
      const res = await pickupService.createPickupPoint(formData);
      if (res.data?.success) {
        setFeedback('New pickup point created successfully!');
        setShowAddForm(false);
        setFormData({
          name: '',
          address: '',
          area: '',
          landmark: '',
          latitude: 17.385,
          longitude: 78.4867,
        });
        fetchPoints();
      }
    } catch (err) {
      setError(err.message || 'Failed to create pickup point.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this pickup point?')) return;
    try {
      const res = await pickupService.deletePickupPoint(id);
      if (res.data?.success) {
        setFeedback('Pickup point deactivated.');
        fetchPoints();
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
            Official Pickup Points Management
          </h1>
          <p className="text-sm text-slate-500">
            Define official safe gathering zones across the city for student and faculty carpool boarding.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors self-start sm:self-auto"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Cancel' : 'Add Pickup Point'}
        </button>
      </div>

      {feedback && <Alert type="success" message={feedback} onClose={() => setFeedback(null)} />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Add Designated Campus Pickup Point</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Point Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Miyapur Metro (Exit Gate A)"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Area / Locality</label>
              <input
                type="text"
                required
                placeholder="e.g. Miyapur"
                value={formData.area}
                onChange={(e) => setFormData((p) => ({ ...p, area: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Recognizable Landmark</label>
              <input
                type="text"
                placeholder="e.g. Near Pillar 32"
                value={formData.landmark}
                onChange={(e) => setFormData((p) => ({ ...p, landmark: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
            <input
              type="text"
              required
              placeholder="Full address of the gathering point"
              value={formData.address}
              onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Pickup Point
            </button>
          </div>
        </form>
      )}

      {/* Points Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Fetching pickup points..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Point Name</th>
                  <th className="py-3 px-4">Area</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Landmark</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {points.map((pt) => (
                  <tr key={pt._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{pt.name}</td>
                    <td className="py-3 px-4 font-medium text-blue-700">{pt.area}</td>
                    <td className="py-3 px-4 text-slate-600">{pt.address}</td>
                    <td className="py-3 px-4 text-slate-500">{pt.landmark || '—'}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(pt._id)}
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

export default AdminPickupPoints;
