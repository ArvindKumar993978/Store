import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

const SEARCH_PLACEHOLDER = "Search products, invoices, customers... (press Enter)";
const PRIMARY_ACTION = { icon: "add", label: "Add Product" };

export default function TopNav() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleNotificationClick = (n) => {
    markAsRead(n.id);
    setShowNotifications(false);
    if (n.link) navigate(n.link);
  };

  return (
    <header className="flex justify-between items-center h-16 px-4 sm:px-6 sticky top-0 z-40 md:ml-60 ml-0 bg-[#f8f9ff] border-b border-[#bfc7d2] shadow-sm transition-all duration-300">
      {/* Left: Mobile hamburger & search */}
      <div className="flex items-center flex-1 max-w-xl gap-2">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("krishna_toggle_sidebar"))}
          className="md:hidden p-2 text-[#3f4850] hover:text-[#006194] hover:bg-[#eff4ff] rounded-lg transition-colors flex-shrink-0"
          title="Open Menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#3f4850] text-[18px]">
            search
          </span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className="w-full bg-[#eff4ff] border border-transparent rounded-full pl-9 pr-4 py-1.5 sm:py-2 text-xs sm:text-sm focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all outline-none"
            placeholder={SEARCH_PLACEHOLDER}
            type="text"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 sm:gap-4 ml-3">
        <div className="flex items-center gap-2 sm:gap-4 relative">
          {/* Notification Bell */}
          <button 
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2 rounded-full hover:bg-[#dce9ff] transition-all text-[#3f4850]"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-[#f8f9ff]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Correctly Positioned Notifications Dropdown */}
          {showNotifications && (
            <div className="fixed sm:absolute right-4 sm:right-0 top-16 sm:top-12 w-[calc(100vw-2rem)] sm:w-88 bg-white rounded-2xl shadow-2xl border border-[#bfc7d2] p-4 z-[100] animate-in fade-in max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#bfc7d2]/30">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#0b1c30]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] text-[#006194] font-semibold bg-[#e5eeff] px-2 py-0.5 rounded-full">
                      {unreadCount} Unread
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-[#006194] hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 text-gray-400 hover:text-black rounded-full sm:hidden"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 overflow-y-auto flex-1 max-h-[50vh] pr-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-[#707881]">
                    <span className="material-symbols-outlined text-3xl text-gray-300 mb-1">notifications_off</span>
                    <p className="text-xs font-semibold">No notifications right now</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-2.5 rounded-xl text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                        n.read ? "bg-[#f8f9ff] hover:bg-[#eff4ff] opacity-80" : "bg-[#eef4ff] hover:bg-[#e0ecff] font-medium border-l-4 border-[#006194]"
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[18px] p-1.5 rounded-lg flex-shrink-0 mt-0.5 text-white"
                        style={{ backgroundColor: n.color || "#006194" }}
                      >
                        {n.icon || "notifications"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#0b1c30] truncate">{n.title}</p>
                        <p className="text-[11px] text-[#3f4850] line-clamp-2 leading-relaxed mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-[#707881] mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-[#bfc7d2]/30 mt-2 flex items-center justify-between">
                <button 
                  onClick={() => { setShowNotifications(false); navigate("/orders"); }}
                  className="text-xs font-semibold text-[#006194] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">local_shipping</span>
                  View Orders
                </button>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-[11px] text-[#ba1a1a] hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )}

          <button 
            onClick={() => navigate("/help")}
            className="text-xs sm:text-sm font-semibold text-[#3f4850] hover:text-[#006194] transition-all hidden sm:inline"
          >
            Help
          </button>
        </div>

        <button 
          onClick={() => navigate("/add-product")}
          className="bg-[#007bb9] text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-sm flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[16px] sm:text-[18px]">{PRIMARY_ACTION.icon}</span>
          <span className="hidden sm:inline">{PRIMARY_ACTION.label}</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
}
