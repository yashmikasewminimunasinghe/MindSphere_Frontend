import { useEffect, useState } from "react";
import { getResultsForBooking } from "../../api/clientApi";
import apiClient from "../../api/client";
import { useNavigate } from "react-router-dom";

const ViewResults = () => {
  const [bookings, setBookings] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load bookings for current user
  useEffect(() => {
    apiClient
      .get("/Bookings/mine")
      .then((res) => {
        const mapped = res.data.map((b) => ({
          id: b.id,
          clientName: b.client?.firstName + " " + b.client?.lastName || "Unknown",
          date: b.slot,
        }));
        setBookings(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load bookings.");
      });
  }, []);

  // Load results for selected booking
  useEffect(() => {
    if (!selectedBookingId) {
      setResults([]);
      return;
    }

    getResultsForBooking(selectedBookingId)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setResults(res.data);
          setError(null);
        } else {
          console.warn("Unexpected results format:", res.data);
          setResults([]);
          setError("No valid results returned.");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch results:", err);
        setResults([]);
        setError("Failed to load quiz results.");
      });
  }, [selectedBookingId]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 p-6">
        <div className="max-w-4xl w-full bg-white rounded shadow text-red-600 p-8">
          <h2 className="text-2xl font-semibold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-100 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-blue-900 border-b pb-4">
          Client Quiz Results
        </h2>

        <select
          className="p-3 border border-blue-300 rounded mb-8 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          onChange={(e) => setSelectedBookingId(e.target.value)}
          value={selectedBookingId}
        >
          <option value="">Select a Booking</option>
          {bookings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.clientName} | {new Date(b.date).toLocaleString()}
            </option>
          ))}
        </select>

        {results.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No quiz results for this booking.
          </p>
        ) : (
          <>
            {results.map((r) => (
              <div
                key={r.id}
                className="mb-6 p-6 border border-blue-300 rounded-xl shadow-md bg-blue-50"
              >
                <p className="text-lg font-semibold text-blue-900 mb-1">
                  Quiz: <span className="font-normal">{r.title}</span>
                </p>
                {r.clientName && (
                  <p className="mb-1">
                    <strong>Client:</strong> {r.clientName}
                  </p>
                )}
                <p className="mb-1">
                  <strong>Total Score:</strong> {r.totalScore}
                </p>
                {r.mentalLevel && (
                  <p className="mb-1">
                    <strong>Mental Level:</strong> {r.mentalLevel}
                  </p>
                )}
                <p className="mb-3 text-sm text-gray-700">
                  <strong>Date:</strong>{" "}
                  {new Date(r.assignedAt).toLocaleDateString()}
                </p>
                <p className="font-medium mb-2">Answers:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-800">
                  {r.answers.map((a, i) => (
                    <li key={i}>
                      {a.text} → {a.scaleAnswer ?? `Option ID: ${a.selectedOptionId}`}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/login")}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded shadow"
              >
                Back 
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewResults;
