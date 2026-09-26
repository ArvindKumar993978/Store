import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import { useStore } from "../context/StoreContext";

export default function BackupData() {
  const navigate = useNavigate();
  const { exportBackupJSON, importBackupJSON, products, sales, orders } = useStore();
  const [backupState, setBackupState] = useState("idle"); // idle | syncing | complete
  const [dragActive, setDragActive] = useState(false);
  const [fileInfo, setFileInfo] = useState(null); // { name, size, rawFile }
  const [exportFormat, setExportFormat] = useState("xlsx");
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleBackupNow = () => {
    if (backupState !== "idle") return;
    setBackupState("syncing");
    setTimeout(() => {
      exportBackupJSON();
      setBackupState("complete");
      showToast("Store backup exported and synchronized successfully!");
      setTimeout(() => {
        setBackupState("idle");
      }, 2000);
    }, 800);
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
    if (file) {
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        rawFile: file,
      });
      showToast(`Selected backup file: ${file.name}`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        rawFile: file,
      });
      showToast(`Selected backup file: ${file.name}`);
    }
  };

  const handleClearFile = (e) => {
    e.stopPropagation();
    setFileInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    showToast("File selection cleared.");
  };

  const handleExportDataset = (datasetName) => {
    let content, mimeType, fileExt;
    const dateStr = new Date().toISOString().slice(0, 10);

    if (exportFormat === "csv") {
      mimeType = "text/csv;charset=utf-8;";
      fileExt = "csv";
      if (datasetName === "Product Catalog") {
        const headers = ["ID", "Name", "SKU", "Category", "Price", "Stock", "Threshold"];
        const rows = products.map((p) => [p.id, `"${p.name}"`, `"${p.sku || ""}"`, `"${p.category || ""}"`, p.price, p.stock, p.lowStockThreshold || 10]);
        content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      } else if (datasetName === "Sales Records") {
        const headers = ["Invoice ID", "Date", "Customer", "Subtotal", "Discount", "Grand Total", "Status"];
        const rows = sales.map((s) => [s.id, `"${s.date}"`, `"${s.customer || ""}"`, s.subtotal || 0, s.discount || 0, s.grandTotal || 0, `"${s.status || "Paid"}"`]);
        content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      } else {
        const headers = ["Order ID", "Date", "Customer", "Total", "Status", "Payment Method"];
        const rows = orders.map((o) => [o.id, `"${o.date}"`, `"${o.customer || ""}"`, o.total || 0, `"${o.status || ""}"`, `"${o.paymentMethod || ""}"`]);
        content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      }
    } else if (exportFormat === "json") {
      mimeType = "application/json";
      fileExt = "json";
      const payload = datasetName === "Product Catalog" ? products : datasetName === "Sales Records" ? sales : orders;
      content = JSON.stringify(
        {
          dataset: datasetName,
          generatedDate: new Date().toISOString(),
          recordCount: payload.length,
          data: payload,
        },
        null,
        2
      );
    } else {
      fileExt = "tsv";
      mimeType = "text/tab-separated-values";
      const payload = datasetName === "Product Catalog" ? products : datasetName === "Sales Records" ? sales : orders;
      content = JSON.stringify(payload, null, 2);
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${datasetName.replace(/\s+/g, "_")}_Export_${dateStr}.${fileExt}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${datasetName} (${fileExt.toUpperCase()})`);
  };

  const handleConfirmRestore = () => {
    if (!fileInfo?.rawFile) {
      showToast("No file selected to restore!");
      setShowRestoreModal(false);
      return;
    }

    setRestoring(true);
    setRestoreProgress(25);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        setRestoreProgress(65);
        setTimeout(() => {
          const success = importBackupJSON(parsed);
          setRestoreProgress(100);
          setTimeout(() => {
            setRestoring(false);
            setShowRestoreModal(false);
            const restoredFileName = fileInfo?.name || "backup";
            setFileInfo(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            if (success) {
              showToast(`Database successfully restored from ${restoredFileName}!`);
            } else {
              showToast("Failed to restore: invalid backup structure.");
            }
          }, 500);
        }, 500);
      } catch (err) {
        setRestoring(false);
        setShowRestoreModal(false);
        showToast("Error parsing JSON backup file!");
      }
    };
    reader.readAsText(fileInfo.rawFile);
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

      {/* Live Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#001d31] text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-[#006194]/40 animate-fade-in">
          <span className="material-symbols-outlined text-[#8cd0ff] text-[20px]">info</span>
          <span className="text-[14px] font-medium">{toast}</span>
        </div>
      )}

      <Sidebar />

      {/* Main Content */}
      <main className="md:ml-[240px] flex-1 flex flex-col min-h-screen">
        {/* TopAppBar */}
        <header className="h-16 bg-[#f7f9fb] border-b border-[#bfc7d2] flex justify-between items-center px-6 sticky top-0 z-40">
          <h2 className="text-[20px] leading-[28px] font-bold text-[#006194]">
            Backup &amp; Data Portability
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/help")}
              title="Help Center"
              className="p-2 text-[#3f4850] hover:text-[#006194] transition-colors cursor-pointer rounded-lg hover:bg-[#e0e3e5]"
            >
              <span className="material-symbols-outlined">help</span>
            </button>
            <button
              onClick={() => navigate("/settings")}
              title="Settings"
              className="p-2 text-[#3f4850] hover:text-[#006194] transition-colors cursor-pointer rounded-lg hover:bg-[#e0e3e5]"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div
              onClick={() => navigate("/settings")}
              title="Profile & Account Settings"
              className="w-8 h-8 rounded-full bg-[#cce5ff] flex items-center justify-center border border-[#bfc7d2] overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#006194]"
            >
              <img
                className="w-full h-full object-cover"
                alt="Profile"
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
                  className={`w-full md:w-auto px-6 py-2.5 text-white rounded-lg text-[12px] tracking-[0.05em] font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95 cursor-pointer ${
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
            <AutoBackupSettings onNotify={showToast} />
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
                <select
                  value={exportFormat}
                  onChange={(e) => {
                    setExportFormat(e.target.value);
                    showToast(`Export format changed to .${e.target.value}`);
                  }}
                  className="bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg text-[12px] tracking-[0.05em] font-semibold px-3 py-1.5 focus:ring-[#006194] focus:border-[#006194] outline-none cursor-pointer"
                >
                  <option value="xlsx">Excel (.xlsx)</option>
                  <option value="csv">CSV (.csv)</option>
                  <option value="json">JSON (.json)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Export Card: Products */}
              <div className="group p-4 border border-[#bfc7d2] rounded-xl hover:bg-[#f2f4f6] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-[#007bb9]/10 text-[#006194] rounded-lg">
                      <span className="material-symbols-outlined">inventory_2</span>
                    </div>
                    <button
                      onClick={() => handleExportDataset("Product Catalog")}
                      title="Download Product Catalog"
                      className="text-[#006194] hover:bg-[#007bb9]/20 p-2 rounded-full transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined">file_download</span>
                    </button>
                  </div>
                  <h4 className="text-[16px] leading-[24px] font-bold text-[#191c1e]">
                    Product Catalog
                  </h4>
                  <p className="text-[14px] leading-[20px] text-[#3f4850] mt-1">
                    Stock levels, pricing, and supplier info.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#bfc7d2]/40">
                  <span className="text-[12px] tracking-[0.05em] font-semibold text-[#3f4850] italic">
                    1,240 Items
                  </span>
                  <button
                    onClick={() => handleExportDataset("Product Catalog")}
                    className="text-[12px] font-semibold text-[#006194] hover:underline cursor-pointer"
                  >
                    Download
                  </button>
                </div>
              </div>

              {/* Export Card: Sales */}
              <div className="group p-4 border border-[#bfc7d2] rounded-xl hover:bg-[#f2f4f6] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-[#00855b]/10 text-[#006947] rounded-lg">
                      <span className="material-symbols-outlined">analytics</span>
                    </div>
                    <button
                      onClick={() => handleExportDataset("Sales Records")}
                      title="Download Sales Records"
                      className="text-[#006947] hover:bg-[#00855b]/20 p-2 rounded-full transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined">file_download</span>
                    </button>
                  </div>
                  <h4 className="text-[16px] leading-[24px] font-bold text-[#191c1e]">
                    Sales Records
                  </h4>
                  <p className="text-[14px] leading-[20px] text-[#3f4850] mt-1">
                    Transaction history and tax reports.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#bfc7d2]/40">
                  <span className="text-[12px] tracking-[0.05em] font-semibold text-[#3f4850] italic">
                    8,500 Records
                  </span>
                  <button
                    onClick={() => handleExportDataset("Sales Records")}
                    className="text-[12px] font-semibold text-[#006947] hover:underline cursor-pointer"
                  >
                    Download
                  </button>
                </div>
              </div>

              {/* Export Card: Customers */}
              <div className="group p-4 border border-[#bfc7d2] rounded-xl hover:bg-[#f2f4f6] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-[#dae2fd]/20 text-[#565e74] rounded-lg">
                      <span className="material-symbols-outlined">group</span>
                    </div>
                    <button
                      onClick={() => handleExportDataset("Customer Data")}
                      title="Download Customer Data"
                      className="text-[#565e74] hover:bg-[#dae2fd]/40 p-2 rounded-full transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined">file_download</span>
                    </button>
                  </div>
                  <h4 className="text-[16px] leading-[24px] font-bold text-[#191c1e]">
                    Customer Data
                  </h4>
                  <p className="text-[14px] leading-[20px] text-[#3f4850] mt-1">
                    Profiles, loyalty points, and history.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#bfc7d2]/40">
                  <span className="text-[12px] tracking-[0.05em] font-semibold text-[#3f4850] italic">
                    450 Profiles
                  </span>
                  <button
                    onClick={() => handleExportDataset("Customer Data")}
                    className="text-[12px] font-semibold text-[#565e74] hover:underline cursor-pointer"
                  >
                    Download
                  </button>
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
                  className={`w-full min-h-[192px] p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer group ${
                    dragActive ? "border-[#006194] bg-[#007bb9]/10" : "border-[#bfc7d2] bg-[#f7f9fb] hover:bg-[#f2f4f6]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    className="hidden"
                    type="file"
                    accept=".ledger,.zip,.xlsx,.csv,.json"
                    onChange={handleFileChange}
                  />

                  {fileInfo ? (
                    <div className="w-full flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-[#006194]/10 text-[#006194] flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[28px]">description</span>
                      </div>
                      <p className="text-[16px] font-bold text-[#191c1e]">{fileInfo.name}</p>
                      <p className="text-[13px] text-[#3f4850] mt-0.5">Size: {fileInfo.size}</p>

                      <div className="mt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={handleClearFile}
                          className="px-4 py-1.5 text-[13px] font-medium border border-[#bfc7d2] rounded-lg hover:bg-white transition-colors"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowRestoreModal(true);
                          }}
                          className="px-5 py-1.5 text-[13px] font-semibold bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[16px]">restore</span>
                          Restore Database
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[48px] text-[#707881] group-hover:text-[#006194] transition-colors">
                        cloud_upload
                      </span>
                      <p className="mt-2 text-[16px] leading-[24px] font-medium text-[#191c1e]">
                        Click or drag backup file here
                      </p>
                      <p className="text-[12px] tracking-[0.05em] font-semibold text-[#3f4850]">
                        Supports .ledger, .zip, .xlsx, .csv, .json
                      </p>
                    </>
                  )}
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
            <button
              onClick={() => navigate("/help")}
              className="text-[12px] text-[#3f4850] hover:underline transition-all cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate("/help")}
              className="text-[12px] text-[#3f4850] hover:underline transition-all cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => navigate("/help")}
              className="text-[12px] text-[#3f4850] hover:underline transition-all cursor-pointer"
            >
              Support
            </button>
          </div>
        </footer>
      </main>

      {/* Restore Confirmation & Progress Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#bfc7d2]">
            {!restoring ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-full">
                    <span className="material-symbols-outlined text-[24px]">warning</span>
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-[#191c1e]">Confirm Database Restore</h3>
                    <p className="text-[13px] text-[#40474f]">This operation cannot be reversed.</p>
                  </div>
                </div>
                <p className="text-[14px] text-[#3f4850] mb-6">
                  Restoring from <strong className="text-[#191c1e]">{fileInfo?.name}</strong> will overwrite current products, sales, and customer tables with the backup archive data.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowRestoreModal(false)}
                    className="px-4 py-2 border border-[#bfc7d2] rounded-lg text-[14px] font-medium hover:bg-[#f2f4f6]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmRestore}
                    className="px-5 py-2 bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-lg text-[14px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">restore</span>
                    Confirm &amp; Restore
                  </button>
                </div>
              </>
            ) : (
              <div className="py-6 flex flex-col items-center text-center">
                <div className="relative w-16 h-16 mb-4">
                  <svg className="animate-spin w-full h-full text-[#006194]" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <h4 className="text-[18px] font-bold text-[#191c1e] mb-1">Restoring Database...</h4>
                <p className="text-[13px] text-[#40474f] mb-4">Please do not refresh or close the browser.</p>
                <div className="w-full bg-[#f2f4f6] h-2.5 rounded-full overflow-hidden border border-[#bfc7d2]/40">
                  <div
                    className="bg-[#006194] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${restoreProgress}%` }}
                  />
                </div>
                <span className="text-[12px] font-semibold text-[#006194] mt-2">{restoreProgress}%</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AutoBackupSettings({ onNotify }) {
  const [frequency, setFrequency] = useState("daily");
  const [emailOnFailure, setEmailOnFailure] = useState(true);

  const handleSave = () => {
    onNotify?.(`Auto-backup set to ${frequency} with failure alert ${emailOnFailure ? "enabled" : "disabled"}`);
  };

  return (
    <section className="md:col-span-5 bg-white rounded-xl card-shadow p-6 flex flex-col justify-between">
      <div>
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
              frequency === "daily" ? "border-[#006194] bg-[#007bb9]/5" : "border-[#bfc7d2] hover:border-[#006194]"
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
              className="w-5 h-5 text-[#006194] border-[#bfc7d2] focus:ring-[#006194] cursor-pointer"
              name="freq"
              type="radio"
            />
          </div>
          <div
            onClick={() => setFrequency("weekly")}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
              frequency === "weekly" ? "border-[#006194] bg-[#007bb9]/5" : "border-[#bfc7d2] hover:border-[#006194]"
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
              className="w-5 h-5 text-[#006194] border-[#bfc7d2] focus:ring-[#006194] cursor-pointer"
              name="freq"
              type="radio"
            />
          </div>
          <div className="pt-2 flex items-center gap-2">
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
      </div>
      <div className="mt-6 pt-4 border-t border-[#bfc7d2]/40">
        <button
          onClick={handleSave}
          className="w-full py-2 bg-[#004870] hover:bg-[#006194] text-white text-[13px] font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
        >
          Save Preferences
        </button>
      </div>
    </section>
  );
}
