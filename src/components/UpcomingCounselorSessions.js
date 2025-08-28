import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpcomingCounselorSessions = () => {
  const [bookings, setBookings] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No auth token found");
        return;
      }

      const response = await axios.get("https://localhost:7065/api/Bookings/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (err) {
      console.error("Failed to load counselor bookings", err);
    }
  };

  const handleCancelClick = (bookingId) => {
    setCurrentBookingId(bookingId);
    setCancelReason("");
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason) {
      alert("Please provide a reason for cancellation.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authenticated.");
        return;
      }

      await axios.post(
        `https://localhost:7065/api/Bookings/${currentBookingId}/cancel`,
        { reason: cancelReason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Booking canceled");
      setShowCancelModal(false);
      fetchBookings();
    } catch (err) {
      alert("Error cancelling session");
      console.error(err);
    }
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          Upcoming Sessions with Clients
        </h1>

        <button
          onClick={() => navigate("/login")}
          className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Back
        </button>

        {bookings.length === 0 ? (
          <p className="text-center text-blue-700 text-lg">No sessions found.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white shadow-lg p-5 rounded-2xl border border-blue-200 mb-4 hover:shadow-xl transition"
            >
              <p className="text-blue-800 font-medium">
                <strong>Client:</strong> {booking.client?.firstName}{" "}
                {booking.client?.lastName}
              </p>
              <p className="text-blue-700">
                <strong>Slot:</strong> {new Date(booking.slot).toLocaleString()}
              </p>

              {booking.isCanceled ? (
                <div className="text-red-600 mt-3 font-medium">
                  Canceled by {booking.canceledBy} on{" "}
                  {new Date(booking.canceledAt).toLocaleString()} <br />
                  Reason: {booking.cancelReason}
                </div>
              ) : (
                <button
                  onClick={() => handleCancelClick(booking.id)}
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          ))
        )}

        {/* Cancel Reason Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Cancel Session</h2>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter reason for cancellation"
                className="w-full border border-gray-300 rounded-lg p-2 mb-4"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancelModalClose}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                >
                  Close
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingCounselorSessions;
