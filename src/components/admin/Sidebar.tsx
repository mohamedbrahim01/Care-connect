/**
 * Purpose: The main navigation menu on the left.
 * Elements: It will contain links (use NavLink from react-router-dom so you can style the active link, like the blue highlight on "Patients").
 * Links: Dashboard, Patients, Requests, Verification, Activity, Settings.
 * State: It needs to know which link is currently active. NavLink handles this automatically.
 */

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Stethoscope,

  BadgeCheck,

  Settings,
  CircleUserRound,
} from "lucide-react";

// An array to hold navigation links for easy mapping
const navLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Patients", href: "/admin/patients" },
  { icon: Stethoscope, label: "Doctors", href: "/admin/doctors" },

  { icon: BadgeCheck, label: "Verification", href: "/admin/verify-doctors" },

  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const Sidebar = () => {
  // Style for active NavLink
  const activeLinkStyle = {
    backgroundColor: "#2563eb", // A blue color for active state
    color: "white",
  };

  return (
    <aside className="w-64 h-screen bg-slate-800 text-white flex flex-col">
      {/* Top Profile Section */}
      <div className="p-6 flex flex-col items-center border-b border-slate-700">
        <CircleUserRound size={48} className="mb-2" />
        <span className="font-semibold text-lg">Admin Name</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.href}
                end={link.href === "/admin/dashboard"} // Ensure only the exact dashboard path is active
                style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                <link.icon size={20} />
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
