import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiBell,
  FiCalendar,
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const Alerts = () => {
  const [expandedId, setExpandedId] = useState(null);

  // Placeholder - will be replaced with API data
  const alerts = [];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">
            Alerts
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            View all notifications received from QR code scans
          </p>
        </div>
        <div className="flex gap-3">
          <div className="card px-4 py-2 text-center">
            <p className="text-2xl font-bold text-primary-600">—</p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
          <div className="card px-4 py-2 text-center">
            <p className="text-2xl font-bold text-green-600">—</p>
            <p className="text-xs text-gray-400">Today</p>
          </div>
          <div className="card px-4 py-2 text-center">
            <p className="text-2xl font-bold text-amber-600">—</p>
            <p className="text-xs text-gray-400">This Week</p>
          </div>
        </div>
      </div>

      {alerts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-12 text-center"
        >
          <FiBell className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-xl text-gray-600 mb-2">
            No Alerts Yet
          </h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            When someone scans the QR code on your vehicle, you'll receive
            alerts here along with SMS/WhatsApp notifications. Alerts will show
            the concern type, time, and location if available.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === alert.id ? null : alert.id)
                }
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                  <FiBell className="text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {alert.concern}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <FiCalendar /> {alert.date}
                    </span>
                    {alert.location && (
                      <span className="flex items-center gap-1">
                        <FiMapPin /> Location available
                      </span>
                    )}
                  </div>
                </div>
                {expandedId === alert.id ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {expandedId === alert.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  className="border-t px-4 py-3 bg-gray-50 text-sm text-gray-600"
                >
                  <p>
                    <strong>Vehicle:</strong> {alert.vehicle}
                  </p>
                  <p>
                    <strong>Concern:</strong> {alert.concern}
                  </p>
                  {alert.message && (
                    <p>
                      <strong>Message:</strong> {alert.message}
                    </p>
                  )}
                  <p>
                    <strong>Time:</strong> {alert.date}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
