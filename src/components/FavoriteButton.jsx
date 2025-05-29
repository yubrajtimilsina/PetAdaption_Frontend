import axios from "axios";
import { useState } from "react";

const FavoriteButton = ({ petId, isFavorited, onToggle }) => {
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false); // for temporary visual feedback

  const toggleFavorite = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setClicked(true); // trigger animation

      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:3000/api/favorites/${petId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onToggle(); // Tell parent to re-fetch updated favorite list
    } catch (error) {
      console.error("Favorite toggle failed:", error);
      alert("Something went wrong!");
    } finally {
      setTimeout(() => setClicked(false), 300); // Reset after animation
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      disabled={loading}
      className={`text-2xl transition-all duration-300 ${
        isFavorited ? "text-red-500" : "text-gray-400"
      } ${clicked ? "scale-125" : "scale-100"} ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
    >
      ❤️
    </button>
  );
};

export default FavoriteButton;
