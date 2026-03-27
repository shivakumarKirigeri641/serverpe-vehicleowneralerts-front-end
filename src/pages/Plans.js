import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiX,
  FiStar,
  FiMapPin,
  FiArrowRight,
  FiMessageSquare,
} from "react-icons/fi";
import { getSubscriptionPlans } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchPlans = () => {
    setLoading(true);
    setError("");
    getSubscriptionPlans()
      .then((res) => setPlans(res.data?.data || []))
      .catch(() => setError("Failed to load plans"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const featureList = [
    {
      key: "alerts_per_day",
      label: "Alerts per day",
      format: (v) => v || "Unlimited",
    },
    { key: "sms_notifications", label: "SMS Notifications", bool: true },
    { key: "whatsapp_alerts", label: "WhatsApp Alerts", bool: true },
    {
      key: "instant_notifications",
      label: "Instant Notifications",
      bool: true,
    },
    { key: "usage_limits", label: "Usage", format: (v) => v },
    {
      key: "cooldown_minutes",
      label: "Cooldown",
      format: (v) => `${v} min between alerts`,
    },
    {
      key: "is_weekly_summary",
      label: "Weekly Summary Report (WhatsApp)",
      bool: true,
    },
    {
      key: "is_monthly_summary",
      label: "Monthly Summary Report (WhatsApp)",
      bool: true,
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="gradient-bg section-padding text-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-extrabold text-white mb-6"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary-100 text-lg max-w-2xl mx-auto"
          >
            Start for free and upgrade when you're ready. All plans include
            premium waterproof QR stickers.
          </motion.p>
        </div>
      </section>

      {/* Plans */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <LoadingSpinner message="Loading plans..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchPlans} />
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan, i) => (
                  <div
                    key={plan.rpid}
                    className={`relative ${plan.is_popular ? "pt-4" : ""}`}
                  >
                    {plan.is_popular && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-accent-500 to-orange-400 text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg uppercase tracking-wide z-10">
                        ⭐ Most Popular
                      </div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className={`card p-8 relative flex flex-col h-full ${
                        plan.is_popular
                          ? "ring-2 ring-primary-500 md:scale-105 shadow-2xl"
                          : ""
                      }`}
                    >
                      <div className="mb-6">
                        <h3 className="font-display font-bold text-2xl text-gray-800 mb-1">
                          {plan.recharge_name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {plan.recharge_description}
                        </p>
                      </div>

                      <div className="mb-8">
                        {plan.price === 0 ? (
                          <span className="font-display text-5xl font-bold text-gray-900">
                            FREE
                          </span>
                        ) : (
                          <>
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="font-display text-5xl font-bold text-primary-700">
                                ₹{plan.price}
                              </span>
                              {plan.comparable_price > plan.price && (
                                <span className="text-gray-400 text-xl line-through">
                                  ₹{plan.comparable_price}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-xs mt-1.5">
                              per year · per vehicle number
                            </p>
                          </>
                        )}
                      </div>

                      <ul className="space-y-3 mb-8 flex-1">
                        {featureList.map((f) => {
                          const value = plan[f.key];
                          if (f.bool) {
                            return (
                              <li
                                key={f.key}
                                className="flex items-center gap-3 text-sm"
                              >
                                {value ? (
                                  <FiCheckCircle className="text-green-500 shrink-0" />
                                ) : (
                                  <FiX className="text-gray-300 shrink-0" />
                                )}
                                <span
                                  className={
                                    value ? "text-gray-700" : "text-gray-400"
                                  }
                                >
                                  {f.label}
                                </span>
                              </li>
                            );
                          }
                          return (
                            <li
                              key={f.key}
                              className="flex items-center gap-3 text-sm"
                            >
                              <FiCheckCircle className="text-green-500 shrink-0" />
                              <span className="text-gray-700">
                                {f.label}: <strong>{f.format(value)}</strong>
                              </span>
                            </li>
                          );
                        })}
                      </ul>

                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                        <FiStar className="text-accent-500" />
                        Best for: {plan.best_for}
                      </div>

                      <Link
                        to="/subscribe"
                        className={
                          plan.is_popular
                            ? "btn-primary w-full"
                            : "btn-secondary w-full"
                        }
                      >
                        {plan.price === 0 ? "Start Free Trial" : "Choose Plan"}{" "}
                        <FiArrowRight className="ml-2" />
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Comparison Table */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-20 card overflow-x-auto"
              >
                <div className="p-6">
                  <h3 className="font-display font-bold text-2xl text-gray-800 mb-6">
                    Full Comparison
                  </h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-gray-500 font-medium">
                          Feature
                        </th>
                        {plans.map((p) => (
                          <th
                            key={p.rpid}
                            className="text-center py-3 px-4 font-display font-semibold text-gray-800"
                          >
                            {p.recharge_name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {featureList.map((f) => (
                        <tr key={f.key} className="border-b last:border-0">
                          <td className="py-3 px-4 text-gray-600">{f.label}</td>
                          {plans.map((p) => (
                            <td key={p.rpid} className="text-center py-3 px-4">
                              {f.bool ? (
                                p[f.key] ? (
                                  <FiCheckCircle className="text-green-500 mx-auto" />
                                ) : (
                                  <FiX className="text-gray-300 mx-auto" />
                                )
                              ) : (
                                <span className="font-medium text-gray-700">
                                  {f.format(p[f.key])}
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* 1-subscription note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 bg-primary-50 border border-primary-100 rounded-2xl p-6 text-center"
              >
                <p className="text-primary-800 font-medium text-sm leading-relaxed">
                  <span className="font-bold">Important:</span> Each
                  subscription is linked to <strong>one mobile number</strong>{" "}
                  and <strong>one vehicle registration number</strong>. This
                  ensures every alert reaches the right owner and prevents
                  misuse or spam.
                </p>
              </motion.div>

              {/* QR Sticker Info */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 card p-8 flex flex-col md:flex-row items-center gap-8"
              >
                <div className="w-24 h-24 shrink-0 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <FiMapPin className="text-primary-600 text-3xl" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-gray-800 mb-2">
                    Premium QR Code Stickers
                  </h3>
                  <p className="text-gray-500 leading-relaxed mb-4">
                    Every plan includes premium quality{" "}
                    <strong>waterproof, vinyl matte</strong> QR code stickers
                    designed to last. They're weather-resistant, UV-protected,
                    and built for outdoor use.
                  </p>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">
                        Sticker Delivery:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>
                          First-time subscription: Digital QR for testing
                          purposes only
                        </li>
                        <li>
                          Subsequent subscriptions & renewals: 2 identical
                          waterproof stickers delivered
                        </li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">
                        Placement Guidelines:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>
                          Stick on completely visible and accessible locations
                          (e.g., windshield, rear window)
                        </li>
                        <li>
                          Ensure the QR code is easily scannable by the public
                        </li>
                        <li>
                          Avoid placing in hard-to-reach or obscured areas
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
              {/* Responsibility Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 card p-8 bg-amber-50 border border-amber-200"
              >
                <h3 className="font-display font-bold text-lg text-gray-800 mb-4">
                  Important Disclaimer
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    <strong>Service Scope:</strong> ServerPe App Solutions is
                    responsible solely for alerting the respective vehicle
                    owners about concerns raised by the public. We are{" "}
                    <strong>not responsible</strong> for any vehicle-related
                    issues, damages, or incidents that occur.
                  </p>
                  <p>
                    <strong>Owner Responsibility:</strong> Vehicle owners are
                    solely responsible for taking timely action after receiving
                    an alert. ServerPe App Solutions is{" "}
                    <strong>not responsible</strong> if owners delay in
                    responding to or addressing alerts.
                  </p>
                  <p>
                    <strong>Public Expectation:</strong> Members of the public
                    who report concerns must understand that they should wait
                    for the vehicle owner to respond and take action. Response
                    times may vary based on owner availability and
                    circumstances.
                  </p>
                  <p>
                    <strong>Mobile Number Protection:</strong> Vehicle owner
                    mobile numbers are fully protected and kept highly
                    confidential. The public cannot access, see, or contact the
                    vehicle owner directly. All communications are facilitated
                    solely through ServerPe App Solutions platform to ensure
                    complete privacy and security.
                  </p>
                </div>
              </motion.div>

              {/* Powered by */}
              <div className="mt-12 text-center">
                <p className="text-sm text-gray-500">
                  Powered by <strong>ServerPe App Solutions</strong>
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Plans;
