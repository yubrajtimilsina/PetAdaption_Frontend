import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3000"; // Consider moving this to an environment variable

export default function AdopterApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // State to track which application is being deleted
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Please log in to view your applications.");
      return;
    }

    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API}/api/applications/adopter`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(response.data);
      } catch (e) {
        console.error("Failed to fetch applications:", e);
        setError(e.response?.data?.message || "Failed to fetch applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  const getImageUrl = (photoPath) => {
    if (!photoPath) {
      return "https://placehold.co/600x400?text=Pet+Photo+Coming+Soon";
    }
    if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) {
      return photoPath;
    }
    return `${API}/${photoPath}`;
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    // Confirmation dialog to prevent accidental deletion
    if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      return;
    }

    setDeletingId(applicationId); // Set the ID of the application being deleted
    try {
      await axios.delete(`${API}/api/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter out the deleted application from the state
      setApplications(applications.filter((app) => app._id !== applicationId));
      alert("Application deleted successfully!");
    } catch (e) {
      console.error("Failed to delete application:", e);
      alert(e.response?.data?.message || "Failed to delete application. Please try again.");
    } finally {
      setDeletingId(null); // Reset deleting state
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto min-h-[calc(100vh-120px)]">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 text-center">
        📄 My Adoption Applications
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md p-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
          <p className="text-lg text-gray-600">Loading your applications...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-lg shadow-sm text-center">
          <p className="font-semibold text-xl mb-2">Error Loading Applications</p>
          <p>{error}</p>
          {token && (
            <p className="mt-4 text-sm text-red-600">
              Please ensure you are logged in and your internet connection is stable.
            </p>
          )}
          {!token && (
            <p className="mt-4 text-sm text-red-600">
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Click here to log in.
              </Link>
            </p>
          )}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-5 rounded-lg shadow-sm text-center">
          <p className="font-semibold text-xl mb-2">No applications found!</p>
          <p>It looks like you haven't applied for any pets yet.</p>
          <p className="mt-4">
            Ready to find your new best friend?{" "}
            <Link to="/adopter/dashboard" className="text-indigo-600 hover:underline font-medium">
              Browse available pets here!
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col"
            >
              <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                <img
                  src={getImageUrl(app.pet?.photo)}
                  alt={app.pet?.name || "Pet Photo"}
                  className="w-full h-full object-cover rounded-t-xl"
                  loading="lazy"
                />
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusClasses(app.status)}`}
                >
                  {app.status}
                </span>
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-xl text-gray-800 mb-1">
                    {app.pet?.name || "Unknown Pet"} ({app.pet?.type || "Unknown Type"})
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    Application ID: <span className="font-mono text-xs text-gray-500">{app._id}</span>
                  </p>
                  <p className="text-gray-700 mb-2">
                    Applied on:{" "}
                    <span className="font-medium">
                {app.createdAt
                ? new Date(app.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
             day: "numeric",
             })
             : "N/A"}

                    </span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  {/* Chat link */}
                  <Link
                    to={`/chat/${app._id}`}
                    className="inline-flex items-center justify-center flex-grow px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ease-in-out text-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.761 8.761 0 01-1.383-.153L2 19l1.636-4.507A9.037 9.037 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Chat with Shelter
                  </Link>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteApplication(app._id)}
                    disabled={deletingId === app._id} // Disable button while deleting
                    className={`inline-flex items-center justify-center flex-grow px-4 py-2 rounded-md font-medium transition-all duration-200 ease-in-out text-center
                      ${deletingId === app._id
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      }
                    `}
                  >
                    {deletingId === app._id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}