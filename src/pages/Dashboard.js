// src/Dashboard.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ClientDashboard from "./dashboards/ClientDashboard";
import CounsellorDashboard from "./dashboards/CounsellorDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import Sidebar from "./Sidebar";

const Dashboard = ({ user }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar role={user.role} />
      <main className="flex-grow p-6">
        <Routes>
          <Route
            path="client"
            element={
              user.role === "client" ? (
                <ClientDashboard />
              ) : (
                <Navigate to="/unauthorized" replace />
              )
            }
          />
          <Route
            path="counsellor"
            element={
              user.role === "counsellor" ? (
                <CounsellorDashboard />
              ) : (
                <Navigate to="/unauthorized" replace />
              )
            }
          />
          <Route
            path="admin"
            element={
              user.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/unauthorized" replace />
              )
            }
          />
          {/* Redirect to user's dashboard */}
          <Route
            path="/"
            element={<Navigate to={user.role} replace />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
