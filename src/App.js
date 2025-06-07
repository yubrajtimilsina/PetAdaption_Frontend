import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdopterDashboard from "./pages/Adopterpages/AdopterDashboard";
import ShelterDashboard from "./pages/Shelterpages/ShelterDashboard";
import AdminDashboard from "./pages/Adminpage/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import PetDetails from "./pages/PetDetails";

import AdopterApplications from "./pages/Adopterpages/AdopterApplications";
import ShelterApplications from "./pages/Shelterpages/ShelterApplications"; 
import ChatRoom from "./components/ChatRoom";
import AdminApplications from "./pages/Adminpage/AdminApplications";
import AdminUserManagement from "./pages/Adminpage/AdminUserManagement";
import AdminPets from "./pages/Adminpage/AdminPets";
import Profile from "./pages/ProfilePage";
import FavoritePets from "./pages/favouritepage";
import LandingPage from "./components/LandingPage";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
  
      <Navbar />

      <Routes>
        {/* root → proper dashboard or login */}
       <Route
       path="/"
       element={
         user
        ? <Navigate to={`/${user.role}-dashboard`} />
        : <LandingPage />        /* 👈 show landing if not authed */
    }
   />

        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

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

      
        <Route
         path="/chat/:applicationId"
        element={
       <ProtectedRoute>
         <ChatRoom user={user} />
       </ProtectedRoute>
       }
      />


      <Route path="/admin/users" element={<AdminUserManagement />} />
         <Route path="/admin/pets" element={<AdminPets />} />
       <Route path="/admin/applications" element={<AdminApplications />} />
       <Route path="/favorites" element={<FavoritePets />} />


        {/* shared */}
        <Route path="/pet/:id" element={<PetDetails />} />
      </Routes>
      
    </>
  );
}

export default App;