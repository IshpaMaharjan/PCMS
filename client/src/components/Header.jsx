import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Header() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Update header when login/logout happens
  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    navigate("/", { replace: true });
    window.dispatchEvent(new Event("storage")); // update header
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700 cursor-pointer" onClick={() => navigate("/")}>
          PCMS
        </h1>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-gray-700 font-medium">
          <Link
            to="/"
            className="relative group px-2 py-1 hover:text-blue-600 transition"
          >
            Blog
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>

          {!token ? (
            <>
              <Link
                to="/login"
                className="hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/settings"
                className="hover:text-blue-600 transition-colors"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 font-semibold transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
