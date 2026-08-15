import React, { useRef, useState } from "react";
import Sidebar from "../component/Sidebar";

export default function BackupData() {
  const [backupState, setBackupState] = useState("idle"); // idle | syncing | complete
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);

  const handleBackupNow = () => {
    if (backupState !== "idle") return;
    setBackupState("syncing");
    setTimeout(() => {
      setBackupState("complete");
      setTimeout(() => {
        setBackupState("idle");
      }, 2000);
    }, 3000);
  };

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrag = (e, active) => {
    e.preventDefault();
    setDragActive(active);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] flex min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
        .card-shadow { box-shadow: 0px 1px 3px rgba(0,0,0,0.05), 0px 1px 2px rgba(0,0,0,0.03); }
      `}</style>

      <Sidebar />

      {/* Main Content */}
      <main className="md:ml-[240px] flex-1 flex flex-col min-h-screen">
        {/* TopAppBar */}
        <header className="h-16 bg-[#f7f9fb] border-b border-[#bfc7d2] flex justify-between items-center px-6 sticky top-0 z-40">
          <h2 className="text-[20px] leading-[28px] font-bold text-[#006194]">
            Backup &amp; Data Portability
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#3f4850] hover:text-[#006194] transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
            <button className="p-2 text-[#3f4850] hover:text-[#006194] transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#cce5ff] flex items-center justify-center border border-[#bfc7d2] overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="A professional headshot of a modern Indian business manager in a clean office setting, featuring soft natural lighting and a minimalist corporate aesthetic. The background is slightly blurred with light blue and grey tones consistent with the Efficient Ledger brand palette."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKA36f0Ab3-zPdfmk0hwBFH1vMrL92e-jlvCROGGiiJknZk4vgrZ9Ue6ANnZIk-UZvTrJBnWRLm9j4lFqoAa2KUL-M3r3KCMa4g2TgRiL2IXvnLHwo18Wg3CG7EuibIujwCTcwVeZywiAJeK8J4DmVNOIz2Ax-KAs4APa097ub10ubZJBy-bgWvwNKIKKVwBiyH577Lgm6PAjxNQ-Jhoa5ksgTt6n_N4wlTM2dbJE6ibi0zh9OHT5fnGUK50Twnu6jvePVfDFW_Ehw"
              />
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="p-8 space-y-8 max-w-[1200px]">
          {/* Bento Header Section: Cloud Status & Auto-Backup */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Cloud Backup Status Card */}
            <section className="md:col-span-7 bg-white rounded-xl card-shadow p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span
                  className="material-symbols-outlined text-[80px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  cloud_done
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-2 bg-[#00855b]/10 text-[#006947] rounded-lg">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      backup
                    </span>
                  </span>
                  <h3 className="text-[20px] leading-[28px] font-semibold text-[#191c1e]">
                    Cloud Backup Status
                  </h3>
                </div>
                <div className="space-y-1 mb-6">
                  <p className="text-[14px] leading-[20px] text-[#3f4850]">
                    Last successful synchronization
                  </p>
                  <p className="text-[20px] leading-[28px] font-bold text-[#006194]">
                    Today, 10:45 AM
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full bg-[#00855b]/10 text-[#006947] text-[12px] tracking-[0.05em] font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#006947]"></span>
                    Securely Encrypted
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#dae2fd]/20 text-[#5c647a] text-[12px] tracking-[0.05em] font-semibold">
                    4.2 GB Used
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleBackupNow}
                  disabled={backupState !== "idle"}
                  className={`w-full md:w-auto px-6 py-2.5 text-white rounded-lg text-[12px] tracking-[0.05em] font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95 ${
                    backupState !== "idle" ? "opacity-75" : ""
                  }`}
                  style={{
                    backgroundColor: backupState === "complete" ? "#006947" : "#006194",
                  }}
                >
                  {backupState === "idle" && (
                    <>
                      <span className="material-symbols-outlined text-[20px]">sync</span>
                      Backup Now
                    </>
                  )}
                  {backupState === "syncing" && (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-1 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Syncing...
                    </>
                  )}
                  {backupState === "complete" && (
                    <>
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      Complete
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Auto-Backup Settings */}
            <AutoBackupSettings />
          </div>

          {/* Data Export Grid */}
          <section className="bg-white rounded-xl card-shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-[#dae2fd]/20 text-[#565e74] rounded-lg">
                  <span className="material-symbols-outlined">download</span>
                </span>
                <div>
                  <h3 className="text-[20px] leading-[28px] font-semibold text-[#191c1e]">
                    Data Export
                  </h3>
                  <p className="text-[14px] leading-[20px] text-[#3f4850]">
                    Download your business data for external analysis.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] tracking-[0.05em] font-semibold text-[#3f4850]">
                  Format:
                </span>
                <select className="bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg text-[12px] tracking-[0.05em] font-semibold px-3 py-1 focus:ring-[#006194] focus:border-[#006194]">
                  <option>Excel (.xlsx)</option>
                  <option>CSV (.csv)</option>
                  <option>JSON (.json)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Export Card: Products */}
              <div className="group p-4 border border-[#bfc7d2] rounded-xl hover:bg-[#f2f4f6] transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#007bb9]/10 text-[#006194] rounded-lg">
                    <span className="material-symbols-outlined">inventory_2</span>
                  </div>
                  <button className="text-[#006194] hover:bg-[#007bb9]/20 p-2 rounded-full transition-colors">
                    <span className="material-symbols-outlined">file_download</span>
                  </button>
                </div>
                <h4 className="text-[16px] leading-[24px] font-bold text-[#191c1e]">
                  Product Catalog
                </h4>
                <p className="text-[14px] leading-[20px] text-[#3f4850] mt-1">
                  Stock levels, pricing, and supplier info.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[12px] tracking-[0.05em] font-semibold text-[#3f4850] italic">
                    1,240 Items
                  </span>
                  <span className="text-[14px] leading-[20px] font-medium text-[#3f4850]">
                    2.4 MB
                  </span>
                </div>
              </div>

              {/* Export Card: Sales */}
              <div className="group p-4 border border-[#bfc7d2] rounded-xl hover:bg-[#f2f4f6] transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#00855b]/10 text-[#006947] rounded-lg">
                    <span className="material-symbols-outlined">analytics</span>
                  </div>
                  <button className="text-[#006947] hover:bg-[#00855b]/20 p-2 rounded-full transition-colors">
                    <span className="material-symbols-outlined">file_download</span>
                  </button>
                </div>
                <h4 className="text-[16px] leading-[24px] font-bold text-[#191c1e]">
                  Sales Records
                </h4>
                <p className="text-[14px] leading-[20px] text-[#3f4850] mt-1">
                  Transaction history and tax reports.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[12px] tracking-[0.05em] font-semibold text-[#3f4850] italic">
                    8,500 Records
                  </span>
                  <span className="text-[14px] leading-[20px] font-medium text-[#3f4850]">
                    14.8 MB
                  </span>
                </div>
              </div>

              {/* Export Card: Customers */}
              <div className="group p-4 border border-[#bfc7d2] rounded-xl hover:bg-[#f2f4f6] transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#dae2fd]/20 text-[#565e74] rounded-lg">
                    <span className="material-symbols-outlined">group</span>
                  </div>
                  <button className="text-[#565e74] hover:bg-[#dae2fd]/40 p-2 rounded-full transition-colors">
                    <span className="material-symbols-outlined">file_download</span>
                  </button>
                </div>
                <h4 className="text-[16px] leading-[24px] font-bold text-[#191c1e]">
                  Customer Data
                </h4>
                <p className="text-[14px] leading-[20px] text-[#3f4850] mt-1">
                  Profiles, loyalty points, and history.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[12px] tracking-[0.05em] font-semibold text-[#3f4850] italic">
                    450 Profiles
                  </span>
                  <span className="text-[14px] leading-[20px] font-medium text-[#3f4850]">
                    0.8 MB
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Restore Data Section */}
          <section className="bg-white rounded-xl card-shadow p-6 border-2 border-dashed border-[#bfc7d2]">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="md:w-1/3">
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-2 bg-[#ffdad6]/20 text-[#ba1a1a] rounded-lg">
                    <span className="material-symbols-outlined">upload_file</span>
                  </span>
                  <h3 className="text-[20px] leading-[28px] font-semibold text-[#191c1e]">
                    Restore Data
                  </h3>
                </div>
                <p className="text-[14px] leading-[20px] text-[#3f4850] mb-4">
                  Uploading a backup file will overwrite your current database. We recommend
                  performing a backup first.
                </p>
                <div className="p-3 bg-[#ffdad6]/10 border-l-4 border-[#ba1a1a] rounded-r-lg">
                  <p className="text-[12px] tracking-[0.05em] font-semibold text-[#ba1a1a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    Destructive Action: Cannot be undone.
                  </p>
                </div>
              </div>
              <div className="md:w-2/3 w-full">
                <div
                  onClick={handleDropzoneClick}
                  onDragOver={(e) => handleDrag(e, true)}
                  onDragLeave={(e) => handleDrag(e, false)}
                  onDrop={handleDrop}
                  className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer group ${
                    dragActive ? "border-[#006194] bg-[#007bb9]/10" : "border-[#bfc7d2] bg-[#f7f9fb] hover:bg-[#f2f4f6]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    className="hidden"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <span className="material-symbols-outlined text-[48px] text-[#707881] group-hover:text-[#006194] transition-colors">
                    cloud_upload
                  </span>
                  <p className="mt-2 text-[16px] leading-[24px] font-medium text-[#191c1e]">
                    {fileName ? fileName : "Click or drag backup file here"}
                  </p>
                  <p className="text-[12px] tracking-[0.05em] font-semibold text-[#3f4850]">
                    Supports .ledger, .zip, .xlsx
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-auto w-full py-4 border-t border-[#bfc7d2] bg-white flex flex-col md:flex-row justify-between items-center px-8">
          <span className="text-[12px] text-[#3f4850]">
            © 2024 Efficient Ledger. All rights reserved.
          </span>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a className="text-[12px] text-[#3f4850] hover:underline transition-all" href="#">
              Privacy Policy
            </a>
            <a className="text-[12px] text-[#3f4850] hover:underline transition-all" href="#">
              Terms of Service
            </a>
            <a className="text-[12px] text-[#3f4850] hover:underline transition-all" href="#">
              Support
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

function AutoBackupSettings() {
  const [frequency, setFrequency] = useState("daily");
  const [emailOnFailure, setEmailOnFailure] = useState(true);

  return (
    <section className="md:col-span-5 bg-white rounded-xl card-shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="p-2 bg-[#007bb9]/10 text-[#006194] rounded-lg">
          <span className="material-symbols-outlined">schedule</span>
        </span>
        <h3 className="text-[20px] leading-[28px] font-semibold text-[#191c1e]">Auto-Backup</h3>
      </div>
      <div className="space-y-4">
        <div
          onClick={() => setFrequency("daily")}
          className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer group ${
            frequency === "daily" ? "border-[#006194]" : "border-[#bfc7d2] hover:border-[#006194]"
          }`}
        >
          <div className="flex flex-col">
            <span className="text-[16px] leading-[24px] font-semibold text-[#191c1e]">
              Daily Backup
            </span>
            <span className="text-[14px] leading-[20px] text-[#3f4850]">
              Every day at 02:00 AM
            </span>
          </div>
          <input
            checked={frequency === "daily"}
            onChange={() => setFrequency("daily")}
            className="w-5 h-5 text-[#006194] border-[#bfc7d2] focus:ring-[#006194]"
            name="freq"
            type="radio"
          />
        </div>
        <div
          onClick={() => setFrequency("weekly")}
          className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
            frequency === "weekly" ? "border-[#006194]" : "border-[#bfc7d2] hover:border-[#006194]"
          }`}
        >
          <div className="flex flex-col">
            <span className="text-[16px] leading-[24px] font-semibold text-[#191c1e]">
              Weekly Backup
            </span>
            <span className="text-[14px] leading-[20px] text-[#3f4850]">Sundays at 12:00 AM</span>
          </div>
          <input
            checked={frequency === "weekly"}
            onChange={() => setFrequency("weekly")}
            className="w-5 h-5 text-[#006194] border-[#bfc7d2] focus:ring-[#006194]"
            name="freq"
            type="radio"
          />
        </div>
        <div className="pt-4 flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              checked={emailOnFailure}
              onChange={() => setEmailOnFailure((v) => !v)}
              className="sr-only peer"
              type="checkbox"
            />
            <div
              className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all relative transition-colors"
              style={{ backgroundColor: emailOnFailure ? "#006194" : "#d8dadc" }}
            ></div>
            <span className="ml-3 text-[14px] leading-[20px] text-[#3f4850]">
              Email me on failure
            </span>
          </label>
        </div>
      </div>
    </section>
  );
}
