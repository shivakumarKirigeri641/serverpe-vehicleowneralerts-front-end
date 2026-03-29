import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { syncOwnerChat } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { FiAlertTriangle } from "react-icons/fi";

const ChatSync = () => {
  const { qrcodeNumber } = useParams();
  const navigate = useNavigate();
  const [error, setError] = React.useState("");

  useEffect(() => {
    if (!qrcodeNumber) return;

    const syncChat = async () => {
      try {
        const res = await syncOwnerChat(qrcodeNumber);
        
        const data = res.data?.data;
        if (data && data.alert_details) {
          // Normalize the data to match the scanner's format
          const normalizedSession = {
            alert_id: data.alert_details.alert_id,
            qrcode_number: data.qrcode_number,
            is_scanner: data.is_scanner,
            expires_at: data.alert_details.expires_at,
          };
          localStorage.setItem("vehicle_chat_session", JSON.stringify(normalizedSession));
          navigate("/chat");
        } else {
           setError("Failed to sync chat session. Invalid Response.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to sync chat session. The session may have expired.");
        toast.error("Failed to sync chat session.");
      }
    };

    syncChat();
  }, [qrcodeNumber, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="card p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <FiAlertTriangle className="text-red-500 text-2xl" />
          </div>
          <h2 className="font-display font-bold text-xl text-gray-800 mb-2">
            Chat Sync Error
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <LoadingSpinner size="lg" message="Syncing secure chat session..." />
    </div>
  );
};

export default ChatSync;
