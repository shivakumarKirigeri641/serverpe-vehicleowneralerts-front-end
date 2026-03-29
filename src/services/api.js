import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:7777";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's a 401 response with proper API structure (business logic error)
    // vs actual auth failure. Business logic 401s have successstatus field.
    if (error.response?.status === 401) {
      const hasApiStructure = error.response?.data?.successstatus !== undefined;

      // Only logout if it's NOT a business logic error (e.g., actual auth failure)
      // Business logic errors (like "mobile number not found") should be handled by the component
      if (!hasApiStructure) {
        sessionStorage.removeItem("vehicleOwner");
        if (!window.location.pathname.includes("/scan/")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

// Public APIs
export const getSubscriptionPlans = () =>
  api.get("/vehiclealerts/subscription-plans");
export const getQueryTypes = () => api.get("/vehiclealerts/query-type");
export const submitContactMe = (data) =>
  api.post("/vehiclealerts/contact-me", data);
export const scanQRCode = (qrcodeNumber) =>
  api.get(`/vehiclealerts/scan/${qrcodeNumber}`);
export const submitScan = (data) => api.post("/vehiclealerts/submitscan", data);
export const reportMisuse = (qrcodeNumber) =>
  api.post(`/vehiclealerts/report-misuse/${qrcodeNumber}`);

// Public check for vehicle subscription status (unauthenticated)
export const checkSubscriptionStatus = (vehicleNumber) =>
  api.get(`/vehiclealerts/check-subscription-status/${vehicleNumber}`);

// Fetch Indian states / union territories
export const getStatesUnions = () => api.get("/vehiclealerts/states-unions");

// Leave message for vehicle owner when scanner can't contact owner
export const leaveMessageToVehicleOwner = (payload) =>
  api.post("/vehiclealerts/scan/leave-message-to-vehicle-owner", payload);

// Temporary Chat Session APIs
export const startChatSession = (data) =>
  api.post("/vehiclealerts/scan/send-alert", data);
export const sendChatMessage = (data) =>
  api.post("/vehiclealerts/scan/send-message", data);
export const syncOwnerChat = (qrcodeNumber) =>
  api.get(`/vehiclealerts/scan/send-alert-owner/${qrcodeNumber}`);
export const endChatSession = (data) =>
  api.post("/vehiclealerts/scan/end-session", data);

// Vehicle Owner Auth
export const sendSubscriptionOtp = (data) =>
  api.post("/vehicleowner/subscription/send-otp", data);
export const sendLoginOtp = (data) =>
  api.post("/vehicleowner/login/send-otp", data);
export const verifyLoginOtp = (data) =>
  api.post("/vehicleowner/login/verify-otp", data);

export const verifySubscriptionOtp = (data) =>
  api.post("/vehicleowner/subscription/verify-otp", data);
// Vehicle Owner Protected
export const vehicleOwnerLogout = () =>
  api.post("/vehicleowner/credentials/logout");
export const addQRCodeSticker = (data) =>
  api.post("/vehicleowner/credentials/add-qr-ticker", data);
export const createPaymentOrder = (data) =>
  api.post("/vehicleowner/credentials/payment/create-order", data);
export const verifyPayment = (data) =>
  api.post("/vehicleowner/credentials/payment/verify", data);
export const getMyScans = () => api.get("/vehicleowner/credentials/myscans");
export const getDashboard = () =>
  api.get("/vehicleowner/credentials/dashboard");
export const getQRCodeImage = () =>
  api.get("/vehicleowner/credentials/qrcodeimage", { responseType: "blob" });

export default api;
