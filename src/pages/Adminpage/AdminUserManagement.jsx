import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

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
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === data._id ? { ...user, isBlocked: data.isBlocked } : user
        )
      );
    } catch (err) {
      console.error(err);
      alert("Block / unblock failed");
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
      alert("Approval failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this user?");
    if (!ok) return;

    setActionLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    [user.name, user.email].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛠 Manage Users</h1>

      <input
        type="text"
        placeholder="Search by name or email..."
        className="border px-3 py-2 rounded w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-blue-500">Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Approval</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border capitalize">{user.role}</td>
                  <td
                    className={`p-2 border font-semibold ${
                      user.isBlocked ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </td>
                  <td className="p-2 border">
                    {user.role === "shelter" ? (
                      user.isApproved ? (
                        <span className="text-green-500">Approved</span>
                      ) : (
                        <span className="text-yellow-500">Pending</span>
                      )
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => handleBlockToggle(user._id)}
                      className="bg-yellow-400 px-3 py-1 rounded disabled:opacity-50"
                      disabled={actionLoading}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>

                    {user.role === "shelter" && !user.isApproved && (
                      <button
                        onClick={() => approveShelter(user._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        disabled={actionLoading}
                      >
                        Approve
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                      disabled={actionLoading}
                    >
                      Delete
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

export default AdminUserManagement;
