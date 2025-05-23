import React, { useEffect, useState } from "react";
import AddPetForm from "../../components/AddPetForm";
import PetCard from "../../components/PetCard";
import axios from "axios";
import api from "../../api";

const ShelterDashboard = () => {
  const [pets, setPets] = useState([]);
    // ✅ now defined

useEffect(() => {
    api.get("/pets/mine").then(res => setPets(res.data));
   }, []);

  return (

    <div className="p-6 max-w-7xl mx-auto">
  <h1 className="text-3xl font-bold text-gray-800 mb-6">👋 Welcome, Shelter!</h1>

  {/* Add Pet Form */}
  <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add a New Pet 🐾</h2>
    <AddPetForm />
  </div>

  {/* Pet List */}
  <div>
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Pets</h2>

    {pets.length === 0 ? (
      <p className="text-gray-600 italic">You haven't listed any pets yet.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <PetCard key={pet._id} pet={pet} />
        ))}
      </div>
    )}
  </div>
</div>

  );
};

export default ShelterDashboard;
