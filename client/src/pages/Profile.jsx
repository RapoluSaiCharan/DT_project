import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  ShieldCheck,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Save,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { Badge, Alert } from '../components/UIPrimitives';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
    year: user?.year || '1st Year',
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await userService.updateProfile(formData);
      if (res.data?.success) {
        setFeedback('Profile updated successfully.');
        await refreshUser();
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          College Identity Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Your verified campus credentials and transportation contact record.
        </p>
      </div>

      {feedback && <Alert type="success" message={feedback} onClose={() => setFeedback(null)} />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
        {/* Profile Header Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-slate-100 pb-6">
          <div className="w-20 h-20 rounded-2xl bg-blue-100 text-blue-700 font-extrabold text-2xl flex items-center justify-center border-2 border-blue-200 shadow-sm shrink-0">
            {user?.name?.charAt(0)}
          </div>
          <div className="text-center sm:text-left space-y-1 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              {user?.isVerified && (
                <ShieldCheck className="w-5 h-5 text-blue-600" title="Verified College Member" />
              )}
            </div>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <div className="pt-1 flex flex-wrap justify-center sm:justify-start gap-2">
              <Badge variant="primary">{user?.role}</Badge>
              <Badge variant="success">Verified Campus ID</Badge>
              <Badge variant="default">Roll: {user?.collegeId}</Badge>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number (For Ride Updates)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Department / School
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Year / Status
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
