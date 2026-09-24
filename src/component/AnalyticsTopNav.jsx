import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_NAME = "Rajesh Kumar";
const PROFILE_PHOTO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAfVThSTf8MaxF9U2SWT4HQI7at_R49K6MirrmpLdtHh0S7Agkp14WBRzI9tRL2BHGMflf2BVxIehKvvSL_YtCrB-fuTSwdnvEWJFywFSDFVylEnnlktB_brQ6bd-dB7qWxj0MxVV0ysZsZ9GAx_IwxYeKaB3oU9zPN8uXRkPyBqnMdjqEzOm7w1hvFsowz3xnJtd7wzVR4VpeyufK6HGYREeIOTWqYK1ek6E6DXHvn8j3E4mmF1FwZJiHVGeo0WJG09QWcH_dpdWF8";

const DATE_RANGES = [
  "Today",
  "This Week",
  "Oct 1 - Oct 31, 2024",
  "Last Quarter",
  "Fiscal Year 2024",
];

export default function AnalyticsTopNav() {
  const navigate = useNavigate();
  const [selectedRange, setSelectedRange] = useState("Oct 1 - Oct 31, 2024");
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white h-16 border-b border-[#bfc7d2] flex justify-between items-center px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h2 className="text-[20px] font-bold text-[#006194]">Reports &amp; Analytics</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Date range picker dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRangeDropdown(!showRangeDropdown)}
            className="hidden lg:flex items-center gap-1.5 bg-[#f2f4f6] hover:bg-[#e6e8ea] px-3 py-1.5 rounded-lg border border-[#bfc7d2] text-xs font-semibold text-[#3f4850] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#707881] text-[18px]">calendar_today</span>
            <span>{selectedRange}</span>
            <span className="material-symbols-outlined text-[#707881] text-[16px]">expand_more</span>
          </button>

          {showRangeDropdown && (
            <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-[#bfc7d2]/50 p-2 z-50 animate-in fade-in">
              {DATE_RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setSelectedRange(range);
                    setShowRangeDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                    selectedRange === range
                      ? "bg-[#006194] text-white font-bold"
                      : "text-[#3f4850] hover:bg-[#f2f4f6]"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-[#3f4850] hover:bg-[#e6e8ea] p-2 rounded-lg transition-all cursor-pointer"
              title="Alerts"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#bfc7d2]/50 p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-xs text-[#191c1e]">Report Updates</h4>
                  <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-black">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
                <div className="text-xs text-[#3f4850] p-2 bg-[#f8f9ff] rounded-lg border border-[#bfc7d2]/30">
                  Monthly GST Summary is ready to download.
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 cursor-pointer hover:bg-[#e6e8ea] p-1 rounded-lg transition-all"
            title="Profile & Workspace Settings"
          >
            <img className="w-8 h-8 rounded-full border border-[#bfc7d2] object-cover" alt="Profile" src={PROFILE_PHOTO} />
            <span className="hidden sm:inline text-sm font-bold text-[#191c1e]">{ADMIN_NAME}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
