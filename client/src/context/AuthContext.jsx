import React, { createContext, useContext, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async ({ notify = true } = {}) => {
    const token = localStorage.getItem('learnhub_token');
    if (notify && token) {
      try {
        await authAPI.logout(token);
      } catch (error) {
        console.warn('Logout email could not be sent:', error.response?.data?.message || error.message);
      }
    }

    localStorage.removeItem('learnhub_token');
    localStorage.removeItem('learnhub_user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
