import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SEARCH_PLACEHOLDER = "Search products, invoices, customers... (press Enter)";
const PRIMARY_ACTION = { icon: "add", label: "Add Product" };

export default function TopNav() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const NOTIFICATIONS = [
    { id: 1, text: "Low stock alert: Amul Butter (2 units left)", time: "10 mins ago", type: "warning" },
    { id: 2, text: "New online order #ORD-99821 placed", time: "25 mins ago", type: "order" },
    { id: 3, text: "GST monthly report ready for download", time: "1 hour ago", type: "info" },
  ];

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="flex justify-between items-center h-16 px-6 sticky top-0 z-40 ml-60 bg-[#f8f9ff] border-b border-[#bfc7d2] shadow-sm">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#3f4850]">
            search
          </span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className="w-full bg-[#eff4ff] border border-transparent rounded-full pl-10 pr-4 py-2 text-sm focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all outline-none"
            placeholder={SEARCH_PLACEHOLDER}
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 relative">
          <button 
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2 rounded-full hover:bg-[#dce9ff] transition-all text-[#3f4850]"
            title="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full border-2 border-[#f8f9ff]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-[#bfc7d2] p-4 z-50 animate-in fade-in">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#bfc7d2]/30">
                <span className="font-bold text-sm text-[#0b1c30]">Notifications</span>
                <span className="text-[10px] text-[#006194] font-semibold bg-[#e5eeff] px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="space-y-2">
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="p-2 hover:bg-[#eff4ff] rounded-lg text-xs cursor-pointer transition-colors">
                    <p className="font-semibold text-[#0b1c30]">{n.text}</p>
                    <span className="text-[10px] text-[#707881]">{n.time}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => { setShowNotifications(false); navigate("/reports"); }}
                className="w-full mt-3 text-center text-xs font-semibold text-[#006194] hover:underline"
              >
                View all in Reports
              </button>
            </div>
          )}

          <button 
            onClick={() => navigate("/help")}
            className="text-sm font-semibold text-[#3f4850] hover:text-[#006194] transition-all"
          >
            Help
          </button>
        </div>
        <button 
          onClick={() => navigate("/add-product")}
          className="bg-[#007bb9] text-white px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">{PRIMARY_ACTION.icon}</span>
          {PRIMARY_ACTION.label}
        </button>
      </div>
    </header>
  );
}
