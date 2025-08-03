import React, { useEffect, useState } from "react";

const Profile = ({ onProfileSaved }) => {
  const userId = 1; // Replace with real user ID or from auth

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Base API URL
  const baseApiUrl = "https://localhost:7201/api/Profile";

  // Fetch user data
  useEffect(() => {
    fetch(`${baseApiUrl}/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setContactNumber(data.contactNumber || "");
        setProfilePhotoUrl(data.profilePhotoUrl || null);
      })
      .catch((err) => console.error("Error fetching user data:", err));
  }, [userId]);

  // Handle file change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Save updated profile and photo
  const handleSave = async () => {
    let updatedPhotoUrl = profilePhotoUrl;

    // Upload photo if selected
    if (selectedPhotoFile) {
      const photoFormData = new FormData();
      photoFormData.append("file", selectedPhotoFile);

      try {
        const res = await fetch(`${baseApiUrl}/${userId}/upload-photo`, {
          method: "POST",
          body: photoFormData,
        });

        if (res.ok) {
          const result = await res.json();
          updatedPhotoUrl = result.photoUrl;
        } else {
          alert("Failed to upload profile photo.");
          return;
        }
      } catch (err) {
        console.error("Photo upload error:", err);
        alert("Error uploading profile photo.");
        return;
      }
    }

    // Update profile details
    const profileData = {
      firstName,
      lastName,
      contactNumber,
      profilePhotoUrl: updatedPhotoUrl,
    };

    try {
      const res = await fetch(`${baseApiUrl}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        setPhotoPreview(null);
        setSelectedPhotoFile(null);
        setProfilePhotoUrl(updatedPhotoUrl);

        // Navigate to counsellor list after saving profile
        if (onProfileSaved) {
          onProfileSaved();
        }
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Error updating profile.");
    }
  };

  // Reset to original
  const handleCancel = () => {
    setSelectedPhotoFile(null);
    setPhotoPreview(null);
    fetch(`${baseApiUrl}/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setContactNumber(data.contactNumber || "");
        setProfilePhotoUrl(data.profilePhotoUrl || null);
      })
      .catch((err) => console.error("Error fetching user data:", err));
  };

  return (
    <div className="min-h-screen bg-blue-100 flex justify-center items-center p-10">
      <div className="bg-white p-8 rounded-lg w-full max-w-3xl shadow-md relative">
        {/* Profile photo */}
        <div className="absolute top-8 left-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center text-white text-3xl overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="object-cover w-full h-full" />
            ) : profilePhotoUrl ? (
              <img
                src={`https://localhost:7201${profilePhotoUrl}`}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              "👤"
            )}
          </div>
          <label htmlFor="photo-upload" className="mt-2 text-sm font-medium text-black cursor-pointer">
            Change Photo
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-24">My Profile</h1>

        {/* Form */}
        <div className="space-y-6 mt-4">
          <div className="flex items-center">
            <label className="w-40 font-bold text-lg">Full Name :</label>
            <input
              type="text"
              placeholder="First Name"
              className="bg-gray-200 p-2 rounded mr-4 flex-1"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="bg-gray-200 p-2 rounded flex-1"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <label className="w-40 font-bold text-lg">Email Address :</label>
            <input
              type="email"
              placeholder="Email Address"
              className="bg-gray-200 p-2 rounded flex-1"
              value={email}
              disabled
            />
          </div>

          <div className="flex items-center">
            <label className="w-40 font-bold text-lg">Contact NO :</label>
            <input
              type="text"
              placeholder="Contact NO"
              className="bg-gray-200 p-2 rounded flex-1"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={handleSave}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
