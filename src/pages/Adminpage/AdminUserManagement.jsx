import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Search, Trash2 } from "lucide-react";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("http://localhost:3000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleBlockToggle = async (id) => {
    setActionLoading(true);
    try {
      const { data } = await axios.patch(
        `http://localhost:3000/api/admin/users/${id}/block`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user._id === data._id ? { ...user, isBlocked: data.isBlocked } : user
        )
      );
    } catch (err) {
      console.error(err);
      alert("Block/unblock failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const approveShelter = async (id) => {
    setActionLoading(true);
    try {
      await axios.patch(
        `http://localhost:3000/api/admin/users/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Approval failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setActionLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-lg text-gray-600">Loading users...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No users found matching your search.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider rounded-tl-lg">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Approval</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{user.role}</td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      user.isBlocked ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.role === "shelter" ? (
                      user.isApproved ? (
                        <span className="text-green-500 font-semibold">Approved</span>
                      ) : (
                        <span className="text-yellow-500 font-semibold">Pending</span>
                      )
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm space-x-2">
                    <button
                      onClick={() => handleBlockToggle(user._id)}
                      className={`px-3 py-1 rounded-md text-white transition-colors duration-200 ${
                        user.isBlocked ? "bg-orange-500 hover:bg-orange-600" : "bg-yellow-500 hover:bg-yellow-600"
                      } disabled:opacity-50`}
                      disabled={actionLoading}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>

                    {user.role === "shelter" && !user.isApproved && (
                      <button
                        onClick={() => approveShelter(user._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                        disabled={actionLoading}
                      >
                        Approve
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(user._id)}
                      className="inline-flex items-center text-red-600 hover:text-red-800 font-medium transition-colors duration-200 ml-2 disabled:opacity-50"
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
    </section>
  );
};

export default AdminUserManagement;
