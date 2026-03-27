import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiShield, FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import PolicyModal from "./PolicyModal";

const Footer = () => {
  const [policyModal, setPolicyModal] = useState({
    open: false,
    type: "",
    title: "",
  });
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <FiShield className="text-white text-xl" />
              </div>
              <div>
                <span className="font-display font-bold text-xl text-white">
                  ServerPe
                </span>
                <span className="block text-[10px] font-medium -mt-1 text-primary-400">
                  Vehicle Alerts
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Protecting your parked vehicle with smart QR code alerts. Get
              instant notifications when someone needs you to move your car.
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Powered by <strong>ServerPe App Solutions</strong>
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/917996083415"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <FaWhatsapp />
              </a>
              <a
                href="mailto:support@serverpe.in"
                className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <FiMail />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/how-it-works"
                  className="hover:text-primary-400 transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/plans"
                  className="hover:text-primary-400 transition-colors"
                >
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary-400 transition-colors"
                >
                  Contact Me
                </Link>
              </li>
              <li>
                <Link
                  to="/subscribe"
                  className="hover:text-primary-400 transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal (Policy Modals) */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  className="hover:text-primary-400 transition-colors underline bg-transparent p-0 border-0"
                  onClick={() =>
                    setPolicyModal({
                      open: true,
                      type: "privacy",
                      title: "Privacy Policy",
                    })
                  }
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  className="hover:text-primary-400 transition-colors underline bg-transparent p-0 border-0"
                  onClick={() =>
                    setPolicyModal({
                      open: true,
                      type: "terms",
                      title: "Terms & Conditions",
                    })
                  }
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  className="hover:text-primary-400 transition-colors underline bg-transparent p-0 border-0"
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
              </li>
            </ul>
          </div>

          {/* Contact (Email only for privacy) */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <FiMail className="text-primary-400 shrink-0" />
                <span>support@serverpe.in</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} ServerPe. All rights reserved.
          </p>
          <p>Made with ❤️ by Shivakumar Kirigeri</p>
        </div>

        {/* Policy Modal */}
        <PolicyModal
          open={policyModal.open}
          onClose={() => setPolicyModal({ ...policyModal, open: false })}
          policyType={policyModal.type}
          title={policyModal.title}
        />
      </div>
    </footer>
  );
};

export default Footer;
