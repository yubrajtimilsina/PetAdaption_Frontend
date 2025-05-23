import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPets = () => {
  const [pets, setPets] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:3000/api/admin/pets", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPets(res.data));
  }, [token]);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/api/admin/pets/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPets(pets.filter(p => p._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🐾 Manage Pets</h1>
      {pets.map(pet => (
        <div key={pet._id} className="flex justify-between items-center border-b py-2">
          <span>{pet.name} ({pet.type})</span>
          <button onClick={() => handleDelete(pet._id)} className="bg-red-500 text-white px-3 rounded">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminPets;
