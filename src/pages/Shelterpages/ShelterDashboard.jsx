import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { PlusCircle, Edit, Trash2, X, AlertCircle } from "lucide-react"; // Import icons
import AddPetForm from "../../components/AddPetForm.jsx"; // Ensure this file exists at src/components/AddPetForm.jsx
import PetCard from "../../components/PetCard.jsx"; // Ensure this file exists at src/components/PetCard.jsx
import CustomModal from "../../components/CustomModal.jsx"; // Ensure this file exists at src/components/CustomModal.jsx

const ShelterDashboard = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false); // For delete/edit actions

  const [showAddEditPetModal, setShowAddEditPetModal] = useState(false);
  const [petToEdit, setPetToEdit] = useState(null); // State to hold pet data if editing

  // State for delete confirmation modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [petToDeleteId, setPetToDeleteId] = useState(null);
  const [petToDeleteName, setPetToDeleteName] = useState("");

  const token = localStorage.getItem("token");

  // Fetch pets for the logged-in shelter
  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:3000/api/pets/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(res.data);
    } catch (err) {
      console.error("Failed to fetch pets:", err);
      setError("Failed to load your pets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]); // Re-fetch when fetchPets callback changes (which means token changes)

  // --- Pet Management Actions ---

  // Handle opening the Add/Edit Pet modal
  const handleOpenAddEditPetModal = (pet = null) => {
    setPetToEdit(pet); // Set pet data if editing, null if adding new
    setShowAddEditPetModal(true);
  };

  // Handle successful addition/edit of a pet
  const handlePetFormSuccess = () => {
    fetchPets(); // Re-fetch the pets list to show updates
    setShowAddEditPetModal(false); // Close the modal
  };

  // Handle opening delete confirmation modal
  const handleDeleteClick = (petId, petName) => {
    setPetToDeleteId(petId);
    setPetToDeleteName(petName);
    setShowDeleteConfirmModal(true);
  };

  // Handle confirming and performing the delete operation
  const handleConfirmDelete = async () => {
    setShowDeleteConfirmModal(false); // Close modal immediately
    if (!petToDeleteId) return;

    setActionLoading(true); // Show loading during deletion
    setError(null); // Clear any previous error

    try {
      // NOTE: This route is /api/admin/pets/:id, which typically requires admin role.
      // For a shelter to delete its own pet, you would typically use a route like
      // /api/pets/:id where the backend checks if req.user._id matches pet.shelter
      // before deleting. Please ensure your backend supports this.
      await axios.delete(`http://localhost:3000/api/admin/pets/${petToDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPets(); // Refresh the list after deletion
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete pet. Please try again.");
    } finally {
      setActionLoading(false);
      setPetToDeleteId(null);
      setPetToDeleteName("");
    }
  };

  // Handle canceling the delete operation
  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setPetToDeleteId(null);
    setPetToDeleteName("");
  };

  // --- Custom Delete Confirmation Modal Component ---
  const DeleteConfirmModal = () => (
    <CustomModal onClose={handleCancelDelete} title="Confirm Pet Deletion">
      <div className="p-4">
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete "<span className="font-medium text-red-600">{petToDeleteName}</span>"? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancelDelete}
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
            disabled={actionLoading}
          >
            {actionLoading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Trash2 size={18} className="mr-2" />
            )}
            Delete
          </button>
        </div>
      </div>
    </CustomModal>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-[calc(100vh-80px)]"> {/* Adjusted min-height */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">👋 Welcome, Shelter!</h1>

      {/* Error Message Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center mb-6" role="alert">
          <AlertCircle size={20} className="mr-2" />
          <span className="block sm:inline">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-700 hover:text-red-900">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Add Pet Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Add or Edit a Pet 🐾</h2>
          <button
            onClick={() => handleOpenAddEditPetModal()} // Call with no pet for adding
            className="flex items-center bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition duration-200 shadow-md"
            disabled={actionLoading}
          >
            <PlusCircle size={20} className="mr-2" /> Add New Pet
          </button>
        </div>
        <p className="text-gray-600">List new pets or manage existing ones through the table below.</p>
      </div>

      {/* Pet List Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Listed Pets</h2>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-lg text-gray-600">Loading your pets...</p>
          </div>
        ) : pets.length === 0 ? (
          <p className="text-gray-600 italic text-center py-8">
            You haven't listed any pets yet. Click "Add New Pet" to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> {/* Improved grid responsiveness */}
            {pets.map((pet) => (
              <div key={pet._id} className="relative group">
                <PetCard pet={pet} />
                {/* Overlay for actions on hover/focus */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                  <button
                    onClick={() => handleOpenAddEditPetModal(pet)}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-lg mr-2"
                    disabled={actionLoading}
                  >
                    <Edit size={18} className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(pet._id, pet.name)}
                    className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-lg"
                    disabled={actionLoading}
                  >
                    <Trash2 size={18} className="mr-2" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Pet Modal (reused for both add and edit) */}
      {showAddEditPetModal && (
        <CustomModal
          onClose={() => setShowAddEditPetModal(false)}
          title={petToEdit ? "Edit Pet Details" : "Add New Pet"}
        >
          <AddPetForm
            token={token}
            petToEdit={petToEdit} // Pass pet data for editing
            onPetAdded={handlePetFormSuccess} // Callback for both add and edit success
            onClose={() => setShowAddEditPetModal(false)}
            setLoading={setActionLoading} // Use actionLoading for form submission
            setError={setError}
          />
        </CustomModal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && <DeleteConfirmModal />}
    </div>
  );
};

export default ShelterDashboard;
