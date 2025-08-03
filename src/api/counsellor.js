// counsellor.js
import api from "./client";

// Fetch all available quizzes
export const listQuizzes = () => api.get("/quiz");

// Assign a quiz to a specific booking
export const assignQuiz = (bookingId, quizId) =>
  api.post("/assignment/assign", { bookingId, quizId });

// View quiz results for a specific booking
export const viewBookingResults = (bookingId) =>
  api.get(`/assignment/results/${bookingId}`);
