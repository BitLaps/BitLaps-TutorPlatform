/**
 * authService.js
 * Handles all authentication API calls to Django backend.
 * Base URL: configured via VITE_API_BASE_URL env variable
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Helper: set/get auth token from localStorage
export const setToken = (token) => localStorage.setItem("eduvos_token", token);
export const getToken = () => localStorage.getItem("eduvos_token");
export const removeToken = () => localStorage.removeItem("eduvos_token");

// Helper: build headers with Authorization
export const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

/**
 * POST /api/auth/register/
 * Register a new user (student or tutor)
 */
export const register = async (userData) => {
  // userData: { first_name, last_name, email, password, role: 'student'|'tutor', phone? }
  const response = await fetch(`${BASE_URL}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || err.message || "Registration failed");
  }
  return response.json();
};

/**
 * POST /api/auth/login/
 * Log in and return access + refresh tokens
 */
export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Invalid credentials");
  }
  const data = await response.json();
  if (data.access) setToken(data.access);
  return data; // { access, refresh, user: { id, email, role, ... } }
};

/**
 * POST /api/auth/logout/
 * Invalidate refresh token server-side
 */
export const logout = async () => {
  try {
    await fetch(`${BASE_URL}/api/auth/logout/`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ refresh: localStorage.getItem("eduvos_refresh") }),
    });
  } finally {
    removeToken();
    localStorage.removeItem("eduvos_refresh");
  }
};

/**
 * POST /api/auth/token/refresh/
 * Refresh access token using refresh token
 */
export const refreshToken = async () => {
  const refresh = localStorage.getItem("eduvos_refresh");
  if (!refresh) throw new Error("No refresh token");
  const response = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) throw new Error("Token refresh failed");
  const data = await response.json();
  if (data.access) setToken(data.access);
  return data;
};

/**
 * GET /api/auth/me/
 * Get current user profile
 */
export const getCurrentUser = async () => {
  const response = await fetch(`${BASE_URL}/api/auth/me/`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
};

/**
 * PATCH /api/auth/change-password/
 */
export const changePassword = async (oldPassword, newPassword) => {
  const response = await fetch(`${BASE_URL}/api/auth/change-password/`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Password change failed");
  }
  return response.json();
};
