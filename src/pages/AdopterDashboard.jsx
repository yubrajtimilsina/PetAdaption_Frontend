import React, { useEffect, useState } from "react";
import PetCard from "../components/PetCard";
import axios from "axios";

const AdopterDashboard = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/pets")
      .then((res) => setPets(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🐾 Available Pets for Adoption</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <PetCard key={pet._id} pet={pet} />
        ))}
      </div>
    </div>
  );
};

export default AdopterDashboard;
