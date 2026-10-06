import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Route,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  DollarSign,
  Users,
} from 'lucide-react';
import { tripService } from '../services/api';
import { Badge, LoadingSpinner, EmptyState } from '../components/UIPrimitives';
import { useAuth } from '../context/AuthContext';

const Trips = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const params = {};
        if (statusFilter !== 'ALL') params.status = statusFilter;

        const res = await tripService.getTrips(params);
        if (res.data?.success) {
          setTrips(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load trips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [statusFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-1">
            <Route className="w-3.5 h-3.5" />
            Commute Logs & Trips
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Commute Trips
          </h1>
          <p className="text-sm text-slate-500">
            Track active rides, view completed trips, and manage cost sharing.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex rounded-xl bg-slate-100 p-1 self-start sm:self-auto">
          {['ALL', 'STARTED', 'SCHEDULED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === st
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Trips' : st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching your trips..." />
      ) : trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const isDriver = trip.driverId?._id === user?._id || trip.driverId === user?._id;

            return (
              <div
                key={trip._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-elevated transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant={
                        trip.status === 'COMPLETED'
                          ? 'success'
                          : trip.status === 'STARTED'
                          ? 'primary'
                          : trip.status === 'EMERGENCY'
                          ? 'danger'
                          : 'default'
                      }
                      size="sm"
                    >
                      {trip.status}
                    </Badge>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {new Date(trip.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    {trip.origin} ➔ {trip.destination}
                  </h3>

                  <div className="space-y-2 text-xs text-slate-600 my-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Your Role</span>
                      <span className="font-semibold text-slate-800">
                        {isDriver ? '🚗 Host Driver' : '🎒 Co-Passenger'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Driver</span>
                      <span className="font-medium text-slate-800">{trip.driverId?.name || 'Driver'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Passengers</span>
                      <span className="font-medium text-slate-800">
                        {trip.passengerIds?.length || 0} Member(s)
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-slate-500">Split Fare</span>
                      <span className="font-bold text-emerald-600 text-sm">
                        ₹{trip.costPerPerson} / person
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Total: ₹{trip.totalCost}
                  </span>

                  <Link
                    to={`/trips/${trip._id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Trip Details & Cost
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Route}
          title="No commute trips found"
          description="When you start or participate in a pool, your trip logs, shared costs, and participant reviews will show here."
          actionText="Explore Open Pools"
          onAction={() => (window.location.href = '/pools')}
        />
      )}
    </div>
  );
};

export default Trips;
