import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Loader2, CheckCircle, XCircle, Mail, User, PawPrint, MessageSquareText, AlertCircle, RefreshCcw ,X} from "lucide-react"; // Import icons

const API = "http://localhost:3000";

export default function ShelterApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true); // Initial page loading
  const [pageError, setPageError] = useState(null); // Error for the entire page fetch
  const [actionLoadingId, setActionLoadingId] = useState(null); // To show loading on specific update buttons
  const [actionMessage, setActionMessage] = useState(null); // Success/error message for status updates

  const token = localStorage.getItem("token");

  // Function to fetch applications
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setPageError(null);
    try {
      if (!token) {
        setPageError("Authentication required. Please log in as a shelter to view applications.");
        return;
      }
      const res = await axios.get(`${API}/api/applications/shelter`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to load applications:", err);
      setPageError(err.response?.data?.message || "Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Function to update application status
  const updateStatus = async (id, status) => {
    setActionLoadingId(id); // Set loading for this specific application card
    setActionMessage(null); // Clear previous action message
    try {
      await axios.patch(
        `${API}/api/applications/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Optimistically update the UI, then re-fetch for absolute consistency
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a)),
      );
      setActionMessage({ type: "success", text: `Application ${status} successfully!` });
    } catch (err) {
      console.error("Failed to update application status:", err);
      setActionMessage({ type: "error", text: err.response?.data?.message || "Failed to update application status." });
    } finally {
      setActionLoadingId(null); // End loading for this specific application card
    }
  };

  // Helper to get status badge classes
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

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto my-6 md:my-10">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
        📨 Applications for Your Pets
      </h1>

      {/* Action Message Display (for status updates) */}
      {actionMessage && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center shadow-md ${
            actionMessage.type === "success"
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-red-100 text-red-700 border border-red-400"
          }`}
          role="status"
        >
          {actionMessage.type === "success" ? (
            <CheckCircle size={20} className="mr-3" />
          ) : (
            <XCircle size={20} className="mr-3" />
          )}
          <span className="font-medium text-sm sm:text-base">{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="ml-auto p-1 text-inherit hover:opacity-80">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl shadow-lg p-8">
          <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
          <p className="text-lg text-gray-700">Loading applications...</p>
        </div>
      ) : pageError ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-50 rounded-xl shadow-lg p-8 text-red-700 border border-red-300">
          <AlertCircle className="mb-4" size={48} />
          <p className="text-xl text-center font-medium">{pageError}</p>
          <button
            onClick={fetchApplications}
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow"
          >
            <RefreshCcw className="inline-block mr-2" size={18} /> Retry
          </button>
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl shadow-lg p-8 text-gray-600">
          <PawPrint className="mb-4" size={48} />
          <p className="text-xl font-medium mb-2">No applications yet.</p>
          <p className="text-center">Once adopters show interest in your pets, their applications will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div key={app._id} className="p-4 sm:p-6 border border-gray-200 rounded-xl shadow-md bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-y-1">
                    <h2 className="font-bold text-xl sm:text-2xl text-gray-800 flex items-center mr-3">
                        {app.pet?.name || 'N/A Pet'}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusClasses(app.status)}`}>
                        {app.status}
                    </span>
                </div>
                <p className="text-gray-700 text-base mt-2 flex items-center">
                    <User size={16} className="mr-2 text-blue-500" />
                    Adopter: <span className="font-semibold ml-1">{app.adopter?.name || "Unknown Adopter"}</span>
                </p>
                <p className="text-gray-600 text-sm mt-1 flex items-center">
                    <Mail size={16} className="mr-2 text-blue-500" />
                    Email: {app.adopter?.email || "N/A"}
                </p>
                {app.message && (
                    <p className="text-gray-700 italic mt-3 text-sm border-l-2 border-gray-300 pl-3 py-1">
                        "{app.message}"
                    </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                    Applied on: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 flex-shrink-0 mt-4 md:mt-0">
                {app.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(app._id, "approved")}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      disabled={actionLoadingId === app._id}
                    >
                      {actionLoadingId === app._id ? (
                        <Loader2 className="animate-spin mr-2" size={18} />
                      ) : (
                        <CheckCircle className="mr-2" size={18} />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(app._id, "rejected")}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      disabled={actionLoadingId === app._id}
                    >
                      {actionLoadingId === app._id ? (
                        <Loader2 className="animate-spin mr-2" size={18} />
                      ) : (
                        <XCircle className="mr-2" size={18} />
                      )}
                      Reject
                    </button>
                  </>
                )}

                {/* Chat link */}
                <Link
                  to={`/chat/${app._id}`}
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow text-sm"
                >
                  <MessageSquareText className="mr-2" size={18} />
                  Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
