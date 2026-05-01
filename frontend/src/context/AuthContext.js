import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser, logoutUser, getUserProfile, getCachedUser, isAuthenticated } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage on mount
    const restoreSession = async () => {
      if (isAuthenticated()) {
        try {
          // Try to get fresh profile from backend
          const profile = await getUserProfile();
          setUser(profile);
        } catch (e) {
          console.error('Error restoring session:', e);
          // Fall back to cached user
          const cached = getCachedUser();
          setUser(cached);
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    const userData = await loginUser(email, password);
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const userData = await registerUser(formData);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    logoutUser();
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
