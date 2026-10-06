import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Search, Trash2, XCircle, Users, ExternalLink } from 'lucide-react';
import { poolService } from '../../services/api';
import { Badge, LoadingSpinner, Alert } from '../../components/UIPrimitives';

const AdminPools = () => {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const fetchPools = async () => {
    try {
      setLoading(true);
      const res = await poolService.getPools({ status: '' });
      if (res.data?.success) {
        setPools(res.data.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load pools.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, []);

  const handleCancelPool = async (poolId) => {
    if (!window.confirm('Cancel this pool for all campus members?')) return;
    try {
      const res = await poolService.cancelPool(poolId);
      if (res.data?.success) {
        setFeedback('Pool cancelled.');
        fetchPools();
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel pool.');
    }
  };

  const handleDeletePool = async (poolId) => {
    if (!window.confirm('Delete this pool completely from the database?')) return;
    try {
      const res = await poolService.deletePool(poolId);
      if (res.data?.success) {
        setFeedback('Pool deleted.');
        fetchPools();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete pool.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Campus Pools Oversight
        </h1>
        <p className="text-sm text-slate-500">
          Monitor all active and recurring transport pools operating within the college ecosystem.
        </p>
      </div>

      {feedback && <Alert type="success" message={feedback} onClose={() => setFeedback(null)} />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Fetching pools..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Pool Name</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Host Driver</th>
                  <th className="py-3 px-4">Departure</th>
                  <th className="py-3 px-4">Seats</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pools.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <Link to={`/pools/${p._id}`} className="hover:text-blue-600 flex items-center gap-1">
                        {p.name} <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {p.origin?.area} ➔ {p.destination?.campusName || 'Campus'}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {p.driver?.name} ({p.driver?.role})
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {p.departureTime} AM
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {p.availableSeats} of {p.totalSeats}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={p.status === 'OPEN' ? 'success' : p.status === 'FULL' ? 'warning' : 'default'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {p.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleCancelPool(p._id)}
                          className="text-slate-500 hover:text-rose-600 font-semibold transition-colors"
                          title="Cancel Pool"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePool(p._id)}
                        className="text-rose-600 hover:text-rose-800 font-semibold transition-colors"
                        title="Delete Record"
                      >
                        Delete
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

export default AdminPools;
