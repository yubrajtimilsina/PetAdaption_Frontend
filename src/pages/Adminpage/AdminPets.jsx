import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPets = () => {
  const [pets, setPets] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:3000/api/admin/pets", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPets(res.data))
    .catch(err => {
      console.error(err);
      alert("Failed to load pets.");
    });
  }, [token]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this pet?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/admin/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPets(pets.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete pet.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🐾 Manage Pets</h1>
      {pets.map(pet => (
        <div key={pet._id} className="flex justify-between items-center border-b py-2">
          <span>{pet.name} ({pet.type})</span>
          <button
            onClick={() => handleDelete(pet._id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminPets;
