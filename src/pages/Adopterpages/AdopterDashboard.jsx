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
  const [error, setError] = useState(null); // New state for error handling

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
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
        console.error("Error fetching pets:", err);
        setError("Failed to load pets. Please try again later."); // User-friendly error message
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [search, type, age, page]);

  // Function to handle filter changes and reset page
  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 text-center">
        🐾 Find Your Fur-ever Friend 🐾
      </h1>

      <p className="text-lg text-gray-600 text-center mb-8">
        Browse adorable pets available for adoption. Use the filters to find your perfect match!
      </p>

      {/* Filters */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full sm:w-auto flex-grow border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3 rounded-md transition duration-200 ease-in-out text-gray-700"
          value={search}
          onChange={(e) => handleFilterChange(setSearch, e.target.value)}
        />

        <select
          className="w-full sm:w-auto border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3 rounded-md transition duration-200 ease-in-out text-gray-700 bg-white"
          value={type}
          onChange={(e) => handleFilterChange(setType, e.target.value)}
        >
          <option value="">All Types</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="rabbit">Rabbit</option>
          <option value="bird">Bird</option>
          <option value="other">Other</option>
        </select>

        <select
          className="w-full sm:w-auto border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3 rounded-md transition duration-200 ease-in-out text-gray-700 bg-white"
          value={age}
          onChange={(e) => handleFilterChange(setAge, e.target.value)}
        >
          <option value="">All Ages</option>
          <option value="young">Young</option>
          <option value="adult">Adult</option>
          <option value="senior">Senior</option>
          {/* Consider more descriptive age ranges or a dynamic range based on data */}
        </select>
      </div>

      {/* Loading, Error, and Pet Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          <p className="ml-4 text-lg text-gray-600">Loading adorable pets...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 text-lg py-10 px-4 bg-red-50 rounded-lg border border-red-200">
          <p className="font-semibold mb-2">Oops! Something went wrong.</p>
          <p>{error}</p>
          <p className="mt-4">Please refresh the page or try again later.</p>
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center text-gray-600 text-lg py-10 px-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="font-semibold mb-2">No pets found matching your criteria.</p>
          <p>Try adjusting your filters or searching for something else!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {pets.map((pet) => (
            <PetCard key={pet._id} pet={pet} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage((prev) => prev - 1)}
            className="flex items-center px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out shadow-md"
            aria-label="Previous page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Prev
          </button>
          <span className="font-semibold text-lg text-gray-800">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages || loading}
            onClick={() => setPage((prev) => prev + 1)}
            className="flex items-center px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out shadow-md"
            aria-label="Next page"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default AdopterDashboard;