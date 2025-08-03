import { useEffect, useState } from "react";
import apiClient from "../../api/client";

const Results = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  // Step 1: Get user's bookings
  useEffect(() => {
    apiClient
      .get("/Bookings/client")
      .then((res) => {
        const mapped = res.data.map((b) => ({
          id: b.id,
          date: b.slot,
          clientName: b.client?.name || "Unknown",
        }));
        setBookings(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch bookings:", err);
        setError("Could not load bookings.");
      });
  }, []);

  // Step 2: Get results when booking is selected
  useEffect(() => {
    if (!selectedBookingId) {
      setResults([]);
      return;
    }

    apiClient
      .get(`/assignment/results/${selectedBookingId}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setResults(res.data);
          setError(null);
        } else {
          setResults([]);
          setError("Unexpected results format.");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch results:", err);
        setResults([]);
        setError("No results available for this booking.");
      });
  }, [selectedBookingId]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">My Quiz Results</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Select a Booking:
        </label>
        <select
          className="w-full md:w-1/2 p-2 border rounded"
          value={selectedBookingId}
          onChange={(e) => setSelectedBookingId(e.target.value)}
        >
          <option value="">-- Select --</option>
          {bookings.map((b) => (
            <option key={b.id} value={b.id}>
              {new Date(b.date).toLocaleString()} | {b.clientName}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!results.length && !error ? (
        <p>No quiz results yet for the selected booking.</p>
      ) : (
        results.map((r) => (
          <div
            key={r.id}
            className="mb-4 p-4 border rounded-lg shadow bg-white"
          >
            <p>
              <strong>Quiz:</strong> {r.title}
            </p>
            <p>
              <strong>Score:</strong> {r.totalScore}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(r.assignedAt).toLocaleDateString()}
            </p>
            <ul className="list-disc pl-6 mt-2">
              {r.answers.map((a, i) => (
                <li key={i}>
                  {a.text} → {a.scaleAnswer ?? `Option ID: ${a.selectedOptionId}`}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Results;
