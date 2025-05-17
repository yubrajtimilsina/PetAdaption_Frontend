import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdopterDashboard from "./pages/AdopterDashboard";
import ShelterDashboard from "./pages/ShelterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar />

      <Routes>
        {/* Redirect root → dashboard or login */}
        <Route
          path="/"
          element={<Navigate to={user ? `/${user.role}-dashboard` : "/login"} />}
        />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected dashboards */}
        <Route
          path="/adopter-dashboard"
          element={
            <ProtectedRoute>
              <AdopterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shelter-dashboard"
          element={
            <ProtectedRoute>
              <ShelterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              {user?.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" />
              )}
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
