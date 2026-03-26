import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiBell,
  FiCreditCard,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiX,
  FiShield,
  FiRefreshCw,
  FiUser,
} from "react-icons/fi";
import { HiOutlineQrCode } from "react-icons/hi2";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { owner, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: "/dashboard", icon: <FiHome />, label: "Dashboard", end: true },
    { to: "/dashboard/alerts", icon: <FiBell />, label: "Alerts" },
    {
      to: "/dashboard/plans",
      icon: <FiCreditCard />,
      label: "Subscription Plans",
    },
    {
      to: "/dashboard/stickers",
      icon: <HiOutlineQrCode />,
      label: "My QR Stickers",
    },
    { to: "/dashboard/renewals", icon: <FiRefreshCw />, label: "My Renewals" },
    { to: "/dashboard/profile", icon: <FiUser />, label: "Profile" },
    { to: "/dashboard/help", icon: <FiHelpCircle />, label: "Help" },
  ];

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-0">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b shadow-sm h-16 flex items-center px-4 lg:px-8">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <FiMenu size={22} />
        </button>

        <div className="flex items-center gap-2 ml-2 lg:ml-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <FiShield className="text-white text-sm" />
          </div>
          <span className="font-display font-bold text-primary-700 hidden sm:inline">
            ServerPe
          </span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700">
              {owner?.vehicle_owner_name || "Vehicle Owner"}
            </p>
            <p className="text-xs text-gray-400">{owner?.mobile_number}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold text-sm">
            {(owner?.vehicle_owner_name || "V")[0].toUpperCase()}
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex fixed top-16 left-0 bottom-0 w-64 bg-white border-r flex-col z-30">
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary-50 text-primary-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all w-full"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 lg:hidden flex flex-col shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <FiShield className="text-white text-sm" />
                  </div>
                  <span className="font-display font-bold text-primary-700">
                    ServerPe
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <FiX size={20} />
                </button>
              </div>

              <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary-50 text-primary-700 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50"
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="p-3 border-t">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all w-full"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
