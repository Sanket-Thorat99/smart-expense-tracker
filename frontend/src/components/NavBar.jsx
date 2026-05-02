import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

      {/* Logo */}
      <h1 className="text-xl font-bold text-blue-600">
        💰 Expense Tracker
      </h1>

      {/* Links */}
      <div className="flex items-center gap-6">

        <Link
          to="/dashboard"
          className="text-gray-700 hover:text-blue-500"
        >
          Dashboard
        </Link>

        <Link
          to="/add"
          className="text-gray-700 hover:text-blue-500"
        >
          Add Expense
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </div>
    </nav>
  );
};

export default Navbar;