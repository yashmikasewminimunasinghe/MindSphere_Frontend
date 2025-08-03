import React from "react";
import { Link } from "react-router-dom";

const ClientDashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 p-6">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-5xl w-full">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-6 text-center">
          Client Dashboard
        </h1>

        {/* 🧠 MindMap Quiz Promo */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-10 rounded-md">
          <p className="text-lg font-medium">
            🧠 New! Take the <span className="font-bold text-indigo-700">MindMap Quiz</span> to get matched with the right counselor.
          </p>
          <Link
            to="/dashboard/mindmap"
            className="mt-3 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Take the Quiz Now
          </Link>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { label: "Check Counsellor Availability", to: "/counsellors" },
            { label: "Book a Session", to: "/counsellors" },
            { label: "View & Cancel Upcoming Appointments", to: "/client/upcoming-sessions" },
            { label: "Take Mental Health Quizzes", to: "/client/quiz" },
           
            
          ].map(({ label, to }) => (
            <li
              key={label}
              className="bg-blue-50 hover:bg-blue-100 rounded-lg shadow-md p-8 transition-colors duration-300"
            >
              <Link
                to={to}
                className="block text-center text-blue-800 font-semibold text-xl hover:underline"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClientDashboard;
