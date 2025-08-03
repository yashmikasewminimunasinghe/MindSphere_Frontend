import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SessionPage = ({ counsellors, sessions, setSessions }) => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const session = sessions.find((s) => s.id === parseInt(sessionId));
  const counsellor = session
    ? counsellors.find((c) => c.id === session.counsellorId)
    : null;

  // Safe quiz retrieval; use optional chaining to avoid errors if counsellor or quizzes is undefined
  const quiz = counsellor?.quizzes?.[0];

  // Declare hooks unconditionally
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Early returns after hooks declared
  if (!session) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <h2 className="text-xl font-semibold">Session not found.</h2>
        <button
          className="mt-4 bg-cyan-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/")}
        >
          Back to Counsellors
        </button>
      </div>
    );
  }

  if (!counsellor) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <h2 className="text-xl font-semibold">Counsellor not found.</h2>
        <button
          className="mt-4 bg-cyan-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/")}
        >
          Back to Counsellors
        </button>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <h2 className="text-xl font-semibold">Quiz not available.</h2>
        <button
          className="mt-4 bg-cyan-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/")}
        >
          Back to Counsellors
        </button>
      </div>
    );
  }

  const handleAnswerChange = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    // Simple check if all answered
    if (quiz.questions.some((q) => !answers[q.id])) {
      alert("Please answer all questions");
      return;
    }
    setShowResults(true);

    // Save answers and mark session completed
    setSessions((prev) =>
      prev.map((s) =>
        s.id === session.id ? { ...s, answers: answers, completed: true } : s
      )
    );
  };

  const score = () => {
    // Example scoring: assign values 0-3 to answers (Never=0,...Always=3)
    const valueMap = { Never: 0, Sometimes: 1, Often: 2, Always: 3 };
    return Object.values(answers).reduce(
      (acc, ans) => acc + (valueMap[ans] || 0),
      0
    );
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        Session with {counsellor.name} on {new Date(session.slot).toLocaleString()}
      </h1>

      {!showResults ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">{quiz.title}</h2>
          <form>
            {quiz.questions.map((q) => (
              <div key={q.id} className="mb-4">
                <p className="font-semibold">{q.question}</p>
                <div className="flex flex-wrap gap-4 mt-2">
                  {q.options.map((opt) => (
                    <label
                      key={opt}
                      className="inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleAnswerChange(q.id, opt)}
                        className="form-radio"
                      />
                      <span className="ml-2">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </form>

          <button
            className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded font-semibold"
            onClick={handleSubmit}
          >
            Submit Quiz
          </button>
        </>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <p className="mb-4">
            Your score is: <strong>{score()}</strong>
          </p>
          <p>
            {score() > quiz.questions.length * 2 ? (
              <span className="text-red-600 font-bold">
                We recommend you discuss these results further with your counselor.
              </span>
            ) : (
              <span className="text-green-600 font-bold">
                Your responses suggest mild symptoms. Keep monitoring your mental health.
              </span>
            )}
          </p>
          <button
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold"
            onClick={() => navigate("/")}
          >
            Back to Counsellors
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionPage;
