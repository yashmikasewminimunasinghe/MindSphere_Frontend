// PaymentPage.js
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentButton from "./PaymentButton";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { booking, counsellor, slot, notes } = location.state || {};

  useEffect(() => {
    if (!booking || !booking.id || !counsellor || !slot) {
      navigate("/counsellors");
    }
  }, [booking, counsellor, slot, navigate]);

  if (!booking || !booking.id || !counsellor || !slot) return null;

  const clientId = localStorage.getItem("clientId");

  const bookingDetails = {
    id: booking.id,
    counsellorId: counsellor.id,
    slot,
    notes,
    clientId,
    amount: 5000,
    currency: "usd",
    description: `Payment for session with ${counsellor.name} on ${new Date(
      slot
    ).toLocaleString()}`,
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl p-12 sm:p-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-8 text-center drop-shadow-md">
          Payment for Session
        </h1>
        <div className="space-y-6 text-gray-700 text-lg sm:text-xl">
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-medium">Counsellor:</span>
            <span>{counsellor.name}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-medium">Date & Time:</span>
            <span>{new Date(slot).toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-medium">Amount:</span>
            <span className="text-green-600 font-semibold text-lg sm:text-xl">
              $100.00
            </span>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <PaymentButton booking={bookingDetails} />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
