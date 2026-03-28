import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

export default function AdminProtectedWrapper({ children }) {
  const navigate = useNavigate();
  const { token, isLoading } = useAdmin();

  useEffect(() => {
    if (!isLoading && !token) {
      navigate('/admin/login');
    }
  }, [token, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return token ? children : null;
}
