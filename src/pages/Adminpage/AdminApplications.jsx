import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:3000/api/admin/applications", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setApplications(res.data));
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📥 All Applications</h1>
      {applications.map(app => (
        <div key={app._id} className="border p-3 mb-3 rounded shadow">
          <p><strong>Pet:</strong> {app.pet?.name}</p>
          <p><strong>Adopter:</strong> {app.adopter?.name}</p>
          <p><strong>Status:</strong> {app.status}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminApplications;
