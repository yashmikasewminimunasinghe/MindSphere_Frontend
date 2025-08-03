import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentPage from "./PaymentPage";

const PaymentPageWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { counsellor, slot, notes } = location.state || {};

  if (!counsellor || !slot) {
    return (
      <div className="text-center mt-20 text-red-600 font-semibold text-xl">
        Invalid booking. Please go back and try again.
      </div>
    );
  }

  return (
    <PaymentPage
      counsellor={counsellor}
      slot={slot}
      onBack={() =>
        navigate("/booking-confirmation", {
          state: { counsellor, slot, notes },
        })
      }
      onPaymentSuccess={() => navigate("/dashboard/Client")}
    />
  );
};

export default PaymentPageWrapper;
