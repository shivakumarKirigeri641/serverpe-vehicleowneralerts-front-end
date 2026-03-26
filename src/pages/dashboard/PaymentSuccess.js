import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiDownload, FiHome } from "react-icons/fi";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const { paymentId, orderId, plan, amount, invoiceNumber } = state;

  const handleDownloadInvoice = async () => {
    try {
      if (!invoiceNumber) {
        toast.error("Invoice number not available");
        return;
      }

      // Fetch invoice from backend
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/vehicleowner/credentials/payment/invoice/${invoiceNumber}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      // Get blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully!");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download invoice");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="card p-8 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"
          >
            <FiCheckCircle className="text-white text-3xl" />
          </motion.div>

          {/* Header */}
          <h1 className="font-display font-bold text-3xl text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-500 mb-8">
            Your subscription has been activated successfully.
          </p>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 rounded-xl p-6 mb-8 space-y-4 text-left"
          >
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Plan</span>
              <span className="font-semibold text-gray-800">
                {plan?.recharge_name || "Premium"}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="text-sm text-gray-600">Amount Paid</span>
              <span className="font-display font-bold text-primary-700">
                ₹{amount?.toFixed(2) || "—"}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="text-sm text-gray-600">Payment ID</span>
              <span className="font-mono text-xs text-gray-500 truncate">
                {paymentId ? `${paymentId.slice(0, 8)}...` : "—"}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="text-sm text-gray-600">Order ID</span>
              <span className="font-mono text-xs text-gray-500 truncate">
                {orderId ? `${orderId.slice(0, 8)}...` : "—"}
              </span>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleDownloadInvoice}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <FiDownload />
              Download Invoice
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full btn-secondary flex items-center justify-center gap-2"
            >
              <FiHome />
              Go to Dashboard
            </button>
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-sm text-primary-800"
          >
            <p className="font-medium mb-2">✓ What's Next?</p>
            <ul className="space-y-1 text-xs text-left">
              <li>
                • Your QR stickers are ready to download from the dashboard
              </li>
              <li>• Subscription is valid for 1 year from today</li>
              <li>• You'll receive alerts when your QR code is scanned</li>
              <li>• Manage your vehicle in QR Stickers section</li>
            </ul>
          </motion.div>

          {/* Powered By */}
          <p className="text-xs text-gray-400 mt-8">
            Powered by ServerPe App Solutions
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
