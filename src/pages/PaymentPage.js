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
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 sm:p-10">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          Secure Payment for Session
        </h1>
        <div className="space-y-4 text-gray-700 text-lg">
          <div className="flex justify-between">
            <span className="font-medium">Counsellor:</span>
            <span>{counsellor.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date & Time:</span>
            <span>{new Date(slot).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Amount:</span>
            <span className="text-green-600 font-semibold">$50.00</span>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <PaymentButton booking={bookingDetails} />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
