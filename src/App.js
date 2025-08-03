import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Your pages imports
import Home from "./pages/home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";
import ChangePassword from "./pages/ChangePassword";
import CounsellorList from "./pages/CounsellorList";
import BookingConfirmation from "./pages/BookingConfirmation";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import SessionPage from "./pages/SessionPage";
import AddCounsellor from "./pages/AddCounsellor";
import Unauthorized from "./pages/Unauthorized";
// import PaymentPageWrapper if still used
// import MindMapQuiz, UpcomingClientSessions, UpcomingCounselorSessions
import MindMapQuiz from "./pages/MindMapQuiz"; 
import UpcomingClientSessions from "./components/UpcomingClientSessions"; 
import UpcomingCounselorSessions from "./components/UpcomingCounselorSessions"; 

// New import: EditCounselor page
import EditCounselor from "./pages/EditCounselor";

// Dashboards
import ClientDashboard from "./dashboards/ClientDashboard";
import CounsellorDashboard from "./dashboards/CounsellorDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

// Quiz Pages
import TakeQuiz from "./pages/client/TakeQuiz";
import Results from "./pages/client/Results";
import AssignQuiz from "./pages/counsellor/AssignQuiz";
import ViewResults from "./pages/counsellor/ViewResults";

function AppRoutes({ user, onLogin }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login onLogin={onLogin} />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/client/upcoming-sessions" element={<UpcomingClientSessions />} />
      <Route path="/counselor/upcoming-sessions" element={<UpcomingCounselorSessions />} />

      <Route
        path="/profile"
        element={
          <Profile
            onProfileSaved={() => {
              window.location.href = "/counsellors";
            }}
          />
        }
      />
      <Route path="/counsellors" element={<CounsellorList />} />
      <Route path="/add-counsellor" element={<AddCounsellor />} />

      {/* New Route for editing counsellors */}
      <Route
        path="/edit-counsellors"
        element={
          user?.role === "Admin" ? (
            <EditCounselor />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />

      {/* Booking & Payment routes */}
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />

      <Route path="/session/:sessionId" element={<SessionPage />} />

      {/* Role-based dashboards */}
      <Route
        path="/dashboard/Client"
        element={
          user?.role === "Client" ? (
            <ClientDashboard />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/dashboard/Counselor"
        element={
          user?.role === "Counselor" ? (
            <CounsellorDashboard />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/dashboard/Admin"
        element={
          user?.role === "Admin" ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />

      {/* Redirect to dashboard based on role or login */}
      <Route
        path="/dashboard"
        element={
          user ? (
            <Navigate to={`/dashboard/${user.role}`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Quiz routes for Client */}
      <Route
        path="/client/quiz"
        element={
          user?.role === "Client" ? (
            <TakeQuiz />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/client/results"
        element={
          user?.role === "Client" ? (
            <Results />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />

      {/* Quiz routes for Counselor */}
      <Route
        path="/counsellor/assign"
        element={
          user?.role === "Counselor" ? (
            <AssignQuiz user={user} />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/counsellor/results"
        element={
          user?.role === "Counselor" ? (
            <ViewResults />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />

      {/* ✅ NEW: MindMap Quiz for Client */}
      <Route
        path="/dashboard/mindmap"
        element={
          user?.role === "Client" ? (
            <MindMapQuiz />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (role) => {
    setUser({ username: "testuser", role }); // role: Client, Counselor, Admin
  };

  return (
    <Router>
      <AppRoutes user={user} onLogin={handleLogin} />
    </Router>
  );
}
