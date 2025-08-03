import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCounsellor = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [rating, setRating] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [availableSlots, setAvailableSlots] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // modal state

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !specialty || !rating) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("specialty", specialty);
    formData.append("rating", rating);
    if (photoFile) formData.append("photo", photoFile);

    const slotsArray = availableSlots
      .split(",")
      .map((slot) => slot.trim())
      .filter(Boolean);

    slotsArray.forEach((slot) => {
      formData.append("availableSlots", slot);
    });

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post("https://localhost:7065/api/Counsellors", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (onAdd) onAdd(response.data);

      setShowSuccessPopup(true); // show modal
    } catch (error) {
      console.error(error);
      if (error.response) {
        if (error.response.status === 404) {
          alert(error.response.data);
        } else {
          alert(`Error ${error.response.status}: ${error.response.data}`);
        }
      } else {
        alert("Failed to add counsellor. Make sure you're logged in as Admin.");
      }
    }
  };

  const closePopup = () => {
    setShowSuccessPopup(false);
    navigate("/edit-counsellors"); // Navigate to EditCounselor page after success
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center px-4 py-10">
      {/* Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-green-600 text-xl font-bold mb-2">Success!</h2>
            <p className="text-gray-700 mb-4">Counsellor added successfully.</p>
            <button
              onClick={closePopup}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
        <h2 className="text-3xl font-extrabold text-blue-900 mb-6 text-center">
          Add New Counsellor
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Specialty *</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Rating (0-5) *</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Photo</label>
            <input
              type="file"
              accept="image/*"
              className="w-full bg-white"
              onChange={(e) => setPhotoFile(e.target.files[0])}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Available Slots (comma separated)
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={availableSlots}
              onChange={(e) => setAvailableSlots(e.target.value)}
              placeholder="e.g. 2025-06-28 14:00, 2025-06-29 10:30"
            />
          </div>

          <div className="pt-4 flex justify-between gap-4">
            <button
              type="submit"
              className="w-1/2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md"
            >
              Add Counsellor
            </button>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="w-1/2 border border-blue-500 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all"
            >
              Back to Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCounsellor;
