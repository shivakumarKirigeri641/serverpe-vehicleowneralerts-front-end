import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiShield, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { sendLoginOtp, verifyLoginOtp } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("9876543218");
  const [otp, setOtp] = useState("1234");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobileNumber))
      return toast.error("Enter a valid 10-digit mobile number");
    if (!agreeTerms)
      return toast.error("Please agree to the Terms & Conditions");

    setSubmitting(true);
    try {
      const res = await sendLoginOtp({ mobile_number: mobileNumber });
      if (res.data?.successstatus) {
        toast.success("OTP sent to your mobile number!");
        setStep(2);
      } else {
        toast.error(res.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      // Enhanced error handling to ensure message is displayed
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to send OTP";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(otp)) return toast.error("Enter a valid 4-digit OTP");

    setSubmitting(true);
    try {
      const res = await verifyLoginOtp({ mobile_number: mobileNumber, otp });
      if (res.data?.successstatus) {
        toast.success("Login successful!");
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
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <FiShield className="text-white text-2xl" />
            </div>
            <h1 className="font-display font-bold text-2xl text-gray-800">
              {step === 1 ? "Welcome Back" : "Verify OTP"}
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {step === 1
                ? "Login to your Vehicle Alerts dashboard"
                : `Enter the 4-digit OTP sent to ${mobileNumber}`}
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
                  Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setMobileNumber(val);
                    }}
                    className="input-field !rounded-l-none"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    autoFocus
                  />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-800">
                <strong>🔒 Security:</strong> Your mobile number is fully
                protected, kept strictly confidential, and never shared with
                anyone.
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-primary-600 hover:underline"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-primary-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  "Sending OTP..."
                ) : (
                  <>
                    <FiArrowRight /> Get OTP
                  </>
                )}
              </button>
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
                    <FiCheckCircle /> Verify & Login
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
            New here?{" "}
            <Link
              to="/subscribe"
              className="text-primary-600 font-medium hover:underline"
            >
              Subscribe now — It's free!
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
