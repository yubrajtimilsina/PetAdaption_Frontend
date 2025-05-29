import React, { useEffect, useState } from "react";
import axios from "axios";

const FavoritePets = () => {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFavorites(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">❤️ My Favorite Pets</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((pet) => (
          <div key={pet._id} className="border rounded p-4 shadow-md">
           <img
        src={pet.photo?.startsWith("http") ? pet.photo : `http://localhost:3000/${pet.photo}`}
        alt={pet.name}
        className="w-full h-96 object-cover rounded-lg mb-6"
      />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">{pet.name}</h1>
        <p className="text-gray-600 text-lg">{pet.age} • {pet.type}</p>
        <p className="text-gray-700 mt-3 leading-relaxed">{pet.description}</p>
      </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritePets;
