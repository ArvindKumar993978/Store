import React, {useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import SettingsTopNav from "../component/SettingsTopNav";
import Sidebar from "../component/Sidebar";
import SubscriptionPlans from "./SubscriptionPlans";

/*
  EASY-TO-EDIT VERSION
  --------------------
  Colors as Tailwind arbitrary values, e.g. text-[#006194].

  Quick color reference:
    #006194  -> primary (blue)
    #007bb9  -> primary-container (subscription card bg)
    #565e74  -> secondary/gray text
    #f7f9fb  -> page background
    #f2f4f6  -> surface-container-low
    #eceef0  -> surface-container
    #bfc7d2  -> border color
    #ba1a1a  -> error (red, "Closed" text)

  DATA:
  - SETTINGS_TABS: the left vertical tab list. Clicking switches the
    highlighted tab (same visual-only behavior as the original page).
  - PROFILE fields are plain useState values pre-filled with the
    original sample data — edit the defaultValue below or wire up
    a real save handler when you connect a backend.

  Clicking "Save Profile" shows a brief "Saving..." state, then a
  success toast in the bottom-right corner that auto-dismisses after
  5 seconds (same behavior as the original page's script).
*/

const SETTINGS_TABS = [
  { path: "/settings", icon: "store", label: "Shop Profile" },
  { path: "/billing-details", icon: "account_balance_wallet", label: "Bank & Billing Details" },
  { path: "/staff-management", icon: "badge", label: "Staff Management" },
  { path: "/backup-data", icon: "cloud_sync", label: "Backup & Data Portability" },
];

const PLAN = { name: "Business Pro", renewal: "Renewal in 12 days" };

const LOGO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA7jXyHNEGKgimfeHcilNDVMBGZEIJepHHKiAd4xjMxllGnU4RgH0wk4wmcLCQiO1YO5G7ZohuR1kjIdQCBXlOBKsYfhLWqpWyCuL2yiiA_whlV6LVy7fFhHZTzWO2ooFXBzkVROyVKhdmGBd54t7Wrz1ci-dIEARRMl1su8-ppAudfDvfYJ0xgUzqTyy6dsWsiWa5guCh8tEXfqxOrRG7F9rBeQA6DfQ93_oyJK2bVdhsFZ4_EOyeu_uRm3uOghIMobkmnQxBERCAq";
const MAP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDoUiPaiksmdB6TPNdBnZQGMjxTm7KjtAGgNaGUESbP74Wn77PL4WfBpg216BAF8kezhnEfqil670RDYP-F5OG04S_8qC0fxnEHD01SWfUHTEH2bz3UjqzP1vPbeSGKL9zI6ZI_lHU3q-zhAlwmXpLUfm_KxG614AABJYRmD720dMTTmL6A6EM8Trnnceg8K6ItEqFNGCKlaZWYKEmAca6p_34BHVyci3qFln679oB_SEPUmJZI93tFaElWRCm6X8RR9FDGTaVf8QZN";

export default function SettingsPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [saveState, setSaveState] = useState("idle"); // "idle" | "saving"
  const [showToast, setShowToast] = useState(false);
  const [showGstOnInvoices, setShowGstOnInvoices] = useState(true);


  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };


  const handleSave = () => {
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("idle");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }, 1200);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
        .active-tab-indicator { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>

      <Sidebar />

      <main className="ml-[280px] min-h-screen p-8">
        <SettingsTopNav />
        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" />
        <div className="flex gap-8">
          {/* Vertical tabs */}
          <nav className="w-72 flex flex-col gap-2">
            {SETTINGS_TABS.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive || index === 0
                    ? "flex items-center gap-3 px-4 py-3 rounded-xl text-[#006194] bg-white shadow-sm border border-[#bfc7d2]/30 font-semibold active-tab-indicator text-left"
                    : "flex items-center gap-3 px-4 py-3 rounded-xl text-[#565e74] hover:bg-[#e6e8ea] transition-all text-left"
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* Subscription card */}
            <div className="mt-8 p-6 rounded-2xl bg-[#007bb9] text-white relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs opacity-80 uppercase tracking-widest mb-2 font-semibold">Subscription</p>
                <h4 className="text-[20px] font-semibold mb-1">{PLAN.name}</h4>
                <p className="text-sm opacity-90 mb-4">{PLAN.renewal}</p>
                <button
                  onClick={() => navigate("/subscriptionPlans")}
                  className="px-4 py-2 bg-white text-[#006194] rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all shadow-md">
                  Manage Plan
                </button>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl opacity-10 rotate-12">
                auto_awesome
              </span>
            </div>
          </nav>

          {/* Configuration canvas */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-[#bfc7d2]/20 overflow-hidden flex flex-col">
            <div className="p-8 flex-1">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[20px] font-semibold">Shop Profile</h3>
                <span className="px-3 py-1 bg-[#6ffbbe] text-[#002113] rounded-full text-xs font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Verified Business
                </span>
              </div>

              <div className="grid grid-cols-12 gap-6">
                {/* Identity section */}
                <div className="col-span-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-[#3f4850]">Business Name</label>
                      <input
                        className="w-full px-4 py-3 bg-white border border-[#bfc7d2] rounded-xl focus:ring-2 focus:ring-[#006194] outline-none text-sm transition-all"
                        type="text"
                        defaultValue="Apex Retail Solutions"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-[#3f4850]">GSTIN Number</label>
                      <input
                        className="w-full px-4 py-3 bg-white border border-[#bfc7d2] rounded-xl focus:ring-2 focus:ring-[#006194] outline-none text-sm transition-all"
                        type="text"
                        defaultValue="27AAACA1234A1Z5"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#3f4850]">Full Business Address</label>
                    <textarea
                      className="w-full px-4 py-3 bg-white border border-[#bfc7d2] rounded-xl focus:ring-2 focus:ring-[#006194] outline-none text-sm transition-all resize-none"
                      rows={3}
                      defaultValue="Shop No. 42, Green Plaza, Sector 15, HSR Layout, Bengaluru, Karnataka - 560102"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-[#3f4850]">Primary Contact</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707881] text-sm">+91</span>
                        <input
                          className="w-full pl-12 pr-4 py-3 bg-white border border-[#bfc7d2] rounded-xl focus:ring-2 focus:ring-[#006194] outline-none text-sm transition-all"
                          type="tel"
                          defaultValue="98765 43210"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-[#3f4850]">Email Address</label>
                      <input
                        className="w-full px-4 py-3 bg-white border border-[#bfc7d2] rounded-xl focus:ring-2 focus:ring-[#006194] outline-none text-sm transition-all"
                        type="email"
                        defaultValue="contact@apexretail.in"
                      />
                    </div>
                  </div>
                </div>

                {/* Brand visuals section */}
                <div className="col-span-4 space-y-6">
                  <div className="p-6 rounded-2xl bg-[#f2f4f6] border border-[#bfc7d2]/30 flex flex-col items-center text-center">
                    <label className="text-xs text-[#3f4850] mb-4 self-start">Storefront Logo</label>
                    <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-[#bfc7d2] flex items-center justify-center relative group cursor-pointer overflow-hidden bg-white">
                      <img
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        alt="Storefront logo"
                        src={LOGO_IMAGE}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="material-symbols-outlined text-white">photo_camera</span>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-[#707881]">Recommended: 512x512px SVG or PNG</p>
                    <button className="mt-4 text-[#006194] font-semibold text-sm hover:underline transition-all">
                      Update Logo
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl border border-[#bfc7d2]/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#3f4850]">Brand Primary Color</span>
                      <div className="w-8 h-8 rounded-lg bg-[#006194] shadow-sm border border-white" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#3f4850]">Show GST in Invoices</span>
                      <button
                        onClick={() => setShowGstOnInvoices((v) => !v)}
                        className="relative inline-flex items-center cursor-pointer"
                        aria-label="Toggle show GST in invoices"
                      >
                        <div
                          className="w-11 h-6 rounded-full transition-colors relative"
                          style={{ backgroundColor: showGstOnInvoices ? "#006194" : "#e0e3e5" }}
                        >
                          <div
                            className="absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-all"
                            style={{ transform: showGstOnInvoices ? "translateX(100%)" : "translateX(0)" }}
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business hours + map */}
              <div className="mt-8 pt-8 border-t border-[#bfc7d2]/20 grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-base font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006194]">schedule</span>
                    Business Hours
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Monday - Saturday</span>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-[#e6e8ea] rounded text-sm">09:00 AM</span>
                        <span className="text-[#707881]">to</span>
                        <span className="px-3 py-1 bg-[#e6e8ea] rounded text-sm">09:00 PM</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Sunday</span>
                      <span className="text-sm text-[#ba1a1a] font-semibold">Closed</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-base font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006194]">map</span>
                    Map Pin
                  </h4>
                  <div className="h-32 rounded-2xl bg-[#f2f4f6] overflow-hidden relative border border-[#bfc7d2]/20 group">
                    <img
                      className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500"
                      alt="Map showing business location"
                      src={MAP_IMAGE}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-6 h-6 bg-[#006194] rounded-full border-4 border-white shadow-lg animate-bounce" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky actions footer */}
            <footer className="px-8 py-6 bg-white border-t border-[#bfc7d2]/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#3f4850]">
                <span className="material-symbols-outlined text-sm">info</span>
                <p className="text-xs">Last updated on Oct 24, 2023 • 02:15 PM</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="px-6 py-2.5 text-[#565e74] font-semibold border border-[#bfc7d2] rounded-lg hover:bg-[#f2f4f6] transition-all active:scale-95">
                  Discard Changes
                </button>
                <button
                  onClick={handleSave}
                  disabled={saveState === "saving"}
                  className="px-8 py-2.5 bg-[#006194] text-white font-semibold rounded-lg shadow-md hover:bg-[#007bb9] transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70"
                >
                  {saveState === "saving" ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </footer>
          </div>
        </div>
      </main>

      {/* Success toast */}
      <div
        className="fixed bottom-8 right-8 bg-[#2d3133] text-[#eff1f3] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all duration-500 z-50"
        style={{
          transform: showToast ? "translateY(0)" : "translateY(96px)",
          opacity: showToast ? 1 : 0,
        }}
      >
        <span className="material-symbols-outlined text-[#4edea3]">check_circle</span>
        <div>
          <p className="font-semibold text-sm">Settings Saved Successfully</p>
          <p className="text-xs opacity-80">All changes have been applied across your business.</p>
        </div>
        <button onClick={() => setShowToast(false)} className="ml-4 p-1 hover:bg-white/10 rounded-full">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
}
