import React, { useEffect, useState } from "react";
import PolicyModal from "../../components/PolicyModal";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiLoader,
  FiAlertCircle,
  FiMapPin,
  FiChevronDown,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  getSubscriptionPlans,
  createPaymentOrder,
  verifyPayment,
  getStatesUnions,
} from "../../services/api";

const GST_RATE = 0.18; // 18% GST in India

const INITIAL_ADDRESS = {
  ownerName: "",
  mobileNumber: "",
  flatHouseNo: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  district: "",
  stateUnion: "",
  pincode: "",
  mapsLink: "",
};

const PaymentSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { owner } = useAuth();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [statesUnions, setStatesUnions] = useState([]);
  const [statesLoading, setStatesLoading] = useState(true);

  // Address form state
  const [address, setAddress] = useState(INITIAL_ADDRESS);
  const [addressErrors, setAddressErrors] = useState({});
  // Policy modal state
  const [policyModal, setPolicyModal] = useState({
    open: false,
    type: "",
    title: "",
  });

  const planId = new URLSearchParams(location.search).get("planId");

  // Pre-fill name and mobile from owner context
  useEffect(() => {
    if (owner) {
      setAddress((prev) => ({
        ...prev,
        ownerName: prev.ownerName || owner.vehicle_owner_name || "",
        mobileNumber: prev.mobileNumber || owner.mobile_number || "",
      }));
    }
  }, [owner]);

  // Fetch plan details
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getSubscriptionPlans();
        const plans = res.data?.data || [];

        if (planId) {
          const selectedPlan = plans.find((p) => String(p.rpid) === planId);
          if (selectedPlan) {
            setPlan(selectedPlan);
          } else {
            toast.error("Plan not found");
            navigate("/dashboard/plans");
          }
        } else {
          navigate("/dashboard/plans");
        }
      } catch (err) {
        toast.error("Failed to load plan details");
        navigate("/dashboard/plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [planId, navigate]);

  // Fetch states/union territories
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await getStatesUnions();
        if (res.data?.successstatus) {
          setStatesUnions(res.data.data || []);
        }
      } catch (err) {
        console.warn("Failed to fetch states:", err?.message);
      } finally {
        setStatesLoading(false);
      }
    };
    fetchStates();
  }, []);

  // Update address field
  const updateAddress = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (addressErrors[field]) {
      setAddressErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Validate address
  const validateAddress = () => {
    const errors = {};
    const required = [
      { key: "ownerName", label: "Vehicle owner name" },
      { key: "mobileNumber", label: "Mobile number" },
      { key: "flatHouseNo", label: "Flat/House no" },
      { key: "addressLine1", label: "Address line 1" },
      { key: "city", label: "City" },
      { key: "district", label: "District" },
      { key: "stateUnion", label: "State/Union territory" },
      { key: "pincode", label: "Pincode" },
    ];

    required.forEach(({ key, label }) => {
      if (!address[key]?.trim()) {
        errors[key] = `${label} is required`;
      }
    });

    // Validate mobile number format
    if (address.mobileNumber && !/^\d{10}$/.test(address.mobileNumber.trim())) {
      errors.mobileNumber = "Enter a valid 10-digit mobile number";
    }

    // Validate pincode
    if (address.pincode && !/^\d{6}$/.test(address.pincode.trim())) {
      errors.pincode = "Enter a valid 6-digit pincode";
    }

    // Validate maps link if provided
    if (
      address.mapsLink.trim() &&
      !/^https?:\/\//i.test(address.mapsLink.trim())
    ) {
      errors.mapsLink = "Enter a valid URL starting with http:// or https://";
    }

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayNow = async () => {
    if (!plan || !owner) return;

    // Validate address first
    if (!validateAddress()) {
      toast.error("Please fill in all required delivery address fields");
      // Scroll to the address section
      document
        .getElementById("delivery-address-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setProcessing(true);
    try {
      // Create Razorpay order
      const orderRes = await createPaymentOrder({
        amount: plan.price,
        currency: "INR",
        vehicle_number: owner.vehicle_number,
      });

      if (!orderRes.data?.successstatus) {
        throw new Error(orderRes.data?.message || "Failed to create order");
      }

      const orderData = orderRes.data.data;
      const baseAmount = parseFloat(plan.price) || 0;
      const gst = calculateGST(baseAmount);
      const total = baseAmount + gst;

      // Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: Math.round(total * 100), // in paise
        currency: "INR",
        name: "ServerPe Vehicle Alerts",
        description: `${plan.recharge_name} subscription for ${owner.vehicle_number}`,
        order_id: orderData.order_id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              vehicle_number: owner.vehicle_number,
              subscription_plan_id: plan.rpid,
              amount: total,
              delivery_address: address,
            });

            if (verifyRes.data?.successstatus) {
              toast.success("Payment successful!");
              navigate("/dashboard/payment-success", {
                state: {
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  plan,
                  amount: total,
                  invoiceNumber: verifyRes.data?.data?.invoice?.invoice_number,
                },
              });
            } else {
              throw new Error(
                verifyRes.data?.message || "Payment verification failed",
              );
            }
          } catch (err) {
            toast.error(err.message || "Payment verification failed");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: address.ownerName || owner.vehicle_owner_name || "",
          email: owner.email || "",
          contact: address.mobileNumber || owner.mobile_number || "",
        },
        theme: {
          color: "#4f46e5", // indigo primary color
        },
      };

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          const razorpay = new window.Razorpay(options);
          razorpay.open();
        };
        document.body.appendChild(script);
      } else {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (err) {
      toast.error(err.message || "Failed to process payment");
      setProcessing(false);
    }
  };

  const calculateGST = (amount) => {
    return Math.round(amount * GST_RATE * 100) / 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <FiLoader className="text-4xl text-primary-400 mx-auto mb-3 animate-spin" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!plan || !owner) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <FiAlertCircle className="text-4xl text-red-400 mx-auto mb-3" />
          <p className="text-gray-600">Payment details not available</p>
        </div>
      </div>
    );
  }

  const baseAmount = parseFloat(plan.price) || 0;
  const gstAmount = calculateGST(baseAmount);
  const totalAmount = baseAmount + gstAmount;

  // Helper: render a form input field
  const renderField = (label, field, placeholder, options = {}) => {
    const {
      required = true,
      type = "text",
      maxLength,
      colSpan2 = false,
    } = options;
    return (
      <div className={colSpan2 ? "sm:col-span-2" : ""}>
        <label
          htmlFor={`addr-${field}`}
          className="block text-xs font-medium text-gray-600 mb-1.5"
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
          {!required && (
            <span className="text-gray-400 ml-1 font-normal">(Optional)</span>
          )}
        </label>
        <input
          id={`addr-${field}`}
          type={type}
          maxLength={maxLength}
          value={address[field]}
          onChange={(e) => updateAddress(field, e.target.value)}
          placeholder={placeholder}
          className={`input-field w-full text-sm ${
            addressErrors[field]
              ? "!border-red-400 !ring-red-200 focus:!ring-red-300 focus:!border-red-400"
              : ""
          }`}
        />
        {addressErrors[field] && (
          <p className="text-xs text-red-500 mt-1">{addressErrors[field]}</p>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <button
        onClick={() => navigate("/dashboard/plans")}
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-medium"
      >
        <FiArrowLeft /> Back to Plans
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid lg:grid-cols-3 gap-8"
      >
        {/* Left: Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Owner Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h3 className="font-display font-semibold text-lg text-gray-800 mb-4">
              Owner Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Full Name
                </p>
                <p className="font-semibold text-gray-800">
                  {owner.vehicle_owner_name || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Mobile Number
                </p>
                <p className="font-semibold text-gray-800">
                  {owner.mobile_number || "—"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Email
                </p>
                <p className="font-semibold text-gray-800">
                  {owner.email || "Not provided"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Vehicle Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h3 className="font-display font-semibold text-lg text-gray-800 mb-4">
              Vehicle Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Vehicle Number
                </p>
                <p className="font-semibold text-lg bg-primary-50 text-primary-700 px-3 py-2 rounded-lg">
                  {owner.vehicle_number || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Duration
                </p>
                <p className="font-semibold text-gray-800">1 Year</p>
              </div>
            </div>
          </motion.div>

          {/* ────────────────────────────────────────────────────────────── */}
          {/*  Delivery Address Section                                     */}
          {/* ────────────────────────────────────────────────────────────── */}
          <motion.div
            id="delivery-address-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-1">
              <FiMapPin className="text-primary-500" />
              <h3 className="font-display font-semibold text-lg text-gray-800">
                Delivery Address
              </h3>
            </div>
            <p className="text-xs text-gray-400 mb-5">
              QR sticker will be delivered to this address after successful
              payment.
            </p>

            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-4">
              {/* Owner name */}
              {renderField(
                "Vehicle Owner Name",
                "ownerName",
                "Full name as on QR sticker",
              )}

              {/* Mobile for delivery */}
              {renderField(
                "Mobile Number",
                "mobileNumber",
                "10-digit mobile number",
                { type: "tel", maxLength: 10 },
              )}

              {/* Flat / House No */}
              {renderField(
                "Flat / House No.",
                "flatHouseNo",
                "e.g., Flat 204, 2nd Floor",
              )}

              {/* Address Line 1 */}
              {renderField(
                "Address Line 1",
                "addressLine1",
                "Building name, Street / Road",
              )}

              {/* Address Line 2 */}
              {renderField(
                "Address Line 2",
                "addressLine2",
                "Area, Colony (if any)",
                { required: false },
              )}

              {/* Landmark */}
              {renderField(
                "Landmark",
                "landmark",
                "Near temple, school, etc.",
                { required: false },
              )}

              {/* City */}
              {renderField("City / Town", "city", "e.g., Bengaluru")}

              {/* District */}
              {renderField("District", "district", "e.g., Bangalore Urban")}

              {/* State / Union Territory — dropdown */}
              <div>
                <label
                  htmlFor="addr-stateUnion"
                  className="block text-xs font-medium text-gray-600 mb-1.5"
                >
                  State / Union Territory
                  <span className="text-red-400 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <select
                    id="addr-stateUnion"
                    value={address.stateUnion}
                    onChange={(e) =>
                      updateAddress("stateUnion", e.target.value)
                    }
                    className={`input-field w-full text-sm appearance-none pr-10 cursor-pointer ${
                      addressErrors.stateUnion
                        ? "!border-red-400 !ring-red-200 focus:!ring-red-300 focus:!border-red-400"
                        : ""
                    } ${!address.stateUnion ? "text-gray-400" : "text-gray-800"}`}
                  >
                    <option value="" disabled>
                      {statesLoading ? "Loading…" : "— Select state —"}
                    </option>
                    {statesUnions.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.type})
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {addressErrors.stateUnion && (
                  <p className="text-xs text-red-500 mt-1">
                    {addressErrors.stateUnion}
                  </p>
                )}
              </div>

              {/* Pincode */}
              {renderField("Pincode", "pincode", "6-digit pincode", {
                type: "text",
                maxLength: 6,
              })}

              {/* Google Maps link – optional, full width */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="addr-mapsLink"
                  className="block text-xs font-medium text-gray-600 mb-1.5"
                >
                  Google Maps Location Link
                  <span className="text-gray-400 ml-1 font-normal">
                    (Optional)
                  </span>
                </label>
                <input
                  id="addr-mapsLink"
                  type="url"
                  value={address.mapsLink}
                  onChange={(e) => updateAddress("mapsLink", e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className={`input-field w-full text-sm ${
                    addressErrors.mapsLink
                      ? "!border-red-400 !ring-red-200 focus:!ring-red-300 focus:!border-red-400"
                      : ""
                  }`}
                />
                {addressErrors.mapsLink && (
                  <p className="text-xs text-red-500 mt-1">
                    {addressErrors.mapsLink}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Share your location via Google Maps for accurate delivery.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Plan Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 border-2 border-primary-200 bg-primary-50"
          >
            <h3 className="font-display font-semibold text-lg text-gray-800 mb-4">
              Selected Plan
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-display font-bold text-2xl text-primary-700">
                  {plan.recharge_name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {plan.recharge_description}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-primary-200">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FiCheckCircle className="text-green-500 shrink-0" />
                  {plan.alerts_per_day
                    ? `${plan.alerts_per_day} alerts/day`
                    : "Unlimited alerts"}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FiCheckCircle className="text-green-500 shrink-0" />
                  SMS Notifications
                </div>
                {plan.whatsapp_alerts && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FiCheckCircle className="text-green-500 shrink-0" />
                    WhatsApp Alerts
                  </div>
                )}
                {plan.location_link_in_alert && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FiCheckCircle className="text-green-500 shrink-0" />
                    Location in Alerts
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800"
          >
            <p>
              ✓ Your subscription will be valid for <strong>1 year</strong> from
              the payment date.
            </p>
            <p className="mt-2">
              ✓ You can download the invoice immediately after successful
              payment.
            </p>
            <p className="mt-2">
              ✓ QR sticker will be dispatched to the delivery address provided
              above.
            </p>
            <p className="mt-2 font-medium text-amber-900">
              Note: Renewing a plan will overwrite your current subscription.
              Please ensure you intend to replace the existing plan before
              proceeding.
            </p>
          </motion.div>
        </div>

        {/* Right: Payment Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6 h-fit sticky top-20"
        >
          <h3 className="font-display font-semibold text-lg text-gray-800 mb-6">
            Payment Summary
          </h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subscription Amount</span>
              <span className="font-semibold text-gray-800">
                ₹{baseAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">GST (18%)</span>
              <span className="font-semibold text-gray-800">
                ₹{gstAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="border-t-2 pt-4 mb-6">
            <div className="flex justify-between">
              <span className="font-display font-bold text-lg text-gray-800">
                Total to Pay
              </span>
              <span className="font-display font-bold text-xl text-primary-700">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Delivery address mini-preview */}
          {address.flatHouseNo && address.city && (
            <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs text-gray-600">
              <p className="font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FiMapPin className="w-3 h-3" /> Delivering to
              </p>
              <p>
                {address.ownerName && <>{address.ownerName}, </>}
                {address.flatHouseNo}, {address.addressLine1}
                {address.addressLine2 && `, ${address.addressLine2}`}
              </p>
              <p>
                {address.city}
                {address.district && `, ${address.district}`}
                {address.stateUnion && ` - ${address.stateUnion}`}
                {address.pincode && ` ${address.pincode}`}
              </p>
            </div>
          )}

          {/* Policy agreement before Pay Now */}
          <div className="text-xs text-gray-600 text-center mb-3">
            By proceeding, you agree to our
            <button
              type="button"
              className="text-primary-600 hover:underline ml-1 mr-1"
              onClick={() =>
                setPolicyModal({
                  open: true,
                  type: "payment",
                  title: "Payment Policy",
                })
              }
            >
              Payment
            </button>
            &
            <button
              type="button"
              className="text-primary-600 hover:underline ml-1"
              onClick={() =>
                setPolicyModal({
                  open: true,
                  type: "refund",
                  title: "Refund Policy",
                })
              }
            >
              Refund Policy
            </button>
          </div>

          <button
            onClick={handlePayNow}
            disabled={processing}
            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <FiLoader className="animate-spin" />
                Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            Secure payment powered by Razorpay
          </p>

          {/* Policy Modal */}
          <PolicyModal
            open={policyModal.open}
            onClose={() => setPolicyModal({ open: false, type: "", title: "" })}
            policyType={policyModal.type}
            title={policyModal.title}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSummary;
