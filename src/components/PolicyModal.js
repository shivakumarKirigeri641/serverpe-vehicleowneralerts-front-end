import React, { useEffect, useState } from "react";
import { getPolicy } from "../services/api";

const PolicyModal = ({
  open,
  onClose,
  policyType, // 'terms', 'privacy', etc.
  title,
  showAccept = false,
  onAccept,
  acceptLabel = "Accept",
}) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !policyType) return;
    setLoading(true);
    setError("");
    getPolicy(policyType)
      .then((res) => {
        // API returns an array of policy objects
        const data = res.data?.data;
        if (Array.isArray(data) && data.length > 0) {
          setContent(data);
        } else {
          setContent([]);
        }
      })
      .catch(() => setError("Failed to load policy."))
      .finally(() => setLoading(false));
  }, [open, policyType]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 flex flex-col">
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b">
          <h2 className="font-display text-lg font-bold text-blue-700">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-4 max-h-96 text-gray-700 text-sm">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : Array.isArray(content) && content.length > 0 ? (
            <div>
              {content.map((item) => (
                <div key={item.id} className="mb-5">
                  <div className="font-semibold text-base text-blue-800 mb-1">
                    {item.title}
                  </div>
                  <div className="text-gray-700 whitespace-pre-line">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No content available.</div>
          )}
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="btn-secondary px-4 py-2 text-sm"
            type="button"
          >
            Close
          </button>
          {showAccept && (
            <button
              onClick={onAccept}
              className="btn-primary px-4 py-2 text-sm"
              type="button"
            >
              {acceptLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
