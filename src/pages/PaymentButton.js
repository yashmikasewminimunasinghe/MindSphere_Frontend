// PaymentButton.js
import React from "react";
import { loadStripe } from "@stripe/stripe-js";

// Stripe public key (replace with your live key in production)
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
          headers: {
            "Content-Type": "application/json",
          },
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
        await stripe.redirectToCheckout({ sessionId: session.id });
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
    <button
      onClick={handleClick}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl transition duration-300 ease-in-out"
    >
      Pay Now
    </button>
  );
};

export default PaymentButton;
