// components/AddPetForm.jsx
import React, { useState } from "react";
import axios from "axios";

const AddPetForm = () => {
  const [form, setForm] = useState({ name: "", age: "", type: "", description: "" });
  const [photo, setPhoto] = useState(null);
 const token = localStorage.getItem("token"); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (photo) formData.append("photo", photo);

    try {
      const res = await axios.post("http://localhost:3000/api/pets", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Pet added!");
      window.location.reload();
    } catch (err) {
      alert("Error uploading pet");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg shadow-md bg-gray-200">
  <div>
    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Pet Name</label>
    <input
      type="text"
      id="name"
      placeholder="Enter pet's name"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      required
      className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>
  <div>
    <label htmlFor="age" className="block text-gray-700 text-sm font-bold mb-2">Age</label>
    <input
      type="number"
      id="age"
      placeholder="Enter pet's age"
      value={form.age}
      onChange={(e) => setForm({ ...form, age: e.target.value })}
      required
      className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>
  <div>
    <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Type</label>
    <input
      type="text"
      id="type"
      placeholder="e.g., Dog, Cat"
      value={form.type}
      onChange={(e) => setForm({ ...form, type: e.target.value })}
      required
      className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>
  <div>
    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
    <textarea
      id="description"
      placeholder="Tell us a bit about your pet"
      value={form.description}
      onChange={(e) => setForm({ ...form, description: e.target.value })}
      className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>
  <div>
    <label htmlFor="photo" className="block text-gray-700 text-sm font-bold mb-2">Photo</label>
    <input type="file" id="photo" onChange={(e) => setPhoto(e.target.files[0])} className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
  </div>
  <button
    type="submit"
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
  >
    Add Pet
  </button>
</form>
  );
};

export default AddPetForm;
