import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiSmartphone,
  FiBell,
  FiArrowRight,
  FiCheckCircle,
  FiTruck,
  FiUserCheck,
} from "react-icons/fi";
import { HiOutlineQrCode } from "react-icons/hi2";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const HowItWorks = () => {
  const ownerSteps = [
    {
      step: 1,
      icon: <FiUserCheck />,
      title: "Subscribe with Your Details",
      desc: "Create your account by providing your name and mobile number. Your number stays 100% confidential — no one sees it, ever.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      step: 2,
      icon: <HiOutlineQrCode />,
      title: "Add Your Vehicle & Get QR Code",
      desc: "From your dashboard, add your vehicle number. We generate a unique QR code sticker linked to your vehicle. You get 2 free test scans to try it out!",
      color: "bg-purple-100 text-purple-600",
    },
    {
      step: 3,
      icon: <FiTruck />,
      title: "Receive Premium QR Stickers",
      desc: "We deliver 2 premium waterproof vinyl matte QR code stickers to your doorstep — completely free! Stick them on visible areas of your vehicle (windshield, rear, side).",
      color: "bg-green-100 text-green-600",
    },
    {
      step: 4,
      icon: <FiSmartphone />,
      title: "Test Your QR Code",
      desc: "Scan the generated QR code from your dashboard to test. You'll see exactly what a concerned person would see. Test it twice for free!",
      color: "bg-amber-100 text-amber-600",
    },
    {
      step: 5,
      icon: <FiBell />,
      title: "Renew & Enjoy Unlimited Alerts",
      desc: "After your 2 free test scans, choose a subscription plan that fits. Get unlimited SMS & WhatsApp notifications whenever anyone scans your QR!",
      color: "bg-red-100 text-red-600",
    },
  ];

  const publicSteps = [
    {
      step: 1,
      title: "Spot a Vehicle Issue",
      desc: "You see a vehicle blocking your driveway, headlights left on, window open, or any other concern while out in a parking lot, street, or building.",
      emoji: "👀",
    },
    {
      step: 2,
      title: "Find the ServerPe QR Sticker",
      desc: "Look for the ServerPe QR code sticker on the vehicle — usually placed on the windshield, rear glass, or side window.",
      emoji: "🔍",
    },
    {
      step: 3,
      title: "Scan with Your Phone Camera",
      desc: "Simply open your phone's camera and scan the QR code. No app download needed! It opens a mobile-friendly page in your browser.",
      emoji: "📱",
    },
    {
      step: 4,
      title: "Select Your Concern",
      desc: 'Choose from a list of common concerns like "Vehicle blocking the way", "Headlights are ON", "Tyre punctured", or type a custom message.',
      emoji: "✏️",
    },
    {
      step: 5,
      title: "Submit & Done!",
      desc: "Hit submit and the vehicle owner gets an instant SMS/WhatsApp notification with your concern. They'll be on their way in minutes!",
      emoji: "✅",
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="gradient-bg section-padding text-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-extrabold text-white mb-6"
          >
            How It Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary-100 text-lg max-w-2xl mx-auto"
          >
            Whether you're a vehicle owner protecting your ride, or a concerned
            citizen trying to help — it's incredibly simple.
          </motion.p>
        </div>
      </section>

      {/* For Vehicle Owners */}
      <section className="section-padding bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-4">
              🚗 For Vehicle Owners
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Protect Your Vehicle in 5 Easy Steps
            </h2>
          </motion.div>

          <div className="space-y-8">
            {ownerSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div
                  className={`w-14 h-14 shrink-0 rounded-2xl ${step.color} flex items-center justify-center text-2xl`}
                >
                  {step.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-primary-400 bg-primary-50 px-2 py-0.5 rounded">
                      STEP {step.step}
                    </span>
                    <h3 className="font-display font-semibold text-lg text-gray-800">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Public */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-50 rounded-full text-accent-700 text-sm font-medium mb-4">
              🤝 For Public / Concerned Citizens
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Help a Vehicle Owner in Seconds
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              No app download. No registration. Just scan and submit.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-6">
            {publicSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 text-center relative"
              >
                <span className="text-3xl block mb-3">{step.emoji}</span>
                <span className="text-xs font-bold text-gray-400 mb-2 block">
                  STEP {step.step}
                </span>
                <h3 className="font-display font-semibold text-sm text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {step.desc}
                </p>
                {i < publicSteps.length - 1 && (
                  <FiArrowRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-gray-300 text-xl z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="section-padding bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why ServerPe Vehicle Alerts?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Complete Privacy",
                desc: "Your mobile number is NEVER shown to anyone. The person scanning only sees concern options — not your details.",
              },
              {
                title: "Premium QR Stickers",
                desc: "Waterproof, vinyl matte finish — built to last in all weather conditions. Delivered free to your doorstep.",
              },
              {
                title: "No App Required for Scanner",
                desc: "The person scanning doesn't need to download any app. It works directly in the browser — mobile-first design.",
              },
              {
                title: "Instant Notifications",
                desc: "Receive SMS and WhatsApp alerts within seconds of someone scanning your QR code. Never miss an alert.",
              },
              {
                title: "Multiple Concern Types",
                desc: "Pre-defined options like blocking, headlights, tyre issues, plus a custom message field for anything else.",
              },
              {
                title: "Affordable Plans",
                desc: "Start free with 2 test alerts. Then upgrade to unlimited alerts with plans starting at just ₹599.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-4"
              >
                <FiCheckCircle className="text-green-500 text-xl shrink-0 mt-1" />
                <div>
                  <h3 className="font-display font-semibold text-gray-800 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-bg section-padding text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-primary-100 text-lg mb-8">
              Subscribe now and protect your vehicle in under 2 minutes.
            </p>
            <Link
              to="/subscribe"
              className="btn-accent text-lg px-10 py-4 gap-2"
            >
              Get Started Free <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
