import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiBell,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiMonitor,
  FiLoader,
} from "react-icons/fi";
import { getMyScans } from "../../services/api";

const PLACEHOLDER_DESC = "Type a short custom message to vehicle owner!";

const Alerts = () => {
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const res = await getMyScans();
        if (res.data?.successstatus) {
          setScans(res.data.data || []);
        } else {
          setError(res.data?.message || "Failed to load alerts.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to fetch alerts. Try again.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchScans();
  }, []);

  // Derive stats from scans
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(todayStart.getDate() - 6);

  const todayCount = scans.filter(
    (s) => new Date(s.created_at) >= todayStart,
  ).length;
  const weekCount = scans.filter(
    (s) => new Date(s.created_at) >= weekStart,
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">
            Alerts
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            All notifications received when someone scans your QR code
          </p>
        </div>
        <div className="flex gap-3">
          <div className="card px-4 py-2 text-center min-w-[64px]">
            <p className="text-2xl font-bold text-primary-600">
              {loading ? "…" : scans.length}
            </p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
          <div className="card px-4 py-2 text-center min-w-[64px]">
            <p className="text-2xl font-bold text-green-600">
              {loading ? "…" : todayCount}
            </p>
            <p className="text-xs text-gray-400">Today</p>
          </div>
          <div className="card px-4 py-2 text-center min-w-[64px]">
            <p className="text-2xl font-bold text-amber-600">
              {loading ? "…" : weekCount}
            </p>
            <p className="text-xs text-gray-400">This Week</p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="card p-12 text-center text-gray-400">
          <FiLoader className="text-4xl mx-auto mb-3 animate-spin text-primary-400" />
          <p className="text-sm">Loading alerts…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="card p-8 text-center text-red-500">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && scans.length === 0 && (
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
            alerts here with the concern type, message, and scan time.
          </p>
        </motion.div>
      )}

      {/* Alerts list */}
      {!loading && !error && scans.length > 0 && (
        <div className="space-y-3">
          {scans.map((scan, i) => {
            const isExpanded = expandedIdx === i;
            const hasCustomDesc =
              scan.description && scan.description !== PLACEHOLDER_DESC;
            const hasOtherMsg = !!scan.other_message_content;
            const scanDate = new Date(scan.created_at);
            const formattedDate = scanDate.toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card overflow-hidden"
              >
                {/* Row summary — click to expand */}
                <button
                  onClick={() => setExpandedIdx(isExpanded ? null : i)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                    <FiBell className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-800">{scan.phrase}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          scan.is_verified_user
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {scan.is_verified_user ? "Verified User" : "Anonymous"}
                      </span>
                    </div>
                    {hasCustomDesc && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {scan.description}
                      </p>
                    )}
                    {hasOtherMsg && (
                      <p className="text-xs text-amber-600 mt-0.5 truncate">
                        {scan.other_message_content}
                      </p>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <FiCalendar className="text-xs" /> {formattedDate}
                    </span>
                  </div>
                  {isExpanded ? (
                    <FiChevronUp className="text-gray-400 shrink-0" />
                  ) : (
                    <FiChevronDown className="text-gray-400 shrink-0" />
                  )}
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-gray-100 bg-gray-50 px-4 py-4"
                  >
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div>
                        <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                          Vehicle Number
                        </dt>
                        <dd className="font-semibold text-gray-800">
                          {scan.vehicle_number}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                          Alert Type
                        </dt>
                        <dd className="font-semibold text-gray-800">
                          {scan.phrase}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                          Message
                        </dt>
                        <dd className="text-gray-700">
                          {hasCustomDesc ? (
                            scan.description
                          ) : (
                            <span className="italic text-gray-400">
                              No custom message provided
                            </span>
                          )}
                        </dd>
                      </div>
                      {hasOtherMsg && (
                        <div className="sm:col-span-2">
                          <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                            Additional Note
                          </dt>
                          <dd className="text-amber-700">
                            {scan.other_message_content}
                          </dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5 flex items-center gap-1">
                          <FiUser className="text-xs" /> Scanner
                        </dt>
                        <dd className="text-gray-700">
                          {scan.is_verified_user ? (
                            <span className="text-green-700 font-medium">
                              Verified User
                            </span>
                          ) : (
                            <span className="text-gray-500">
                              Anonymous / Public
                            </span>
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                          Date &amp; Time
                        </dt>
                        <dd className="text-gray-700">{formattedDate}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5 flex items-center gap-1">
                          <FiMonitor className="text-xs" /> Device / Client
                        </dt>
                        <dd className="text-gray-600 text-xs break-all">
                          {scan.user_agent || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                          IP Address
                        </dt>
                        <dd className="text-gray-600 text-xs font-mono">
                          {scan.ip_address || "—"}
                        </dd>
                      </div>
                    </dl>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Alerts;
