import React, { useState } from "react";
import Sidebar from "../component/Sidebar";

export default function Billingdetails() {
  const [gstEnabled, setGstEnabled] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] flex min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
        .glass-header { backdrop-filter: blur(8px); background-color: rgba(247, 249, 251, 0.8); }
        .input-focus-ring:focus { outline: none; border-color: #006194; box-shadow: 0 0 0 2px rgba(0, 97, 148, 0.15); }
      `}</style>

      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[240px] flex flex-col min-h-screen">
        {/* TopAppBar */}
        <header className="glass-header sticky top-0 z-40 border-b border-[#bfc7d2] px-6 py-4 flex justify-between items-center max-w-[1280px] mx-auto w-full">
          <div className="flex flex-col">
            <h2 className="text-[20px] leading-[28px] text-[#006194] font-bold">
              Bank &amp; Billing Details
            </h2>
            <nav className="flex text-[#3f4850] text-[12px] gap-2 items-center mt-1">
              <span>Settings</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-[#006194] font-semibold">Financial Configuration</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#3f4850] hover:text-[#006194] transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
            <button className="p-2 text-[#3f4850] hover:text-[#006194] transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="h-8 w-8 rounded-full overflow-hidden border border-[#bfc7d2]">
              <img
                className="w-full h-full object-cover"
                alt="A professional headshot of a modern Indian business owner in a clean office environment, high-key lighting, corporate minimalist aesthetic, looking friendly and confident. The background is softly blurred with tones of blue and white."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ3twhDVOjWfK9VwUmu0TiZqVDzBQQJGRn0xDjjtf_hrSwB9idfbrH7L4j8htaeRMoQOuXm0QNxoH6dqyejhSWi-8AyrYGYLMR3bszj2LKXZsa2ZZNXiBrDow3fHwGbAmFfruA4J4Xdn5R-mnCLR-ON1vKOf1wvkEj4VauQHBFSpqalJItNzFN9D7bGAI248Gsrtp0i7HeNm9tr4oapgIz6qyOUTklSAfW1fNT19eoGn2mblQl35fypIIkcXq3FvAoSNvZJ2C1uWjz"
              />
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8">
          {/* Intro Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="col-span-1">
              <h3 className="text-[20px] leading-[28px] font-semibold text-[#191c1e]">
                Financial Infrastructure
              </h3>
              <p className="text-[14px] leading-[20px] text-[#3f4850] mt-2">
                Configure how your business receives funds, manages taxes, and generates
                professional invoices for your customers.
              </p>
            </div>

            {/* Main Configuration Cards */}
            <div className="col-span-2 space-y-4">
              {/* Section 1: Bank Account Information */}
              <section className="bg-white rounded-xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_1px_2px_rgba(0,0,0,0.03)] border border-[#bfc7d2]/30">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[#006194]">account_balance</span>
                  <h4 className="text-[20px] leading-[28px] font-semibold text-[#191c1e]">
                    Bank Account Information
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#3f4850]">
                      Account Holder Name
                    </label>
                    <input
                      className="w-full bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg p-3 text-[14px] leading-[20px] input-focus-ring transition-all"
                      placeholder="e.g., Rajesh Kumar Enterprises"
                      type="text"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#3f4850]">
                      Bank Name
                    </label>
                    <input
                      className="w-full bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg p-3 text-[14px] leading-[20px] input-focus-ring transition-all"
                      placeholder="e.g., HDFC Bank"
                      type="text"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#3f4850]">
                      Account Number
                    </label>
                    <input
                      className="w-full bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg p-3 text-[14px] leading-[20px] font-medium input-focus-ring transition-all"
                      type="password"
                      defaultValue="987654321012"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#3f4850]">
                      IFSC Code
                    </label>
                    <input
                      className="w-full bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg p-3 text-[14px] leading-[20px] uppercase input-focus-ring transition-all"
                      placeholder="HDFC0001234"
                      type="text"
                    />
                  </div>
                </div>
              </section>

              {/* Section 2: Tax Settings */}
              <section className="bg-white rounded-xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_1px_2px_rgba(0,0,0,0.03)] border border-[#bfc7d2]/30">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#006194]">receipt_long</span>
                    <h4 className="text-[20px] leading-[28px] font-semibold text-[#191c1e]">
                      Tax Settings
                    </h4>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-[#f2f4f6] p-4 rounded-lg">
                    <div>
                      <h5 className="text-[16px] leading-[24px] font-semibold text-[#191c1e]">
                        GST Registration
                      </h5>
                      <p className="text-[14px] leading-[20px] text-[#3f4850]">
                        Enable this to add GST details to your invoices.
                      </p>
                    </div>
                    <button
                      onClick={() => setGstEnabled((prev) => !prev)}
                      className="w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center relative"
                      style={{ backgroundColor: gstEnabled ? "#006194" : "#bfc7d2" }}
                    >
                      <div
                        className="w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-sm"
                        style={{ transform: gstEnabled ? "translateX(20px)" : "translateX(0)" }}
                      ></div>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#3f4850]">
                        GSTIN Number
                      </label>
                      <input
                        className="w-full bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg p-3 text-[14px] leading-[20px] uppercase input-focus-ring transition-all"
                        placeholder="22AAAAA0000A1Z5"
                        type="text"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#3f4850]">
                        PAN Number
                      </label>
                      <input
                        className="w-full bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg p-3 text-[14px] leading-[20px] uppercase input-focus-ring transition-all"
                        placeholder="ABCDE1234F"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: Billing Preferences */}
              <section className="bg-white rounded-xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_1px_2px_rgba(0,0,0,0.03)] border border-[#bfc7d2]/30">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[#006194]">
                    settings_applications
                  </span>
                  <h4 className="text-[20px] leading-[28px] font-semibold text-[#191c1e]">
                    Billing Preferences
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-1.5">
                    <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#3f4850]">
                      Default Currency
                    </label>
                    <select className="w-full bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg p-3 text-[14px] leading-[20px] input-focus-ring transition-all">
                      <option value="INR">INR (₹) - Indian Rupee</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#3f4850]">
                      Invoice Prefix
                    </label>
                    <div className="flex">
                      <input
                        className="flex-1 bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg p-3 text-[14px] leading-[20px] input-focus-ring transition-all"
                        type="text"
                        defaultValue="INV-"
                      />
                      <div className="ml-3 flex items-center px-4 bg-[#eceef0] shadow-inner border border-[#bfc7d2]/50 rounded-lg text-[#3f4850] text-[12px] tracking-[0.05em] font-semibold">
                        Sample: INV-1001
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#3f4850]">
                    Default Terms &amp; Conditions
                  </label>
                  <textarea
                    className="w-full bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg p-3 text-[14px] leading-[20px] input-focus-ring transition-all resize-none"
                    rows="4"
                    defaultValue={
                      "1. Payments are due within 15 days.\n2. Please quote invoice number on all correspondence.\n3. Goods once sold will not be taken back."
                    }
                  />
                </div>
              </section>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-6">
                <button className="px-6 py-2.5 rounded-lg text-[12px] tracking-[0.05em] font-semibold text-[#3f4850] border border-[#bfc7d2] hover:bg-[#e6e8ea] transition-all active:scale-95">
                  Discard Changes
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-2.5 bg-[#006194] text-white rounded-lg text-[12px] tracking-[0.05em] font-semibold shadow-lg shadow-[#006194]/20 hover:opacity-90 transition-all active:scale-95"
                >
                  Save Financial Settings
                </button>
              </div>
            </div>
          </div>

          {/* Bento Preview Section (Educational / Guidance) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="col-span-1 md:col-span-2 bg-[#007bb9]/10 border border-[#007bb9]/20 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-[#006194] mb-4 text-3xl">
                  verified_user
                </span>
                <h4 className="text-[20px] leading-[28px] font-semibold text-[#006194]">
                  Trust &amp; Compliance
                </h4>
                <p className="text-[14px] leading-[20px] text-[#004b73] mt-2">
                  All financial data is encrypted and stored according to industry-standard
                  PCI-DSS guidelines.
                </p>
              </div>
              <a
                className="mt-6 text-[#006194] text-[12px] tracking-[0.05em] font-semibold flex items-center gap-1 hover:underline"
                href="#"
              >
                Security Overview{" "}
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
            <div className="bg-[#e6e8ea] p-6 rounded-2xl">
              <span className="material-symbols-outlined text-[#5c647a] mb-4">
                account_balance_wallet
              </span>
              <h5 className="text-[16px] leading-[24px] font-bold text-[#191c1e]">Settlement Cycle</h5>
              <p className="text-[12px] leading-[16px] tracking-[0.05em] text-[#3f4850] mt-2">
                T+2 days for domestic payments. T+7 for international.
              </p>
            </div>
            <div className="bg-[#00855b]/10 border border-[#00855b]/20 p-6 rounded-2xl">
              <span className="material-symbols-outlined text-[#006947] mb-4">
                contact_support
              </span>
              <h5 className="text-[16px] leading-[24px] font-bold text-[#191c1e]">Need Help?</h5>
              <p className="text-[12px] leading-[16px] tracking-[0.05em] text-[#005236] mt-2">
                Speak to a finance specialist for GST onboarding.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto w-full py-4 bg-white border-t border-[#bfc7d2] flex flex-col md:flex-row justify-between items-center px-8">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="text-[12px] tracking-[0.05em] font-semibold text-[#006194]">
              Efficient Ledger
            </span>
            <span className="text-[12px] text-[#3f4850]">
              © 2024. All rights reserved.
            </span>
          </div>
          <div className="flex gap-6">
            <a className="text-[12px] text-[#3f4850] hover:underline" href="#">
              Privacy Policy
            </a>
            <a className="text-[12px] text-[#3f4850] hover:underline" href="#">
              Terms of Service
            </a>
            <a className="text-[12px] text-[#3f4850] hover:underline" href="#">
              Support
            </a>
          </div>
        </footer>
      </main>

      {/* Toast notification */}
      <div
        className="fixed bottom-24 right-6 bg-[#2d3133] text-[#eff1f3] px-6 py-3 rounded-lg text-[14px] flex items-center gap-3 shadow-xl transition-all duration-300 transform z-[100]"
        style={{
          transform: showToast ? "translateY(0)" : "translateY(40px)",
          opacity: showToast ? 1 : 0,
          pointerEvents: showToast ? "auto" : "none",
        }}
      >
        <span className="material-symbols-outlined text-[#6ffbbe]">check_circle</span>
        Settings saved successfully.
      </div>
    </div>
  );
}
