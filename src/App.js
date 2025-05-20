import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdopterDashboard from "./pages/AdopterDashboard";
import ShelterDashboard from "./pages/ShelterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import PetDetails from "./pages/PetDetails";

import AdopterApplications from "./pages/AdopterApplications";
import ShelterApplications from "./pages/ShelterApplications"; 

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
  
      <Navbar />

      <Routes>
        {/* root → proper dashboard or login */}
        <Route
          path="/"
          element={<Navigate to={user ? `/${user.role}-dashboard` : "/login"} />}
        />

        {/* public */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* adopter */}
        <Route
          path="/adopter-dashboard"
          element={
            <ProtectedRoute>
              <AdopterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <AdopterApplications />
            </ProtectedRoute>
          }
        />

        {/* shelter */}
        <Route
          path="/shelter-dashboard"
          element={
            <ProtectedRoute>
              <ShelterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shelter/applications"
          element={
            <ProtectedRoute>
              <ShelterApplications />
            </ProtectedRoute>
          }
        />

        {/* admin */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              {user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
            </ProtectedRoute>
          }
        />

        {/* shared */}
        <Route path="/pet/:id" element={<PetDetails />} />
      </Routes>
      
    </>
  );
}

export default App;
