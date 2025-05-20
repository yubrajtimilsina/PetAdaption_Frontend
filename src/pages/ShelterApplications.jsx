import React, { useEffect, useState } from "react";
import axios from "axios";

const ShelterApplications = () => {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token"); // ✅ using token from localStorage

  useEffect(() => {
    if (!token) return; // 🔐 prevent request if no token

    axios
      .get("http://localhost:3000/api/applications/shelter", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setApplications(res.data))
      .catch((err) => {
        console.error("Error fetching applications:", err.response?.data?.message);
        alert(err.response?.data?.message || "Failed to load applications");
      });
  }, [token]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/applications/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error("Status update error:", err.response?.data?.message);
      alert("Failed to update application status.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📨 Applications for Your Pets</h1>

      {applications.length === 0 ? (
        <p className="text-gray-600 italic">No applications yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="p-4 border rounded-lg shadow bg-white">
              <h2 className="font-semibold text-lg">
                {app.pet?.name} — {app.adopter?.name}
              </h2>
              <p>Email: {app.adopter?.email}</p>
              <p>Status: <span className="capitalize font-medium">{app.status}</span></p>

              {app.status === "pending" && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(app._id, "approved")}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(app._id, "rejected")}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShelterApplications;
