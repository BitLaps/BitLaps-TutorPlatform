/**
 * ratingsService.js
 */
import { authHeaders } from "./authService";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/** POST /api/ratings/ — Submit a rating for a tutor after a session */
export const submitRating = async ({ tutor_id, booking_id, rating, review }) => {
  const response = await fetch(`${BASE_URL}/api/ratings/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ tutor_id, booking_id, rating, review }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to submit rating");
  }
  return response.json();
};

/** GET /api/ratings/?tutor_id=:id */
export const getRatingsByTutor = async (tutorId) => {
  const response = await fetch(`${BASE_URL}/api/ratings/?tutor_id=${tutorId}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch ratings");
  return response.json();
};

// ─────────────────────────────────────────────
/**
 * adminService.js
 * Admin-only API calls — requires admin/staff token
 */

/** GET /api/admin/reports/ — Fetch platform analytics */
export const getAdminReports = async () => {
  const response = await fetch(`${BASE_URL}/api/admin/reports/`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch reports");
  return response.json();
};

/** GET /api/admin/users/ — List all users */
export const getAdminUsers = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${BASE_URL}/api/admin/users/?${params}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

/** PATCH /api/admin/users/:id/ — Approve/suspend user */
export const updateUserStatus = async (userId, status) => {
  const response = await fetch(`${BASE_URL}/api/admin/users/${userId}/`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update user");
  return response.json();
};

/** GET /api/admin/bookings/ */
export const getAdminBookings = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${BASE_URL}/api/admin/bookings/?${params}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch bookings");
  return response.json();
};

/** DELETE /api/admin/users/:id/ */
export const deleteUser = async (userId) => {
  const response = await fetch(`${BASE_URL}/api/admin/users/${userId}/`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete user");
  return true;
};
