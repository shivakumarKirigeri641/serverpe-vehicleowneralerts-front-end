import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSave } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { owner } = useAuth();
  const [form, setForm] = useState({
    vehicle_owner_name: owner?.vehicle_owner_name || "",
    mobile_number: owner?.mobile_number || "",
    email: owner?.email || "",
    address: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    location_link: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast("Profile update API will be available soon!", { icon: "🔜" });
  };

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-800">
          Profile
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your personal details and delivery address
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 md:p-8 max-w-2xl"
      >
        <div className="flex items-center gap-4 mb-8 pb-6 border-b">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center">
            <span className="text-2xl text-white font-display font-bold">
              {(form.vehicle_owner_name || "V")[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-gray-800">
              {form.vehicle_owner_name}
            </h2>
            <p className="text-sm text-gray-400">+91 {form.mobile_number}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="vehicle_owner_name"
                value={form.vehicle_owner_name}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobile_number"
                value={form.mobile_number}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email (Optional)
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

          <hr className="my-2" />
          <h3 className="font-display font-semibold text-gray-700 text-sm uppercase tracking-wider">
            Delivery Address (for QR Stickers)
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Address
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="input-field resize-none h-20"
              placeholder="House/Flat No, Building, Street"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Area/Locality
              </label>
              <input
                type="text"
                name="area"
                value={form.area}
                onChange={handleChange}
                className="input-field"
                placeholder="Area or locality"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                City
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="input-field"
                placeholder="City"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                State / Union Territory
              </label>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select state...</option>
                {indianStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setForm({ ...form, pincode: val });
                }}
                className="input-field"
                placeholder="6-digit pincode"
                maxLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Google Maps Link (Optional)
            </label>
            <input
              type="url"
              name="location_link"
              value={form.location_link}
              onChange={handleChange}
              className="input-field"
              placeholder="https://maps.google.com/..."
            />
          </div>

          <div className="pt-4">
            <button type="submit" className="btn-primary gap-2">
              <FiSave /> Save Profile
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
