import React, { useEffect, useState } from "react";
import PetCard from "../../components/PetCard";
import axios from "axios";

const AdopterDashboard = () => {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
       setLoading(true);
      try {
        const params = {
          page,
          limit: 6,
          ...(search && { name: search }),
          ...(type && { type }),
          ...(age && { age }),
        };

        const res = await axios.get("http://localhost:3000/api/pets", { params });

        setPets(res.data.pets);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
      setLoading(false);
    }
    };

    fetchPets();
  }, [search, type, age, page]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🐾 Available Pets for Adoption</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border p-2 rounded"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page on new search
          }}
        />

        <select className="border p-2 rounded" value={type} onChange={(e) => {
          setType(e.target.value);
          setPage(1);
        }}>
          <option value="">All Types</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="rabbit">Rabbit</option>
        </select>

        <select className="border p-2 rounded" value={age} onChange={(e) => {
          setAge(e.target.value);
          setPage(1);
        }}>
          <option value="">All Ages</option>
          <option value="1">1 year</option>
          <option value="2">2 years</option>
          <option value="3">3 years</option>
          <option value="4">4 years</option>
          <option value="5">5 years</option>
        </select>
      </div>

      {/* Pet Grid */}
     {loading ? (
  <p className="text-center text-gray-500">Loading pets...</p>
    ) : pets.length === 0 ? (
    <p className="text-gray-600 italic">No pets found.</p>
   ) : (
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pets.map(pet => <PetCard key={pet._id} pet={pet} />)}
       </div>
      )}


      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          ◀ Prev
        </button>
        <span className="font-semibold text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default AdopterDashboard;
