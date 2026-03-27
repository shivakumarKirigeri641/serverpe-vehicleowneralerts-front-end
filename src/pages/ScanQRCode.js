import React, { useEffect, useState } from "react";
import PolicyModal from "../components/PolicyModal";
  const [policyModal, setPolicyModal] = useState({ open: false, type: "", title: "" });
import { useLocation, useParams } from "react-router-dom";
import { FiSend, FiAlertTriangle, FiChevronDown, FiCheckCircle, FiShield, FiExternalLink } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  scanQRCode,
  submitScan,
  reportMisuse,
  leaveMessageToVehicleOwner,
} from "../services/api";

const ScanQRCode = () => {
  const params = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const qrcodeFromQuery = query.get("qrcode") || query.get("qrcode_number");
  const qrcodeParam = params.qrcode || qrcodeFromQuery;

  const [qrcode, setQrcode] = useState(qrcodeParam || "");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [leaveAllowed, setLeaveAllowed] = useState(false);
  const [leaveText, setLeaveText] = useState("");
  const [selected, setSelected] = useState("");
  const [otherText, setOtherText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!qrcode) return;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      setSent(false);
      try {
        const res = await scanQRCode(qrcode);
        if (res.data?.successstatus) {
          setData(res.data.data || null);
          // default select first concern
          const first = res.data.data?.concern_messages_list?.[0];
          setSelected(first?.phrase || "");
          setLeaveAllowed(false);
        } else {
          const msg = res.data?.message || "Invalid QR code";
          setError(msg);
          const statuscode = res.data?.statuscode ?? res.status;
          if (
            statuscode === 401 ||
            /Unable to contact vehicle owner/i.test(msg)
          ) {
            setLeaveAllowed(true);
            setLeaveText("");
          } else {
            setLeaveAllowed(false);
          }
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Failed to call scan API";
        setError(msg);
        const sc = err.response?.status;
        if (sc === 401 || /Unable to contact vehicle owner/i.test(msg)) {
          setLeaveAllowed(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [qrcode]);

  const handleSend = async () => {
    if (!selected) return toast.error("Please select a concern");
    if (selected === "Others" && otherText.trim().length === 0)
      return toast.error("Please enter a short message");

    setSubmitting(true);
    try {
      const payload = {
        qrcode_number: qrcode,
        concern_message_selected: selected,
        message: selected === "Others" ? otherText.trim() : selected,
      };
      const res = await submitScan(payload);
      if (res.data?.successstatus) {
        toast.success(res.data.message || "Alert sent successfully!");
        setSent(true);
        setData((d) => ({ ...d, submitResult: res.data.data }));
      } else {
        toast.error(res.data?.message || "Failed to send alert");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Send failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async () => {
    if (!qrcode) return toast.error("No QR code");
    try {
      const res = await reportMisuse(qrcode);
      if (res.data?.successstatus) {
        toast.success(res.data.message || "Reported misuse");
      } else {
        toast.error(res.data?.message || "Failed to report");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Report failed",
      );
    }
  };

  const handleLeaveMessage = async () => {
    if (!qrcode) return toast.error("No QR code");
    if (!leaveText.trim()) return toast.error("Enter a short message");
    try {
      const res = await leaveMessageToVehicleOwner({
        qrcode_number: qrcode,
        message: leaveText.trim(),
      });
      if (res.data?.successstatus) {
        toast.success(res.data.message || "Message left");
      } else {
        toast.error(res.data?.message || "Failed to leave message");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Leave message failed",
      );
    }
  };

  const selectedConcern = data?.concern_messages_list?.find(
    (c) => c.phrase === selected
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">

        {/* ───── Header ───── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-200 mb-4">
            <FiShield className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Vehicle Alert System
          </h1>
          <p className="text-gray-500 text-sm mt-1">Scan result &amp; notify the vehicle owner</p>
        </div>

        {/* ───── QR input (when no param) ───── */}
        {!qrcodeParam && (
          <div className="card p-5 mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-1">QR Code</label>
            <input
              id="qrcode-input"
              value={qrcode}
              onChange={(e) => setQrcode(e.target.value)}
              placeholder="Paste QR code id or open via /scan/:qrcode"
              className="input-field w-full"
            />
          </div>
        )}

        {/* ───── Loading ───── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-500 animate-pulse">Checking QR code…</p>
          </div>
        )}

        {/* ───── Error ───── */}
        {error && (
          <div className="card border-red-200 bg-red-50 p-5 mb-6">
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* ───── Main content ───── */}
        {data && !loading && (
          <div className="space-y-5">

            {/* ── Vehicle Number Banner ── */}
            <div className="card overflow-visible border-2 border-primary-200 bg-gradient-to-r from-primary-50 to-indigo-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <FiCheckCircle className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    You are scanning a vehicle with number:
                  </p>
                  <p className="text-2xl sm:text-3xl font-display font-extrabold tracking-wider text-primary-700 my-2 uppercase">
                    {data.vehicle_number}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Please <strong className="text-gray-800">cross check</strong> the vehicle.
                    If it does not match, report using the{" "}
                    <strong className="text-red-600">Report Misuse</strong> button below.
                  </p>
                  {data.is_subscriptionexpired && (
                    <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5 mt-3 inline-block">
                      ⚠️ Owner's subscription appears expired.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Concern Dropdown ── */}
            <div className="card p-5">
              <label
                htmlFor="concern-select"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Select your concern
              </label>
              <div className="relative">
                <select
                  id="concern-select"
                  value={selected}
                  onChange={(e) => {
                    setSelected(e.target.value);
                    setSent(false);
                  }}
                  className="input-field w-full appearance-none pr-10 cursor-pointer text-gray-800 font-medium"
                >
                  <option value="" disabled>
                    — Choose a concern —
                  </option>
                  {data.concern_messages_list?.map((c) => (
                    <option key={c.id} value={c.phrase}>
                      {c.phrase}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* description hint */}
              {selectedConcern && (
                <p className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                  💡 {selectedConcern.description}
                </p>
              )}

              {/* custom message for "Others" */}
              {selected === "Others" && (
                <div className="mt-3">
                  <input
                    id="other-message-input"
                    maxLength={20}
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    placeholder="Type a short custom message (max 20 chars)"
                    className="input-field w-full"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {otherText.length}/20
                  </p>
                </div>
              )}
            </div>

            {/* ── Action Buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="send-alert-btn"
                onClick={handleSend}
                disabled={submitting || !selected}
                className={`btn-primary flex-1 flex items-center justify-center gap-2 text-base
                  ${submitting ? "opacity-60 cursor-not-allowed" : ""}
                  ${sent ? "!bg-green-600 hover:!bg-green-700 !shadow-green-200" : ""}`}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Sending…
                  </>
                ) : sent ? (
                  <>
                    <FiCheckCircle className="w-5 h-5" /> Alert Sent!
                  </>
                ) : (
                  <>
                    <FiSend className="w-5 h-5" /> Send Alert Message
                  </>
                )}
              </button>

              <button
                id="report-misuse-btn"
                onClick={handleReport}
                className="btn-secondary flex items-center justify-center gap-2 text-base border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 focus:ring-red-100"
              >
                <FiAlertTriangle className="w-5 h-5" /> Report Misuse
              </button>
            </div>

            {/* ── Disclaimer and Policy Links ── */}
            <div className="mt-4 text-xs text-gray-500 text-center">
              By sending alert, you agree to responsible use of this service.<br />
              <span>
                Read our
                <button
                  type="button"
                  className="underline hover:text-primary-600 mx-1"
                  onClick={() => setPolicyModal({ open: true, type: "terms", title: "Terms & Conditions" })}
                >
                  Terms & Conditions
                </button>
                and
                <button
                  type="button"
                  className="underline hover:text-primary-600 mx-1"
                  onClick={() => setPolicyModal({ open: true, type: "privacy", title: "Privacy Policy" })}
                >
                  Privacy Policy
                </button>
                .
              </span>
            </div>

            {/* Policy Modal */}
            <PolicyModal
              open={policyModal.open}
              onClose={() => setPolicyModal({ ...policyModal, open: false })}
              policyType={policyModal.type}
              title={policyModal.title}
            />
            </div>

            {/* ── Sent confirmation ── */}
            {sent && data.submitResult && (
              <div className="card border-green-200 bg-green-50 p-5">
                <div className="flex items-center gap-2 mb-1">
                  <FiCheckCircle className="w-5 h-5 text-green-600" />
                  <p className="font-semibold text-green-800">Alert Sent Successfully!</p>
                </div>
                <p className="text-sm text-green-700">
                  The vehicle owner has been notified about your concern.
                </p>
              </div>
            )}

            {/* ── Leave message (owner unreachable) ── */}
            {leaveAllowed && (
              <div className="card border-amber-200 bg-amber-50/50 p-5">
                <p className="text-sm font-semibold text-amber-800 mb-3">
                  ⚠️ Owner cannot be contacted — leave a message instead
                </p>
                <input
                  id="leave-message-input"
                  value={leaveText}
                  maxLength={200}
                  onChange={(e) => setLeaveText(e.target.value)}
                  placeholder="Type a short message for the owner"
                  className="input-field w-full mb-3"
                />
                <div className="flex gap-2">
                  <button
                    id="leave-message-btn"
                    onClick={handleLeaveMessage}
                    className="btn-primary text-sm"
                  >
                    Leave Message
                  </button>
                  <button
                    onClick={handleReport}
                    className="btn-secondary text-sm"
                  >
                    Report Misuse
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ───── Promotion Banner ───── */}
        <div className="mt-10">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 p-6 shadow-xl shadow-primary-900/20">
            {/* decorative circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />

            <div className="relative z-10 text-center">
              <p className="text-primary-200 text-xs font-semibold uppercase tracking-widest mb-1">
                Powered by
              </p>
              <p className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
                ServerPe App Solutions
              </p>
              <p className="text-primary-200 text-sm leading-relaxed mb-4">
                Subscribe to <strong className="text-white">ServerPe</strong> and get instant vehicle
                alerts, QR stickers &amp; much more for your vehicle.
              </p>
              <a
                href="https://www.serverpe.in"
                target="_blank"
                rel="noopener noreferrer"
                id="serverpe-subscribe-link"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-primary-700 font-semibold rounded-xl
                           hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
              >
                Visit www.serverpe.in <FiExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* ───── Footer ───── */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} ServerPe App Solutions. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ScanQRCode;
