import React, { createContext, useState, useEffect } from 'react';

// Get API URL from environment or use localhost as default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedAdmin = localStorage.getItem('adminData');

    if (storedToken && storedAdmin) {
      try {
        setToken(storedToken);
        setAdmin(JSON.parse(storedAdmin));
      } catch (error) {
        console.error('Error loading admin data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
    }
  }, []);

  const loginAdmin = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.token);
      setAdmin(data.admin);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminData', JSON.stringify(data.admin));

      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAdmin = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        token,
        isLoading,
        loginAdmin,
        logoutAdmin,
        isLoggedIn: !!token,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = React.useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminContextProvider');
  }
  return context;
};
