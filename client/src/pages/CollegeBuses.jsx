import React, { useState, useEffect } from 'react';
import { Bus, Clock, Phone, MapPin, Search, Users, AlertCircle } from 'lucide-react';
import { busService } from '../services/api';
import { Badge, LoadingSpinner, EmptyState } from '../components/UIPrimitives';

const CollegeBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const res = await busService.getBuses({ search });
      if (res.data?.success) {
        setBuses(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load buses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBuses();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-1">
            <Bus className="w-3.5 h-3.5" />
            Official Fleet Timetables
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            College Bus Fleet & Routes
          </h1>
          <p className="text-sm text-slate-500">
            View morning and evening college transit schedules, assigned drivers, and intermediate boarding stops.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search route or bus number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </form>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching bus fleet timetables..." />
      ) : buses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buses.map((bus) => (
            <div
              key={bus._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4 hover:shadow-elevated transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {bus.busNumber}
                  </span>
                  <Badge variant={bus.currentStatus === 'ON_SCHEDULE' ? 'success' : 'warning'}>
                    {bus.currentStatus}
                  </Badge>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{bus.routeName}</h3>

                <div className="grid grid-cols-2 gap-2 my-3 bg-slate-50 p-3 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Morning Departure</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" /> {bus.morningDeparture} AM
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Evening Return</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-purple-600" /> {bus.eveningReturn} PM
                    </span>
                  </div>
                </div>

                {/* Route Stops */}
                {bus.route && bus.route.length > 0 && (
                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Intermediate Stops & Times
                    </span>
                    {bus.route.map((st, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          {st.stopName}
                        </span>
                        <span className="font-medium text-slate-500">{st.estimatedTime}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Driver info & capacity footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div>
                  <span className="font-bold text-slate-800 block">{bus.driverName}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {bus.driverPhone}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Capacity</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {bus.capacity} seats
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bus}
          title="No college buses found"
          description="Try changing your search keywords."
        />
      )}
    </div>
  );
};

export default CollegeBuses;
