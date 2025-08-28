import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CounsellorList = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please login to view counsellors.");
          return;
        }

        const response = await axios.get("https://localhost:7065/api/Counsellors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCounsellors(response.data);
      } catch (error) {
        console.error("Error fetching counsellors:", error.response?.data || error.message);
        alert("Failed to load counsellors.");
      }
    };

    fetchCounsellors();
  }, []);

  const handleBookSession = () => {
    if (!selectedCounsellor || !selectedSlot) {
      alert("Please select a counsellor and a time slot.");
      return;
    }

    navigate("/booking-confirmation", {
      state: {
        counsellor: selectedCounsellor,
        slot: selectedSlot,
      },
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gradient-to-br from-cyan-100 via-pink-50 to-purple-100 min-h-screen rounded-3xl shadow-xl">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-cyan-800 drop-shadow">
        🌟 Book a Counselling Session 🌟
      </h1>
      {counsellors.map((counsellor) => (
        <div
          key={counsellor.id}
          className={`transition-all duration-300 border-2 p-6 mb-8 rounded-2xl shadow-lg ${
            selectedCounsellor?.id === counsellor.id
              ? "bg-cyan-200 border-cyan-600"
              : "bg-white border-gray-300"
          }`}
        >
          <h2 className="text-2xl font-semibold text-purple-800">{counsellor.name}</h2>
          <p className="text-pink-700 font-medium">{counsellor.specialty}</p>
         
          <button
            onClick={() => {
              setSelectedCounsellor(counsellor);
              setSelectedSlot("");
            }}
            className="mt-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-5 py-2 rounded-full hover:scale-105 transition-transform"
          >
            Select Counsellor
          </button>
          {selectedCounsellor?.id === counsellor.id && (
            <div className="mt-6">
              <label className="block font-semibold text-gray-800 mb-2">🕓 Choose a Time Slot:</label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full border border-purple-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">-- Select a slot --</option>
                {counsellor.availableSlots.map((slot, idx) => (
                  <option key={idx} value={slot}>
                    {new Date(slot).toLocaleString()}
                  </option>
                ))}
              </select>
              <button
                onClick={handleBookSession}
                className="mt-4 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                ✅ Proceed to Confirmation
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CounsellorList;
