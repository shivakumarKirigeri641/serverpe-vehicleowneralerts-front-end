import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FiSend, FiAlertTriangle } from "react-icons/fi";
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
  const [selected, setSelected] = useState(null);
  const [otherText, setOtherText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!qrcode) return;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await scanQRCode(qrcode);
        if (res.data?.successstatus) {
          setData(res.data.data || null);
          const first = res.data.data?.concern_messages_list?.[0];
          setSelected(first?.phrase || null);
          setLeaveAllowed(false);
        } else {
          const msg = res.data?.message || "Invalid QR code";
          setError(msg);
          // enable leave-message when API explicitly says owner couldn't be contacted or returns 401
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
        // if server responded with 401, allow leave message
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
    if (!selected) return toast.error("Select a concern");
    if (selected === "Others" && otherText.trim().length === 0)
      return toast.error("Enter a short message");

    setSubmitting(true);
    try {
      const payload = {
        qrcode_number: qrcode,
        concern_message_selected: selected,
        message: selected === "Others" ? otherText.trim() : selected,
      };
      const res = await submitScan(payload);
      if (res.data?.successstatus) {
        toast.success(res.data.message || "Scan sent");
        setData((d) => ({ ...d, submitResult: res.data.data }));
      } else {
        toast.error(res.data?.message || "Failed to send scan");
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

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="font-display text-2xl font-bold mb-4">Scan Result</h2>

      <div className="mb-4">
        <label className="text-sm text-gray-600">QR Code</label>
        <input
          value={qrcode}
          onChange={(e) => setQrcode(e.target.value)}
          placeholder="Paste QR code id or open via /scan/:qrcode"
          className="input-field w-full mt-1"
        />
      </div>

      {loading && <p className="text-sm text-gray-500">Checking QR code…</p>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {data && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded">
            <p>
              You have scanned a vehicle with{" "}
              <strong>{data.vehicle_number}</strong>, please cross check if it
              matches.
            </p>
            {data.is_subscriptionexpired && (
              <p className="text-sm text-amber-700 mt-2">
                Note: The owner appears to have an expired subscription.
              </p>
            )}
          </div>

          <div className="card p-4">
            <p className="font-semibold mb-2">Select Concern</p>
            <div className="space-y-2">
              {data.concern_messages_list?.map((c) => (
                <label key={c.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="concern"
                    checked={selected === c.phrase}
                    onChange={() => setSelected(c.phrase)}
                  />
                  <div>
                    <div className="font-medium">{c.phrase}</div>
                    <div className="text-xs text-gray-500">{c.description}</div>
                  </div>
                </label>
              ))}
            </div>

            {selected === "Others" && (
              <div className="mt-3">
                <input
                  maxLength={20}
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="Type a short message (20 chars)"
                  className="input-field w-full"
                />
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSend}
                disabled={submitting}
                className="btn-primary flex items-center gap-2"
              >
                <FiSend /> Send message to vehicle owner
              </button>

              <button
                onClick={handleReport}
                className="btn-secondary flex items-center gap-2"
              >
                <FiAlertTriangle /> Report misuse
              </button>
            </div>
            {leaveAllowed && (
              <div className="mt-4 p-3 bg-yellow-50 rounded">
                <p className="text-sm font-medium mb-2">
                  Leave a message — owner cannot be contacted
                </p>
                <input
                  value={leaveText}
                  maxLength={200}
                  onChange={(e) => setLeaveText(e.target.value)}
                  placeholder="Type a short message"
                  className="input-field w-full mb-2"
                />
                <div className="flex gap-2">
                  <button onClick={handleLeaveMessage} className="btn-primary">
                    Leave message
                  </button>
                  <button onClick={handleReport} className="btn-secondary">
                    Report misuse
                  </button>
                </div>
              </div>
            )}
          </div>

          {data.submitResult && (
            <div className="p-4 bg-green-50 rounded">
              <p className="font-semibold">Sent</p>
              <pre className="text-xs overflow-auto mt-2">
                {JSON.stringify(data.submitResult, null, 2)}
              </pre>
            </div>
          )}

          {/* placeholder for owner not recharged / not renewed message */}
          <div className="text-sm text-gray-500">
            {/* owner recharge status placeholder */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanQRCode;
