import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("https://localhost:7065/api/Auth/change-password", {
        email,
        newPassword,
      });

      if (response.status === 200) {
        setSuccessMessage("Password updated successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Email not found.");
      } else {
        setError("Failed to update password. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#e3f2fd]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-[#0c1c84] mb-4">Change Password</h2>
        <p className="text-gray-600 mb-4">
          Set a new password for <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />
          <button
            type="submit"
            className="w-full py-2 text-white font-semibold bg-[#0c1c84] hover:bg-[#0a1666] rounded-lg transition duration-200"
          >
            Save Password
          </button>
        </form>

        {error && <p className="mt-4 text-red-500">{error}</p>}
        {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
      </div>
    </div>
  );
};

export default ChangePassword;
