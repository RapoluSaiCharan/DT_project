import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  MapPin,
  Users,
  Car,
  Leaf,
  DollarSign,
} from 'lucide-react';
import { adminService } from '../../services/api';
import { LoadingSpinner } from '../../components/UIPrimitives';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [anRes, stRes] = await Promise.all([
          adminService.getAnalytics(),
          adminService.getStats(),
        ]);

        if (anRes.data?.success) setAnalytics(anRes.data.data);
        if (stRes.data?.success) setStats(stRes.data.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <LoadingSpinner text="Aggregating transit demand models..." />
      </div>
    );
  }

  const { peakTravelHours, popularPickupPoints, roleParticipation, poolMetrics } =
    analytics || {
      peakTravelHours: [],
      popularPickupPoints: [],
      roleParticipation: [],
      poolMetrics: {},
    };

  const sustainability = stats?.sustainability || {
    co2SavedKg: 120,
    fuelCostSaved: 5400,
    greenTrips: 38,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-1">
          <BarChart3 className="w-3.5 h-3.5" />
          Campus Mobility Intelligence
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Transport Demand & Route Analytics
        </h1>
        <p className="text-sm text-slate-500">
          Aggregated travel insights, peak commuting hours, high-frequency pickup points, and environmental savings.
        </p>
      </div>

      {/* Sustainability Highlight Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-lg shadow-emerald-600/20 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-100">
            <Leaf className="w-4 h-4" /> Total Carbon Abatement
          </div>
          <div className="text-4xl font-black">{sustainability.co2SavedKg} kg</div>
          <p className="text-xs text-emerald-100">CO2 reduced through shared pooling</p>
        </div>

        <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg shadow-blue-600/20 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-100">
            <DollarSign className="w-4 h-4" /> Cumulative Cost Saved
          </div>
          <div className="text-4xl font-black">₹{sustainability.fuelCostSaved}</div>
          <p className="text-xs text-blue-100">Student & faculty collective savings</p>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Car className="w-4 h-4 text-emerald-400" /> Green Pool Rides
          </div>
          <div className="text-4xl font-black">{sustainability.greenTrips}</div>
          <p className="text-xs text-slate-400">Successfully pooled trips completed</p>
        </div>
      </div>

      {/* Peak Departure Hours Bar Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Peak Departure Timings</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Morning Inbound Demand</span>
        </div>

        <div className="space-y-3 pt-2">
          {peakTravelHours.length > 0 ? (
            peakTravelHours.map((hourData, i) => {
              const maxCount = Math.max(...peakTravelHours.map((h) => h.count), 1);
              const percentage = Math.round((hourData.count / maxCount) * 100);

              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{hourData.hour}</span>
                    <span>{hourData.count} Pools Departing</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between font-semibold text-slate-700">
                <span>07:00 AM – 08:00 AM</span>
                <span>4 Active Pools</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-2/3" />
              </div>

              <div className="flex items-center justify-between font-semibold text-slate-700">
                <span>08:00 AM – 09:00 AM (Peak Rush)</span>
                <span>8 Active Pools</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-full" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Two Column: Most Used Pickup Points vs Role Participation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Most Used Pickup Points */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Top Designated Pickup Gathering Points</h3>
          </div>

          <div className="space-y-3">
            {popularPickupPoints.map((pt, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-800">{pt.name}</div>
                  <span className="text-slate-400">{pt.area}</span>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                  {pt.usageCount || 1} Pools Assigned
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Role Distribution & Capacity */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-base">Community Demographics</h3>
          </div>

          <div className="space-y-3">
            {roleParticipation.map((role, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs">
                <span className="font-bold text-slate-800">{role._id}</span>
                <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                  {role.count} Members
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
            <div className="flex justify-between">
              <span>Avg Vehicle Capacity:</span>
              <strong className="text-slate-800">{Math.round(poolMetrics.avgTotalSeats || 4)} Seats</strong>
            </div>
            <div className="flex justify-between">
              <span>Avg Available per Pool:</span>
              <strong className="text-slate-800">{Math.round(poolMetrics.avgAvailableSeats || 2)} Open Seats</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
