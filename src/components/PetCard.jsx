import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Calendar, Share2, Camera } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

const PetCard = ({
  pet,
  userFavorites = [],
  refetchPetsOrFavorites = () => {},
  showFavoriteButton = true,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = pet.photo?.startsWith("http")
    ? pet.photo
    : `http://localhost:3000/${pet.photo}`;

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/pet/${pet._id}`;
    if (navigator.share) {
      navigator
        .share({
          title: `Meet ${pet.name}`,
          text: `Check out this adorable ${pet.type}!`,
          url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleRefresh = () => {
    refetchPetsOrFavorites();
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-1 hover:rotate-[0.3deg] max-w-sm mx-auto">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <div className="aspect-w-4 aspect-h-3 bg-gray-200">
          {!imageError ? (
            <img
              src={imageUrl}
              alt={pet.name}
              className={`w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Image loader */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Pet type and gender badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/90 text-gray-700 text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
            {pet.type}
          </span>
          {pet.gender && (
            <span className="bg-blue-500/90 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
              {pet.gender}
            </span>
          )}
        </div>

        {/* Share and Favorite buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/90 text-gray-600 hover:text-blue-600 hover:bg-white transition duration-300 shadow-lg"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {showFavoriteButton && (
            <FavoriteButton
              petId={pet._id}
              isFavorited={userFavorites.includes(pet._id)}
              onToggle={handleRefresh}
            />
          )}
        </div>
      </div>

      {/* Pet Information */}
      <div className="p-5">
        <div className="mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{pet.name}</h3>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Calendar className="w-4 h-4 mr-1" />
            {pet.age} {pet.age === 1 ? "year" : "years"} old
          </div>
        </div>

        {pet.location && (
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
            {pet.location}
          </div>
        )}

        {pet.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {pet.description}
          </p>
        )}

        <Link
          to={`/pet/${pet._id}`}
          className="w-full inline-block text-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PetCard;
