import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Home, PawPrint, Heart, FileText, User, LogOut, LogIn, UserPlus, Shield, } from "lucide-react"; // Import icons

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu visibility

  const logout = () => {
    localStorage.clear();
    setIsMobileMenuOpen(false); // Close menu on logout
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-4 px-4 sm:px-6 flex justify-between items-center shadow-lg sticky top-0 z-40">
      {/* Brand/Logo */}
      <Link to="/" className="flex items-center space-x-2 text-2xl font-semibold tracking-tight hover:text-teal-100 transition-colors duration-300">
        <PawPrint className="w-7 h-7" />
        <span>PetConnect</span>
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center space-x-6">
        {user ? (
          <>
            {user.role === "adopter" && (
              <>
                <NavLink to="/adopter-dashboard" icon={Home} label="Dashboard" />
                <NavLink to="/my-applications" icon={FileText} label="My Applications" />
                <NavLink to="/favorites" icon={Heart} label="My Favorites" />
              </>
            )}

            {user.role === "shelter" && (
              <>
                <NavLink to="/shelter-dashboard" icon={Home} label="Dashboard" />
                <NavLink to="/shelter/applications" icon={FileText} label="Applications" />
              </>
            )}

            {user.role === "admin" && (
              <>
                <NavLink to="/admin-dashboard" icon={Shield} label="Dashboard" />
                <NavLink to="/admin/users" icon={User} label="Users" />
                <NavLink to="/admin/pets" icon={PawPrint} label="Pets" />
                <NavLink to="/admin/applications" icon={FileText} label="Applications" />
                
              </>
            )}

            <NavLink to="/profile" icon={User} label="Profile" />
            <button
              onClick={logout}
              className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 shadow-md text-sm"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" icon={LogIn} label="Login" />
            <Link
              to="/register"
              className="flex items-center bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 shadow-md text-sm"
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button (Hamburger) */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-white hover:bg-teal-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gradient-to-br from-teal-500 to-emerald-700 z-30 flex flex-col items-center justify-center space-y-8 animate-fadeIn">
          {/* Close button for mobile menu, positioned top-right for easy access */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-teal-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="flex flex-col items-center space-y-6 text-xl">
            {user ? (
              <>
                {user.role === "adopter" && (
                  <>
                    <MobileNavLink to="/adopter-dashboard" icon={Home} label="Dashboard" onClick={closeMobileMenu} />
                    <MobileNavLink to="/my-applications" icon={FileText} label="My Applications" onClick={closeMobileMenu} />
                    <MobileNavLink to="/favorites" icon={Heart} label="My Favorites" onClick={closeMobileMenu} />
                  </>
                )}

                {user.role === "shelter" && (
                  <>
                    <MobileNavLink to="/shelter-dashboard" icon={Home} label="Dashboard" onClick={closeMobileMenu} />
                    <MobileNavLink to="/shelter/applications" icon={FileText} label="Applications" onClick={closeMobileMenu} />
                  </>
                )}

                {user.role === "admin" && (
                  <>
                    <MobileNavLink to="/admin-dashboard" icon={Shield} label="Admin" onClick={closeMobileMenu} />
                    <MobileNavLink to="/admin/pets" icon={PawPrint} label="Pets" onClick={closeMobileMenu} />
                    <MobileNavLink to="/admin/applications" icon={FileText} label="Applications" onClick={closeMobileMenu} />
                    <MobileNavLink to="/admin/users" icon={FileText} label="Users" onClick={closeMobileMenu} />
                  </>
                )}

                <MobileNavLink to="/profile" icon={User} label="Profile" onClick={closeMobileMenu} />
                <button
                  onClick={logout}
                  className="flex items-center text-white px-6 py-3 rounded-full font-semibold bg-red-500 hover:bg-red-600 transition duration-300 shadow-md text-xl"
                  aria-label="Logout"
                >
                  <LogOut className="w-6 h-6 mr-3" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" icon={LogIn} label="Login" onClick={closeMobileMenu} />
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="flex items-center text-white px-6 py-3 rounded-full font-semibold bg-indigo-500 hover:bg-indigo-600 transition duration-300 shadow-md text-xl"
                >
                  <UserPlus className="w-6 h-6 mr-3" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Helper component for desktop navigation links
const NavLink = ({ to, icon: Icon, label }) => (
  <Link
    to={to}
    className="flex items-center text-white font-semibold hover:text-teal-100 transition duration-300 text-sm"
  >
    {Icon && <Icon className="w-4 h-4 mr-1" />}
    {label}
  </Link>
);

// Helper component for mobile navigation links
const MobileNavLink = ({ to, icon: Icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center text-white font-semibold hover:text-teal-100 transition duration-300 text-2xl"
  >
    {Icon && <Icon className="w-7 h-7 mr-4" />}
    {label}
  </Link>
);

export default Navbar;
