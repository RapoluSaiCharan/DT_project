import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
  MoreVertical,
  Loader2,
} from 'lucide-react';
import { adminService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Badge, LoadingSpinner, Alert } from '../../components/UIPrimitives';

const AdminUsers = () => {
  const { isSuperAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;

      const res = await adminService.getUsers(params);
      if (res.data?.success) {
        setUsers(res.data.data.users || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load user directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleVerification = async (userId, currentVerified) => {
    try {
      const res = await adminService.toggleUserStatus(userId, { isVerified: !currentVerified });
      if (res.data?.success) {
        setFeedback(`User verification status updated.`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isVerified: !currentVerified } : u))
        );
      }
    } catch (err) {
      setError(err.message || 'Failed to update user status.');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await adminService.updateUserRole(userId, newRole);
      if (res.data?.success) {
        setFeedback(`User role changed to ${newRole}.`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      setError(err.message || 'Failed to update user role.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus User & Identity Management
          </h1>
          <p className="text-sm text-slate-500">
            Verify student & faculty college IDs, manage permissions, and assign administrative roles.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, email, roll..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </form>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="FACULTY">Faculty</option>
            <option value="TRANSPORT_ADMIN">Transport Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>
      </div>

      {feedback && <Alert type="success" message={feedback} onClose={() => setFeedback(null)} />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading campus directory..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">College ID</th>
                  <th className="py-3 px-4">Department & Year</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                      {u.collegeId}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{u.department}</div>
                      <div className="text-[10px] text-slate-400">{u.year}</div>
                    </td>
                    <td className="py-3 px-4">
                      {isSuperAdmin ? (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white font-medium"
                        >
                          <option value="STUDENT">STUDENT</option>
                          <option value="FACULTY">FACULTY</option>
                          <option value="TRANSPORT_ADMIN">TRANSPORT_ADMIN</option>
                          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        </select>
                      ) : (
                        <Badge variant={u.role === 'FACULTY' ? 'faculty' : u.role.includes('ADMIN') ? 'admin' : 'primary'}>
                          {u.role}
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {u.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleVerification(u._id, u.isVerified)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                          u.isVerified
                            ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                            : 'border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {u.isVerified ? 'Revoke Verify' : 'Approve Verify'}
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

export default AdminUsers;
