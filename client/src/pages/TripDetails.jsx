import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Route,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Star,
  ArrowLeft,
  Loader2,
  Play,
  Calculator,
} from 'lucide-react';
import { tripService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Badge, LoadingSpinner, Alert } from '../components/UIPrimitives';
import RatingModal from '../components/RatingModal';

const TripDetails = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  // Cost calculator state
  const [costForm, setCostForm] = useState({
    totalCost: 150,
    driverContribution: 0,
  });

  // Rating modal state
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedRatee, setSelectedRatee] = useState(null);

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const res = await tripService.getTripById(id);
      if (res.data?.success) {
        setTrip(res.data.data);
        setCostForm({
          totalCost: res.data.data.totalCost || 150,
          driverContribution: res.data.data.driverContribution || 0,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch trip details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <LoadingSpinner text="Fetching trip information..." />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Trip record not found</h2>
        <Link to="/trips" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline">
          Return to Trips
        </Link>
      </div>
    );
  }

  const isDriver = trip.driverId?._id === user?._id || trip.driverId === user?._id;
  const isPassenger = trip.passengerIds?.some((p) => (p._id || p) === user?._id);

  // Complete Trip Handler
  const handleCompleteTrip = async () => {
    try {
      setActionLoading(true);
      setError(null);
      const res = await tripService.updateStatus(trip._id, 'COMPLETED');
      if (res.data?.success) {
        setFeedback('Trip marked as COMPLETED! Passengers are notified to rate the ride.');
        await fetchTrip();
      }
    } catch (err) {
      setError(err.message || 'Failed to complete trip.');
    } finally {
      setActionLoading(false);
    }
  };

  // Recalculate Trip Cost Handler
  const handleRecalculateCost = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setError(null);
      const res = await tripService.updateCost(trip._id, {
        totalCost: parseFloat(costForm.totalCost),
        driverContribution: parseFloat(costForm.driverContribution),
      });

      if (res.data?.success) {
        setFeedback(`Cost calculated server-side! New share: ₹${res.data.data.trip.costPerPerson}/person`);
        setTrip(res.data.data.trip);
      }
    } catch (err) {
      setError(err.message || 'Failed to calculate shared cost.');
    } finally {
      setActionLoading(false);
    }
  };

  const openRating = (participant) => {
    setSelectedRatee(participant);
    setRatingModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/trips"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to My Trips
      </Link>

      {feedback && <Alert type="success" message={feedback} onClose={() => setFeedback(null)} />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Main Trip Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
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
                size="md"
              >
                Status: {trip.status}
              </Badge>
              {trip.emergencyStatus && (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> SOS Logged
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {trip.origin} ➔ {trip.destination}
            </h1>
            <p className="text-xs text-slate-500">
              Trip started on {new Date(trip.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Fare Summary Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-right shrink-0">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Fair Share Per Person
            </span>
            <div className="text-3xl font-extrabold text-emerald-600">₹{trip.costPerPerson}</div>
            <span className="text-[11px] text-slate-500">Total: ₹{trip.totalCost}</span>
          </div>
        </div>

        {/* Driver & Trip Management Controls */}
        {isDriver && trip.status === 'STARTED' && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-emerald-950">Active Commute in Progress</h4>
              <p className="text-xs text-emerald-800">
                You are currently driving this pool. Click Complete Trip when you arrive safely at campus.
              </p>
            </div>
            <button
              onClick={handleCompleteTrip}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Complete Trip
            </button>
          </div>
        )}

        {/* Server-Side Cost Calculator Section */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">Server-Side Cost Sharing Calculation</h3>
          </div>
          <p className="text-xs text-slate-500">
            Server calculates fair split: <code>(Total Cost - Driver Fuel Share) ÷ Number of Passengers</code>.
          </p>

          <form onSubmit={handleRecalculateCost} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Trip Expense (₹)</label>
              <input
                type="number"
                min="0"
                value={costForm.totalCost}
                onChange={(e) => setCostForm((p) => ({ ...p, totalCost: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Driver Voluntary Share (₹)</label>
              <input
                type="number"
                min="0"
                value={costForm.driverContribution}
                onChange={(e) => setCostForm((p) => ({ ...p, driverContribution: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={actionLoading || (!isDriver && !isAdmin)}
                className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all disabled:opacity-50"
              >
                {actionLoading ? 'Updating Server...' : 'Recalculate Share'}
              </button>
            </div>
          </form>
        </div>

        {/* Participants & Ratings Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            Ride Participants & Feedback
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Driver Card */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  {trip.driverId?.name?.charAt(0) || 'D'}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-xs flex items-center gap-1">
                    {trip.driverId?.name}
                    {trip.driverId?.isVerified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">Driver • {trip.driverId?.department}</span>
                </div>
              </div>

              {trip.status === 'COMPLETED' && !isDriver && (
                <button
                  onClick={() => openRating(trip.driverId)}
                  className="px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs border border-amber-200 flex items-center gap-1 transition-colors"
                >
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Rate Driver
                </button>
              )}
            </div>

            {/* Passenger Cards */}
            {trip.passengerIds?.map((passenger, idx) => {
              const isCurrentPassenger = passenger._id === user?._id;

              return (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm">
                      {passenger.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-xs flex items-center gap-1">
                        {passenger.name}
                        {isCurrentPassenger && <span className="text-[10px] text-blue-600 font-bold">(You)</span>}
                      </div>
                      <span className="text-[10px] text-slate-400">Passenger • {passenger.department}</span>
                    </div>
                  </div>

                  {trip.status === 'COMPLETED' && isDriver && (
                    <button
                      onClick={() => openRating(passenger)}
                      className="px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs border border-amber-200 flex items-center gap-1 transition-colors"
                    >
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Rate Rider
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Rating Modal */}
      <RatingModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        trip={trip}
        rateeUser={selectedRatee}
        onRatingSubmitted={() => setFeedback('Thank you! Rating submitted successfully.')}
      />
    </div>
  );
};

export default TripDetails;
