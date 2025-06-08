import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Search, Trash2, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AddPetForm from "../../components/AddPetForm";
import CustomModal from "../../components/CustomModal";

const AdminPets = () => {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const token = localStorage.getItem("token");

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
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
  }, [token]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!confirmDelete) return;
    setActionLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/admin/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete pet.");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePetAdded = () => {
    fetchPets();
    setShowAddForm(false);
  };

  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Pet Management</h2>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search pets by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-lg text-gray-600">Loading pets...</p>
        </div>
      ) : error ? (
        <p className="text-center text-red-500 py-10">{error}</p>
      ) : filteredPets.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No pets found matching your search.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider rounded-tl-lg">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Shelter</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPets.map((pet) => (
                <tr key={pet._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link to={`/pet/${pet._id}`}>
                      {pet.photo ? (
                        <img
                          src={pet.photo.startsWith("http") ? pet.photo : `http://localhost:3000/${pet.photo}`}
                          alt={pet.name}
                          className="h-10 w-10 object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 italic text-xs">No Image</span>
                      )}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <Link to={`/pet/${pet._id}`} className="text-blue-600 hover:underline">
                      {pet.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 capitalize">{pet.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{pet.age}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {pet.shelter?.name || "-"} <br />
                    <span className="text-xs text-gray-500">{pet.shelter?.email}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(pet._id, pet.name)}
                      className="inline-flex items-center text-red-600 hover:text-red-800 font-medium"
                      disabled={actionLoading}
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Pet Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="mt-8 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200 flex items-center justify-center shadow-md disabled:opacity-50"
        disabled={actionLoading}
      >
        <PlusCircle size={20} className="mr-2" /> Add New Pet
      </button>

      {/* Add Pet Modal */}
      {showAddForm && (
        <CustomModal title="Add New Pet" onClose={() => setShowAddForm(false)}>
          <AddPetForm
            token={token}
            onPetAdded={handlePetAdded}
            onClose={() => setShowAddForm(false)}
            setLoading={setLoading}
            setError={setError}
          />
        </CustomModal>
      )}

     
    </section>
  );
};

export default AdminPets;
