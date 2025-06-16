import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdopterDashboard from "./pages/Adopterpages/AdopterDashboard";
import ShelterDashboard from "./pages/Shelterpages/ShelterDashboard";
import AdminDashboard from "./pages/Adminpage/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import PetDetails from "./pages/PetDetails";
import Footer from "./components/Footer"; // Ensure this is imported

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
    // This div will serve as the main container for your entire application
    // 'flex flex-col' makes it a flex container with items stacked vertically
    // 'min-h-screen' ensures it always takes at least the full height of the viewport
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* The 'main' element will contain all your routed pages. */}
      {/* 'flex-grow' ensures this section expands to fill any available space,
          pushing the footer to the bottom. */}
      <main className="flex-grow"> 
        <Routes>
          {/* root → proper dashboard or login */}
          <Route
            path="/"
            element={
              user
                ? <Navigate to={`/${user.role}-dashboard`} />
                : <LandingPage />
            }
          />

          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* public */}
          <Route path="/login"    element={<Login />} />
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
              < Route
                path="/admin-dashboard"
                 element={
                   <ProtectedRoute>
                        {user?.role === "admin" && <AdminDashboard />}
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
      </main> {/* End of main content area */}

      <Footer /> {/* Your footer component */}
    </div>
  );
}

export default App;