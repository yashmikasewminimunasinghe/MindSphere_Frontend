import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpcomingClientSessions = () => {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelId, setCancelId] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No auth token found");
        return;
      }

      const response = await axios.get("https://localhost:7065/api/Bookings/client", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (err) {
      console.error("Failed to load client bookings", err);
      showAlertMessage("Failed to load client bookings.");
    }
  };

  const showAlertMessage = (msg) => {
    setAlertMessage(msg);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const openCancelModal = (bookingId) => {
    setCancelId(bookingId);
    setCancelReason("");
    setShowModal(true);
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      showAlertMessage("Please enter a reason for cancellation.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showAlertMessage("You are not authenticated.");
        return;
      }

      await axios.post(
        `https://localhost:7065/api/Bookings/${cancelId}/cancel`,
        { reason: cancelReason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showAlertMessage("Booking canceled successfully.");
      setShowModal(false);
      fetchBookings();
    } catch (err) {
      showAlertMessage("Error cancelling session.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-10 px-4 relative">
      {/* Back button at top-left */}
      <button
        onClick={() => navigate("/login")}
        className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Back
      </button>

      <h1 className="text-3xl font-bold text-blue-900 mb-8 mt-6">My Upcoming Sessions</h1>

      {/* Alert popup */}
      {showAlert && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded shadow-lg z-50 animate-fadeIn">
          {alertMessage}
        </div>
      )}

      {/* Booking list container */}
      <div className="w-full max-w-3xl space-y-6">
        {bookings.length === 0 ? (
          <p className="text-center text-blue-700 text-lg">No sessions found.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white shadow-md rounded-lg border border-blue-200 p-6"
            >
              <p className="text-lg font-semibold text-blue-800">
                Counselor: <span className="font-normal">{booking.counsellor?.name || "N/A"}</span>
              </p>
              <p className="text-blue-700 mt-1">
                Slot:{" "}
                <span className="font-medium">
                  {new Date(booking.slot).toLocaleString()}
                </span>
              </p>

              {booking.isCanceled ? (
                <div className="text-red-600 mt-3 text-sm">
                  <p>
                    Canceled by <strong>{booking.canceledBy}</strong> on{" "}
                    {new Date(booking.canceledAt).toLocaleString()}
                  </p>
                  <p>Reason: {booking.cancelReason}</p>
                </div>
              ) : (
                <button
                  onClick={() => openCancelModal(booking.id)}
                  className="mt-4 bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold px-4 py-2 rounded shadow"
                >
                  Cancel
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal for cancellation reason */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Cancel Booking</h2>
            <label className="block mb-2 text-blue-700 font-medium" htmlFor="reason">
              Reason for cancellation:
            </label>
            <textarea
              id="reason"
              rows={4}
              className="w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border border-blue-500 text-blue-600 hover:bg-blue-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default UpcomingClientSessions;
