import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SEARCH_PLACEHOLDER = "Search settings...";
const PROFILE_PHOTO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDDHmAAYCCk1v7OBg2Ozi0V8tuItPFXCDxPWa5dxiCGgEja7G5VjqOlG8dgP3umqZBvIBvHipQ3qPYIiWstZssUe0EZzF-j9LH_Jd2ijDF8QTFRYD5ihGlGIbuCZxDdBGM8kSgyOBf2t5AxxBr2VvorZ09gghhD1YtblzEstDdl_VPr418x584ttDag7FhNR76GzLoYsJRy24ZuarVUshMt5zOIIEseFEG7SjrSe2LcadaXwqjX9q0HbdsI-Ht3dwp9G42AGMKJGGHV";

export default function SettingsTopNav() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [searchVal, setSearchVal] = useState("");

  return (
    <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-[32px] font-bold text-[#191c1e]">Settings</h2>
        <p className="text-sm text-[#3f4850]">Manage your business profile and workspace preferences.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707881]">
            search
          </span>
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg text-sm focus:ring-2 focus:ring-[#006194] outline-none w-64"
            placeholder={SEARCH_PLACEHOLDER}
            type="text"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setHasNotification(false);
            }}
            className="p-2 text-[#3f4850] hover:bg-[#e6e8ea] rounded-full transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            {hasNotification && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#bfc7d2]/50 p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-sm text-[#191c1e]">Settings Notices</h4>
                <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-black">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
              <div className="space-y-2 text-xs text-[#3f4850]">
                <div className="p-2.5 bg-[#eff4ff] rounded-lg border border-[#bfc7d2]/30">
                  <p className="font-semibold text-[#006194]">GST Profile Validated</p>
                  <p className="mt-0.5 text-[#565e74]">Your GSTIN number has been verified for B2B e-invoicing.</p>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="font-semibold text-[#191c1e]">Security Recommendation</p>
                  <p className="mt-0.5 text-[#707881]">Enable two-factor authentication for staff members.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help button */}
        <button
          onClick={() => navigate("/help")}
          className="p-2 text-[#3f4850] hover:bg-[#e6e8ea] rounded-full transition-colors cursor-pointer"
          title="Help & Support"
        >
          <span className="material-symbols-outlined">help</span>
        </button>

        {/* Avatar */}
        <div
          onClick={() => navigate("/settings")}
          className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center overflow-hidden border border-[#bfc7d2] cursor-pointer hover:ring-2 hover:ring-[#006194]"
          title="Account Profile"
        >
          <img className="w-full h-full object-cover" alt="Profile" src={PROFILE_PHOTO} />
        </div>
      </div>
    </header>
  );
}
