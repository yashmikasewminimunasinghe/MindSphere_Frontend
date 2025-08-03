import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/login"); // Make sure this route exists in your app
  };

  return (
    <div className="text-center mt-10 p-6 max-w-md mx-auto bg-green-100 rounded shadow">
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="mb-2">Your booking (ID: {bookingId || "N/A"}) has been confirmed.</p>
      <p className="mb-6">The session link will be emailed to you shortly.</p>
      <button
        onClick={handleBackToLogin}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Back to Login
      </button>
    </div>
  );
};

export default PaymentSuccess;
