import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-white border-b-2 border-blue-400"
      : "text-gray-300 hover:text-white";

  const initial = user?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <span className="text-xl font-bold text-blue-400">Social Media</span>

        <div className="hidden sm:flex space-x-4 ml-4">
          <Link to="/feed" className={`${isActive("/feed")} text-sm`}>
            Feed
          </Link>
          <Link to="/profile" className={`${isActive("/profile")} text-sm`}>
            Profil
          </Link>
        </div>
      </div>

      {user && (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {initial}
            </div>
            <span className="text-gray-200 text-sm">{user.name}</span>
          </div>

          <button
            onClick={handleLogout}
            className="ml-2 text-xs sm:text-sm px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}