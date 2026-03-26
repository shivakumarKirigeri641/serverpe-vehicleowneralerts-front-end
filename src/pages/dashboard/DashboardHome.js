import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiBell,
  FiCreditCard,
  FiAlertCircle,
  FiPlus,
  FiArrowRight,
  FiUser,
  FiClock,
  FiX,
} from "react-icons/fi";
import { HiOutlineQrCode } from "react-icons/hi2";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { addQRCodeSticker, getMyScans } from "../../services/api";

const DashboardHome = () => {
  const { owner } = useAuth();
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [adding, setAdding] = useState(false);
  const [scans, setScans] = useState([]);
  const [scansLoading, setScansLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);

  // Extract data from owner context (from verify-otp response)
  const qrCodes = owner?.qrCodeInfo || [];
  const rawPlans = owner?.subscriptionPlans || [];
  console.log("rawplans:", rawPlans);
  // Deduplicate subscription plans by vosid
  const subscriptionPlans = rawPlans.filter(
    (plan, index, self) =>
      index === self.findIndex((p) => p.vosid === plan.vosid),
  );
  const hasActiveSubscription = subscriptionPlans.some(
    (s) => new Date(s.effective_until) >= new Date(),
  );
  const activePlan = subscriptionPlans.find(
    (s) => new Date(s.effective_until) >= new Date(),
  );

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const res = await getMyScans();
        if (res.data?.successstatus) {
          setScans(res.data.data || []);
        }
      } catch (err) {
        // Silently fail — scans are non-critical
      } finally {
        setScansLoading(false);
      }
    };
    fetchScans();
  }, []);

  // Vehicle owner has single vehicle mapped to QR sticker
  const primaryVehicle = owner?.vehicle_number || "—";
  const primaryQrCode = qrCodes.length > 0 ? qrCodes[0] : null;

  const handleOrderStickers = async () => {
    if (!primaryVehicle || !primaryQrCode) {
      toast.error("No vehicle or QR code found");
      return;
    }
    // TODO: Call API to order stickers
    toast.success(
      `Order placed: ${orderQuantity} sticker(s) for ${primaryVehicle}`,
    );
    setShowOrderModal(false);
    setOrderQuantity(1);
  };

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
        toast.error(res.data?.message || "Failed to assign vehicle");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign vehicle");
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
            label: "Vehicle Number",
            value: primaryVehicle,
            icon: <HiOutlineQrCode />,
            color: "bg-blue-100 text-blue-600",
          },
          {
            label: "Total Alerts",
            value: scansLoading ? "…" : String(scans.length),
            icon: <FiBell />,
            color: "bg-green-100 text-green-600",
          },
          {
            label: "Active Plan",
            value: activePlan?.recharge_name || "—",
            icon: <FiCreditCard />,
            color: "bg-purple-100 text-purple-600",
          },
          {
            label: "Plan Expires",
            value: activePlan
              ? new Date(activePlan.effective_until).toLocaleDateString("en-IN")
              : "—",
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
        {/* Assign Vehicle - Only show if no vehicle mapped */}
        {!primaryQrCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <h3 className="font-display font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <HiOutlineQrCode className="text-primary-500" /> Assign Vehicle &
              Get QR
            </h3>
            {!showAddVehicle ? (
              <button
                onClick={() => setShowAddVehicle(true)}
                className="btn-primary gap-2 text-sm"
              >
                <FiPlus /> Assign my vehicle
              </button>
            ) : (
              <form onSubmit={handleAddVehicle} className="space-y-3">
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) =>
                    setVehicleNumber(e.target.value.toUpperCase())
                  }
                  className="input-field"
                  placeholder="e.g., KA01AB1234"
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={adding}
                    className="btn-primary text-sm disabled:opacity-50 flex-1"
                  >
                    {adding ? "Assigning..." : "Assign Vehicle"}
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
        )}

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
          {scansLoading ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">Loading alerts…</p>
            </div>
          ) : scans.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FiBell className="text-4xl mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No alerts yet</p>
              <p className="text-xs mt-1">
                Alerts will appear here when someone scans your QR code
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {scans.slice(0, 5).map((scan, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <FiBell className="text-green-600 text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      {scan.phrase}
                    </p>
                    {scan.description &&
                      scan.description !==
                        "Type a short custom message to vehicle owner!" && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {scan.description}
                        </p>
                      )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <FiUser className="text-xs" />
                        {scan.is_verified_user ? "Verified" : "Anonymous"}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <FiClock className="text-xs" />
                        {new Date(scan.created_at).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {scans.length > 5 && (
                <p className="text-xs text-center text-gray-400 pt-1">
                  +{scans.length - 5} more alerts — view all in Alerts tab
                </p>
              )}
            </div>
          )}
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
          My Vehicle & QR Stickers
        </h3>
        {!primaryQrCode ? (
          <div className="text-center py-8 text-gray-400">
            <HiOutlineQrCode className="text-4xl mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No QR stickers added yet</p>
            <p className="text-xs mt-1">
              Add a vehicle above to get your QR code sticker
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <HiOutlineQrCode className="text-blue-600 text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{primaryVehicle}</p>
                <p className="text-xs text-gray-500 mt-1">
                  QR Code: {primaryQrCode?.qrcode_id || "—"}
                </p>
              </div>
              <div className="text-right text-xs">
                <span
                  className={`inline-block px-2 py-1 rounded text-white text-xs font-medium ${
                    primaryQrCode?.is_working ? "bg-green-500" : "bg-gray-400"
                  }`}
                >
                  {primaryQrCode?.is_working ? "Active" : "InActive"}
                </span>
              </div>
              <button
                onClick={() => setShowOrderModal(true)}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-100 hover:bg-primary-200 text-primary-600 transition-colors shrink-0"
                title="Order more sticker copies"
              >
                <FiPlus className="text-lg" />
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-sm">
              <p className="text-gray-600 font-medium mb-2">Sticker Status:</p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>
                  • QR Tested: {primaryQrCode?.is_qr_code_tested ? "✓" : "✗"}
                </li>
                <li>• Delivered: {primaryQrCode?.is_delivered ? "✓" : "✗"}</li>
                <li>• Blocked: {primaryQrCode?.is_blocked ? "✓" : "✗"}</li>
              </ul>
            </div>
          </div>
        )}
      </motion.div>

      {/* Order Stickers Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg text-gray-800">
                Order QR Stickers
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  value={primaryVehicle}
                  disabled
                  className="w-full input-field bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code ID
                </label>
                <input
                  type="text"
                  value={primaryQrCode?.qrcode_id || "—"}
                  disabled
                  className="w-full input-field bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Stickers
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setOrderQuantity(Math.max(1, orderQuantity - 1))
                    }
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={orderQuantity}
                    onChange={(e) =>
                      setOrderQuantity(
                        Math.max(1, parseInt(e.target.value) || 1),
                      )
                    }
                    className="w-20 text-center input-field"
                  />
                  <button
                    onClick={() => setOrderQuantity(orderQuantity + 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Premium waterproof vinyl matte stickers per order
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-700">
                  <strong>Estimated cost:</strong> ₹{orderQuantity * 50} for{" "}
                  {orderQuantity} sticker(s)
                </p>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOrderStickers}
                  className="flex-1 btn-primary"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Active Subscription Plans */}
      {subscriptionPlans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6 mt-8"
        >
          <h3 className="font-display font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <FiCreditCard className="text-purple-500" /> Active Subscription
          </h3>
          <div className="space-y-3">
            {subscriptionPlans.map((plan, i) => (
              <div
                key={i}
                className="flex items-start justify-between p-4 bg-purple-50 rounded-xl border border-purple-100"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {plan.recharge_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {plan.recharge_description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Active from:{" "}
                    <strong>
                      {new Date(plan.effective_from).toLocaleDateString()}
                    </strong>
                  </p>
                  <p className="text-xs text-gray-500">
                    Expires:{" "}
                    <strong>
                      {new Date(plan.effective_until).toLocaleDateString()}
                    </strong>
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium ${
                      new Date(plan.effective_until) >= new Date()
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {new Date(plan.effective_until) >= new Date()
                      ? "Active"
                      : "Expired"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardHome;
