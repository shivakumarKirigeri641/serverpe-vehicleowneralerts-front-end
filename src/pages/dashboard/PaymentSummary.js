import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  getSubscriptionPlans,
  createPaymentOrder,
  verifyPayment,
} from "../../services/api";

const GST_RATE = 0.18; // 18% GST in India

const PaymentSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { owner } = useAuth();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const planId = new URLSearchParams(location.search).get("planId");

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

  const handlePayNow = async () => {
    if (!plan || !owner) return;

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
          name: owner.vehicle_owner_name || "",
          email: owner.email || "",
          contact: owner.mobile_number || "",
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
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSummary;
