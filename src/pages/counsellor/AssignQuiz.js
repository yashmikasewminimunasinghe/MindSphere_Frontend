import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // <-- added
import { listQuizzes, assignQuiz } from "../../api/counsellor";
import apiClient from "../../api/client";

const AssignQuiz = ({ user }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedQuizIds, setSelectedQuizIds] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");  // <-- added

  const navigate = useNavigate();  // <-- added

  useEffect(() => {
    if (user?.role === "Counselor" || user?.role === "Admin") {
      listQuizzes()
        .then((r) => setQuizzes(r.data))
        .catch((err) => {
          console.error("Error fetching quizzes:", err);
          setError("Failed to load quizzes.");
        });

      apiClient
        .get("/Bookings/mine")
        .then((r) => setBookings(r.data))
        .catch((err) => {
          console.error("Error fetching bookings:", err);
          setError("Failed to load bookings.");
        });
    } else {
      setError("Unauthorized: You don't have permission to assign quizzes.");
    }
  }, [user]);

  const handleAssign = (bookingId) => {
    const quizId = selectedQuizIds[bookingId];
    if (!quizId) {
      alert("Please select a quiz before assigning.");
      return;
    }
    assignQuiz(bookingId, quizId)
      .then(() => {
        setSuccessMessage("✅ Quiz assigned successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000); // 2 seconds delay before redirect
      })
      .catch((err) => {
        console.error("Error assigning quiz:", err);
        alert("Failed to assign quiz. Please try again.");
      });
  };

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow text-red-600">
        <h2 className="text-xl font-semibold mb-4">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto relative">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Assign Quiz</h1>

      {/* Success popup */}
      {successMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-xl shadow-lg text-center z-50">
          {successMessage}
        </div>
      )}

      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="border border-blue-300 rounded-lg p-4 bg-blue-50 shadow-md"
            >
              <h3 className="text-lg font-semibold text-blue-800 mb-1">
                Patient's name: {b.client.firstName + " " + b.client.lastName}
              </h3>
              <p className="text-blue-700 mb-2">
                Time Slot: {new Date(b.slot).toLocaleString()}
              </p>

              <select
                className="w-full mb-3 p-2 border rounded"
                onChange={(e) =>
                  setSelectedQuizIds({
                    ...selectedQuizIds,
                    [b.id]: Number(e.target.value),
                  })
                }
                value={selectedQuizIds[b.id] || ""}
              >
                <option value="" disabled>
                  Select quiz
                </option>
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAssign(b.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Assign Quiz
                </button>
                <button className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-100">
                  View Result
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignQuiz;
