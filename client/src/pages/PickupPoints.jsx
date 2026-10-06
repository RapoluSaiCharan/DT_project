import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, ShieldCheck } from 'lucide-react';
import { pickupService } from '../services/api';
import { LoadingSpinner, EmptyState } from '../components/UIPrimitives';

const PickupPoints = () => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPoints = async () => {
    try {
      setLoading(true);
      const res = await pickupService.getPickupPoints({ search: searchTerm });
      if (res.data?.success) {
        setPoints(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load pickup points:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPoints();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
            <MapPin className="w-3.5 h-3.5" />
            Designated Gathering Points
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Official Campus Pickup Points
          </h1>
          <p className="text-sm text-slate-500">
            Secure, well-lit meeting points designated by college transport administration for pool boarding.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by area or landmark..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </form>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading campus pickup points..." />
      ) : points.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((point) => (
            <div
              key={point._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-3 hover:shadow-elevated transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{point.name}</h3>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {point.area}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Address:</strong> {point.address}</p>
                {point.landmark && (
                  <p><strong>Landmark:</strong> {point.landmark}</p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Official Safe Zone
                </span>
                <span>
                  {point.latitude?.toFixed(4)}, {point.longitude?.toFixed(4)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MapPin}
          title="No pickup points found"
          description="Try searching for another neighborhood or view all points."
        />
      )}
    </div>
  );
};

export default PickupPoints;
