import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPets = () => {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/api/admin/pets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPets(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load pets.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [token]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this pet?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/admin/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(pets.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete pet.");
    }
  };

  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🐾 Manage Pets</h1>

      <input
        type="text"
        placeholder="Search pets by name..."
        className="border px-3 py-2 mb-4 w-full md:w-1/2 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-blue-500">Loading pets...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredPets.length === 0 ? (
        <p>No pets found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Photo</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Age</th>
                <th className="p-2 border">Shelter</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPets.map((pet) => (
                <tr key={pet._id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {pet.photo ? (
                     <img
                        src={pet.photo?.startsWith("http") ? pet.photo : `http://localhost:3000/${pet.photo}`}
                         alt={pet.name}
                         className="h-9 object-cover rounded-lg mb-6"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No Image</span>
                    )}
                  </td>
                  <td className="p-2 border">{pet.name}</td>
                  <td className="p-2 border capitalize">{pet.type}</td>
                  <td className="p-2 border">{pet.age}</td>
                  <td className="p-2 border">
                    {pet.shelter?.name || "-"} <br />
                    <span className="text-xs text-gray-500">{pet.shelter?.email}</span>
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleDelete(pet._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPets;
