import { useEffect, useState } from "react";
import axios from "axios";

const UpcomingCounselorSessions = () => {
  const [bookings, setBookings] = useState([]);

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

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm("Cancel this session?");
    if (!confirmCancel) return;

    const reason = prompt("Reason for cancellation:");
    if (!reason) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authenticated.");
        return;
      }

      await axios.post(
        `https://localhost:7065/api/Bookings/${bookingId}/cancel`,
        { reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Booking canceled");
      fetchBookings();
    } catch (err) {
      alert("Error cancelling session");
      console.error(err);
    }
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
                  onClick={() => handleCancel(booking.id)}
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingCounselorSessions;
