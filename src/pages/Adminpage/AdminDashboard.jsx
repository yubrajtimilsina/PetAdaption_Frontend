import React, { useEffect, useState } from "react";
import { Users, PawPrint, FileText, Ban, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      }
    };

    fetchStats();
  }, [token]);

  if (!stats) {
    return <div className="p-6 text-center text-gray-500">Loading stats...</div>;
  }

  return (
    <section className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      <p className="text-gray-700 text-lg mb-4">
        Welcome to the Admin Dashboard! Here you can manage users, pets, and adoption applications.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <StatCard icon={<Users size={40} className="text-blue-400" />} value={stats.totalUsers} label="Total Users" bg="blue" />
        <StatCard icon={<Ban size={40} className="text-red-400" />} value={stats.blockedUsers} label="Blocked Users" bg="red" />
        <StatCard icon={<PawPrint size={40} className="text-teal-400" />} value={stats.petsListed} label="Pets Listed" bg="teal" />
        <StatCard icon={<FileText size={40} className="text-purple-400" />} value={stats.pendingApplications} label="Pending Applications" bg="purple" />
        <StatCard icon={<CheckCircle size={40} className="text-green-400" />} value={stats.approvedApplications} label="Approved Applications" bg="green" />
        <StatCard icon={<XCircle size={40} className="text-gray-400" />} value={stats.rejectedApplications} label="Rejected Applications" bg="gray" />
      </div>

      <p className="text-sm text-gray-500 mt-6">
        *These are live stats from my backend API.
      </p>
    </section>
  );
};

const StatCard = ({ icon, value, label, bg }) => {
  const bgColors = {
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-700",
    teal: "bg-teal-50 text-teal-700",
    purple: "bg-purple-50 text-purple-700",
    green: "bg-green-50 text-green-700",
    gray: "bg-gray-50 text-gray-700",
  };

  return (
    <div className={`p-6 rounded-lg shadow-md flex items-center justify-between ${bgColors[bg]}`}>
      <div>
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-gray-600">{label}</p>
      </div>
      {icon}
    </div>
  );
};

export default AdminOverview;
