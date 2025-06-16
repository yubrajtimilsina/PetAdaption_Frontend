import React, { useEffect, useState } from "react";
import { useParams ,Link} from "react-router-dom";
import axios from "axios";
import { Loader2, CheckCircle, XCircle, PawPrint, AlertCircle } from "lucide-react"; // Import icons

const PetDetails = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adoptionStatus, setAdoptionStatus] = useState(null); // 'success', 'error', 'applying'
  const [isApplying, setIsApplying] = useState(false); // State for button loading

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // Function to fetch pet details
  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      setError(null);
      setPet(null); // Clear previous pet data
      try {
        const res = await axios.get(`http://localhost:3000/api/pets/${id}`);
        setPet(res.data);
      } catch (err) {
        console.error("Failed to fetch pet details:", err);
        setError("Failed to load pet details. Please try again or check the pet ID.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPet();
    }
  }, [id]); // Re-fetch when the pet ID changes

  // Function to handle adoption application
  const applyForAdoption = async () => {
    setAdoptionStatus(null); // Clear previous status
    setIsApplying(true); // Start applying loading state

    if (!token) {
      setAdoptionStatus({ type: "error", message: "Please log in to apply for adoption." });
      setIsApplying(false);
      return;
    }

    if (role !== "adopter") {
      setAdoptionStatus({ type: "error", message: "Only adopters can apply for adoption." });
      setIsApplying(false);
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/api/applications/apply/${pet._id}`,
        { message: "I would love to adopt this pet!" }, // Default message, can be expanded to a form
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdoptionStatus({ type: "success", message: "Application submitted successfully!" });
    } catch (err) {
      console.error("Failed to apply for adoption:", err);
      setAdoptionStatus({ type: "error", message: err.response?.data?.message || "Failed to submit application. Please try again." });
    } finally {
      setIsApplying(false); // End applying loading state
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg">
          <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
          <p className="text-lg text-gray-700">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg text-red-600">
          <AlertCircle className="mb-4" size={48} />
          <p className="text-lg text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg text-gray-700">
          <PawPrint className="mb-4" size={48} />
          <p className="text-lg text-center">Pet not found or invalid ID.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg my-6 md:my-10">
      {/* Pet Image */}
      <div className="relative w-full h-80 sm:h-96 md:h-[500px] overflow-hidden rounded-lg mb-6">
        <img
          src={pet.photo?.startsWith("http") ? pet.photo : `http://localhost:3000/${pet.photo}`}
          alt={pet.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback image if photo fails to load
            e.target.onerror = null; // Prevents infinite loop
            e.target.src = `https://placehold.co/800x500/cccccc/333333?text=No+Image+Available`;
          }}
        />
        {/* Optional: Overlay with basic info on image */}
        <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full text-white">
          <h1 className="text-3xl sm:text-4xl font-bold">{pet.name}</h1>
          <p className="text-lg sm:text-xl opacity-90">{pet.age} • {pet.type}</p>
        </div>
      </div>

      {/* Pet Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">About {pet.name}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{pet.description}</p>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-gray-700"><span className="font-semibold">Age:</span> {pet.age}</p>
            <p className="text-gray-700"><span className="font-semibold">Type:</span> {pet.type}</p>
            <p className="text-gray-700"><span className="font-semibold">Gender:</span> {pet.gender || 'Unknown'}</p> {/* Assuming gender field exists */}
            <p className="text-gray-700"><span className="font-semibold">Location:</span> {pet.location || 'N/A'}</p> {/* Assuming location field exists */}
          </div>
        </div>
        <div className="md:col-span-1 bg-blue-50 p-6 rounded-lg shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-blue-800 mb-3">Shelter Information</h2>
            <p className="text-blue-700 font-medium">{pet.shelter?.name || "Unknown Shelter"}</p>
            <p className="text-blue-600 text-sm">{pet.shelter?.email || "No contact email"}</p>
            {/* Future: Link to shelter profile/contact */}
          </div>
          <p className="text-sm text-blue-500 mt-4">Contact the shelter directly for more information.</p>
        </div>
      </div>

      {/* Adoption Application Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        {role === "adopter" ? (
          <>
            {adoptionStatus && (
              <div
                className={`mb-4 p-3 rounded-lg flex items-center ${
                  adoptionStatus.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
                role="status"
              >
                {adoptionStatus.type === "success" ? (
                  <CheckCircle size={20} className="mr-2" />
                ) : (
                  <XCircle size={20} className="mr-2" />
                )}
                {adoptionStatus.message}
              </div>
            )}
            <button
              onClick={applyForAdoption}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isApplying}
            >
              {isApplying ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                <PawPrint size={20} />
              )}
              {isApplying ? "Applying..." : `Apply to Adopt ${pet.name}`}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Your application will be sent to the shelter for review.
            </p>
          </>
        ) : user ? (
          <p className="text-gray-600 italic mt-6">
            You must be logged in as an "Adopter" to apply for adoption.
          </p>
        ) : (
          <p className="text-gray-600 italic mt-6">
            <Link to="/login" className="text-blue-600 hover:underline">Log in</Link> or <Link to="/register" className="text-blue-600 hover:underline">Register</Link> as an "Adopter" to apply for adoption.
          </p>
        )}
      </div>
    </div>
  );
};

export default PetDetails;
