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
  FiCalendar,
} from "react-icons/fi";
import { HiOutlineQrCode } from "react-icons/hi2";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  addQRCodeSticker,
  getMyScans,
  getQRCodeImage,
  checkSubscriptionStatus,
} from "../../services/api";

const DashboardHome = () => {
  const { owner, refreshOwner } = useAuth();
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [adding, setAdding] = useState(false);
  const [scans, setScans] = useState([]);
  const [scansLoading, setScansLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [subscriptionCheck, setSubscriptionCheck] = useState({
    loading: false,
    message: null,
    active: null,
    data: null,
  });

  // Extract data from owner context (from verify-otp / dashboard response)
  const qrCodes = owner?.qrCodeInfo || [];
  const rawPlans = owner?.subscriptionPlans || [];

  // Deduplicate subscription plans by vosid
  const subscriptionPlans = rawPlans.filter(
    (plan, index, self) =>
      index === self.findIndex((p) => p.vosid === plan.vosid),
  );

  // Determine the latest plan (may be active OR expired)
  const latestPlan = subscriptionPlans.length > 0 ? subscriptionPlans[0] : null;
  const isLatestPlanActive = latestPlan
    ? new Date(latestPlan.effective_until) >= new Date()
    : false;

  // For backward compat — use the latest plan if active, null otherwise
  const activePlan = isLatestPlanActive ? latestPlan : null;

  const hasActiveSubscription = isLatestPlanActive;

  // Helper: how many days until expiry (negative = days ago)
  const getDaysUntilExpiry = (dateStr) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysUntilExpiry = latestPlan
    ? getDaysUntilExpiry(latestPlan.effective_until)
    : null;

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

    (async () => {
      // refresh owner/dashboard data on mount
      if (typeof refreshOwner === "function") await refreshOwner();

      // attempt to fetch the QR image
      try {
        const imgRes = await getQRCodeImage();
        if (imgRes && imgRes.data) {
          const blob = imgRes.data;
          const url = window.URL.createObjectURL(blob);
          if (qrImageUrl) {
            try {
              window.URL.revokeObjectURL(qrImageUrl);
            } catch (e) {}
          }
          setQrImageUrl(url);
        }
      } catch (err) {
        console.warn("QR image fetch on mount failed:", err?.message || err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // cleanup object URL on unmount / when url changes
  useEffect(() => {
    return () => {
      if (qrImageUrl) {
        try {
          window.URL.revokeObjectURL(qrImageUrl);
        } catch (e) {}
      }
    };
  }, [qrImageUrl]);

  // check subscription status for the primary vehicle (public endpoint)
  useEffect(() => {
    const vehicleNumber = owner?.vehicle_number;
    if (!vehicleNumber) return;

    let mounted = true;
    (async () => {
      try {
        setSubscriptionCheck({ loading: true, message: null, active: null, data: null });
        const res = await checkSubscriptionStatus(vehicleNumber);
        if (!mounted) return;
        const msg = res.data?.message || "Status unavailable";
        const subData = res.data?.data?.subscription_status_details || null;

        // Determine active status from the API response:
        // The API returns specific messages for expired/exhausted vs active
        const isExpiredMsg = /expired/i.test(msg) || /exhausted/i.test(msg);
        const isActiveMsg = /active/i.test(msg) && !isExpiredMsg;
        const active = res.data?.successstatus ? isActiveMsg : null;

        setSubscriptionCheck({ loading: false, message: msg, active, data: subData });
      } catch (err) {
        if (!mounted) return;
        setSubscriptionCheck({
          loading: false,
          message: "Check failed",
          active: null,
          data: null,
        });
      }
    })();

    return () => {
      mounted = false;
    };
  }, [owner?.vehicle_number]);

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
        try {
          if (typeof refreshOwner === "function") await refreshOwner();
          const imgRes = await getQRCodeImage();
          if (imgRes && imgRes.data) {
            const blob = imgRes.data;
            const url = window.URL.createObjectURL(blob);
            if (qrImageUrl) {
              try {
                window.URL.revokeObjectURL(qrImageUrl);
              } catch (e) {}
            }
            setQrImageUrl(url);
          }
        } catch (err) {
          console.warn("QR image fetch failed", err);
        }
      } else {
        toast.error(res.data?.message || "Failed to assign vehicle");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign vehicle");
    } finally {
      setAdding(false);
    }
  };

  // Format expiry display with relative context
  const formatPlanExpiry = () => {
    if (!latestPlan) return "—";
    const dateStr = new Date(latestPlan.effective_until).toLocaleDateString("en-IN");
    return dateStr;
  };

  // Get the plan expiry label
  const getPlanExpiryLabel = () => {
    if (!latestPlan) return "Plan Expires";
    if (isLatestPlanActive) {
      if (daysUntilExpiry !== null && daysUntilExpiry <= 7) {
        return "Expires Soon!";
      }
      return "Plan Expires";
    }
    return "Plan Expired";
  };

  // Stat card color override for expired plan
  const getPlanExpiryColor = () => {
    if (!latestPlan) return "bg-gray-100 text-gray-500";
    if (!isLatestPlanActive) return "bg-red-100 text-red-600";
    if (daysUntilExpiry !== null && daysUntilExpiry <= 7)
      return "bg-orange-100 text-orange-600";
    return "bg-amber-100 text-amber-600";
  };

  const getActivePlanColor = () => {
    if (!latestPlan) return "bg-gray-100 text-gray-500";
    if (!isLatestPlanActive) return "bg-red-100 text-red-600";
    return "bg-purple-100 text-purple-600";
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

      {/* Subscription Status Banner from API */}
      {subscriptionCheck.message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`rounded-2xl p-4 mb-6 flex items-center gap-4 border ${
            subscriptionCheck.active === true
              ? "bg-green-50 border-green-200"
              : subscriptionCheck.active === false
                ? "bg-red-50 border-red-200"
                : "bg-gray-50 border-gray-200"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              subscriptionCheck.active === true
                ? "bg-green-100 text-green-600"
                : subscriptionCheck.active === false
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {subscriptionCheck.active === true ? (
              <FiCreditCard className="text-lg" />
            ) : (
              <FiAlertCircle className="text-lg" />
            )}
          </div>
          <div className="flex-1">
            <p
              className={`font-medium text-sm ${
                subscriptionCheck.active === true
                  ? "text-green-800"
                  : subscriptionCheck.active === false
                    ? "text-red-800"
                    : "text-gray-800"
              }`}
            >
              {subscriptionCheck.message}
            </p>
          </div>
          {subscriptionCheck.active === false && (
            <Link
              to="/dashboard/plans"
              className="btn-accent text-sm !py-2 shrink-0"
            >
              Renew Now <FiArrowRight className="ml-1 inline" />
            </Link>
          )}
        </motion.div>
      )}

      {/* Subscription Alert (when no plans at all / assign vehicle) */}
      {!hasActiveSubscription && !subscriptionCheck.message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-4"
        >
          <FiAlertCircle className="text-amber-500 text-xl shrink-0" />
          <div className="flex-1">
            {rawPlans.length === 0 ? (
              <>
                <p className="font-medium text-amber-800">
                  Assign vehicle to get your QR code tested
                </p>
                <p className="text-sm text-amber-600">
                  Assign a vehicle to generate a QR sticker. You can run two
                  quick tests to validate the qr code before renewing the
                  subscription.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-amber-800">
                  Your trial/subscription has expired
                </p>
                <p className="text-sm text-amber-600">
                  Renew now to continue receiving unlimited vehicle alerts.
                </p>
              </>
            )}
          </div>
          {rawPlans.length === 0 ? (
            <button
              onClick={() => setShowAddVehicle(true)}
              className="btn-accent text-sm !py-2 shrink-0"
            >
              Assign Vehicle
            </button>
          ) : (
            <Link
              to="/dashboard/plans"
              className="btn-accent text-sm !py-2 shrink-0"
            >
              Renew <FiArrowRight className="ml-1" />
            </Link>
          )}
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
            label: latestPlan
              ? isLatestPlanActive
                ? "Active Plan"
                : "Expired Plan"
              : "Active Plan",
            value: latestPlan?.recharge_name || "—",
            icon: <FiCreditCard />,
            color: getActivePlanColor(),
          },
          {
            label: getPlanExpiryLabel(),
            value: formatPlanExpiry(),
            icon: <FiCalendar />,
            color: getPlanExpiryColor(),
            sublabel:
              latestPlan && !isLatestPlanActive
                ? `Expired ${Math.abs(daysUntilExpiry)} day${Math.abs(daysUntilExpiry) !== 1 ? "s" : ""} ago`
                : latestPlan && isLatestPlanActive && daysUntilExpiry !== null && daysUntilExpiry <= 7
                  ? `${daysUntilExpiry} day${daysUntilExpiry !== 1 ? "s" : ""} left`
                  : null,
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
            {stat.sublabel && (
              <p
                className={`text-xs mt-1 font-medium ${
                  !isLatestPlanActive ? "text-red-500" : "text-orange-500"
                }`}
              >
                {stat.sublabel}
              </p>
            )}
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
          My QR Stickers
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
              {/* Inline QR image (small) */}
              {qrImageUrl && (
                <div className="ml-4">
                  <img
                    src={qrImageUrl}
                    alt="QR code"
                    className="w-28 h-28 object-contain rounded-md border"
                  />
                </div>
              )}
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

      {/* Subscription Plans History */}
      {subscriptionPlans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6 mt-8"
        >
          <h3 className="font-display font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <FiCreditCard className={hasActiveSubscription ? "text-green-500" : "text-red-400"} />
            {hasActiveSubscription ? "Subscription Details" : "Subscription Details — Expired"}
          </h3>
          <div className="space-y-3">
            {subscriptionPlans.map((plan, i) => {
              const isPlanActive =
                new Date(plan.effective_until) >= new Date();
              const planDaysLeft = getDaysUntilExpiry(plan.effective_until);

              return (
                <div
                  key={i}
                  className={`flex items-start justify-between p-4 rounded-xl border ${
                    isPlanActive
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {plan.recharge_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {plan.recharge_description}
                    </p>
                    <div className="mt-2 space-y-0.5">
                      <p className="text-xs text-gray-500">
                        Active from:{" "}
                        <strong>
                          {new Date(plan.effective_from).toLocaleDateString("en-IN")}
                        </strong>
                      </p>
                      <p className="text-xs text-gray-500">
                        {isPlanActive ? "Expires:" : "Expired:"}{" "}
                        <strong>
                          {new Date(plan.effective_until).toLocaleDateString("en-IN")}
                        </strong>
                      </p>
                    </div>
                    {/* Contextual sublabel */}
                    {isPlanActive && planDaysLeft !== null && planDaysLeft <= 7 && (
                      <p className="text-xs text-orange-600 font-medium mt-1">
                        ⚠️ Expires in {planDaysLeft} day{planDaysLeft !== 1 ? "s" : ""}
                      </p>
                    )}
                    {!isPlanActive && planDaysLeft !== null && (
                      <p className="text-xs text-red-600 font-medium mt-1">
                        Expired {Math.abs(planDaysLeft)} day{Math.abs(planDaysLeft) !== 1 ? "s" : ""} ago
                      </p>
                    )}
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium ${
                        isPlanActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {isPlanActive ? "Active" : "Expired"}
                    </span>
                    {!isPlanActive && (
                      <Link
                        to="/dashboard/plans"
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2"
                      >
                        Renew Now →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardHome;
