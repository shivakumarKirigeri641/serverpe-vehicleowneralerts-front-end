import React, { useState } from "react";
import PolicyModal from "../components/PolicyModal";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiShield, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { sendSubscriptionOtp, verifyLoginOtp } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Subscribe = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1); // 1: form, 2: otp
  const [submitting, setSubmitting] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [policyModal, setPolicyModal] = useState({
    open: false,
    type: "",
    title: "",
  });
  const [form, setForm] = useState({
    vehicle_owner_name: "",
    mobile_number: "",
  });
  const [otp, setOtp] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!form.vehicle_owner_name.trim())
      return toast.error("Please enter your name");
    if (!/^\d{10}$/.test(form.mobile_number))
      return toast.error("Enter a valid 10-digit mobile number");
    if (!agreeTerms)
      return toast.error("Please agree to the Terms & Conditions");

    setSubmitting(true);
    try {
      const res = await sendSubscriptionOtp({
        mobile_number: form.mobile_number,
      });
      if (res.data?.successstatus) {
        toast.success("OTP sent to your mobile number!");
        setStep(2);
      } else {
        toast.error(res.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send OTP";
      if (msg.toLowerCase().includes("already")) {
        toast.error("This number is already registered. Please login instead.");
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(otp)) return toast.error("Enter a valid 4-digit OTP");

    setSubmitting(true);
    try {
      const res = await verifyLoginOtp({
        mobile_number: form.mobile_number,
        otp,
      });
      if (res.data?.successstatus) {
        toast.success("Subscription successful! Welcome!");
        // Pass full verify OTP response as second parameter
        login(res.data.data?.vehicle_owner_info?.[0], res.data.data);
        navigate("/dashboard");
      } else {
        toast.error(res.data?.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4 py-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <FiShield className="text-white text-2xl" />
            </div>
            <h1 className="font-display font-bold text-2xl text-gray-800">
              {step === 1 ? "Get Started Free" : "Verify OTP"}
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {step === 1
                ? "Subscribe to protect your vehicle with smart QR alerts"
                : `Enter the 4-digit OTP sent to ${form.mobile_number}`}
            </p>
            <Link
              to="/"
              className="inline-block mt-3 text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.vehicle_owner_name}
                  onChange={(e) =>
                    setForm({ ...form, vehicle_owner_name: e.target.value })
                  }
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={form.mobile_number}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setForm({ ...form, mobile_number: val });
                    }}
                    className="input-field !rounded-l-none"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  ✓ Vehicle owner mobile number is fully protected and kept
                  confidential
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 leading-relaxed">
                <strong>Note:</strong> On successful subscription, you will
                receive a digital QR for testing. You will receive{" "}
                <strong>2 identical waterproof stickers</strong> on subsequent
                renewals or as per your plan terms.
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 leading-relaxed">
                <strong>Note:</strong> One subscription is linked to{" "}
                <strong>one mobile number</strong> and{" "}
                <strong>one vehicle registration number</strong>. This prevents
                misuse and spam alerts.
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600 flex flex-wrap items-center gap-1">
                  I agree to
                  <button
                    type="button"
                    className="text-primary-600 hover:underline"
                    onClick={() =>
                      setPolicyModal({
                        open: true,
                        type: "terms",
                        title: "Terms & Conditions",
                      })
                    }
                  >
                    Terms
                  </button>
                  ,
                  <button
                    type="button"
                    className="text-primary-600 hover:underline"
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
                  ,
                  <button
                    type="button"
                    className="text-primary-600 hover:underline"
                    onClick={() =>
                      setPolicyModal({
                        open: true,
                        type: "payment",
                        title: "Payment Policy",
                      })
                    }
                  >
                    Payment Policy
                  </button>
                  &
                  <button
                    type="button"
                    className="text-primary-600 hover:underline"
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
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting || !agreeTerms}
                className="btn-accent w-full gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  "Sending OTP..."
                ) : (
                  <>
                    <FiArrowRight /> Subscribe & Get OTP
                  </>
                )}
              </button>
              <div className="text-xs text-center text-amber-600 mt-2">
                All payments are non-refundable
              </div>
              {/* Policy Modal */}
              <PolicyModal
                open={policyModal.open}
                onClose={() =>
                  setPolicyModal({ open: false, type: "", title: "" })
                }
                policyType={policyModal.type}
                title={policyModal.title}
              />
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setOtp(val);
                  }}
                  className="input-field text-center text-2xl tracking-[1em] font-mono"
                  placeholder="• • • •"
                  maxLength={4}
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-2 text-center">
                  OTP expires in 3 minutes
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  "Verifying..."
                ) : (
                  <>
                    <FiCheckCircle /> Verify & Subscribe
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                }}
                className="w-full text-sm text-gray-500 hover:text-primary-600 transition-colors"
              >
                ← Change mobile number
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            Already subscribed?{" "}
            <Link
              to="/login"
              className="text-primary-600 font-medium hover:underline"
            >
              Login here
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Subscribe;
