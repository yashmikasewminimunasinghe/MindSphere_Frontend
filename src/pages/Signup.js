import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    const { firstName, lastName, email, password, confirmPassword, contactNumber, role } = formData;

    // First Name & Last Name
    if (!firstName.trim()) newErrors.firstName = "First Name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last Name is required.";

    // Email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailPattern.test(email)) newErrors.email = "Please enter a valid email.";

    // Contact Number
    if (!contactNumber.trim()) newErrors.contactNumber = "Contact number is required.";
    else if (!/^\d{10,15}$/.test(contactNumber)) newErrors.contactNumber = "Contact number must be 10-15 digits.";

    // Role
    if (!role) newErrors.role = "Role is required.";

    // Password
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    else if (!/[A-Z]/.test(password)) newErrors.password = "Password must include at least one uppercase letter.";
    else if (!/[a-z]/.test(password)) newErrors.password = "Password must include at least one lowercase letter.";
    else if (!/[0-9]/.test(password)) newErrors.password = "Password must include at least one number.";
    else if (!/[!@#$%^&*]/.test(password)) newErrors.password = "Password must include at least one special character.";

    // Confirm Password
    if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post("https://localhost:7065/api/Auth/register", {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        contactNumber: formData.contactNumber.trim(),
        role: formData.role,
      });

      if (response.status === 200 || response.status === 201) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          contactNumber: "",
          role: "",
        });
        setShowSuccessPopup(true);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data?.message) {
          setApiError(error.response.data.message);
        } else if (error.response.status === 400) {
          setApiError("Email already exists.");
        } else {
          setApiError(`Error: ${error.response.statusText || "Unknown error"}`);
        }
      } else if (error.request) {
        setApiError("No response from server. Please check your network.");
      } else {
        setApiError("Error: " + error.message);
      }
    }
  };

  const closePopup = () => {
    setShowSuccessPopup(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-100 relative">
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
            <h3 className="text-xl font-bold text-green-600 mb-2">Registration Successful!</h3>
            <p className="text-gray-700 mb-4">You can now log in to your account.</p>
            <button
              onClick={closePopup}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <img src="/images/logo.png" alt="Logo" className="absolute top-6 left-6 w-20 h-20 object-contain" />

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Create an Account</h2>

        {apiError && <div className="text-red-600 mb-4 text-center">{apiError}</div>}

        <form onSubmit={handleSignup}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700">First Name :</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
              {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
            </div>

            <div>
              <label className="block font-semibold text-gray-700">Last Name :</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
              {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-semibold text-gray-700">Email Address :</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-[50%] p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
          </div>

          <div className="mt-4">
            <label className="block font-semibold text-gray-700">Contact Number :</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-[50%] p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.contactNumber && <span className="text-red-500 text-sm">{errors.contactNumber}</span>}
          </div>

          <div className="mt-4">
            <label className="block font-semibold text-gray-700">Role :</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-[50%] p-2 mt-1 border border-gray-300 rounded-md"
            >
              <option value="">Select Role</option>
              <option value="client">Client</option>
              <option value="counselor">Counselor</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <span className="text-red-500 text-sm">{errors.role}</span>}
          </div>

          <div className="mt-4">
            <label className="block font-semibold text-gray-700">Password :</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-[50%] p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
          </div>

          <div className="mt-4">
            <label className="block font-semibold text-gray-700">Confirm Password :</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-[50%] p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="mt-16 flex justify-center">
            <button
              type="submit"
              className="w-[30%] bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600"
            >
              Register
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>

        <div className="mt-6 flex justify-center">
          <img src="/images/signup.jpg" alt="Signup" className="w-60" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
