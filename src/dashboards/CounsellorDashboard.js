import React from "react";
import { Link } from "react-router-dom";

const CounsellorDashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 p-6">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-3xl w-full">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-10 text-center">
          Counsellor Dashboard
        </h1>
        <ul className="space-y-8">
          {[
           
            { label: "Assign Mental Health Quizzes", to: "/counsellor/assign" },
            { label: "View Quiz Results", to: "/counsellor/results" },
           
             { label: "View & Cancel Upcoming Appointments", to: "/counselor/upcoming-sessions" },
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

export default CounsellorDashboard;
