import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SCORE_DESCRIPTIONS = [
  { score: 0, text: "Not at all" },
  { score: 1, text: "Several days" },
  { score: 2, text: "More than half the days" },
  { score: 3, text: "Nearly every day" },
];

const TakeQuiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get("https://localhost:7065/api/Assignment/pending", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.length) {
          setQuiz(response.data[0]); // only taking the first one
        } else {
          setQuiz(null);
        }
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
        alert("Error fetching quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [token]);

  const handleChange = (qId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz || !quiz.id) return;

    const payload = Object.entries(answers).map(([qId, val]) => ({
      questionId: parseInt(qId),
      optionId: quiz.questions.find((q) => q.id === parseInt(qId)).type === 1 ? val : null,
      scaleAnswer: quiz.questions.find((q) => q.id === parseInt(qId)).type === 0 ? val : null,
    }));

    try {
      await axios.post(`https://localhost:7065/api/Assignment/${quiz.id}/submit`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowSuccess(true);
      // Redirect after 3 seconds automatically
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to submit quiz.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-200">
        <p className="text-xl text-blue-700 font-semibold">Loading...</p>
      </div>
    );

  if (!quiz)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-200 via-white to-green-200">
        <p className="text-2xl text-green-700 font-semibold">No assigned quizzes to complete 🎉</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-100 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-semibold mb-6 text-blue-900 border-b pb-4">{quiz.title}</h2>

        {/* Legend explaining score meanings */}
        <div className="mb-8 p-5 border rounded-lg bg-blue-50 shadow-sm">
          <h3 className="font-semibold mb-3 text-blue-800 text-lg">How to Answer (Score Guide)</h3>
          <table className="w-full border-collapse text-sm text-left">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-blue-300 p-3">Score</th>
                <th className="border border-blue-300 p-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {SCORE_DESCRIPTIONS.map(({ score, text }) => (
                <tr key={score} className="hover:bg-blue-100">
                  <td className="border border-blue-300 p-3 font-mono text-center">{score}</td>
                  <td className="border border-blue-300 p-3">{text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {quiz.questions.map((q) => (
          <div key={q.id} className="mb-8">
            <p className="font-medium text-lg mb-3 text-blue-800">{q.text}</p>

            {q.type === 0 ? (
              <select
                className="mt-1 p-3 border border-blue-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                onChange={(e) => handleChange(q.id, parseInt(e.target.value))}
                value={answers[q.id] ?? ""}
              >
                <option value="">Select...</option>
                {SCORE_DESCRIPTIONS.map(({ score, text }) => (
                  <option key={score} value={score}>
                    {text}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex flex-col space-y-2">
                {q.options.map((o) => (
                  <label
                    key={o.id}
                    className="flex items-center cursor-pointer text-blue-700 hover:text-cyan-700"
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={o.id}
                      onChange={() => handleChange(q.id, o.id)}
                      checked={answers[q.id] === o.id}
                      className="mr-3 cursor-pointer"
                    />
                    {o.text}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-full bg-cyan-600 hover:bg-cyan-700 transition-colors text-white font-semibold py-3 rounded-lg shadow-md"
        >
          Submit Quiz
        </button>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-sm text-center">
            <h3 className="text-2xl font-semibold mb-4 text-green-600">Quiz Submitted!</h3>
            <p className="mb-6 text-gray-700">Your quiz has been submitted successfully.</p>
            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded-lg shadow"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
            <p className="mt-4 text-sm text-gray-500">Redirecting automatically in 3 seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;
