import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-5 px-6 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-semibold tracking-tight">Pet Adoption</h1>
      <div className="space-x-5">
        {user && user.role === "adopter" && (
          <>
          <Link to="/adopter-dashboard" className=" text-white font-semibold hover:text-teal-200 transition duration-300">Dashboard</Link>
          <Link to="/my-applications" className=" text-white font-semibold hover:text-teal-200 transition duration-300" >My Applications</Link>
          </>
        )}
        {user && user.role === "shelter" && (
          <>
          <Link to="/shelter-dashboard" className=" text-white font-semibold hover:text-teal-200 transition duration-300">Dashboard</Link>
          <Link to="/shelter/applications" className=" text-white font-semibold hover:text-teal-200 transition duration-300">Applications</Link>
          </>
        )}
        {user?.role === "admin" && (
        <Link to="/admin-dashboard" className=" text-white font-semibold hover:text-teal-200 transition duration-300">Admin</Link>
         )}

        {user ? (
          <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300">Logout</button>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-200 transition duration-300" >Login</Link>
            <Link to="/register" className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300">Register</Link>
          </>
        )}
      </div>
    </nav> 
  );
};

export default Navbar;
