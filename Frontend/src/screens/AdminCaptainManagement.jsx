import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminCaptainManagement() {
  const navigate = useNavigate();
  const { token } = useAdmin();
  const [captains, setCaptains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedCaptain, setSelectedCaptain] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchCaptains();
  }, [token, page, search]);

  const fetchCaptains = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ page, limit: 10 });
      if (search) query.append('search', search);

      const response = await fetch(`${API_URL}/admin/captains?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setCaptains(data.captains || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error('Error fetching captains:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCaptain = async (captainId) => {
    if (!window.confirm('Are you sure you want to delete this captain?')) return;

    try {
      const response = await fetch(`${API_URL}/admin/captains/${captainId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setCaptains(captains.filter((c) => c._id !== captainId));
        alert('Captain deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting captain:', error);
      alert('Failed to delete captain');
    }
  };

  const viewCaptainDetails = async (captainId) => {
    try {
      const response = await fetch(`${API_URL}/admin/captains/${captainId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setSelectedCaptain(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching captain details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Captain Management
            </h1>
            <p className="text-gray-600 text-sm mt-1">Total Captains: <span className="font-bold">{pagination.totalCaptains || 0}</span></p>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition font-semibold shadow-md"
          >
            ← Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Box */}
        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition text-gray-900"
            />
          </div>
        </div>

        {/* Captains Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-500"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading captains...</p>
            </div>
          ) : captains.length > 0 ? (
            <>
              {/* Desktop View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Vehicle</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {captains.map((captain) => (
                      <tr key={captain._id} className="hover:bg-green-50 transition">
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {captain.fullname?.firstname} {captain.fullname?.lastname}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{captain.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{captain.phone || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {captain.vehicle?.plate || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            captain.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {captain.status || 'inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => viewCaptainDetails(captain._id)}
                              className="text-green-600 hover:text-green-800 hover:bg-green-100 p-2 rounded transition"
                              title="View details"
                            >
                              👁️
                            </button>
                            <button
                              onClick={() => deleteCaptain(captain._id)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded transition"
                              title="Delete captain"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="sm:hidden space-y-4 p-4">
                {captains.map((captain) => (
                  <div key={captain._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-green-300 transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-900">
                          {captain.fullname?.firstname} {captain.fullname?.lastname}
                        </p>
                        <p className="text-sm text-gray-600">{captain.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        captain.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {captain.status || 'inactive'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1 mb-3">
                      <p>📱 {captain.phone || 'N/A'}</p>
                      <p>🚗 {captain.vehicle?.plate || 'N/A'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewCaptainDetails(captain._id)}
                        className="flex-1 text-green-600 hover:text-green-800 hover:bg-green-100 p-2 rounded transition text-sm font-semibold"
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => deleteCaptain(captain._id)}
                        className="flex-1 text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded transition text-sm font-semibold"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="px-4 sm:px-6 py-4 border-t-2 border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-600">
                  Page <span className="font-bold">{pagination.page}</span> of <span className="font-bold">{pagination.totalPages}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                  >
                    ← Previous
                  </button>
                  <button
                    disabled={page === pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg">No captains found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </main>

      {/* Captain Details Modal */}
      {showModal && selectedCaptain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Captain Details</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedCaptain.captain?.fullname?.firstname} {selectedCaptain.captain?.fullname?.lastname}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-lg text-gray-900">{selectedCaptain.captain?.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="text-lg text-gray-900">{selectedCaptain.captain?.phone || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Vehicle Plate</p>
                <p className="text-lg font-semibold text-gray-900">{selectedCaptain.captain?.vehicle?.plate || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <p className="text-gray-600 text-xs uppercase font-bold">Completed Rides</p>
                  <p className="text-2xl font-bold text-green-600">{selectedCaptain.completedRides || 0}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                  <p className="text-gray-600 text-xs uppercase font-bold">Total Earnings</p>
                  <p className="text-2xl font-bold text-yellow-600">₹{selectedCaptain.totalEarnings?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Status</p>
                <p className={`text-lg font-bold ${selectedCaptain.captain?.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                  {selectedCaptain.captain?.status || 'inactive'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
