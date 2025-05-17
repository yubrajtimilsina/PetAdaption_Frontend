import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">Pet Adoption</h1>
      <div className="space-x-4">
        {user && user.role === "adopter" && (
          <Link to="/adopter-dashboard" className="hover:underline">Dashboard</Link>
        )}
        {user && user.role === "shelter" && (
          <Link to="/shelter-dashboard" className="hover:underline">Dashboard</Link>
        )}
        {user?.role === "admin" && (
        <Link to="/admin-dashboard" className="hover:underline">Admin</Link>
         )}

        {user ? (
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
