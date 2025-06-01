import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");

  const token = localStorage.getItem("token");

  /* Load user data once */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setFormData({ name: user.name, email: user.email, password: "" });
    setRole(user.role);
  }, []);

  /* ---------- profile update ---------- */
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:3000/api/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated!");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  /* ---------- role switch ---------- */
  const handleRoleSwitch = async () => {
    if (!showPasswordField) {
      // first click – reveal password field
      setShowPasswordField(true);
      return;
    }
    if (!currentPassword) return alert("Enter your current password first");

    try {
      const res = await axios.patch(
        "http://localhost:3000/api/users/switch-role",
        { password: currentPassword },                // 🔑 send password
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      setRole(res.data.role);
      // persist updated role in localStorage
      const updatedUser = { ...JSON.parse(localStorage.getItem("user")), role: res.data.role };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // reset UI
      setShowPasswordField(false);
      setCurrentPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to switch role");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-2">👤 Edit Profile</h2>
      <p className="text-sm text-gray-600 mb-4">
        Current role: <strong>{role}</strong>
      </p>

      {/* ---------- profile form ---------- */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Name"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Email"
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="New Password (optional)"
        />
        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>

      {/* ---------- switch role ---------- */}
      {showPasswordField && (
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border p-2 rounded mt-4"
          placeholder="Current password to confirm"
        />
      )}

      <button
        onClick={handleRoleSwitch}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
      >
        {showPasswordField ? "Confirm & Switch Role" : "Switch Role"}
      </button>
    </div>
  );
};

export default Profile;
