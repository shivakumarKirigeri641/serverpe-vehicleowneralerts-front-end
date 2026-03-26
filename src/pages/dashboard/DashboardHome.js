import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiBell,
  FiCreditCard,
  FiAlertCircle,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";
import { HiOutlineQrCode } from "react-icons/hi2";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { addQRCodeSticker } from "../../services/api";

const DashboardHome = () => {
  const { owner } = useAuth();
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [adding, setAdding] = useState(false);

  // Extract data from owner context
  const vehicles = owner?.qr_code_mappings || [];
  const subscriptions = owner?.active_subscriptions || [];
  const hasActiveSubscription = subscriptions.some(
    (s) => s.is_active && new Date(s.effective_until) >= new Date(),
  );

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) return toast.error("Enter vehicle number");

    setAdding(true);
    try {
      const res = await addQRCodeSticker({
        vehicle_number: vehicleNumber.toUpperCase().replace(/[\s-]/g, ""),
        subscription_plan_id: 1,
      });
      if (res.data?.successstatus) {
        toast.success("Vehicle added! QR code generated.");
        setShowAddVehicle(false);
        setVehicleNumber("");
      } else {
        toast.error(res.data?.message || "Failed to add vehicle");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add vehicle");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
          Welcome, {owner?.vehicle_owner_name || "Vehicle Owner"}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's an overview of your vehicle protection status.
        </p>
      </motion.div>

      {/* Subscription Alert */}
      {!hasActiveSubscription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-4"
        >
          <FiAlertCircle className="text-amber-500 text-xl shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-amber-800">
              Your trial/subscription has expired
            </p>
            <p className="text-sm text-amber-600">
              Renew now to continue receiving unlimited vehicle alerts.
            </p>
          </div>
          <Link
            to="/dashboard/plans"
            className="btn-accent text-sm !py-2 shrink-0"
          >
            Renew <FiArrowRight className="ml-1" />
          </Link>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Vehicles",
            value: vehicles.length,
            icon: <HiOutlineQrCode />,
            color: "bg-blue-100 text-blue-600",
          },
          {
            label: "Total Alerts",
            value: "—",
            icon: <FiBell />,
            color: "bg-green-100 text-green-600",
          },
          {
            label: "Active Plan",
            value:
              subscriptions.length > 0
                ? subscriptions[0]?.recharge_name || "—"
                : "None",
            icon: <FiCreditCard />,
            color: "bg-purple-100 text-purple-600",
          },
          {
            label: "Today Alerts",
            value: "—",
            icon: <FiBell />,
            color: "bg-amber-100 text-amber-600",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="card p-5"
          >
            <div
              className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}
            >
              {stat.icon}
            </div>
            <p className="text-2xl font-display font-bold text-gray-800">
              {stat.value}
            </p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Add Vehicle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="font-display font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <HiOutlineQrCode className="text-primary-500" /> Add New Vehicle
          </h3>
          {!showAddVehicle ? (
            <button
              onClick={() => setShowAddVehicle(true)}
              className="btn-primary gap-2 text-sm"
            >
              <FiPlus /> Add QR Code Sticker
            </button>
          ) : (
            <form onSubmit={handleAddVehicle} className="space-y-3">
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                className="input-field"
                placeholder="e.g., KA01AB1234"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={adding}
                  className="btn-primary text-sm disabled:opacity-50 flex-1"
                >
                  {adding ? "Adding..." : "Add Vehicle"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddVehicle(false)}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="font-display font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <FiBell className="text-green-500" /> Recent Alerts
          </h3>
          <div className="text-center py-8 text-gray-400">
            <FiBell className="text-4xl mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No recent alerts</p>
            <p className="text-xs mt-1">
              Alerts will appear here when someone scans your QR code
            </p>
          </div>
        </motion.div>
      </div>

      {/* My Vehicles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-6"
      >
        <h3 className="font-display font-semibold text-lg text-gray-800 mb-4">
          My Vehicles
        </h3>
        {vehicles.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <HiOutlineQrCode className="text-4xl mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No vehicles added yet</p>
            <p className="text-xs mt-1">
              Add a vehicle above to get your QR code sticker
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {vehicles.map((v, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <HiOutlineQrCode className="text-primary-600 text-xl" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {v.vehicle_number || "Vehicle"}
                  </p>
                  <p className="text-xs text-gray-400">
                    QR Code: {v.qrcode_number?.slice(0, 8)}...
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    v.is_qr_code_issued
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {v.is_qr_code_issued ? "Active" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardHome;
