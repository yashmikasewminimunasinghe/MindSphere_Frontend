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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Upcoming Sessions with Clients (Counselor)</h1>
      {bookings.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white shadow-sm p-4 rounded border mb-4"
          >
            <p>
              <strong>Client:</strong> {booking.client?.firstName}{" "}
              {booking.client?.lastName}
            </p>
            <p>
              <strong>Slot:</strong> {new Date(booking.slot).toLocaleString()}
            </p>
            {booking.isCanceled ? (
              <div className="text-red-600 mt-2">
                Canceled by {booking.canceledBy} on{" "}
                {new Date(booking.canceledAt).toLocaleString()} <br />
                Reason: {booking.cancelReason}
              </div>
            ) : (
              <button
                onClick={() => handleCancel(booking.id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UpcomingCounselorSessions;
