import api from "./client";

// Get quizzes pending assignment (if needed)
export const getPendingQuizzes = () => api.get("/Assignment/pending");

// Submit quiz answers
export const submitQuiz = (assignedId, payload) =>
  api.post(`/Assignment/${assignedId}/submit`, payload);

// Get results by bookingId
export const getResultsForBooking = (bookingId) =>
  api.get(`/Assignment/results/${bookingId}`);
