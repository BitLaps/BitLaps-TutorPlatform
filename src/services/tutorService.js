/**
 * tutorService.js
 * Handles all tutor-related API calls.
 */

import { authHeaders } from "./authService";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * GET /api/tutors/
 * Search/filter tutors
 * @param {Object} filters - { subject, grade, location, availability, page, page_size }
 */
export const getTutors = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== "" && val !== null && val !== undefined) params.append(key, val);
  });
  const response = await fetch(`${BASE_URL}/api/tutors/?${params}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch tutors");
  return response.json(); // { count, next, previous, results: [...tutors] }
};

/**
 * GET /api/tutors/:id/
 * Get single tutor profile
 */
export const getTutorById = async (id) => {
  const response = await fetch(`${BASE_URL}/api/tutors/${id}/`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Tutor not found");
  return response.json();
};

/**
 * GET /api/tutors/me/
 * Get the currently logged-in tutor's own profile
 */
export const getMyProfile = async () => {
  const response = await fetch(`${BASE_URL}/api/tutors/me/`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Profile not found");
  return response.json();
};

/**
 * POST /api/tutors/
 * Create tutor profile
 */
export const createTutorProfile = async (profileData) => {
  // profileData: { bio, subjects, hourly_rate, location, qualifications, availability }
  const response = await fetch(`${BASE_URL}/api/tutors/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(profileData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to create profile");
  }
  return response.json();
};

/**
 * PATCH /api/tutors/:id/
 * Update tutor profile
 */
export const updateTutorProfile = async (id, profileData) => {
  const response = await fetch(`${BASE_URL}/api/tutors/${id}/`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(profileData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to update profile");
  }
  return response.json();
};

/**
 * PATCH /api/tutors/:id/availability/
 * Update tutor availability slots
 * @param {Array} slots - [{ day: 'Monday', start: '09:00', end: '12:00' }, ...]
 */
export const updateAvailability = async (id, slots) => {
  const response = await fetch(`${BASE_URL}/api/tutors/${id}/availability/`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ availability: slots }),
  });
  if (!response.ok) throw new Error("Failed to update availability");
  return response.json();
};

/**
 * GET /api/tutors/:id/ratings/
 * Get ratings for a tutor
 */
export const getTutorRatings = async (id) => {
  const response = await fetch(`${BASE_URL}/api/tutors/${id}/ratings/`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch ratings");
  return response.json();
};
