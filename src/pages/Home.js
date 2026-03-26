import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiShield,
  FiSmartphone,
  FiBell,
  FiCheckCircle,
  FiArrowRight,
  FiStar,
  FiZap,
  FiMapPin,
} from "react-icons/fi";
import { HiOutlineQrCode } from "react-icons/hi2";
import { getSubscriptionPlans } from "../services/api";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const Home = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    getSubscriptionPlans()
      .then((res) => setPlans(res.data?.data || []))
      .catch(() => {});
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center gradient-bg overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary-200 text-sm font-medium mb-6 border border-white/20">
                <FiZap className="text-accent-400" />
                Smart QR Alerts for Your Vehicle
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Worried About{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
                  Parking?
                </span>
                <br />
                <span className="text-3xl md:text-4xl lg:text-5xl">
                  We've Got You Covered!
                </span>
              </h1>

              <p className="text-lg text-primary-100 leading-relaxed mb-4 max-w-xl">
                <strong>"Can I park here?"</strong> — Stop worrying! Get instant
                SMS & WhatsApp alerts whenever someone needs you to move your
                vehicle. Our smart QR stickers let anyone notify you in seconds.
              </p>
              <p className="text-base text-primary-200 leading-relaxed mb-8 max-w-xl">
                No more blocked driveways. No more towed cars. No more awkward
                notes on windshields. Just scan, alert, done.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/subscribe"
                  className="btn-accent text-base px-8 py-4 gap-2"
                >
                  Get Started Free <FiArrowRight />
                </Link>
                <Link
                  to="/how-it-works"
                  className="btn-secondary !bg-white/10 !text-white !border-white/20 hover:!bg-white/20 text-base px-8 py-4"
                >
                  How It Works
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-10 text-primary-200 text-sm">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-400" /> Free to Start
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-400" /> 2 Free Alerts
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-400" /> Instant Setup
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Phone mockup with QR scan illustration */}
                <div className="relative mx-auto w-72 h-[500px] bg-gray-900 rounded-[3rem] border-4 border-gray-700 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl" />
                  <div className="h-full bg-gradient-to-b from-primary-50 to-white p-6 pt-12 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mb-4 animate-float">
                      <HiOutlineQrCode className="text-primary-600 text-4xl" />
                    </div>
                    <h3 className="font-display font-bold text-gray-800 text-lg mb-2">
                      QR Scanned!
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Someone scanned your vehicle's QR code
                    </p>
                    <div className="w-full bg-green-50 border border-green-200 rounded-xl p-4 mb-3">
                      <p className="text-green-700 font-semibold text-sm">
                        🔔 Alert Sent!
                      </p>
                      <p className="text-green-600 text-xs mt-1">
                        "Vehicle blocking the way"
                      </p>
                    </div>
                    <div className="w-full bg-primary-50 border border-primary-200 rounded-xl p-3">
                      <p className="text-primary-700 text-xs font-medium">
                        KA01AB1234
                      </p>
                      <p className="text-primary-500 text-[10px]">
                        SMS notification delivered ✓
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 glass-card p-3 px-4 text-white text-sm font-medium"
                >
                  <FiBell className="inline mr-2 text-accent-400" /> Instant
                  Alert
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute bottom-20 -left-8 glass-card p-3 px-4 text-white text-sm font-medium"
                >
                  <FiShield className="inline mr-2 text-green-400" /> Secure &
                  Private
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#ffffff"
              d="M0,80L48,72C96,64,192,48,288,48C384,48,480,64,576,72C672,80,768,80,864,72C960,64,1056,48,1152,48C1248,48,1344,64,1392,72L1440,80L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sound Familiar?
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Parking problems are real. We solve them with technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                emoji: "🚗",
                title: '"Can I park here safely?"',
                desc: "Always worried if your car will be fine while you're away at work, shopping, or in a meeting.",
              },
              {
                emoji: "🚧",
                title: '"My vehicle is blocking someone!"',
                desc: "You parked in a rush and now someone needs to get out. But they can't reach you!",
              },
              {
                emoji: "💡",
                title: '"Oh no, headlights are still on!"',
                desc: "Left your headlights on? A kind stranger notices but has no way to tell you. Until now.",
              },
              {
                emoji: "🔒",
                title: '"Is my car window open?"',
                desc: "You forgot to close the window. Anyone can see it, but nobody can alert you... unless they scan.",
              },
              {
                emoji: "🅿️",
                title: '"Thinking how to remove that car?"',
                desc: "Someone double-parked and blocked you. No phone number on the dashboard. Frustrating!",
              },
              {
                emoji: "🛞",
                title: '"Tyre looks flat!"',
                desc: "A passerby notices your tyre is punctured. They want to help but can't contact you.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ delay: i * 0.1 }}
                className="card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-4xl mb-4 block">{item.emoji}</span>
                <h3 className="font-display font-semibold text-lg text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple. Smart. Secure.
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Three simple steps to protect your vehicle — no app needed for the
              person scanning!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiSmartphone />,
                step: "01",
                title: "Subscribe & Add Vehicle",
                desc: "Sign up with your name and mobile number. Add your vehicle number from the dashboard. It takes less than 2 minutes.",
              },
              {
                icon: <HiOutlineQrCode />,
                step: "02",
                title: "Stick QR Code",
                desc: "Get premium waterproof vinyl matte QR stickers delivered free. Stick them on visible areas of your vehicle.",
              },
              {
                icon: <FiBell />,
                step: "03",
                title: "Get Alerts Instantly",
                desc: "When someone scans your QR code with a concern, you get instant SMS/WhatsApp notifications. No app needed for the scanner!",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ delay: i * 0.15 }}
                className="relative card p-8 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute top-4 right-4 text-5xl font-display font-bold text-primary-100 group-hover:text-primary-200 transition-colors">
                  {item.step}
                </div>
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center text-2xl group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-display font-semibold text-lg text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} className="text-center mt-12">
            <Link to="/how-it-works" className="btn-primary gap-2">
              Learn More <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pricing Preview */}
      {plans.length > 0 && (
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeInUp} className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Plans That Fit Every Need
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Start free, upgrade anytime. Premium waterproof QR stickers
                included.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                    {...stagger}
                    transition={{ delay: i * 0.15 }}
                    className={`card p-8 relative h-full ${
                      plan.is_popular
                        ? "ring-2 ring-primary-500 scale-105 shadow-2xl"
                        : ""
                    }`}
                  >
                    <h3 className="font-display font-bold text-xl text-gray-800 mb-2">
                      {plan.recharge_name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      {plan.recharge_description}
                    </p>
                    <div className="mb-6">
                      {plan.price === 0 ? (
                        <span className="font-display text-4xl font-bold text-gray-900">
                          FREE
                        </span>
                      ) : (
                        <>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-display text-4xl font-bold text-primary-700">
                              ₹{plan.price}
                            </span>
                            {plan.comparable_price > plan.price && (
                              <span className="text-gray-400 text-lg line-through">
                                ₹{plan.comparable_price}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-xs mt-1">
                            per year · per vehicle number
                          </p>
                        </>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 text-sm">
                      <li className="flex items-center gap-2">
                        <FiCheckCircle className="text-green-500 shrink-0" />{" "}
                        {plan.alerts_per_day
                          ? `${plan.alerts_per_day} alert/day`
                          : "Unlimited alerts"}
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheckCircle className="text-green-500 shrink-0" />{" "}
                        SMS Notifications
                      </li>
                      {plan.whatsapp_alerts && (
                        <li className="flex items-center gap-2">
                          <FiCheckCircle className="text-green-500 shrink-0" />{" "}
                          WhatsApp Alerts
                        </li>
                      )}
                      {plan.location_link_in_alert && (
                        <li className="flex items-center gap-2">
                          <FiMapPin className="text-green-500 shrink-0" />{" "}
                          Location in Alert
                        </li>
                      )}
                      <li className="flex items-center gap-2">
                        <FiCheckCircle className="text-green-500 shrink-0" />{" "}
                        {plan.multiple_contact_numbers} Contact Number
                        {plan.multiple_contact_numbers > 1 ? "s" : ""}
                      </li>
                      <li className="flex items-center gap-2">
                        <FiStar className="text-green-500 shrink-0" /> Best for:{" "}
                        {plan.best_for}
                      </li>
                    </ul>

                    <Link
                      to="/subscribe"
                      className={
                        plan.is_popular
                          ? "btn-primary w-full"
                          : "btn-secondary w-full"
                      }
                    >
                      {plan.price === 0 ? "Start Free" : "Get This Plan"}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>

            <motion.div {...fadeInUp} className="text-center mt-8">
              <Link
                to="/plans"
                className="text-primary-600 font-medium hover:underline"
              >
                View full plan comparison →
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="gradient-bg section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "100%", label: "Privacy Protected" },
              { value: "< 5s", label: "Alert Delivery" },
              { value: "24/7", label: "Active Monitoring" },
              { value: "FREE", label: "To Get Started" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-200 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Protect Your Vehicle?
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of smart vehicle owners. Subscribe now and get 2
              free test alerts to experience the magic of instant notifications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/subscribe"
                className="btn-accent text-lg px-10 py-4 gap-2"
              >
                Subscribe Now — It's Free <FiArrowRight />
              </Link>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              No credit card required. Your mobile number is kept 100%
              confidential.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
