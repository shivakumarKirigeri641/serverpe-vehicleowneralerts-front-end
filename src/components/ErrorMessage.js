import React from "react";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

const ErrorMessage = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 gap-4 text-center px-4"
    >
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <FiAlertTriangle className="text-red-500 text-2xl" />
      </div>
      <p className="text-gray-700 font-medium">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary text-sm !py-2 gap-2">
          <FiRefreshCw size={16} /> Try Again
        </button>
      )}
    </motion.div>
  );
};

export default ErrorMessage;
