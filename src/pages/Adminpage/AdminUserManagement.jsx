import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:3000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUsers(res.data))
    .catch(err => console.error(err));
  }, [token]);

  const handleBlockToggle = async (id) => {
    await axios.patch(`http://localhost:3000/api/admin/users/${id}/block`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(users.filter(u => u._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛠 Manage Users</h1>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td><td>{user.email}</td><td>{user.role}</td>
              <td>{user.isBlocked ? "Blocked" : "Active"}</td>
              <td>
                <button onClick={() => handleBlockToggle(user._id)} className="mr-2 bg-yellow-400 px-2 rounded">
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
                <button onClick={() => handleDelete(user._id)} className="bg-red-500 text-white px-2 rounded">
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
