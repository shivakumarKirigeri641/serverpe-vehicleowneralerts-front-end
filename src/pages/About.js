import React from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiCode, FiBriefcase } from "react-icons/fi";
import { Link } from "react-router-dom";

const About = () => {
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
            About Me
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary-100 text-lg max-w-2xl mx-auto"
          >
            The story behind ServerPe Vehicle Alerts — built from personal
            experience.
          </motion.p>
        </div>
      </section>

      {/* About Content */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Avatar Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:col-span-1"
            >
              <div className="sticky top-28">
                <div className="w-40 h-40 mx-auto rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center shadow-xl mb-6">
                  <span className="text-6xl text-white font-display font-bold">
                    SK
                  </span>
                </div>
                <div className="text-center">
                  <h2 className="font-display font-bold text-xl text-gray-800">
                    Shivakumar Kirigeri
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Founder & Developer
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <a
                    href="tel:+917996083415"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <FiPhone className="text-primary-500" /> +91 7996083415
                  </a>
                  <a
                    href="mailto:support@serverpe.in"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <FiMail className="text-primary-500" /> support@serverpe.in
                  </a>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FiBriefcase className="text-primary-500" /> 13+ Years
                    Experience
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FiCode className="text-primary-500" /> Full-Stack Developer
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Story */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 prose prose-lg max-w-none"
            >
              <h3 className="font-display text-2xl font-bold text-gray-800 mb-4">
                Why I Built This
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Hi, I'm <strong>Shivakumar Kirigeri</strong>, a software
                professional with over <strong>13 years of experience</strong>{" "}
                in IT and software development. ServerPe Vehicle Alerts is a
                small but meaningful initiative born out of personal
                frustration.
              </p>

              <p className="text-gray-600 leading-relaxed">
                Like many of you, I've faced parking problems{" "}
                <strong>countless times</strong>. Someone parks behind me and
                blocks my vehicle — but there's no way to reach them. I've had
                my headlights left on and drained the battery because nobody
                could alert me. I've seen vehicles double-parked at malls,
                hospitals, and residential areas with absolutely no way for the
                affected person to contact the owner.
              </p>

              <p className="text-gray-600 leading-relaxed">
                The traditional solutions? A phone number on the dashboard
                (privacy risk!), paper notes that fly away, or just... waiting
                and hoping the owner comes back. None of these work well.
              </p>

              <div className="bg-primary-50 rounded-2xl p-6 my-8 border border-primary-100">
                <h4 className="font-display font-semibold text-primary-800 mb-2">
                  💡 The ServerPe Solution
                </h4>
                <p className="text-primary-700 text-sm leading-relaxed">
                  What if a simple QR code sticker could bridge this gap? No
                  phone numbers exposed. No apps to download. Just scan → select
                  concern → submit. The vehicle owner gets an instant
                  notification. Problem solved in seconds.
                </p>
              </div>

              <p className="text-gray-600 leading-relaxed">
                That's exactly what ServerPe Vehicle Alerts does. It keeps your
                mobile number <strong>100% confidential</strong> while making it
                incredibly easy for anyone to alert you about your vehicle —
                whether it's blocking someone, has lights on, or needs
                attention.
              </p>

              <h3 className="font-display text-2xl font-bold text-gray-800 mb-4 mt-10">
                A Note on Response Times
              </h3>
              <p className="text-gray-600 leading-relaxed">
                I'm building and managing this platform alongside my regular
                work hours. So please expect some delay in responses to queries
                or support requests. But I assure you —{" "}
                <strong>I do reply as soon as possible</strong>. Your patience
                and support mean a lot.
              </p>

              <h3 className="font-display text-2xl font-bold text-gray-800 mb-4 mt-10">
                The Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                My goal is to make parking stress-free for every vehicle owner
                in India. Whether you drive a car, bike, scooter, or truck —
                ServerPe Vehicle Alerts is designed for you. I envision a future
                where every vehicle has a smart QR code that creates a bridge
                between concerned citizens and vehicle owners — privately,
                instantly, and effortlessly.
              </p>

              <div className="mt-10">
                <Link to="/contact" className="btn-primary gap-2">
                  Get in Touch <FiMail />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
