import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiArrowLeft, FiClock, FiShield } from "react-icons/fi";
import toast from "react-hot-toast";
import { sendChatMessage, endChatSession } from "../services/api";

const ChatSession = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load local storage session data
    const sessionStr = localStorage.getItem("vehicle_chat_session");
    if (sessionStr) {
      try {
        setSession(JSON.parse(sessionStr));
      } catch (err) {
        console.error("Failed to parse chat session from localStorage");
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (!session) return;

    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const res = await sendChatMessage({ 
          alert_id: session.alert_id,
          is_scanner: !!session.is_scanner,
          qrcode_number: session.qrcode_number
        });
        if ((res.data?.successstatus || res.data?.statuscode === 200) && res.data?.data) {
          if (isMounted) {
            setMessages(res.data.data);
          }
        }
      } catch (err) {
        if (err.response?.data?.message === "Session ended" || err.response?.status === 403) {
          window.alert("Session ended.");
          localStorage.removeItem("vehicle_chat_session");
          window.location.href = "https://serverpe.in";
        } else {
          console.error("Poll error:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Initial fetch
    fetchMessages();

    // Poll every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [session]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const msgText = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      const res = await sendChatMessage({
        alert_id: session.alert_id,
        message: msgText,
        qrcode_number: session.qrcode_number,
        is_scanner: !!session.is_scanner,
      });

      if (res.data?.successstatus || res.data?.statuscode === 200) {
        setMessages(res.data.data);
      } else {
        toast.error("Failed to send message");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
      scrollToBottom();
    }
  };

  const isMyMessage = (msg) => {
    if (session?.is_scanner) {
      return msg.sender_type === "scanner";
    } else {
      return msg.sender_type === "owner";
    }
  };

  const handleLeaveSession = () => {
    // Optionally clear it, or keep it so they can resume
    localStorage.removeItem("vehicle_chat_session");
    if (session?.is_scanner) {
      navigate(`/scan/${session.qrcode_number}`);
    } else {
      navigate("/dashboard");
    }
  };

  const calculateTimeLeft = () => {
    if (!session?.expires_at) return null;
    const end = new Date(session.expires_at).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    if (diff <= 0) return "Expired";
    const minutes = Math.floor(diff / 60000);
    return `${minutes} min left`;
  };

  const endSessionApi = useCallback(async () => {
    if (!session) return;
    try {
      await endChatSession({
        alert_id: session.alert_id,
        qrcode_number: session.qrcode_number,
        is_scanner: !!session.is_scanner,
      });
    } catch (err) {
      console.error(err);
    }
  }, [session]);

  useEffect(() => {
    if (!session?.expires_at) return;
    const checkExpiry = setInterval(async () => {
      const end = new Date(session.expires_at).getTime();
      const now = new Date().getTime();
      if (end - now <= 0) {
        clearInterval(checkExpiry);
        window.alert("Your session has expired.");
        await endSessionApi();
        localStorage.removeItem("vehicle_chat_session");
        window.location.href = "https://serverpe.in";
      }
    }, 1000);
    return () => clearInterval(checkExpiry);
  }, [session, navigate, endSessionApi]);

  const handleEndChat = async () => {
    if (window.confirm("Are you sure you want to end this chat session?")) {
      await endSessionApi();
      localStorage.removeItem("vehicle_chat_session");
      window.location.href = "https://serverpe.in";
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (session) {
        const payload = JSON.stringify({
          alert_id: session.alert_id,
          qrcode_number: session.qrcode_number,
          is_scanner: !!session.is_scanner,
        });
        const url = (process.env.REACT_APP_API_URL || "http://localhost:7777") + "/vehiclealerts/scan/end-session";
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true
        }).catch(err => console.error(err));
        localStorage.removeItem("vehicle_chat_session");
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [session]);

  if (!session) return null;

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50">
      {/* Header */}
      <div className="flex-none bg-white border-b border-gray-200 px-4 py-3 shadow-sm z-10 sticky top-0">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={handleLeaveSession}
            className="p-2 -ml-2 text-gray-400 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100"
          >
            <FiArrowLeft size={20} />
          </button>
          <div className="text-center flex-1">
            <h2 className="font-display font-semibold text-gray-800 text-lg">
              {session.is_scanner ? "Chat with Owner" : "Scanner Chat"}
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-green-600 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live Session
              {session.expires_at && (
                <span className="text-gray-400 ml-2 flex items-center gap-1">
                  <FiClock size={10} /> {calculateTimeLeft()}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleEndChat}
            className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors"
          >
            End Chat
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
        <div className="max-w-3xl mx-auto flex flex-col justify-end min-h-full">
          {/* Privacy Notice inside chat */}
          <div className="flex justify-center mb-6">
            <div className="bg-primary-50 rounded-xl p-3 text-xs text-primary-700 font-medium inline-flex items-center gap-2 max-w-sm text-center">
              <FiShield className="shrink-0" /> This is a temporary, anonymous secure channel. Phone numbers stay hidden.
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center my-4">
              <motion.div
                className="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
                  <p>No messages yet.</p>
                  <p>Send a message to start the conversation.</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const myMessage = isMyMessage(msg);
                  return (
                    <motion.div
                      key={msg.id || index}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className={`flex flex-col mb-4 ${
                        myMessage ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                          myMessage
                            ? "bg-primary-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none"
                        }`}
                      >
                        <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 mx-1 font-medium select-none">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} className="h-2" />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none bg-white p-4 border-t border-gray-200">
        <form
          onSubmit={handleSendMessage}
          className="max-w-3xl mx-auto relative flex items-center"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              if (e.target.value.length <= 50) setNewMessage(e.target.value);
            }}
            maxLength={50}
            placeholder="Type your message (max 50 chars)..."
            className="w-full bg-gray-100/80 border-0 rounded-full py-3.5 pl-5 pr-14 text-[15px] text-gray-800 placeholder-gray-400 focus:bg-gray-100 focus:ring-2 focus:ring-primary-500 transition-all font-medium"
            autoComplete="off"
            disabled={calculateTimeLeft() === "Expired"}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending || calculateTimeLeft() === "Expired"}
            className="absolute right-1.5 p-2 rounded-full bg-primary-600 text-white active:scale-95 transition-all disabled:opacity-50 disabled:bg-gray-300 hover:bg-primary-700 flex items-center justify-center w-10 h-10 shadow-sm"
          >
            {sending ? (
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <FiSend size={16} className="ml-0.5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSession;
