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
    <div className="bg-background text-on-surface flex min-h-screen">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[240px] flex flex-col min-h-screen">
        {/* TopAppBar */}
        <header className="glass-header sticky top-0 z-40 border-b border-outline-variant px-6 py-4 flex justify-between items-center max-w-container-max mx-auto w-full">
          <div className="flex flex-col">
            <h2 className="font-headline-md text-headline-md text-primary font-bold">
              Bank &amp; Billing Details
            </h2>
            <nav className="flex text-on-surface-variant text-[12px] gap-2 items-center mt-1">
              <span>Settings</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-semibold">Financial Configuration</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant">
              <img
                className="w-full h-full object-cover"
                alt="A professional headshot of a modern Indian business owner in a clean office environment, high-key lighting, corporate minimalist aesthetic, looking friendly and confident. The background is softly blurred with tones of blue and white."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ3twhDVOjWfK9VwUmu0TiZqVDzBQQJGRn0xDjjtf_hrSwB9idfbrH7L4j8htaeRMoQOuXm0QNxoH6dqyejhSWi-8AyrYGYLMR3bszj2LKXZsa2ZZNXiBrDow3fHwGbAmFfruA4J4Xdn5R-mnCLR-ON1vKOf1wvkEj4VauQHBFSpqalJItNzFN9D7bGAI248Gsrtp0i7HeNm9tr4oapgIz6qyOUTklSAfW1fNT19eoGn2mblQl35fypIIkcXq3FvAoSNvZJ2C1uWjz"
              />
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-stack-lg">
          {/* Intro Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="col-span-1">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Financial Infrastructure
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                Configure how your business receives funds, manages taxes, and generates
                professional invoices for your customers.
              </p>
            </div>

            {/* Main Configuration Cards */}
            <div className="col-span-2 space-y-stack-md">
              {/* Section 1: Bank Account Information */}
              <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_1px_2px_rgba(0,0,0,0.03)] border border-outline-variant/30">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary">account_balance</span>
                  <h4 className="font-headline-md text-headline-md text-on-surface">
                    Bank Account Information
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  <div className="space-y-1.5">
                    <label className="font-label-md text-label-md text-on-surface-variant">
                      Account Holder Name
                    </label>
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-body-md input-focus-ring transition-all"
                      placeholder="e.g., Rajesh Kumar Enterprises"
                      type="text"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-label-md text-label-md text-on-surface-variant">
                      Bank Name
                    </label>
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-body-md input-focus-ring transition-all"
                      placeholder="e.g., HDFC Bank"
                      type="text"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-label-md text-label-md text-on-surface-variant">
                      Account Number
                    </label>
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-body-md tabular-nums input-focus-ring transition-all"
                      type="password"
                      defaultValue="987654321012"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-label-md text-label-md text-on-surface-variant">
                      IFSC Code
                    </label>
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-body-md uppercase input-focus-ring transition-all"
                      placeholder="HDFC0001234"
                      type="text"
                    />
                  </div>
                </div>
              </section>

              {/* Section 2: Tax Settings */}
              <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_1px_2px_rgba(0,0,0,0.03)] border border-outline-variant/30">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">receipt_long</span>
                    <h4 className="font-headline-md text-headline-md text-on-surface">
                      Tax Settings
                    </h4>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-lg">
                    <div>
                      <h5 className="font-body-lg text-body-lg font-semibold text-on-surface">
                        GST Registration
                      </h5>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Enable this to add GST details to your invoices.
                      </p>
                    </div>
                    <button
                      onClick={() => setGstEnabled((prev) => !prev)}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center relative ${
                        gstEnabled ? "bg-primary" : "bg-outline-variant"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-sm ${
                          gstEnabled ? "translate-x-5" : ""
                        }`}
                      ></div>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    <div className="space-y-1.5">
                      <label className="font-label-md text-label-md text-on-surface-variant">
                        GSTIN Number
                      </label>
                      <input
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-body-md uppercase input-focus-ring transition-all"
                        placeholder="22AAAAA0000A1Z5"
                        type="text"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-label-md text-label-md text-on-surface-variant">
                        PAN Number
                      </label>
                      <input
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-body-md uppercase input-focus-ring transition-all"
                        placeholder="ABCDE1234F"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: Billing Preferences */}
              <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_1px_2px_rgba(0,0,0,0.03)] border border-outline-variant/30">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary">
                    settings_applications
                  </span>
                  <h4 className="font-headline-md text-headline-md text-on-surface">
                    Billing Preferences
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-6">
                  <div className="space-y-1.5">
                    <label className="font-label-md text-label-md text-on-surface-variant">
                      Default Currency
                    </label>
                    <select className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-body-md input-focus-ring transition-all">
                      <option value="INR">INR (₹) - Indian Rupee</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-label-md text-label-md text-on-surface-variant">
                      Invoice Prefix
                    </label>
                    <div className="flex">
                      <input
                        className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-body-md input-focus-ring transition-all"
                        type="text"
                        defaultValue="INV-"
                      />
                      <div className="ml-3 flex items-center px-4 bg-surface-container shadow-inner border border-outline-variant/50 rounded-lg text-on-surface-variant font-label-md">
                        Sample: INV-1001
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface-variant">
                    Default Terms &amp; Conditions
                  </label>
                  <textarea
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-body-md input-focus-ring transition-all resize-none"
                    rows="4"
                    defaultValue={
                      "1. Payments are due within 15 days.\n2. Please quote invoice number on all correspondence.\n3. Goods once sold will not be taken back."
                    }
                  />
                </div>
              </section>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-6">
                <button className="px-6 py-2.5 rounded-lg font-label-md text-label-md text-on-surface-variant border border-outline-variant hover:bg-surface-container-high transition-all active:scale-95">
                  Discard Changes
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
                >
                  Save Financial Settings
                </button>
              </div>
            </div>
          </div>

          {/* Bento Preview Section (Educational / Guidance) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-stack-lg">
            <div className="col-span-1 md:col-span-2 bg-primary-container/10 border border-primary-container/20 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-primary mb-4 text-3xl">
                  verified_user
                </span>
                <h4 className="font-headline-md text-headline-md text-primary">
                  Trust &amp; Compliance
                </h4>
                <p className="font-body-md text-body-md text-on-primary-fixed-variant mt-2">
                  All financial data is encrypted and stored according to industry-standard
                  PCI-DSS guidelines.
                </p>
              </div>
              <a
                className="mt-6 text-primary font-label-md text-label-md flex items-center gap-1 hover:underline"
                href="#"
              >
                Security Overview{" "}
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
            <div className="bg-surface-container-high p-6 rounded-2xl">
              <span className="material-symbols-outlined text-on-secondary-container mb-4">
                account_balance_wallet
              </span>
              <h5 className="font-body-lg text-body-lg font-bold">Settlement Cycle</h5>
              <p className="font-label-md text-label-md text-on-surface-variant mt-2">
                T+2 days for domestic payments. T+7 for international.
              </p>
            </div>
            <div className="bg-tertiary-container/10 border border-tertiary-container/20 p-6 rounded-2xl">
              <span className="material-symbols-outlined text-tertiary mb-4">
                contact_support
              </span>
              <h5 className="font-body-lg text-body-lg font-bold">Need Help?</h5>
              <p className="font-label-md text-label-md text-on-tertiary-fixed-variant mt-2">
                Speak to a finance specialist for GST onboarding.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto w-full py-md bg-surface-container-lowest border-t border-outline-variant flex flex-col md:flex-row justify-between items-center px-lg">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="font-label-md text-label-md font-semibold text-primary">
              Efficient Ledger
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              © 2024. All rights reserved.
            </span>
          </div>
          <div className="flex gap-6">
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:underline" href="#">
              Privacy Policy
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:underline" href="#">
              Terms of Service
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:underline" href="#">
              Support
            </a>
          </div>
        </footer>
      </main>

      {/* <BottomNav /> */}

      {/* Toast notification */}
      <div
        className={`fixed bottom-24 right-6 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-lg font-body-md flex items-center gap-3 shadow-xl transition-all duration-300 transform z-[100] ${
          showToast ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <span className="material-symbols-outlined text-tertiary-fixed">check_circle</span>
        Settings saved successfully.
      </div>
    </div>
  );
}
