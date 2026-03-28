import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const { token } = useAdmin();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchAnalytics();
  }, [token]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (dateRange.startDate) query.append('startDate', dateRange.startDate);
      if (dateRange.endDate) query.append('endDate', dateRange.endDate);

      const response = await fetch(`${API_URL}/admin/analytics/rides?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 text-sm mt-1">📊 View detailed ride statistics and insights</p>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition font-semibold shadow-md"
          >
            ← Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
            📅 Filter by Date Range
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchAnalytics}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition shadow-md"
              >
                🔍 Apply Filter
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-purple-600"></div>
            <p className="mt-6 text-gray-600 text-lg font-semibold">Loading analytics...</p>
          </div>
        ) : analytics ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Rides */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Total Rides</h3>
                <span className="text-3xl">📊</span>
              </div>
              <p className="text-4xl font-bold text-blue-600">{analytics.totalRides}</p>
              <p className="text-sm text-gray-600 mt-3">Rides in period</p>
            </div>

            {/* Completed Rides */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Completed</h3>
                <span className="text-3xl">✅</span>
              </div>
              <p className="text-4xl font-bold text-green-600">{analytics.completedRides}</p>
              <p className="text-sm text-gray-600 mt-3">
                <span className="font-bold text-green-600">
                  {analytics.totalRides > 0
                    ? `${((analytics.completedRides / analytics.totalRides) * 100).toFixed(1)}%`
                    : '0%'}
                </span> completion rate
              </p>
            </div>

            {/* Cancelled Rides */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Cancelled</h3>
                <span className="text-3xl">❌</span>
              </div>
              <p className="text-4xl font-bold text-red-600">{analytics.cancelledRides}</p>
              <p className="text-sm text-gray-600 mt-3">Cancelled rides</p>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Total Revenue</h3>
                <span className="text-3xl">💰</span>
              </div>
              <p className="text-4xl font-bold text-yellow-600">₹{analytics.totalRevenue?.toFixed(2) || '0.00'}</p>
              <p className="text-sm text-gray-600 mt-3">Revenue from completed rides</p>
            </div>

            {/* Average Fare */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition sm:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Average Fare</h3>
                <span className="text-3xl">📈</span>
              </div>
              <p className="text-4xl font-bold text-purple-600">₹{analytics.averageFare?.toFixed(2) || '0.00'}</p>
              <p className="text-sm text-gray-600 mt-3">Per ride average</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <p className="text-gray-600 text-lg font-semibold">📭 No analytics data available</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your date range</p>
          </div>
        )}
      </main>
    </div>
  );
}
