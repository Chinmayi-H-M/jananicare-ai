// ─────────────────────────────────────────────────────────
// Auth Service — Register, Login, Logout (REST API)
// ─────────────────────────────────────────────────────────

import api from './api';

const TOKEN_KEY = 'jc_token';
const USER_KEY = 'jc_user';

// ── Register new user ──────────────────────────────────
export const registerUser = async (formData) => {
  const response = await api.post('/auth/register', formData);
  const { token, user } = response.data;

  // Store token and user in localStorage
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return user;
};

// ── Login existing user ────────────────────────────────
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { token, user } = response.data;

  // Store token and user in localStorage
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return user;
};

// ── Logout ─────────────────────────────────────────────
export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ── Get current user profile from backend ──────────────
export const getUserProfile = async () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const response = await api.get('/auth/profile');
    const user = response.data;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch (err) {
    // Token expired or invalid
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

// ── Get cached user from localStorage ──────────────────
export const getCachedUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// ── Check if user is authenticated ─────────────────────
export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};
