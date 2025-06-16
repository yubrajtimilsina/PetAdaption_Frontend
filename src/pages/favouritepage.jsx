import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PetCard from "../components/PetCard.jsx"; // Ensure this file exists in src/components/
import { Loader2, Heart, AlertCircle, RefreshCcw, PawPrint } from "lucide-react"; // Icons for UI

const API = "http://localhost:3000";

const FavoritePets = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token"); // Get token from localStorage

  // useCallback to memoize the fetch function, preventing unnecessary re-creations
  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        setError("You must be logged in to view your favorite pets.");
        return;
      }
      const res = await axios.get(`${API}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      setError(err.response?.data?.message || "Failed to load favorite pets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]); // Re-create if token changes

  // Fetch favorites on component mount or when fetchFavorites changes
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto my-6 md:my-10">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
        ❤️ My Favorite Pets
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl shadow-lg p-8">
          <Loader2 className="animate-spin text-red-500 mb-4" size={48} />
          <p className="text-lg text-gray-700">Loading your favorite pets...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-50 rounded-xl shadow-lg p-8 text-red-700 border border-red-300">
          <AlertCircle className="mb-4" size={48} />
          <p className="text-xl text-center font-medium">{error}</p>
          <button
            onClick={fetchFavorites} // Allow retrying the fetch
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow"
          >
            <RefreshCcw className="inline-block mr-2" size={18} /> Retry
          </button>
        </div>
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl shadow-lg p-8 text-gray-600">
          <Heart className="mb-4 text-red-400" size={48} />
          <p className="text-xl font-medium mb-2">No favorite pets yet.</p>
          <p className="text-center">Browse our amazing pets and click the heart icon to add them to your favorites!</p>
          <Link
            to="/adopter-dashboard" // Or your main pets listing page
            className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md"
          >
            <PawPrint className="w-5 h-5 mr-2" />
            Find Pets
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((pet) => (
            <PetCard
              key={pet._id}
              pet={pet}
              userFavorites={favorites.map(fav => fav._id)} // Pass current favorites list (just IDs)
              refetchPetsOrFavorites={fetchFavorites} // Pass the function to re-fetch favorites
              showFavoriteButton={true} // Ensure favorite button is shown
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritePets;
