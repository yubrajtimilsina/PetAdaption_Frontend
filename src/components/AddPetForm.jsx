import React, { useState } from "react";
import { Camera, MapPin, User, Calendar, Type, FileText, Upload, Loader2 } from "lucide-react";
import axios from "axios";
 
const AddPetForm = () => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    type: "",
    gender: "",
    location: "",
    description: ""
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = "Pet name is required";
    if (!form.age || form.age < 0) newErrors.age = "Valid age is required";
    if (!form.type.trim()) newErrors.type = "Pet type is required";
    if (!form.gender) newErrors.gender = "Gender selection is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (photo) formData.append("photo", photo);

    const token = localStorage.getItem("token");
    await axios.post("http://localhost:3000/api/pets", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Pet added successfully!");

    // Reset form
    setForm({
      name: "",
      age: "",
      type: "",
      gender: "",
      location: "",
      description: "",
    });
    setPhoto(null);
    setPhotoPreview(null);
    setErrors({});
  } catch (err) {
    alert("Error adding pet. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};



  const inputClasses = (fieldName) => `
    w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 
    ${errors[fieldName] 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
    } 
    focus:outline-none focus:ring-2 focus:ring-opacity-50 
    placeholder-gray-400 text-gray-700
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-8">
            <h2 className="text-3xl font-bold text-white text-center">
              Add New Pet
            </h2>
            <p className="text-blue-100 text-center mt-2">
              Help a furry friend find their forever home
            </p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Photo Upload */}
            <div className="text-center">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                <Camera className="inline w-5 h-5 mr-2" />
                Pet Photo
              </label>
              
              <div className="relative inline-block">
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label
                  htmlFor="photo"
                  className="cursor-pointer block w-32 h-32 sm:w-40 sm:h-40 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors duration-200 flex items-center justify-center bg-gray-50 hover:bg-blue-50"
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-500">Upload Photo</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pet Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-2" />
                  Pet Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter pet's name"
                  className={inputClasses('name')}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Age (years)
                </label>
                <input
                  type="number"
                  id="age"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="0"
                  min="0"
                  max="30"
                  className={inputClasses('age')}
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Type className="inline w-4 h-4 mr-2" />
                  Pet Type
                </label>
                <input
                  type="text"
                  id="type"
                  placeholder="e.g., Dog, Cat, Bird"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className={inputClasses('type')}
                />
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className={inputClasses('gender')}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unknown">Unknown</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-2" />
                Location
              </label>
              <input
                type="text"
                id="location"
                placeholder="City, State or Area"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={inputClasses('location')}
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-2" />
                Description
              </label>
              <textarea
                id="description"
                placeholder="Tell us about the pet's personality, habits, and any special needs..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="4"
                className={`${inputClasses('description')} resize-none`}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    Adding Pet...
                  </>
                ) : (
                  'Add Pet'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPetForm;