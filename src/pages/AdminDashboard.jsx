import { useEffect, useState } from "react";
import axios from "axios"

const AdminDashboard =() =>{
    const [users, setUsers] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">User List</h2>
      <table className="w-full border ">
        <thead>
          <tr className="bg-gray-400">
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Role</th>
            <th className="border px-3 py-2">Approved</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="text-center">
              <td className="border px-3 py-1">{user.name}</td>
              <td className="border px-3 py-1">{user.email}</td>
              <td className="border px-3 py-1">{user.role}</td>
              <td className="border px-3 py-1">{user.isApproved ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
