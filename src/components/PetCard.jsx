// PetCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";

const PetCard = ({
  pet,
  userFavorites = [],
  refetchPetsOrFavorites = () => {},
  showFavoriteButton = true, // default to true
}) => {
  const imageUrl = pet.photo?.startsWith("http")
    ? pet.photo
    : `http://localhost:3000/${pet.photo}`;

  return (
    <div className="border rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 bg-white min-h-[350px]">
      <div className="relative group">
        <img
          src={imageUrl}
          alt={pet.name}
          className="w-full h-48 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-white/80 p-1 rounded-full shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25m0 0L12 9.75m3.75-4.5l3.75 4.5M4.5 15h15m-15 0l3.75-4.5m-3.75 4.5L8.25 19.5"
            />
          </svg>
        </div>
      </div>

      {/* Only show favorite button if showFavoriteButton is true */}
      {showFavoriteButton && (
        <FavoriteButton
          petId={pet._id}
          isFavorited={userFavorites.includes(pet._id)}
          onToggle={refetchPetsOrFavorites}
        />
      )}

      <h2 className="text-xl font-semibold mt-3 text-gray-800">{pet.name}</h2>
      <p className="text-sm text-gray-600 mb-2">
        {pet.type} • Age: {pet.age}
      </p>

      <Link
        to={`/pet/${pet._id}`}
        className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        View Details
      </Link>
    </div>
  );
};

export default PetCard;
