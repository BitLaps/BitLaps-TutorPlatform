/**
 * messagingService.js
 * Handles all messaging API calls.
 */

import { authHeaders } from "./authService";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * GET /api/messages/conversations/
 * Get all conversations for the current user
 */
export const getConversations = async () => {
  const response = await fetch(`${BASE_URL}/api/messages/conversations/`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch conversations");
  return response.json();
};

/**
 * GET /api/messages/?conversation_id=:id
 * Get messages in a conversation
 */
export const getMessages = async (conversationId) => {
  const response = await fetch(`${BASE_URL}/api/messages/?conversation_id=${conversationId}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch messages");
  return response.json();
};

/**
 * POST /api/messages/
 * Send a message
 * @param {Object} data - { recipient_id, content, conversation_id? }
 */
export const sendMessage = async (data) => {
  const response = await fetch(`${BASE_URL}/api/messages/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to send message");
  return response.json();
};

/**
 * PATCH /api/messages/:id/read/
 * Mark message as read
 */
export const markAsRead = async (messageId) => {
  const response = await fetch(`${BASE_URL}/api/messages/${messageId}/read/`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to mark message as read");
  return response.json();
};
