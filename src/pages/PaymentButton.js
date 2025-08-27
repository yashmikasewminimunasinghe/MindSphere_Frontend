import React from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RnvFNQJMMhWYwOBVvsgZDnDTrLd8CGujvyyT3ddR1DzC91OjibjOTgOsxdZsqdW3COdHEpWw2HJVq2yfG3qgCeH00io6SPkqS"
);

const PaymentButton = ({ booking }) => {
  if (!booking) {
    return (
      <div className="text-red-600 text-center font-medium mt-4">
        Error: Booking information is missing. Please try again.
      </div>
    );
  }

  const clientId = localStorage.getItem("userId") || "";

  const handleClick = async () => {
    try {
      const payload = {
        CounsellorId: booking.counsellorId,
        Slot: new Date(booking.slot).toISOString(),
        Notes: booking.notes || "",
        ClientId: clientId,
      };

      console.log("Payment payload:", payload);

      const response = await fetch(
        "https://localhost:7065/api/Stripe/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error response:", errorText);
        throw new Error("Failed to create checkout session");
      }

      const session = await response.json();
      const stripe = await stripePromise;

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: session.sessionId });
      } else {
        console.error("Stripe failed to load");
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error redirecting to Stripe checkout:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-12 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 rounded-2xl shadow-lg flex justify-center">
      <button
        onClick={handleClick}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-base px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-xl transition duration-300 ease-in-out"
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentButton;
