import React, { createContext, useContext, useState, useCallback } from "react";
import { vehicleOwnerLogout, getDashboard } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// Normalize API owner data to consistent format
// Handles both sendOtp response and verifyOtp response structures
const normalizeOwnerData = (apiData, verifyOtpData = null) => {
  // If verifyOtpData is provided, try to derive the owner object from it
  // Support both verify-OTP responses and dashboard responses
  const ownerData = verifyOtpData
    ? verifyOtpData.vehicle_owner_info?.[0] ||
      verifyOtpData.vehicle_owner_login_info ||
      {}
    : apiData || {};

  return {
    id: ownerData.id,
    vehicle_owner_name: ownerData.vehicle_owner_name,
    vehicle_number: ownerData.vehicle_number,
    mobile_number: ownerData.mobile_number || ownerData.mobile_number1, // Map primary mobile number
    email: ownerData.email,
    created_at: ownerData.created_at,
    updated_at: ownerData.updated_at,
    // Include subscription and QR code info from verify OTP or dashboard response
    // Handle typo in API response key: "running_subsscription_plans" (3 s's) vs "running_subscription_plans"
    subscriptionPlans:
      verifyOtpData?.running_subsscription_plans ||
      verifyOtpData?.running_subscription_plans ||
      [],
    qrCodeInfo: verifyOtpData?.qrCode_info || [],
    loginInfo:
      verifyOtpData?.vehicle_owner_login_info ||
      verifyOtpData?.vehicle_owner_login_info ||
      null,
  };
};

export const AuthProvider = ({ children }) => {
  const [owner, setOwner] = useState(() => {
    const saved = sessionStorage.getItem("vehicleOwner");
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!owner);

  const login = (ownerData, verifyOtpData = null) => {
    const normalizedData = normalizeOwnerData(ownerData, verifyOtpData);
    setOwner(normalizedData);
    setIsAuthenticated(true);
    sessionStorage.setItem("vehicleOwner", JSON.stringify(normalizedData));
  };

  const refreshOwner = async () => {
    try {
      const res = await getDashboard();
      if (res.data?.successstatus && res.data.data) {
        // Pass both owner info and the dashboard payload to normalization
        const ownerInfo = res.data.data.vehicle_owner_login_info || null;
        login(ownerInfo, res.data.data);
        return true;
      }
    } catch (err) {
      // ignore — caller may show its own errors
    }
    return false;
  };

  const logout = useCallback(async (callApi = true) => {
    try {
      if (callApi) await vehicleOwnerLogout();
    } catch (err) {
      // ignore logout API errors
    }
    setOwner(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("vehicleOwner");
  }, []);

  return (
    <AuthContext.Provider
      value={{ owner, isAuthenticated, login, logout, refreshOwner }}
    >
      {children}
    </AuthContext.Provider>
  );
};
