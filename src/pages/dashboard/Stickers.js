import React from "react";
import { motion } from "framer-motion";
import { HiOutlineQrCode } from "react-icons/hi2";

const Stickers = () => {
  // Placeholder - will be replaced with API data
  const stickers = [];

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
          {stickers.map((sticker) => (
            <motion.div
              key={sticker.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-5"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center">
                  <HiOutlineQrCode className="text-primary-600 text-2xl" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {sticker.vehicle_number}
                  </p>
                  <p className="text-xs text-gray-400">
                    Sticker ID: {sticker.id}
                  </p>
                  <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    {sticker.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stickers;
