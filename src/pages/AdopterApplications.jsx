import React, { useEffect, useState } from "react";
import axios from "axios";

const AdopterApplications = () => {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token"); // ✅ Get token directly

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📄 My Adoption Applications</h1>
      <div className="space-y-4">
        {applications.map(app => (
          <div key={app._id} className="p-4 border rounded-lg shadow">
            <div className="flex items-center gap-4">
              <img src={`http://localhost:3000/${app.pet?.photo}`} alt={app.pet?.name} className="w-20 h-20 object-cover rounded" />
              <div>
                <h2 className="font-semibold">{app.pet?.name} ({app.pet?.type})</h2>
                <p>Status: <span className="font-medium capitalize">{app.status}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdopterApplications;
