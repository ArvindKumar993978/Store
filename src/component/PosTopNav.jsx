import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

const STORE_NAME = "Krishna General Store";

export default function PosTopNav() {
  const navigate = useNavigate();
  const { unreadCount, notifications } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeStr, setTimeStr] = useState(() =>
    new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex justify-between items-center h-16 px-4 sm:px-6 sticky top-0 z-40 md:ml-60 ml-0 bg-[#f8f9ff] border-b border-[#bfc7d2] shadow-sm transition-all duration-300">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("krishna_toggle_sidebar"))}
          className="md:hidden p-2 text-[#3f4850] hover:text-[#006194] hover:bg-[#eff4ff] rounded-lg transition-colors"
          title="Open Menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span
          onClick={() => navigate("/")}
          className="text-lg sm:text-[20px] font-bold text-[#006194] cursor-pointer hover:opacity-80 truncate"
        >
          {STORE_NAME}
        </span>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden sm:flex items-center gap-2 text-sm text-[#3f4850]">
          <span className="material-symbols-outlined text-[#006194]">schedule</span>
          <span>{timeStr}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-[#dce9ff] text-[#3f4850] hover:text-[#006194] transition-all"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full border-2 border-white" />
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-[#bfc7d2] p-4 z-[100]">
                <div className="flex justify-between items-center mb-2 pb-1 border-b border-[#bfc7d2]/30">
                  <h4 className="font-bold text-xs text-[#191c1e]">Active Store Alerts</h4>
                  <button onClick={() => setShowNotifications(false)} className="text-xs text-gray-500">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
                <div className="space-y-2 text-xs text-[#3f4850] max-h-48 overflow-y-auto">
                  {notifications.slice(0, 3).map((n) => (
                    <div key={n.id} className="p-2 bg-[#f8f9ff] rounded-lg">
                      <p className="font-semibold text-[#0b1c30]">{n.title}</p>
                      <p className="text-[11px] text-gray-500">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => navigate("/admin")}
            className="text-xs font-bold text-[#006194] bg-[#eff4ff] hover:bg-[#dce9ff] px-3 py-1.5 rounded-lg border border-[#006194]/20 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
    </header>
  );
}
