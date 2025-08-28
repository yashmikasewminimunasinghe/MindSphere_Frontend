import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 p-6">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-xl w-full">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-10 text-center">
          Admin Dashboard
        </h1>
        <ul className="space-y-8">
          <li className="bg-blue-50 hover:bg-blue-100 rounded-lg shadow-md p-8 transition-colors duration-300">
            <Link
              to="/add-counsellor"
              className="block text-center text-blue-800 font-semibold text-xl hover:underline"
            >
              Add New Counsellors
            </Link>
          </li>
          <li className="bg-blue-50 hover:bg-blue-100 rounded-lg shadow-md p-8 transition-colors duration-300">
            <Link
              to="/edit-counsellors"
              className="block text-center text-blue-800 font-semibold text-xl hover:underline"
            >
               Edit Counselors
            </Link>
          </li>
          {/* Add more admin links here */}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
