// src/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-6 min-h-screen">
      <h2 className="text-xl font-bold mb-8">Dashboard</h2>
      <nav className="flex flex-col space-y-3">
        {role === "client" && (
          <>
            <Link to="/dashboard/client" className="hover:text-cyan-400">My Sessions</Link>
            <Link to="/dashboard/client/quizzes" className="hover:text-cyan-400">Quizzes</Link>
          </>
        )}
        {role === "counsellor" && (
          <>
            <Link to="/dashboard/counsellor" className="hover:text-cyan-400">My Clients</Link>
            <Link to="/dashboard/counsellor/schedule" className="hover:text-cyan-400">Schedule</Link>
          </>
        )}
        {role === "admin" && (
          <>
            <Link to="/dashboard/admin" className="hover:text-cyan-400">Manage Users</Link>
            <Link to="/dashboard/admin/reports" className="hover:text-cyan-400">Reports</Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
