import { useEffect, useState } from "react";
import axios from "axios";

const MindMapQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("https://localhost:7065/api/mindmap/questions")
      .then(res => setQuestions(res.data))
      .catch(() => setError("Failed to load quiz."));
  }, []);

  const handleAnswer = (qId, optionId) => {
    setAnswers(prev => ({ ...prev, [qId]: optionId }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions.");
      return;
    }

    const payload = Object.entries(answers).map(([qId, optId]) => ({
      questionId: Number(qId),
      optionId: Number(optId)
    }));

    axios.post("/api/mindmap/submit", payload)
      .then(res => setResult(res.data))
      .catch(() => setError("Failed to submit quiz."));
  };

  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (result) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Your MindMap Index™ Score</h2>
        <p className="text-xl mb-2">Score: {result.totalScore} / 100</p>
        <p className="mb-4 font-semibold text-indigo-700">{result.mentalState}</p>
        <p className="mb-6">{result.suggestion}</p>

        <h3 className="font-bold mb-2">Recommended Counselor Category:</h3>
        <p className="mb-6 text-teal-700 font-semibold">{result.counselorCategory}</p>

        <button
          onClick={() => window.location.href = "/book-counselor"}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Book a Counselor
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6">MindMap Index™ Quiz</h1>
      {questions.map(q => (
        <div key={q.id} className="mb-6">
          <p className="font-semibold mb-2">{q.id}. {q.text}</p>
          <div className="flex flex-col space-y-2">
            {q.options.map(o => (
              <label key={o.id} className="cursor-pointer">
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={o.id}
                  checked={answers[q.id] === o.id}
                  onChange={() => handleAnswer(q.id, o.id)}
                  className="mr-2"
                />
                {o.text}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default MindMapQuiz;
