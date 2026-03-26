import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { FiShield } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/how-it-works", label: "How It Works" },
    { to: "/plans", label: "Plans" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/feedback", label: "Feedback" },
  ];

  const isScanPage = location.pathname.startsWith("/scan/");
  if (isScanPage) return null;

  const isHomePage = location.pathname === "/";
  const isOpaque = scrolled || !isHomePage;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isOpaque ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg group-hover:shadow-primary-300/50 transition-shadow">
              <FiShield className="text-white text-xl" />
            </div>
            <div>
              <span
                className={`font-display font-bold text-xl ${
                  isOpaque ? "text-primary-700" : "text-white"
                }`}
              >
                ServerPe
              </span>
              <span
                className={`block text-[10px] font-medium -mt-1 ${
                  isOpaque ? "text-gray-500" : "text-primary-200"
                }`}
              >
                Vehicle Alerts
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? isOpaque
                      ? "bg-primary-50 text-primary-700"
                      : "bg-white/20 text-white"
                    : isOpaque
                      ? "text-gray-600 hover:text-primary-700 hover:bg-gray-50"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-sm !py-2.5">
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isOpaque
                      ? "text-primary-700 hover:bg-primary-50"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Login
                </Link>
                <Link to="/subscribe" className="btn-accent text-sm !py-2.5">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg ${
              isOpaque ? "text-gray-700" : "text-white"
            }`}
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t shadow-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {publicLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.to
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-3" />
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary w-full text-sm">
                  Dashboard
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" className="btn-secondary w-full text-sm">
                    Login
                  </Link>
                  <Link to="/subscribe" className="btn-accent w-full text-sm">
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
