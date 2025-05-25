import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  /* ---------- reusable loader ---------- */
  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/admin/users",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ---------- block / unblock ---------- */
  const handleBlockToggle = async (id) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:3000/api/admin/users/${id}/block`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === data._id ? { ...user, isBlocked: data.isBlocked } : user
        )
      );
    } catch (err) {
      console.error(err);
      alert("Block / unblock failed");
    }
  };

  /* ---------- approve shelter ---------- */
  const approveShelter = async (id) => {
  try {
    await axios.patch(
      `http://localhost:3000/api/admin/users/${id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchUsers(); // refresh list
  } catch (err) {
    console.error(err);
    alert("Approval failed");
  }
};



  /* ---------- delete with confirmation ---------- */
  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this user?");
    if (!ok) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/admin/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛠 Manage Users</h1>

      <table className="w-full table-auto">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th>
            <th>Status</th>
            <th>Approval</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isBlocked ? "Blocked" : "Active"}</td>
              <td className="space-x-2">
                {/* Block / Unblock */}
                <button
                  onClick={() => handleBlockToggle(user._id)}
                  className="bg-yellow-400 px-2 rounded"
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>

                {/* Approve (only if shelter & not yet approved) */}
                {user.role === "shelter" && !user.isApproved && (
                  <button
                    onClick={() => approveShelter(user._id)}
                    className="bg-green-600 text-white px-2 rounded"
                  >
                    Approve
                  </button>
                )}

                {/* Delete */}
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManagement;
