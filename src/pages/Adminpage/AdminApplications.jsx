import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Search, Trash2, Check, X } from "lucide-react";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:3000/api/admin/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(res.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this application?");
    if (!confirmed) return;

    setActionLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/admin/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchApplications();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete application.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(true);
    try {
      await axios.patch(
        `http://localhost:3000/api/admin/applications/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchApplications();
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update application status.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) =>
    `${app.pet?.name || ""} ${app.adopter?.name || ""} ${app.status}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded shadow max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📥 Manage Applications</h2>
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by pet, adopter, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-blue-500">Loading applications...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredApplications.length === 0 ? (
        <p className="text-center text-gray-500">No applications found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Pet</th>
                <th className="px-4 py-2 text-left font-medium">Adopter</th>
                <th className="px-4 py-2 text-left font-medium">Shelter</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredApplications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{app.pet?.name || "-"}</td>
                  <td className="px-4 py-3">
                    {app.adopter?.name}
                    <br />
                    <span className="text-xs text-gray-500">{app.adopter?.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    {app.pet?.shelter?.name}
                    <br />
                    <span className="text-xs text-gray-500">{app.pet?.shelter?.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        app.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : app.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {app.status === "approved" && <Check size={14} className="mr-1" />}
                      {app.status === "rejected" && <X size={14} className="mr-1" />}
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    {app.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(app._id, "approved")}
                          className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600 transition"
                          disabled={actionLoading}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(app._id, "rejected")}
                          className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600 transition"
                          disabled={actionLoading}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() =>
                        handleDelete(app._id)
                      }
                      className="text-red-600 text-sm hover:underline inline-flex items-center"
                      disabled={actionLoading}
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </button>
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
