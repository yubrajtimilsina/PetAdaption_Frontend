import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3000";

export default function AdopterApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API}/api/applications/adopter`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setApplications(r.data))
      .catch((e) =>
        alert(e.response?.data?.message || "Failed to fetch applications"),
      )
      .finally(() => setLoading(false));
  }, [token]);

  const img = (photo) =>
    photo?.startsWith("http")
      ? photo
      : photo
      ? `${API}/${photo}`
      : "https://placehold.co/400x300?text=No+Photo";

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📄 My Adoption Applications</h1>

      {loading ? (
        <p className="italic text-gray-500">Loading…</p>
      ) : applications.length === 0 ? (
        <p className="italic text-gray-500">You haven’t applied for any pets yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="border rounded-xl shadow hover:shadow-md overflow-hidden transition"
            >
              <img
                src={img(app.pet?.photo)}
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

                {/* 💬 chat link */}
                <Link
                  to={`/chat/${app._id}`}
                  className="text-blue-600 hover:underline inline-block mt-2"
                >
                  💬 Chat with Shelter
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
