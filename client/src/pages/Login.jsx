import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, Lock, Mail, Loader2, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/UIPrimitives';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(formData);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick filler for demo testing
  const fillDemoCredentials = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
            <Car className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Welcome Back to CampusPool</h2>
          <p className="mt-1 text-xs text-slate-500">
            Sign in with your verified college credentials
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              College Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="student@college.edu"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In to CampusPool'}
          </button>
        </form>

        {/* Demo Fast-Login Section */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5 flex items-center justify-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-blue-500" />
            Quick Demo Login Accounts:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillDemoCredentials('student@college.edu', 'password123')}
              className="p-2 text-left rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
            >
              <div className="font-semibold text-slate-800">Student Demo</div>
              <div className="text-[10px] text-slate-500">student@college.edu</div>
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('faculty@college.edu', 'password123')}
              className="p-2 text-left rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 transition-colors"
            >
              <div className="font-semibold text-purple-900">Faculty Demo</div>
              <div className="text-[10px] text-slate-500">faculty@college.edu</div>
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('admin@college.edu', 'password123')}
              className="p-2 text-left rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-colors"
            >
              <div className="font-semibold text-indigo-900">Transport Admin</div>
              <div className="text-[10px] text-slate-500">admin@college.edu</div>
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('superadmin@college.edu', 'password123')}
              className="p-2 text-left rounded-lg border border-slate-200 hover:border-slate-800 hover:bg-slate-100 transition-colors"
            >
              <div className="font-semibold text-slate-900">Super Admin</div>
              <div className="text-[10px] text-slate-500">superadmin@college.edu</div>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          New to CampusPool?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">
            Register your College ID
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
