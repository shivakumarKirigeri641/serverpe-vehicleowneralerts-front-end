import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiX,
  FiStar,
  FiMapPin,
  FiArrowRight,
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
    navigate(`/dashboard/payment-summary?planId=${plan.rpid}`);
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
            key={plan.rpid}
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
                {plan.alerts_per_day
                  ? `${plan.alerts_per_day} alert/day`
                  : "Unlimited alerts"}
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="text-green-500 shrink-0" /> SMS
                Notifications
              </li>
              <li className="flex items-center gap-2">
                {plan.whatsapp_alerts ? (
                  <FiCheckCircle className="text-green-500 shrink-0" />
                ) : (
                  <FiX className="text-gray-300 shrink-0" />
                )}
                <span className={!plan.whatsapp_alerts ? "text-gray-400" : ""}>
                  WhatsApp Alerts
                </span>
              </li>
              <li className="flex items-center gap-2">
                {plan.location_link_in_alert ? (
                  <FiMapPin className="text-green-500 shrink-0" />
                ) : (
                  <FiX className="text-gray-300 shrink-0" />
                )}
                <span
                  className={
                    !plan.location_link_in_alert ? "text-gray-400" : ""
                  }
                >
                  Location in Alert
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FiStar className="text-green-500 shrink-0" />{" "}
                {plan.multiple_contact_numbers} Contact Number
                {plan.multiple_contact_numbers > 1 ? "s" : ""}
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
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPlans;
