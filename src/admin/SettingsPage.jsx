import React, { useRef, useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import SettingsTopNav from "../component/SettingsTopNav";
import Sidebar from "../component/Sidebar";
import { useStore } from "../context/StoreContext";

const SETTINGS_TABS = [
  { path: "/settings", icon: "store", label: "Shop Profile" },
  { path: "/billing-details", icon: "account_balance_wallet", label: "Bank & Billing Details" },
  { path: "/staff-management", icon: "badge", label: "Staff Management" },
];

const PLAN = { name: "Business Pro", renewal: "Renewal in 28 days" };

const LOGO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA7jXyHNEGKgimfeHcilNDVMBGZEIJepHHKiAd4xjMxllGnU4RgH0wk4wmcLCQiO1YO5G7ZohuR1kjIdQCBXlOBKsYfhLWqpWyCuL2yiiA_whlV6LVy7fFhHZTzWO2ooFXBzkVROyVKhdmGBd54t7Wrz1ci-dIEARRMl1su8-ppAudfDvfYJ0xgUzqTyy6dsWsiWa5guCh8tEXfqxOrRG7F9rBeQA6DfQ93_oyJK2bVdhsFZ4_EOyeu_uRm3uOghIMobkmnQxBERCAq";
const MAP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDoUiPaiksmdB6TPNdBnZQGMjxTm7KjtAGgNaGUESbP74Wn77PL4WfBpg216BAF8kezhnEfqil670RDYP-F5OG04S_8qC0fxnEHD01SWfUHTEH2bz3UjqzP1vPbeSGKL9zI6ZI_lHU3q-zhAlwmXpLUfm_KxG614AABJYRmD720dMTTmL6A6EM8Trnnceg8K6ItEqFNGCKlaZWYKEmAca6p_34BHVyci3qFln679oB_SEPUmJZI93tFaElWRCm6X8RR9FDGTaVf8QZN";

export default function SettingsPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const restoreFileRef = useRef(null);

  const { settings, updateSettings, exportBackupJSON, importBackupJSON } = useStore();

  // Form states synced with StoreContext settings
  const [businessName, setBusinessName] = useState(settings?.storeName || "Krishna General Store");
  const [tagline, setTagline] = useState(settings?.tagline || "Your Trusted Neighborhood Grocery Partner");
  const [gstin, setGstin] = useState(settings?.gstin || "29AAAAA0000A1Z5");
  const [address, setAddress] = useState(
    settings?.address || "Shop No. 12, Main Market, Sector 4, HSR Layout, Bengaluru, Karnataka - 560102"
  );
  const [contact, setContact] = useState(settings?.phone || "98765 43210");
  const [email, setEmail] = useState(settings?.email || "support@krishnastore.in");
  const [logoPreview, setLogoPreview] = useState(settings?.logo || LOGO_IMAGE);
  const [saveState, setSaveState] = useState("idle"); // "idle" | "saving"
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showGstOnInvoices, setShowGstOnInvoices] = useState(settings?.showGstOnInvoices !== false);

  // Synchronize when settings change in context
  useEffect(() => {
    if (settings) {
      if (settings.storeName) setBusinessName(settings.storeName);
      if (settings.tagline) setTagline(settings.tagline);
      if (settings.gstin) setGstin(settings.gstin);
      if (settings.address) setAddress(settings.address);
      if (settings.phone) setContact(settings.phone);
      if (settings.email) setEmail(settings.email);
      if (settings.logo) setLogoPreview(settings.logo);
      if (settings.showGstOnInvoices !== undefined) setShowGstOnInvoices(settings.showGstOnInvoices);
    }
  }, [settings]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setSaveState("saving");
    setTimeout(() => {
      updateSettings({
        storeName: businessName.trim(),
        tagline: tagline.trim(),
        gstin: gstin.trim().toUpperCase(),
        address: address.trim(),
        phone: contact.trim(),
        email: email.trim(),
        logo: logoPreview,
        showGstOnInvoices,
      });
      setSaveState("idle");
      setToastMessage("Settings saved and synced to live store!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }, 600);
  };

  const handleDiscard = () => {
    if (settings) {
      setBusinessName(settings.storeName || "Krishna General Store");
      setTagline(settings.tagline || "Your Trusted Neighborhood Grocery Partner");
      setGstin(settings.gstin || "29AAAAA0000A1Z5");
      setAddress(settings.address || "Shop No. 12, Main Market, Sector 4, HSR Layout, Bengaluru, Karnataka - 560102");
      setContact(settings.phone || "98765 43210");
      setEmail(settings.email || "support@krishnastore.in");
      setLogoPreview(settings.logo || LOGO_IMAGE);
      setShowGstOnInvoices(settings.showGstOnInvoices !== false);
    }
    setToastMessage("Changes reverted to saved settings.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleRestoreFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = importBackupJSON(event.target.result);
        if (res.success) {
          setToastMessage(res.message);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
        } else {
          alert(`Failed to restore backup: ${res.message}`);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
      `}</style>

      <Sidebar />

      <main className="ml-[280px] min-h-screen p-8">
        <SettingsTopNav />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleLogoChange}
        />
        <input
          ref={restoreFileRef}
          type="file"
          className="hidden"
          accept=".json,application/json"
          onChange={handleRestoreFile}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Vertical tabs */}
          <nav className="w-full lg:w-72 flex flex-col gap-2">
            {SETTINGS_TABS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 px-4 py-3 rounded-xl text-[#006194] bg-white shadow-sm border border-[#bfc7d2]/50 font-bold transition-all text-left"
                    : "flex items-center gap-3 px-4 py-3 rounded-xl text-[#565e74] hover:bg-[#e6e8ea] transition-all text-left font-medium"
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}

            <button
              onClick={exportBackupJSON}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#565e74] hover:bg-[#e6e8ea] transition-all text-left font-medium cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#006194]">cloud_download</span>
              <span>Export Store Backup (.json)</span>
            </button>

            <button
              onClick={() => restoreFileRef.current?.click()}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#565e74] hover:bg-[#e6e8ea] transition-all text-left font-medium cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#006947]">cloud_upload</span>
              <span>Restore Database (.json)</span>
            </button>

            {/* Subscription card */}
            <div className="mt-8 p-6 rounded-2xl bg-[#007bb9] text-white relative overflow-hidden shadow-md">
              <div className="relative z-10">
                <p className="text-xs opacity-80 uppercase tracking-widest mb-2 font-semibold">Subscription</p>
                <h4 className="text-[20px] font-semibold mb-1">{PLAN.name}</h4>
                <p className="text-sm opacity-90 mb-4">{PLAN.renewal}</p>
                <button
                  onClick={() => navigate("/subscriptionPlans")}
                  className="px-4 py-2 bg-white text-[#006194] rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all shadow-md cursor-pointer"
                >
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
                <div>
                  <h3 className="text-[20px] font-semibold">Shop Profile & Settings</h3>
                  <p className="text-xs text-[#707881]">Configure your business details shown on invoices, receipts & storefront</p>
                </div>
                <span className="px-3 py-1 bg-[#6ffbbe] text-[#002113] rounded-full text-xs font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Verified Business
                </span>
              </div>

              <div className="grid grid-cols-12 gap-6">
                {/* Identity section */}
                <div className="col-span-12 md:col-span-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-[#3f4850] font-semibold">Business / Store Name</label>
                      <input
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Krishna General Store"
                        className="w-full px-4 py-3 bg-white border border-[#bfc7d2] rounded-xl focus:border-[#006194] outline-none text-sm transition-all"
                        type="text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-[#3f4850] font-semibold">GSTIN Number</label>
                      <input
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        placeholder="29AAAAA0000A1Z5"
                        className="w-full px-4 py-3 bg-white border border-[#bfc7d2] rounded-xl focus:border-[#006194] outline-none text-sm transition-all uppercase"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-[#3f4850] font-semibold">Store Tagline / Slogan</label>
                    <input
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="Your Trusted Neighborhood Grocery Partner"
                      className="w-full px-4 py-3 bg-white border border-[#bfc7d2] rounded-xl focus:border-[#006194] outline-none text-sm transition-all"
                      type="text"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-[#3f4850] font-semibold">Full Business Address</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Shop No. 12, Main Market, Sector 4, HSR Layout, Bengaluru"
                      className="w-full px-4 py-3 bg-white border border-[#bfc7d2] rounded-xl focus:border-[#006194] outline-none text-sm transition-all resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-[#3f4850] font-semibold">Primary Contact Phone</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707881] text-sm">+91</span>
                        <input
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          placeholder="98765 43210"
                          className="w-full pl-12 pr-4 py-3 bg-white border border-[#bfc7d2] rounded-xl focus:border-[#006194] outline-none text-sm transition-all"
                          type="tel"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-[#3f4850] font-semibold">Email Address</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="support@krishnastore.in"
                        className="w-full px-4 py-3 bg-white border border-[#bfc7d2] rounded-xl focus:border-[#006194] outline-none text-sm transition-all"
                        type="email"
                      />
                    </div>
                  </div>
                </div>

                {/* Brand visuals section */}
                <div className="col-span-12 md:col-span-4 space-y-6">
                  <div className="p-6 rounded-2xl bg-[#f2f4f6] border border-[#bfc7d2]/30 flex flex-col items-center text-center">
                    <label className="text-xs text-[#3f4850] mb-4 self-start font-semibold">Storefront Logo</label>
                    <div
                      onClick={handleUploadClick}
                      className="w-32 h-32 rounded-2xl border-2 border-dashed border-[#bfc7d2] flex items-center justify-center relative group cursor-pointer overflow-hidden bg-white shadow-inner"
                    >
                      <img
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                        alt="Storefront logo"
                        src={logoPreview}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="material-symbols-outlined text-white">photo_camera</span>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-[#707881]">Recommended: 512x512px SVG or PNG</p>
                    <button
                      onClick={handleUploadClick}
                      type="button"
                      className="mt-4 text-[#006194] font-semibold text-sm hover:underline transition-all cursor-pointer"
                    >
                      Update Logo
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl border border-[#bfc7d2]/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#3f4850] font-semibold">Brand Primary Theme</span>
                      <div className="w-8 h-8 rounded-lg bg-[#006194] shadow-sm border border-white" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#3f4850] font-semibold">Show GST in Invoices</span>
                      <button
                        type="button"
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
                            style={{ transform: showGstOnInvoices ? "translateX(20px)" : "translateX(0)" }}
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business hours + map */}
              <div className="mt-8 pt-8 border-t border-[#bfc7d2]/20 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-base font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006194]">schedule</span>
                    Store Hours
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm">Monday - Saturday</span>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-[#e6e8ea] rounded text-xs font-semibold">08:00 AM</span>
                        <span className="text-[#707881] text-xs">to</span>
                        <span className="px-3 py-1 bg-[#e6e8ea] rounded text-xs font-semibold">10:00 PM</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Sunday</span>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-[#e6e8ea] rounded text-xs font-semibold">09:00 AM</span>
                        <span className="text-[#707881] text-xs">to</span>
                        <span className="px-3 py-1 bg-[#e6e8ea] rounded text-xs font-semibold">09:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-base font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006194]">map</span>
                    Location Pin
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
            <footer className="px-8 py-6 bg-white border-t border-[#bfc7d2]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[#3f4850]">
                <span className="material-symbols-outlined text-sm">info</span>
                <p className="text-xs">Changes apply immediately across POS, invoices, and customer storefront.</p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="flex-1 sm:flex-none px-6 py-2.5 text-[#565e74] font-semibold border border-[#bfc7d2] rounded-lg hover:bg-[#f2f4f6] transition-all active:scale-95 cursor-pointer text-sm"
                >
                  Discard Changes
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saveState === "saving"}
                  className="flex-1 sm:flex-none px-8 py-2.5 bg-[#006194] text-white font-semibold rounded-lg shadow-md hover:bg-[#007bb9] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer text-sm"
                >
                  {saveState === "saving" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

      {/* Toast */}
      <div
        className="fixed bottom-8 right-8 bg-[#2d3133] text-[#eff1f3] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all duration-500 z-50"
        style={{
          transform: showToast ? "translateY(0)" : "translateY(96px)",
          opacity: showToast ? 1 : 0,
          pointerEvents: showToast ? "auto" : "none",
        }}
      >
        <span className="material-symbols-outlined text-[#4edea3]">check_circle</span>
        <div>
          <p className="font-semibold text-sm">{toastMessage || "Settings Saved Successfully"}</p>
          <p className="text-xs opacity-80">All changes have been applied to Krishna General Store.</p>
        </div>
        <button onClick={() => setShowToast(false)} className="ml-4 p-1 hover:bg-white/10 rounded-full">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
}
