import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiRefreshCw, FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";

const Renewals = () => {
  const [renewals, setRenewals] = useState([]);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const fetchRenewals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/vehicleowner/credentials/myrenewals`,
        { credentials: "include" },
      );

      if (!res.ok) throw new Error("Failed to load renewals");
      const json = await res.json();
      if (!json.successstatus) throw new Error(json.message || "API error");

      const data = json.data || {};
      setOwner(data.vehicle_owner_info || null);
      setRenewals(data.renewal_fulldetails || []);
    } catch (err) {
      setError(err.message || "Failed to fetch renewals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenewals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownloadInvoice = async (r) => {
    try {
      // candidate invoice identifiers
      const invoiceNumber = r.invoice_number;
      if (!invoiceNumber) {
        toast.error("Invoice number not available for this renewal");
        return;
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/vehicleowner/credentials/payment/invoice/${invoiceNumber}`,
        { method: "GET", credentials: "include" },
      );

      if (!res.ok) throw new Error("Failed to download invoice");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Could not download invoice");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-800">
          My Renewals
        </h1>
        <p className="text-gray-500 text-sm mt-1">View your renewals history</p>
      </div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <div className="h-8 bg-gray-100 rounded w-1/3" />
          <div className="h-8 bg-gray-100 rounded w-1/4" />
        </motion.div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : renewals.length === 0 ? (
        <div className="text-gray-600">No renewals found.</div>
      ) : (
        <div className="space-y-3">
          {renewals.map((r, idx) => {
            const idKey = r.order_id || `idx-${idx}`;
            const planName = r.recharge_name || r.plan_name || "Subscription";
            const amount = r.price ?? r.amount ?? 0;
            const date = r.created_at
              ? new Date(r.created_at).toLocaleString("en-IN")
              : "-";
            const status = r.status || "-";
            const txnId = r.acquirer_data?.bank_transaction_id || "-";
            const description = r.recharge_description || r.description || "";

            const isOpen = expanded === idKey;

            return (
              <motion.div
                key={idKey}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-4"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setExpanded(isOpen ? null : idKey)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setExpanded(isOpen ? null : idKey);
                  }}
                  className="flex items-center gap-4 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                    <FiRefreshCw className="text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{planName}</p>
                    <p className="text-xs text-gray-400">{date}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Order: {r.order_id || "-"} • Txn: {txnId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">₹{amount}</p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        status === "captured" || status === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 border-t pt-3 text-sm text-gray-700"
                  >
                    {description && (
                      <p className="mb-1">
                        <strong>Description:</strong> {description}
                      </p>
                    )}
                    <p className="mb-1">
                      <strong>Payment Method:</strong> {r.method || "-"}
                    </p>
                    {r.bank && (
                      <p className="mb-1">
                        <strong>Bank:</strong> {r.bank}
                      </p>
                    )}
                    <p className="mb-1">
                      <strong>Tax:</strong> {r.tax ?? "-"}
                    </p>
                    <p className="mb-1">
                      <strong>Currency:</strong> {r.currency || "INR"}
                    </p>
                    <p className="mb-1">
                      <strong>Contact:</strong>{" "}
                      {r.mobile_number1 || r.mobile || "-"}
                    </p>
                    <p className="mb-1">
                      <strong>Receipt Created:</strong> {date}
                    </p>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleDownloadInvoice(r)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <FiDownload /> Download Invoice
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Renewals;
