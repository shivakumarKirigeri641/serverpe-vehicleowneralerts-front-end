import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { vehicleOwnerLogout } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [owner, setOwner] = useState(() => {
    const saved = localStorage.getItem('vehicleOwner');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!owner);

  const login = (ownerData) => {
    setOwner(ownerData);
    setIsAuthenticated(true);
    localStorage.setItem('vehicleOwner', JSON.stringify(ownerData));
  };

  const logout = useCallback(async (callApi = true) => {
    try {
      if (callApi) await vehicleOwnerLogout();
    } catch (err) {
      // ignore logout API errors
    }
    setOwner(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vehicleOwner');
  }, []);

  // Logout on browser/tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isAuthenticated) {
        navigator.sendBeacon(
          `${process.env.REACT_APP_API_URL || 'http://localhost:7777'}/vehicleowner/credentials/logout`
        );
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ owner, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
