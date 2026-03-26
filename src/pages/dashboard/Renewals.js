import React from "react";
import { motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";

const Renewals = () => {
  // Placeholder - will be replaced with API data
  const renewals = [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-800">
          My Renewals
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          View your subscription renewal history
        </p>
      </div>

      {renewals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-12 text-center"
        >
          <FiRefreshCw className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-xl text-gray-600 mb-2">
            No Renewals Yet
          </h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Your subscription renewal history will appear here. Renewals are
            ordered from most recent to oldest with their current status.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {renewals.map((renewal) => (
            <motion.div
              key={renewal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                <FiRefreshCw className="text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {renewal.plan_name}
                </p>
                <p className="text-xs text-gray-400">{renewal.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">₹{renewal.amount}</p>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    renewal.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {renewal.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Renewals;
