import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AdopterApplications = () => {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:3000/api/applications/adopter", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setApplications(res.data))
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.message || "Failed to fetch applications");
      });
  }, [token]);

  const getImageUrl = (photo) => {
    if (!photo) return "https://placehold.co/400x300?text=No+Photo";
    return photo.startsWith("http")
      ? photo
      : `http://localhost:3000/${photo}`;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📄 My Adoption Applications</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {applications.map((app) => (
          <div
            key={app._id}
            className="border rounded-xl shadow hover:shadow-md overflow-hidden transition"
          >
            <img
              src={getImageUrl(app.pet?.photo)}
              alt={app.pet?.name || "Pet Photo"}
              className="w-full h-48 object-cover bg-gray-100"
              loading="lazy"
            />
            <div className="p-4 space-y-1">
              <h2 className="font-semibold text-lg">
                {app.pet?.name} ({app.pet?.type})
              </h2>
              <p className="text-gray-500">
                Status:{" "}
                <span className="capitalize font-medium">{app.status}</span>
              </p>
              <Link
                to={`/chat/${app._id}`} // ✅ Fix here
                className="text-blue-600 hover:underline inline-block mt-2"
              >
                💬 Chat with Shelter
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdopterApplications;
