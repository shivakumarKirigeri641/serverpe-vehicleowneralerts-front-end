import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSend, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";
import { getQueryTypes, submitContactMe } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const Contact = () => {
  const [queryTypes, setQueryTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    user_name: "",
    mobile_number: "",
    email: "",
    query_type: "",
    message: "",
  });

  useEffect(() => {
    getQueryTypes()
      .then((res) => setQueryTypes(res.data?.data?.query_types || []))
      .catch(() => toast.error("Failed to load query types"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setForm({
      user_name: "",
      mobile_number: "",
      email: "",
      query_type: "",
      message: "",
    });
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.user_name.trim()) return toast.error("Name is required");
    if (!/^\d{10}$/.test(form.mobile_number))
      return toast.error("Enter a valid 10-digit mobile number");
    if (!form.query_type) return toast.error("Please select a query type");
    if (!form.message.trim()) return toast.error("Message is required");

    setSubmitting(true);
    try {
      const res = await submitContactMe(form);
      if (res.data?.successstatus) {
        setSubmitted(true);
        toast.success("Message sent successfully!");
      } else {
        toast.error(res.data?.message || "Failed to send message");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

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
            Contact Me
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary-100 text-lg max-w-2xl mx-auto"
          >
            Have a question, suggestion, or need support? I'd love to hear from
            you.
          </motion.p>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <LoadingSpinner message="Loading form..." />
          ) : submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <FiSend className="text-green-500 text-2xl" />
              </div>
              <h2 className="font-display font-bold text-2xl text-gray-800 mb-2">
                Message Sent!
              </h2>
              <p className="text-gray-500 mb-6">
                Thank you for reaching out. I'll get back to you as soon as
                possible.
              </p>
              <button onClick={handleReset} className="btn-secondary gap-2">
                <FiRefreshCw size={16} /> Send Another Message
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="user_name"
                    value={form.user_name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={form.mobile_number}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setForm({ ...form, mobile_number: val });
                    }}
                    className="input-field"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Query Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="query_type"
                    value={form.query_type}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select query type...</option>
                    {queryTypes
                      .filter((q) => q.is_active)
                      .map((qt) => (
                        <option key={qt.id} value={qt.query_type_name}>
                          {qt.query_type_name} — {qt.query_type_description}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className="input-field resize-none h-32"
                    placeholder="Describe your query or feedback..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex-1 gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <FiSend /> Send Message
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-secondary"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center text-sm text-gray-500"
          >
            <p>
              Expect some delay as I am working in regular hours but I do reply
              ASAP.
            </p>
            <p className="mt-2">
              Direct:{" "}
              <a
                href="tel:+917996083415"
                className="text-primary-600 hover:underline"
              >
                +91 7996083415
              </a>
              {" · "}
              <a
                href="mailto:support@serverpe.in"
                className="text-primary-600 hover:underline"
              >
                support@serverpe.in
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
