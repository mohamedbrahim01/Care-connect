/**
 * Purpose: The top bar that's consistent across all pages.
 * Elements: "Care Connect" logo, notification bell icon, user profile avatar. The avatar could be a dropdown menu for "Profile" and "Logout".
 */

import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  return (
    <header className="bg-white shadow-sm w-full">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo on the left */}
        <div className="flex items-center gap-2">
          {/* Care Connect Logo */}
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Care Connect</h1>
        </div>

        {/* Icons and User Avatar on the right */}
        <div className="flex items-center gap-5">


          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut size={20} />
              <span className="text-sm">Logout</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
              {/* Replace with actual user image if available */}
              <img
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                alt="Admin Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
