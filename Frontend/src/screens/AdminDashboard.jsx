import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Circular Progress Component
const CircularProgress = ({ percentage, label, size = 120 }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        {/* Percentage text */}
        <text
          x={size / 2}
          y={size / 2 + 6}
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fill="#6d28d9"
          className="pointer-events-none font-bold"
        >
          {percentage}%
        </text>
      </svg>
      <p className="text-sm font-semibold text-gray-700">{label}</p>
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { admin, token, logoutAdmin } = useAdmin();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
  }, [token]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600 text-lg font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex font-inter">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-gradient-to-b from-slate-800 to-slate-900 text-white p-8 sticky top-0 h-screen shadow-2xl border-r border-purple-500/20">
        {/* Logo */}
        <div className="mb-12">
          <div className="text-3xl font-bold mb-2 flex items-center gap-2">
            <span className="text-yellow-400">🚕</span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">DeepRide</span>
          </div>
          <p className="text-purple-300 text-sm font-medium">Admin Control Center</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-3">
          {[
            { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
            { icon: '👥', label: 'Users', path: '/admin/users' },
            { icon: '🚗', label: 'Captains', path: '/admin/captains' },
            { icon: '📈', label: 'Analytics', path: '/admin/analytics' },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-5 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 font-medium ${
                window.location.pathname === item.path
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full px-5 py-3 rounded-xl flex items-center gap-3 bg-red-600/20 hover:bg-red-600/40 text-red-300 hover:text-red-200 transition-all font-semibold border border-red-500/30"
        >
          <span className="text-xl">🚪</span>
          <span>Logout</span>
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 lg:hidden z-40" onClick={() => setSidebarOpen(false)} />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-slate-800 to-slate-900 text-white p-8 transform transition-transform duration-300 lg:hidden z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-6 right-6 text-2xl text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <div className="mt-8 mb-10">
          <div className="text-3xl font-bold mb-2 flex items-center gap-2">
            <span className="text-yellow-400">🚕</span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">DeepRide</span>
          </div>
          <p className="text-purple-300 text-sm">Admin Control Center</p>
        </div>

        <nav className="space-y-3 mb-8">
          {[
            { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
            { icon: '👥', label: 'Users', path: '/admin/users' },
            { icon: '🚗', label: 'Captains', path: '/admin/captains' },
            { icon: '📈', label: 'Analytics', path: '/admin/analytics' },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className="w-full text-left px-5 py-3 rounded-xl flex items-center gap-3 text-gray-300 hover:bg-slate-700/50 transition-all font-medium"
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={() => {
            handleLogout();
            setSidebarOpen(false);
          }}
          className="w-full px-5 py-3 rounded-xl flex items-center gap-3 bg-red-600/20 hover:bg-red-600/40 text-red-300 transition-all font-semibold border border-red-500/30"
        >
          <span className="text-xl">🚪</span>
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-24 lg:pb-0">
        {/* Header */}
        <header className="bg-slate-800/40 backdrop-blur-xl border-b border-purple-500/10 sticky top-0 z-30">
          <div className="px-4 sm:px-8 py-6 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-2xl text-purple-300 hover:text-purple-200"
            >
              ☰
            </button>

            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            </div>

            <div className="lg:hidden text-center flex-1">
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <p className="hidden sm:block text-gray-300 text-sm">
                Welcome back, <span className="font-bold text-white">{admin?.fullname?.firstname}</span> 👋
              </p>
              <button
                onClick={handleLogout}
                className="hidden lg:block bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/50 px-4 py-2 rounded-lg transition-all text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="px-4 sm:px-8 py-8">
          {/* Top Section: Welcome Card - Full Width */}
          <div className="mb-8">
            {/* Welcome Card */}
            <div className="w-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-xl">
              <p className="text-gray-400 text-sm mb-2">Welcome back</p>
              <h2 className="text-3xl font-bold text-white mb-6">
                Hey, {admin?.fullname?.firstname}! 👋
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Active Users</p>
                  <p className="text-3xl font-bold text-purple-300">{stats?.totalUsers}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Captains on Duty</p>
                  <p className="text-3xl font-bold text-blue-300">{stats?.totalCaptains}</p>
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <button
                    onClick={() => navigate('/admin/analytics')}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    View Full Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {/* Total Users */}
            <div className="bg-gradient-to-br from-teal-600/30 to-cyan-600/30 backdrop-blur-xl rounded-2xl p-6 border border-teal-500/30 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-teal-200 text-xs font-semibold uppercase tracking-wide">Total Users</p>
                  <p className="text-4xl font-bold text-white mt-2">{stats?.totalUsers || 0}</p>
                </div>
                <span className="text-3xl">👥</span>
              </div>
              <button
                onClick={() => navigate('/admin/users')}
                className="text-teal-300 hover:text-teal-200 text-xs font-semibold transition"
              >
                Manage Users →
              </button>
            </div>

            {/* Total Captains */}
            <div className="bg-gradient-to-br from-indigo-600/30 to-purple-600/30 backdrop-blur-xl rounded-2xl p-6 border border-indigo-500/30 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wide">Total Captains</p>
                  <p className="text-4xl font-bold text-white mt-2">{stats?.totalCaptains || 0}</p>
                </div>
                <span className="text-3xl">🚗</span>
              </div>
              <button
                onClick={() => navigate('/admin/captains')}
                className="text-indigo-300 hover:text-indigo-200 text-xs font-semibold transition"
              >
                Manage Captains →
              </button>
            </div>

            {/* Total Rides */}
            <div className="bg-gradient-to-br from-amber-600/30 to-orange-600/30 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/30 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-amber-200 text-xs font-semibold uppercase tracking-wide">Total Rides</p>
                  <p className="text-4xl font-bold text-white mt-2">{stats?.totalRides || 0}</p>
                </div>
                <span className="text-3xl">📊</span>
              </div>
              <div className="space-y-1 text-xs">
                <p className="text-green-300">✓ Completed: {stats?.completedRides || 0}</p>
                <p className="text-red-300">✗ Cancelled: {stats?.cancelledRides || 0}</p>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-gradient-to-br from-green-600/30 to-emerald-600/30 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-green-200 text-xs font-semibold uppercase tracking-wide">Total Revenue</p>
                  <p className="text-3xl font-bold text-white mt-2">₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                </div>
                <span className="text-3xl">💰</span>
              </div>
              <p className="text-green-300 text-xs">From completed rides</p>
            </div>
          </div>

          {/* Completion Rate + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Completion Rate */}
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-xl flex flex-col items-center justify-center">
              <CircularProgress
                percentage={
                  stats?.totalRides > 0
                    ? Math.round((stats?.completedRides / stats?.totalRides) * 100)
                    : 0
                }
                label="Completion Rate"
                size={140}
              />
            </div>

            {/* Quick Stats */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-700/30 to-slate-600/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-500/20 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span>📈</span> Quick Overview
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-2">Avg. Revenue/Ride</p>
                  <p className="text-2xl font-bold text-blue-300">
                    ₹{stats?.totalRides > 0 ? (stats?.totalRevenue / stats?.totalRides).toFixed(0) : '0'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-2">Success Rate</p>
                  <p className="text-2xl font-bold text-green-300">
                    {stats?.totalRides > 0
                      ? ((stats?.completedRides / stats?.totalRides) * 100).toFixed(1)
                      : '0'}
                    %
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-2">Cancellation Rate</p>
                  <p className="text-2xl font-bold text-red-300">
                    {stats?.totalRides > 0
                      ? ((stats?.cancelledRides / stats?.totalRides) * 100).toFixed(1)
                      : '0'}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-slate-700/30 to-slate-600/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-500/20 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span>⚡</span> Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/admin/captains')}
                className="group p-6 bg-gradient-to-br from-blue-600/20 to-blue-500/10 hover:from-blue-600/40 hover:to-blue-500/20 rounded-xl border border-blue-500/30 transition-all hover:scale-105 text-center"
              >
                <div className="text-3xl mb-2">➕</div>
                <p className="text-white font-semibold text-sm">Add Captain</p>
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                className="group p-6 bg-gradient-to-br from-purple-600/20 to-purple-500/10 hover:from-purple-600/40 hover:to-purple-500/20 rounded-xl border border-purple-500/30 transition-all hover:scale-105 text-center"
              >
                <div className="text-3xl mb-2">📋</div>
                <p className="text-white font-semibold text-sm">View Users</p>
              </button>
              <button
                onClick={() => navigate('/admin/analytics')}
                className="group p-6 bg-gradient-to-br from-green-600/20 to-green-500/10 hover:from-green-600/40 hover:to-green-500/20 rounded-xl border border-green-500/30 transition-all hover:scale-105 text-center"
              >
                <div className="text-3xl mb-2">📊</div>
                <p className="text-white font-semibold text-sm">View Reports</p>
              </button>
              <button
                onClick={handleLogout}
                className="group p-6 bg-gradient-to-br from-red-600/20 to-red-500/10 hover:from-red-600/40 hover:to-red-500/20 rounded-xl border border-red-500/30 transition-all hover:scale-105 text-center"
              >
                <div className="text-3xl mb-2">🚪</div>
                <p className="text-white font-semibold text-sm">Logout</p>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur-xl border-t border-purple-500/20 lg:hidden z-30">
        <div className="grid grid-cols-4 divide-x divide-purple-500/10">
          {[
            { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
            { icon: '👥', label: 'Users', path: '/admin/users' },
            { icon: '📈', label: 'Analytics', path: '/admin/analytics' },
            { icon: '⚙️', label: 'Settings', path: '/admin/captains' },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`py-4 px-2 flex flex-col items-center gap-1 transition-all ${
                window.location.pathname === item.path
                  ? 'text-purple-300 bg-purple-600/20'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
