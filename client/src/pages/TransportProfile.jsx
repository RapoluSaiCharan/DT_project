import React, { useState, useEffect } from 'react';
import {
  Car,
  MapPin,
  Clock,
  Users,
  Save,
  Loader2,
  CheckCircle2,
  Shield,
  Volume2,
  Wind,
} from 'lucide-react';
import { userService, pickupService } from '../services/api';
import { Alert } from '../components/UIPrimitives';

const TransportProfile = () => {
  const [profile, setProfile] = useState({
    homeLocation: { area: 'Miyapur', address: '', city: 'Hyderabad' },
    destination: { campusName: 'Main Campus', address: 'College Gate' },
    preferredPickupPoint: '',
    travelTime: '08:15',
    returnTime: '17:00',
    transportType: 'CAR',
    availableSeats: 3,
    requiresRide: true,
    offersRide: false,
    preferences: {
      genderPreference: 'ANY',
      smokingAllowed: false,
      musicAllowed: true,
      acAvailable: true,
      notes: '',
    },
  });

  const [pickupPoints, setPickupPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profRes, pickRes] = await Promise.all([
          userService.getTransportProfile(),
          pickupService.getPickupPoints(),
        ]);

        if (profRes.data?.success && profRes.data.data) {
          const d = profRes.data.data;
          setProfile({
            homeLocation: d.homeLocation || { area: 'Miyapur', address: '', city: 'Hyderabad' },
            destination: d.destination || { campusName: 'Main Campus', address: 'College Gate' },
            preferredPickupPoint: d.preferredPickupPoint?._id || d.preferredPickupPoint || '',
            travelTime: d.travelTime || '08:15',
            returnTime: d.returnTime || '17:00',
            transportType: d.transportType || 'CAR',
            availableSeats: d.availableSeats !== undefined ? d.availableSeats : 3,
            requiresRide: d.requiresRide !== undefined ? d.requiresRide : true,
            offersRide: d.offersRide !== undefined ? d.offersRide : false,
            preferences: d.preferences || {
              genderPreference: 'ANY',
              smokingAllowed: false,
              musicAllowed: true,
              acAvailable: true,
              notes: '',
            },
          });
        }

        if (pickRes.data?.success) {
          setPickupPoints(pickRes.data.data || []);
        }
      } catch (err) {
        console.error('Error loading transport profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const res = await userService.updateTransportProfile(profile);
      if (res.data?.success) {
        setFeedback('Commute preferences saved successfully! Recommendations updated.');
      }
    } catch (err) {
      setError(err.message || 'Failed to update preferences.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Commute & Route Preferences
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Customize your daily origin neighborhood, preferred college schedule, and seating options.
        </p>
      </div>

      {feedback && <Alert type="success" message={feedback} onClose={() => setFeedback(null)} />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
        {/* Ride Mode (Looking for Ride vs Offering Ride) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            My Commute Intent
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setProfile((p) => ({ ...p, requiresRide: true, offersRide: false }))}
              className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${
                profile.requiresRide && !profile.offersRide
                  ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              🙋 Looking for a Ride / Co-Passenger
            </button>
            <button
              type="button"
              onClick={() => setProfile((p) => ({ ...p, requiresRide: false, offersRide: true }))}
              className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${
                profile.offersRide
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              🚗 Offering Seats in My Vehicle
            </button>
          </div>
        </div>

        {/* Location & Timings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Home Neighborhood / Area
            </label>
            <input
              type="text"
              value={profile.homeLocation?.area || ''}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  homeLocation: { ...p.homeLocation, area: e.target.value },
                }))
              }
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="e.g. Miyapur, Kukatpally"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">Exact street address remains private.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Destination Campus Block
            </label>
            <input
              type="text"
              value={profile.destination?.campusName || ''}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  destination: { ...p.destination, campusName: e.target.value },
                }))
              }
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="Engineering Block / Main Gate"
            />
          </div>
        </div>

        {/* Preferred Pickup Point */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Preferred Designated Pickup Point
          </label>
          <select
            value={profile.preferredPickupPoint}
            onChange={(e) => setProfile((p) => ({ ...p, preferredPickupPoint: e.target.value }))}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
          >
            <option value="">-- Any Nearby Campus Pickup Point --</option>
            {pickupPoints.map((point) => (
              <option key={point._id} value={point._id}>
                {point.name} ({point.area})
              </option>
            ))}
          </select>
        </div>

        {/* Timings & Transport Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Daily Departure Time
            </label>
            <input
              type="text"
              value={profile.travelTime}
              onChange={(e) => setProfile((p) => ({ ...p, travelTime: e.target.value }))}
              placeholder="08:15"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Evening Return Time
            </label>
            <input
              type="text"
              value={profile.returnTime}
              onChange={(e) => setProfile((p) => ({ ...p, returnTime: e.target.value }))}
              placeholder="17:00"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Transport Type
            </label>
            <select
              value={profile.transportType}
              onChange={(e) => setProfile((p) => ({ ...p, transportType: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
            >
              <option value="CAR">Car</option>
              <option value="BIKE">Two-Wheeler</option>
              <option value="COLLEGE_BUS">College Bus</option>
              <option value="PUBLIC_TRANSPORT">Public Transport</option>
            </select>
          </div>
        </div>

        {/* Preferences Toggle */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
            Ride Comfort Preferences
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 text-xs font-medium cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={profile.preferences?.musicAllowed}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    preferences: { ...p.preferences, musicAllowed: e.target.checked },
                  }))
                }
                className="rounded text-blue-600"
              />
              <span>🎵 Music Friendly</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 text-xs font-medium cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={profile.preferences?.acAvailable}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    preferences: { ...p.preferences, acAvailable: e.target.checked },
                  }))
                }
                className="rounded text-blue-600"
              />
              <span>❄️ AC Preferred</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 text-xs font-medium cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={profile.preferences?.smokingAllowed}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    preferences: { ...p.preferences, smokingAllowed: e.target.checked },
                  }))
                }
                className="rounded text-blue-600"
              />
              <span>🚭 Non-Smoking Only</span>
            </label>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Commute Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransportProfile;
