// pages/PetDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PetDetails = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const role = JSON.parse(localStorage.getItem("user"))?.user?.role;

  useEffect(() => {
    axios.get(`http://localhost:3000/api/pets/${id}`).then(res => setPet(res.data));
  }, [id]);

  const handleAdopt = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/api/applications/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Adoption request sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  if (!pet) return <p>Loading...</p>;

  return (
   <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6">
  <img
    src={pet.photo?.startsWith("http") ? pet.photo : `http://localhost:3000/${pet.photo}`}
    alt={pet.name}
    className="w-full h-96 object-cover rounded-lg mb-6"
  />

  <div className="space-y-2">
    <h1 className="text-3xl font-bold text-gray-800">{pet.name}</h1>
    <p className="text-gray-600 text-lg">{pet.age} • {pet.type}</p>
    <p className="text-gray-700 mt-3 leading-relaxed">{pet.description}</p>
  </div>

  {role === "adopter" && (
    <button
      onClick={handleAdopt}
      className="mt-6 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
    >
      🐾 Adopt {pet.name}
    </button>
  )}
</div>

  );
};

export default PetDetails;
