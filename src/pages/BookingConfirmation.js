import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const BookingConfirmation = ({ onProceedPayment, onBack }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { counsellor, slot } = location.state || {};

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!counsellor || !slot) {
      alert("Please select a counsellor and slot first.");
      navigate("/counsellors");
    }
  }, [counsellor, slot, navigate]);

  if (!counsellor || !slot) return null;

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const clientId = localStorage.getItem("userId");  // <-- GET ClientId from localStorage

      if (!token) {
        alert("You must be logged in to book a session.");
        setLoading(false);
        return;
      }

      if (!clientId) {
        alert("User ID missing. Please login again.");
        setLoading(false);
        return;
      }

      const formattedSlot = new Date(slot)
        .toLocaleString("sv-SE", {
          timeZone: "IST",
          hour12: false,
        })
        .replace("T", " ")
        .slice(0, 16);

      const bookingPayload = {
        CounsellorId: counsellor.id,
        Slot: formattedSlot,
        Notes: notes,
        ClientId: clientId,  // <-- IMPORTANT: send ClientId to backend
      };

      const response = await axios.post(
        "https://localhost:7065/api/Bookings",
        bookingPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setBooking(response.data);

        setSuccessMessage("✅ Your booking is confirmed! Redirecting to payment...");
        setTimeout(() => {
          if (onProceedPayment) {
            onProceedPayment(notes);
          } else {
            navigate("/payment", { state: { booking: response.data, counsellor, slot, notes } });
          }
        }, 2000);
      } else {
        alert("Failed to confirm booking. Please try again.");
      }
    } catch (error) {
      console.error("Error confirming booking:", error.response?.data || error.message);
      alert(
        "Booking failed: " +
          (error.response?.data?.message || JSON.stringify(error.response?.data) || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-6 relative">
      {successMessage && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-xl shadow-lg text-center z-50 animate-bounce">
          {successMessage}
        </div>
      )}

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-blue-200 p-8">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8 drop-shadow">
          🎉 Confirm Your Booking
        </h1>

        <div className="mb-6 bg-blue-50 p-5 rounded-xl shadow border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-900">{counsellor.name}</h2>
          <p className="text-cyan-700 font-medium">{counsellor.specialty}</p>
          <p className="mt-2 font-semibold text-gray-700">🗓️ Date & Time:</p>
          <p className="text-gray-600 italic">{new Date(slot).toLocaleString()}</p>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">📝 Additional Notes (optional):</label>
          <textarea
            rows={4}
            className="w-full border border-blue-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any details you want to share with the counsellor..."
          />
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={onBack || (() => navigate("/payment", { state: { booking, counsellor, slot, notes } }))}
            className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-full shadow-md hover:scale-105 transition-all"
            disabled={loading}
          >
            ⬅️ Back
          </button>
          <button
            onClick={handleConfirmBooking}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:scale-105 transition-all"
            disabled={loading}
          >
            {loading ? "Confirming..." : "✅ Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
