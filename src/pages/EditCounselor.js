import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditCounselor = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    availableSlots: [],
  });
  const [showPopup, setShowPopup] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCounsellors();
  }, []);

  const fetchCounsellors = async () => {
    try {
      const res = await axios.get("https://localhost:7065/api/Counsellors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCounsellors(res.data);
    } catch (error) {
      console.error("Failed to fetch counsellors", error);
    }
  };

  const handleEdit = (counsellor) => {
    setEditing(counsellor.id);
    setForm({
      ...counsellor,
      photoFile: null,
      availableSlots: counsellor.availableSlots || [],
    });
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e) => {
    setForm((prev) => ({ ...prev, photoFile: e.target.files[0] }));
  };

  // Available Slots handlers
  const handleSlotChange = (index, value) => {
    const newSlots = [...form.availableSlots];
    newSlots[index] = value;
    setForm((prev) => ({ ...prev, availableSlots: newSlots }));
  };

  const addSlot = () => {
    setForm((prev) => ({ ...prev, availableSlots: [...prev.availableSlots, ""] }));
  };

  const removeSlot = (index) => {
    const newSlots = [...form.availableSlots];
    newSlots.splice(index, 1);
    setForm((prev) => ({ ...prev, availableSlots: newSlots }));
  };

  const handleUpdate = async () => {
    try {
      if (form.photoFile) {
        const formData = new FormData();
        formData.append("name", form.name || "");
        formData.append("specialty", form.specialty || "");
        formData.append("rating", form.rating ? form.rating.toString() : "0");

        form.availableSlots.forEach((slot) => {
          formData.append("availableSlots", slot);
        });

        formData.append("photo", form.photoFile);

        await axios.put(
          `https://localhost:7065/api/Counsellors/${editing}/photo`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        const updateData = {
          name: form.name || "",
          specialty: form.specialty || "",
          rating: parseFloat(form.rating) || 0,
          availableSlots: form.availableSlots || [],
        };

        await axios.put(
          `https://localhost:7065/api/Counsellors/${editing}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      setEditing(null);
      setShowPopup(true);
      fetchCounsellors();
    } catch (error) {
      console.error("Failed to update counsellor", error);
      alert("Failed to update counsellor. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      {/* Back Button on Top Right */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Back
        </button>
      </div>

      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        Counsellor List
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
          <thead className="bg-blue-200 text-blue-900 font-semibold text-left">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Specialty</th>
              <th className="p-4">Rating</th>
              <th className="p-4 max-w-xs">Available Slots</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {counsellors.map((c) => (
              <tr key={c.id} className="border-t align-top">
                <td className="p-4">{c.name}</td>
                <td className="p-4">{c.email}</td>
                <td className="p-4">{c.specialty}</td>
                <td className="p-4">{c.rating}</td>
                <td className="p-4 whitespace-pre-line max-w-xs">
                  {(c.availableSlots && c.availableSlots.length > 0)
                    ? c.availableSlots.join("\n")
                    : "No slots"}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {counsellors.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-600 p-6">
                  No counsellors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-auto">
            <h3 className="text-xl font-bold text-blue-800 mb-4">Edit Counsellor</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Name</label>
                <input
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Email (readonly)</label>
                <input
                  name="email"
                  value={form.email || ""}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Specialty</label>
                <input
                  name="specialty"
                  value={form.specialty || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Rating</label>
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.rating || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Available Slots */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Available Slots</label>
                {form.availableSlots?.map((slot, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={slot}
                      onChange={(e) => handleSlotChange(idx, e.target.value)}
                      placeholder="YYYY-MM-DD HH:mm"
                      className="flex-grow p-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeSlot(idx)}
                      className="bg-red-600 text-white px-3 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSlot}
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                >
                  + Add Slot
                </button>
              </div>

              {/* Uncomment below to enable photo upload */}
              {/* 
              <div>
                <label className="block text-sm font-semibold text-gray-700">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              */}

              <div className="flex justify-end gap-4 pt-2">
                <button
                  onClick={() => setEditing(null)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-green-600 text-xl font-bold mb-2">Update Successful</h2>
            <p className="text-gray-700 mb-4">The counsellor details were updated successfully.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCounselor;
