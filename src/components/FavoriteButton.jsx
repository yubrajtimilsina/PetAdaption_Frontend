import axios from "axios";
import { Heart } from "lucide-react";
import { useState } from "react";

const FavoriteButton = ({ petId, isFavorited, onToggle }) => {
  const [favorited, setFavorited] = useState(isFavorited);
  const [isAnimating, setIsAnimating] = useState(false);
  const token = localStorage.getItem("token");

  const handleClick = async (e) => {
    e.stopPropagation();
    setIsAnimating(true);

    try {
      const res = await axios.post(
        `http://localhost:3000/api/favorites/${petId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedFavorites = res.data.favorites;
      setFavorited(updatedFavorites.includes(petId));
      onToggle?.(); // refresh parent
    } catch (err) {
      console.error("Error toggling favorite", err);
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
        favorited
          ? "bg-red-500/90 text-white hover:bg-red-600"
          : "bg-white/90 text-gray-600 hover:text-red-500"
      } ${isAnimating ? "scale-125" : "scale-100"} hover:scale-110 shadow-lg`}
    >
      <Heart className={`w-5 h-5 ${favorited ? "fill-current" : ""}`} />
    </button>
  );
};

export default FavoriteButton;
