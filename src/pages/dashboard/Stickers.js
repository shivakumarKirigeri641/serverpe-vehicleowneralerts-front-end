import React, { useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineQrCode } from "react-icons/hi2";
import { FiPlus, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const Stickers = () => {
  const { owner } = useAuth();
  const [selectedStickerForOrder, setSelectedStickerForOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);

  // Get QR codes from auth context
  const stickers = owner?.qrCodeInfo || [];

  const handleOpenOrderModal = (sticker) => {
    setSelectedStickerForOrder(sticker);
    setOrderQuantity(1);
    setShowOrderModal(true);
  };

  const handleOrderStickers = async () => {
    if (!selectedStickerForOrder) return;
    // TODO: Call API to order stickers
    toast.success(
      `Order placed: ${orderQuantity} sticker(s) for ${selectedStickerForOrder.vehicle_number}`,
    );
    setShowOrderModal(false);
    setSelectedStickerForOrder(null);
    setOrderQuantity(1);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-800">
          My QR Code Stickers
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          View all your QR code stickers and their status
        </p>
      </div>

      {stickers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-12 text-center"
        >
          <HiOutlineQrCode className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-xl text-gray-600 mb-2">
            No Stickers Yet
          </h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            After adding a vehicle from the dashboard, your QR code stickers
            will appear here. You get 2 free premium waterproof vinyl matte
            stickers with your first subscription.
          </p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {stickers.map((sticker, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                    <HiOutlineQrCode className="text-primary-600 text-2xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800">
                      {sticker.vehicle_number}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      QR ID: {sticker.qrcode_id || "—"}
                    </p>
                    <span
                      className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                        sticker.is_working
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {sticker.is_working ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenOrderModal(sticker)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-600 transition-colors shrink-0 mt-1"
                  title="Order more sticker copies"
                >
                  <FiPlus className="text-lg" />
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                <p>• Delivered: {sticker.is_delivered ? "✓" : "✗"}</p>
                <p>• QR Tested: {sticker.is_qr_code_tested ? "✓" : "✗"}</p>
                <p>• Blocked: {sticker.is_blocked ? "✓" : "✗"}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Stickers Modal */}
      {showOrderModal && selectedStickerForOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg text-gray-800">
                Order QR Stickers
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  value={selectedStickerForOrder.vehicle_number}
                  disabled
                  className="w-full input-field bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code ID
                </label>
                <input
                  type="text"
                  value={selectedStickerForOrder.qrcode_id || "—"}
                  disabled
                  className="w-full input-field bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Stickers
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setOrderQuantity(Math.max(1, orderQuantity - 1))
                    }
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={orderQuantity}
                    onChange={(e) =>
                      setOrderQuantity(
                        Math.max(1, parseInt(e.target.value) || 1),
                      )
                    }
                    className="w-20 text-center input-field"
                  />
                  <button
                    onClick={() => setOrderQuantity(orderQuantity + 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Premium waterproof vinyl matte stickers per order
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-700">
                  <strong>Estimated cost:</strong> ₹{orderQuantity * 50} for{" "}
                  {orderQuantity} sticker(s)
                </p>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOrderStickers}
                  className="flex-1 btn-primary"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Stickers;
