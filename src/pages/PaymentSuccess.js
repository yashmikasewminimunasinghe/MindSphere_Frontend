// PaymentSuccess.js
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
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl p-12 sm:p-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-indigo-700 drop-shadow-md">
          Payment Successful!
        </h1>
        <p className="text-lg sm:text-xl mb-3 text-gray-700">
          Your booking (ID: <span className="font-medium">{bookingId || "N/A"}</span>) has been confirmed.
        </p>
        <p className="text-lg sm:text-xl mb-8 text-gray-700">
          The session link will be emailed to you shortly.
        </p>
        <button
          onClick={handleBackToLogin}
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-xl transition duration-300"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
