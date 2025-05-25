import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  setFormData((prev) => ({
    ...prev,
    name: user.name,
    email: user.email,
  }));
}, []);


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">👤 Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Name" />
        <input name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Email" />
        <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full border p-2 rounded" placeholder="New Password" />
        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
};

export default Profile;
