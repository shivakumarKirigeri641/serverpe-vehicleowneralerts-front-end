import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiX,
  FiStar,
  FiMapPin,
  FiArrowRight,
  FiCalendar,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { getSubscriptionPlans } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

const DashboardPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(plans);
  useEffect(() => {
    getSubscriptionPlans()
      .then((res) => {
        // Filter out free plans (price === 0)
        const filteredPlans = (res.data?.data || []).filter(
          (plan) => parseFloat(plan.price) !== 0,
        );
        setPlans(filteredPlans);
      })
      .catch(() => toast.error("Failed to load plans"))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectPlan = async (plan) => {
    // Navigate to payment summary with plan ID
    navigate(`/dashboard/payment-summary?planId=${plan.id}`);
  };

  if (loading) return <LoadingSpinner message="Loading plans..." />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-800">
          Subscription Plans
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Choose a plan that fits your needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`card p-6 flex flex-col relative ${
              plan.is_popular ? "ring-2 ring-primary-500" : ""
            }`}
          >
            {plan.is_popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
            )}

            <h3 className="font-display font-bold text-xl text-gray-800">
              {plan.recharge_name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {plan.recharge_description}
            </p>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-gray-900">
                  ₹{plan.price}
                </span>
                {plan.comparable_price > plan.price && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{plan.comparable_price}
                  </span>
                )}
              </div>
            </div>

            <ul className="space-y-2 mb-6 flex-1 text-sm">
              <li className="flex items-center gap-2">
                <FiCheckCircle className="text-green-500 shrink-0" />
                {plan.alert_limit === 0 || plan.alert_limit === undefined
                  ? "Unlimited alerts"
                  : `${plan.alert_limit} alert(s)`}
              </li>
              <li className="flex items-center gap-2">
                {plan.sms_backup ? (
                  <FiCheckCircle className="text-green-500 shrink-0" />
                ) : (
                  <FiX className="text-gray-300 shrink-0" />
                )}
                <span className={!plan.sms_backup ? "text-gray-400" : ""}>
                  SMS Notifications
                </span>
              </li>
              <li className="flex items-center gap-2">
                {plan.report_modes && plan.report_modes !== "Not available" ? (
                  <FiCheckCircle className="text-green-500 shrink-0" />
                ) : (
                  <FiX className="text-gray-300 shrink-0" />
                )}
                <span
                  className={
                    !plan.report_modes || plan.report_modes === "Not available"
                      ? "text-gray-400"
                      : ""
                  }
                >
                  WhatsApp Summaries
                </span>
              </li>
              <li className="flex items-center gap-2">
                {/7\b|7 days|last 7|weekly/i.test(plan.report_modes || "") ? (
                  <FiCalendar className="text-green-500 shrink-0" />
                ) : (
                  <FiX className="text-gray-300 shrink-0" />
                )}
                <span
                  className={
                    !/7\b|7 days|last 7|weekly/i.test(plan.report_modes || "")
                      ? "text-gray-400"
                      : ""
                  }
                >
                  Weekly Summary
                  {/7\b|7 days|last 7|weekly/i.test(
                    plan.report_modes || "",
                  ) && (
                    <span className="ml-1 text-xs text-green-600 font-medium">
                      (Every weekend)
                    </span>
                  )}
                </span>
              </li>
              <li className="flex items-center gap-2">
                {/month|monthly/i.test(plan.report_modes || "") ? (
                  <FiCalendar className="text-green-500 shrink-0" />
                ) : (
                  <FiX className="text-gray-300 shrink-0" />
                )}
                <span
                  className={
                    !/month|monthly/i.test(plan.report_modes || "")
                      ? "text-gray-400"
                      : ""
                  }
                >
                  Monthly Summary
                  {/month|monthly/i.test(plan.report_modes || "") && (
                    <span className="ml-1 text-xs text-green-600 font-medium">
                      (Every month-end)
                    </span>
                  )}
                </span>
              </li>
            </ul>

            <button
              onClick={() => handleSelectPlan(plan)}
              className={
                plan.is_popular
                  ? "btn-primary w-full text-sm"
                  : "btn-secondary w-full text-sm"
              }
            >
              {plan.comparable_price === 0 ? "Current Plan" : "Choose Plan"}{" "}
              <FiArrowRight className="ml-2" />
            </button>

            {/* Highlight for premium plans with summaries */}
            {(/7\b|7 days|last 7|weekly/i.test(plan.report_modes || "") ||
              /month|monthly/i.test(plan.report_modes || "")) && (
              <div className="mt-4 p-3 rounded bg-green-50 border border-green-200 text-green-800 text-xs text-center">
                {/7\b|7 days|last 7|weekly/i.test(plan.report_modes || "") &&
                /month|monthly/i.test(plan.report_modes || "") ? (
                  <>
                    <strong>WhatsApp Summaries:</strong> You will receive a{" "}
                    <b>Weekly</b> summary every weekend and a <b>Monthly</b>{" "}
                    summary at every month-end on WhatsApp.
                  </>
                ) : /7\b|7 days|last 7|weekly/i.test(
                    plan.report_modes || "",
                  ) ? (
                  <>
                    <strong>WhatsApp Summary:</strong> You will receive a{" "}
                    <b>Weekly</b> summary every weekend on WhatsApp.
                  </>
                ) : (
                  <>
                    <strong>WhatsApp Summary:</strong> You will receive a{" "}
                    <b>Monthly</b> summary at every month-end on WhatsApp.
                  </>
                )}
              </div>
            )}

            {/* Plan-specific info section */}
            <div className="mt-4 p-3 rounded bg-blue-50 border border-blue-200 text-blue-800 text-xs text-center">
              {plan.price === 0 ? (
                <>This plan is to try how the alert comes.</>
              ) : plan.sms_backup ? (
                <>
                  For vehicle owners who are ok with SMS notifications. Best for
                  users who prefer SMS.
                </>
              ) : (
                <>For vehicle owners who prefer in-app or WhatsApp summaries.</>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPlans;
