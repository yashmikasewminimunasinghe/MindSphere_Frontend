import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for making HTTP requests

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      setErrorMessage("Email is required");
      return;
    }

    try {
      // Call the backend API to verify the email
      const response = await axios.post("https://localhost:7201/api/Auth/verify-email", {
        email,
      });

      // On success, navigate to Change Password page
      if (response.status === 200) {
        navigate("/change-password", { state: { email } });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("Email not found.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-[#dceefb]">
      <img
        src="/images/logo.png"
        alt="Logo"
        className="absolute top-6 left-6 w-20 h-20 object-contain"
      />

      <div className="bg-white p-8 rounded-2xl shadow-lg w-[600px] text-center">
        <h2 className="text-2xl font-bold text-[#0c1c84] mb-4">Verify Email</h2>
        <p className="text-gray-600 mb-4">Enter your email to verify your identity.</p>

        <form onSubmit={handleVerify}>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#0c1c84]"
          />
          <button
            type="submit"
            className="w-[150px] py-1.5 text-sm bg-[#22b8cf] text-white font-bold rounded-lg hover:bg-[#1a98b0] transition"
          >
            Verify
          </button>
        </form>

        {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}

        <div className="mt-4">
          <a href="/login" className="text-[#0c1c84] font-semibold hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
