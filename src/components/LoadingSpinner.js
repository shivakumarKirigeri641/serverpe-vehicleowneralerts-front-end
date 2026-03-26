import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = ({ size = "md", message = "Loading..." }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <motion.div
        className={`${sizes[size]} border-4 border-primary-200 border-t-primary-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {message && (
        <p className="text-gray-500 text-sm font-medium">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
