import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin, isLoading } = useAdmin();
  const [email, setEmail] = useState('tarunkumar140802@gmail.com');
  const [password, setPassword] = useState('lalit2023');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await loginAdmin(email, password);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                🔐
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-2 text-lg">Manage your QuickRide platform</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-gray-900"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔑 Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-gray-900"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-6"
            >
              {isLoading ? '🔄 Logging in...' : '✨ Login'}
            </button>
          </form>

          

          {/* Features List */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-3 uppercase">What you can do:</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Manage Users</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>View Statistics</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Manage Captains</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Track Revenue</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Not an admin?{' '}
              <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                Go back to home
              </a>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>🔒 Secure authentication with JWT tokens</p>
          <p>🌐 Production-ready admin panel</p>
        </div>
      </div>
    </div>
  );
}
