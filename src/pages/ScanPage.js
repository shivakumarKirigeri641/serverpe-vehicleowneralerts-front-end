import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiAlertTriangle,
  FiCheckCircle,
  FiChevronDown,
  FiShield,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { scanQRCode, submitScan, reportMisuse } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const ScanPage = () => {
  const { qrcodeNumber } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [scanData, setScanData] = useState(null);
  const [selectedConcern, setSelectedConcern] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!qrcodeNumber) return;
    scanQRCode(qrcodeNumber)
      .then((res) => {
        if (res.data?.successstatus) {
          setScanData(res.data.data);
        } else {
          setError(res.data?.message || "Invalid QR code");
        }
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "This QR code is invalid or expired",
        );
      })
      .finally(() => setLoading(false));
  }, [qrcodeNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedConcern) {
      toast.error("Please select a concern");
      return;
    }
    if (selectedConcern === "Others" && !customMessage.trim()) {
      toast.error("Please enter your message");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        qrcode_number: qrcodeNumber,
        concern_message_selected: selectedConcern,
      };
      if (selectedConcern === "Others" && customMessage.trim()) {
        payload.message = customMessage.trim();
      }

      const res = await submitScan(payload);
      if (res.data?.successstatus || res.data?.status === "Success") {
        setSubmitted(true);
        toast.success("Alert sent to the vehicle owner!");
      } else {
        toast.error(res.data?.message || "Failed to send alert");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async () => {
    try {
      const res = await reportMisuse(qrcodeNumber);
      setReportSubmitted(true);
      toast.success(res.data?.message || "Thank you for reporting!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to report");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" message="Loading vehicle info..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <FiAlertTriangle className="text-red-500 text-2xl" />
          </div>
          <h2 className="font-display font-bold text-xl text-gray-800 mb-2">
            QR Code Error
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <FiShield /> Powered by ServerPe App Solutions
          </div>
        </motion.div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
          >
            <FiCheckCircle className="text-green-500 text-3xl" />
          </motion.div>
          <h2 className="font-display font-bold text-2xl text-gray-800 mb-2">
            Alert Sent!
          </h2>
          <p className="text-gray-500 mb-2">
            The vehicle owner of <strong>{scanData?.vehicle_number}</strong> has
            been notified.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            They should respond shortly. Thank you for helping!
          </p>
          <div className="bg-primary-50 rounded-xl p-4 text-sm text-primary-700">
            Concern: <strong>{selectedConcern}</strong>
            {customMessage && <p className="mt-1 text-xs">"{customMessage}"</p>}
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6">
            <FiShield /> Powered by ServerPe App Solutions
          </div>
        </motion.div>
      </div>
    );
  }

  const selectedObj = scanData?.concern_messages_list?.find(
    (c) => c.phrase === selectedConcern,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white px-4 py-8 md:py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <FiShield className="text-white text-xl" />
          </div>
          <h1 className="font-display font-bold text-xl text-gray-800">
            ServerPe Vehicle Alerts
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Alert the vehicle owner about a concern
          </p>
        </motion.div>

        {/* Vehicle Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center">
              <span className="text-2xl">🚗</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Vehicle Number
              </p>
              <p className="font-display font-bold text-lg text-gray-800 tracking-wider">
                {scanData?.vehicle_number}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Concern Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="card p-6"
        >
          <h2 className="font-display font-semibold text-gray-800 mb-4">
            What's your concern?
          </h2>

          {/* Custom Dropdown */}
          <div className="relative mb-4">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3.5 border border-gray-300 rounded-xl text-left bg-white hover:border-primary-400 transition-colors focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <span
                className={selectedConcern ? "text-gray-800" : "text-gray-400"}
              >
                {selectedConcern || "Select a concern..."}
              </span>
              <FiChevronDown
                className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto"
                >
                  {scanData?.concern_messages_list?.map((concern) => (
                    <button
                      key={concern.id}
                      type="button"
                      onClick={() => {
                        setSelectedConcern(concern.phrase);
                        setDropdownOpen(false);
                        if (concern.phrase !== "Others") setCustomMessage("");
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors border-b border-gray-50 last:border-0 ${
                        selectedConcern === concern.phrase
                          ? "bg-primary-50 text-primary-700"
                          : ""
                      }`}
                    >
                      <p className="font-medium text-sm text-gray-800">
                        {concern.phrase}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {concern.description}
                      </p>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {selectedObj && (
            <p className="text-xs text-gray-400 mb-4 -mt-2 px-1">
              {selectedObj.description}
            </p>
          )}

          {/* Custom Message for "Others" */}
          <AnimatePresence>
            {selectedConcern === "Others" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <textarea
                  value={customMessage}
                  onChange={(e) => {
                    if (e.target.value.length <= 20)
                      setCustomMessage(e.target.value);
                  }}
                  placeholder="Type your message (max 20 characters)"
                  className="input-field resize-none h-20"
                  maxLength={20}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {customMessage.length}/20
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !selectedConcern}
            className="btn-primary w-full gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>
                <FiSend /> Send Alert to Owner
              </>
            )}
          </button>
        </motion.form>

        {/* Report Misuse */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          {!showReport ? (
            <button
              onClick={() => setShowReport(true)}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 mx-auto"
            >
              <FiAlertTriangle size={14} /> Report Misuse
            </button>
          ) : reportSubmitted ? (
            <div className="card p-4 text-center">
              <FiCheckCircle className="text-green-500 text-xl mx-auto mb-2" />
              <p className="text-sm text-gray-600">Thank you for reporting!</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4"
            >
              <p className="text-sm text-gray-600 mb-3">
                Is this QR code being misused? Report it and we'll investigate.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleReport}
                  className="btn-primary !bg-red-500 hover:!bg-red-600 flex-1 text-sm"
                >
                  Yes, Report
                </button>
                <button
                  onClick={() => setShowReport(false)}
                  className="btn-secondary flex-1 text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-400">
          <p>Your identity remains anonymous</p>
          <p className="mt-1">
            Powered by <strong>ServerPe</strong> Vehicle Alerts
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
