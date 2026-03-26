import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="font-display text-8xl md:text-9xl font-extrabold text-white/20 mb-4">
          404
        </h1>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-primary-200 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-accent gap-2">
          <FiHome /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
