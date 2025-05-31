import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3000";

export default function ShelterApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API}/api/applications/shelter`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setApplications(r.data))
      .catch((e) =>
        alert(e.response?.data?.message || "Failed to load applications"),
      )
      .finally(() => setLoading(false));
  }, [token]);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${API}/api/applications/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a)),
      );
    } catch {
      alert("Failed to update application status.");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📨 Applications for Your Pets</h1>

      {loading ? (
        <p className="italic text-gray-500">Loading…</p>
      ) : applications.length === 0 ? (
        <p className="italic text-gray-500">No applications yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="p-4 border rounded-lg shadow bg-white">
              <h2 className="font-semibold text-lg">
                {app.pet?.name} — {app.adopter?.name}
              </h2>
              <p>Email: {app.adopter?.email}</p>
              <p>
                Status:{" "}
                <span className="capitalize font-medium">{app.status}</span>
              </p>

              {app.status === "pending" && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => updateStatus(app._id, "approved")}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(app._id, "rejected")}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* 💬 chat link */}
              <Link
                to={`/chat/${app._id}`}
                className="text-blue-600 hover:underline block mt-3"
              >
                💬 Chat with Adopter
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
