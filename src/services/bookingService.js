/**
 * bookingService.js
 * Handles all booking-related API calls.
 */

import { authHeaders } from "./authService";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * GET /api/bookings/
 * Get bookings for current user (student sees their bookings, tutor sees requests)
 */
export const getBookings = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${BASE_URL}/api/bookings/?${params}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch bookings");
  return response.json();
};

/**
 * GET /api/bookings/:id/
 */
export const getBookingById = async (id) => {
  const response = await fetch(`${BASE_URL}/api/bookings/${id}/`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Booking not found");
  return response.json();
};

/**
 * POST /api/bookings/
 * Create a new booking request (student)
 * @param {Object} bookingData - { tutor_id, subject, date, start_time, end_time, session_type, notes }
 */
export const createBooking = async (bookingData) => {
  const response = await fetch(`${BASE_URL}/api/bookings/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to create booking");
  }
  return response.json();
};

/**
 * PATCH /api/bookings/:id/
 * Update booking status (tutor: accept/reject, student: cancel)
 * @param {string} status - 'accepted' | 'rejected' | 'cancelled' | 'completed'
 */
export const updateBookingStatus = async (id, status, reason = "") => {
  const response = await fetch(`${BASE_URL}/api/bookings/${id}/`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status, reason }),
  });
  if (!response.ok) throw new Error("Failed to update booking");
  return response.json();
};

/**
 * DELETE /api/bookings/:id/
 * Cancel a booking
 */
export const cancelBooking = async (id) => {
  const response = await fetch(`${BASE_URL}/api/bookings/${id}/`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to cancel booking");
  return response.ok;
};
