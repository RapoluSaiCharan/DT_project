import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Calendar,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';
import { poolService, pickupService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/UIPrimitives';

const CreatePool = () => {
  const navigate = useNavigate();
  const { user, isVerified, isAdmin } = useAuth();

  const [pickupPoints, setPickupPoints] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    originArea: 'Miyapur',
    originAddress: 'Near Metro Station',
    destinationCampus: 'Main Campus',
    destinationAddress: 'College Main Gate',
    pickupPoint: '',
    departureTime: '08:15',
    estimatedArrival: '08:50',
    transportType: 'CAR',
    totalSeats: 3,
    estimatedCostTotal: 150,
    recurring: true,
    recurrenceDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    notes: 'Leaving strictly at departure time. AC vehicle with room for bags.',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    const loadPickupPoints = async () => {
      try {
        const res = await pickupService.getPickupPoints();
        if (res.data?.success) {
          setPickupPoints(res.data.data || []);
          if (res.data.data?.length > 0) {
            setFormData((prev) => ({ ...prev, pickupPoint: res.data.data[0]._id }));
          }
        }
      } catch (err) {
        console.warn('Failed to load pickup points', err);
      }
    };
    loadPickupPoints();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError(null);
  };

  const toggleDay = (day) => {
    setFormData((prev) => {
      const exists = prev.recurrenceDays.includes(day);
      const newDays = exists
        ? prev.recurrenceDays.filter((d) => d !== day)
        : [...prev.recurrenceDays, day];
      return { ...prev, recurrenceDays: newDays };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified && !isAdmin) {
      setError('Your college ID is pending verification. Only verified college members can create pools.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        name: formData.name,
        origin: {
          area: formData.originArea,
          address: formData.originAddress,
        },
        destination: {
          campusName: formData.destinationCampus,
          address: formData.destinationAddress,
        },
        pickupPoint: formData.pickupPoint || undefined,
        departureTime: formData.departureTime,
        estimatedArrival: formData.estimatedArrival,
        transportType: formData.transportType,
        totalSeats: parseInt(formData.totalSeats, 10),
        estimatedCostTotal: parseFloat(formData.estimatedCostTotal) || 0,
        recurring: formData.recurring,
        recurrenceDays: formData.recurrenceDays,
        notes: formData.notes,
      };

      const res = await poolService.createPool(payload);
      if (res.data?.success) {
        navigate(`/pools/${res.data.data._id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to create pool. Please review your input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Create a New Transport Pool
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Share your daily vehicle commute with fellow verified campus members and split fuel costs.
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
        {/* Pool Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Pool Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Miyapur Fast Campus Carpool"
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        {/* Origin & Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Origin Neighborhood / Locality
            </label>
            <input
              type="text"
              name="originArea"
              required
              value={formData.originArea}
              onChange={handleChange}
              placeholder="e.g. Miyapur"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Destination Campus Block
            </label>
            <input
              type="text"
              name="destinationCampus"
              required
              value={formData.destinationCampus}
              onChange={handleChange}
              placeholder="Main Campus Gate"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Pickup Point Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Designated Campus Pickup Point
          </label>
          <select
            name="pickupPoint"
            value={formData.pickupPoint}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
          >
            <option value="">-- Choose Official Pickup Point (Optional) --</option>
            {pickupPoints.map((point) => (
              <option key={point._id} value={point._id}>
                {point.name} ({point.area})
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400 mt-1">
            Helps passengers gather at a recognizable and secure landmark.
          </p>
        </div>

        {/* Departure & Arrival */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Departure Time (24h format, e.g. 08:15)
            </label>
            <input
              type="text"
              name="departureTime"
              required
              value={formData.departureTime}
              onChange={handleChange}
              placeholder="08:15"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Estimated Campus Arrival Time
            </label>
            <input
              type="text"
              name="estimatedArrival"
              required
              value={formData.estimatedArrival}
              onChange={handleChange}
              placeholder="08:50"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Transport Type, Seats & Cost */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Transport Type
            </label>
            <select
              name="transportType"
              value={formData.transportType}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
            >
              <option value="CAR">Car</option>
              <option value="BIKE">Two-Wheeler</option>
              <option value="COLLEGE_BUS">College Bus</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Available Seats
            </label>
            <input
              type="number"
              name="totalSeats"
              min="1"
              max="8"
              required
              value={formData.totalSeats}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Total Trip Fuel Cost (₹)
            </label>
            <input
              type="number"
              name="estimatedCostTotal"
              min="0"
              step="10"
              value={formData.estimatedCostTotal}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Recurrence Days */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Weekly Recurrence Days
          </label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => {
              const active = formData.recurrenceDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Special Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Notes / Route Description
          </label>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Vehicle details, luggage room, exact meeting point..."
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Car className="w-4 h-4" />}
            Publish Transport Pool
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePool;
