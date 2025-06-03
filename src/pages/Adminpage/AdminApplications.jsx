import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/api/admin/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  const filtered = applications.filter((app) =>
    `${app.pet?.name} ${app.adopter?.name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📥 All Applications</h1>

      <input
        type="text"
        placeholder="Search by pet or adopter name..."
        className="border px-3 py-2 mb-4 w-full md:w-1/2 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-blue-500">Loading applications...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Pet</th>
                <th className="p-2 border">Adopter</th>
                <th className="p-2 border">Shelter</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{app.pet?.name || "-"}</td>
                  <td className="p-2 border">
                    {app.adopter?.name} <br />
                    <span className="text-xs text-gray-500">{app.adopter?.email}</span>
                  </td>
                  <td className="p-2 border">
                    {app.pet?.shelter?.name} <br />
                    <span className="text-xs text-gray-500">{app.pet?.shelter?.email}</span>
                  </td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        app.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : app.status === "approved"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
