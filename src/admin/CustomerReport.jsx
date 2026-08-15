import React, { useState } from "react";
import Sidebar from "../component/Sidebar";


/*
  EASY-TO-EDIT VERSION
  --------------------
  Colors as Tailwind arbitrary values, e.g. text-[#006194].

  DATA:
  - LOYALTY_TIERS: checkbox filter list (edit `checked` for defaults)
  - DATA_POINTS: toggle switch list
  - CUSTOMERS: rows shown in the report preview table
  - RECENT_REPORTS: floating "Recent Reports" widget items

  Toggling a loyalty-tier checkbox or a data-point switch briefly
  fades the preview table (same "live refresh" flicker as the
  original page's script). Clicking either export button shows a
  real "Preparing... -> Ready!" sequence before resetting, same
  timing as the original.
*/

const LOYALTY_TIERS = [
  { key: "platinum", label: "Platinum", icon: "workspace_premium", swatch: "#E5E4E2", checked: true },
  { key: "gold", label: "Gold", icon: "military_tech", swatch: "#FFD700", checked: true },
  { key: "regular", label: "Regular", icon: "person", swatch: "#C0C0C0", checked: false },
];

const DATA_POINTS = [
  { key: "totalSpent", label: "Total Spent", checked: true },
  { key: "lastOrder", label: "Last Order Date", checked: true },
  { key: "outstanding", label: "Outstanding Balance", checked: true },
  { key: "segment", label: "Customer Segment", checked: false },
];

const QUICK_PRESETS = ["Last Qtr", "Last Month", "Year to Date"];

const TIER_BADGE = {
  Platinum: { bg: "#dae2fd", text: "#5c647a" },
  Gold: { bg: "#cce5ff", text: "#004b73" },
  Regular: { bg: "#e0e3e5", text: "#3f4850" },
};

const STATUS_BADGE = {
  Active: "bg-emerald-100 text-emerald-800",
  Idle: "bg-orange-100 text-orange-800",
  Blocked: "bg-[#ffdad6] text-[#93000a]",
};

const CUSTOMERS = [
  { name: "Amitav G.", id: "#CUS-9021", tier: "Platinum", lastOrder: "24 Oct 2023", spent: "\u20B9 84,200.00", outstanding: "\u20B9 0.00", status: "Active" },
  { name: "Priya Sharma", id: "#CUS-4432", tier: "Gold", lastOrder: "12 Nov 2023", spent: "\u20B9 32,500.00", outstanding: "\u20B9 4,200.00", outstandingHighlight: true, status: "Active" },
  { name: "Rahul Mehta", id: "#CUS-7781", tier: "Regular", lastOrder: "05 Sep 2023", spent: "\u20B9 12,000.00", outstanding: "\u20B9 0.00", status: "Idle" },
  { name: "Vikram Singh", id: "#CUS-1209", tier: "Platinum", lastOrder: "19 Dec 2023", spent: "\u20B9 145,900.00", outstanding: "\u20B9 0.00", status: "Active" },
  { name: "Sneha Kapoor", id: "#CUS-5541", tier: "Gold", lastOrder: "02 Dec 2023", spent: "\u20B9 28,400.00", outstanding: "\u20B9 12,000.00", outstandingHighlight: true, status: "Blocked" },
  { name: "Deepak Iyer", id: "#CUS-3321", tier: "Regular", lastOrder: "15 Nov 2023", spent: "\u20B9 8,900.00", outstanding: "\u20B9 0.00", status: "Active" },
];

const RECENT_REPORTS = [
  { icon: "file_download", iconBg: "#ffdcc0", iconColor: "#2d1600", name: "Yearly_Revenue_2023.xlsx", meta: "2 mins ago \u2022 12MB" },
  { icon: "picture_as_pdf", iconBg: "#dae2fd", iconColor: "#131b2e", name: "Tax_Audit_Segment.pdf", meta: "1 hour ago \u2022 4.5MB", faded: true },
];

export default function CustomerReport() {
  const [tiers, setTiers] = useState(LOYALTY_TIERS);
  const [dataPoints, setDataPoints] = useState(DATA_POINTS);
  const [tableFading, setTableFading] = useState(false);
  const [exportState, setExportState] = useState({ pdf: "idle", excel: "idle" }); // idle | preparing | ready

  const flashTable = () => {
    setTableFading(true);
    setTimeout(() => setTableFading(false), 400);
  };

  const toggleTier = (key) => {
    setTiers((prev) => prev.map((t) => (t.key === key ? { ...t, checked: !t.checked } : t)));
    flashTable();
  };

  const toggleDataPoint = (key) => {
    setDataPoints((prev) => prev.map((d) => (d.key === key ? { ...d, checked: !d.checked } : d)));
    flashTable();
  };

  const handleExport = (type) => {
    setExportState((prev) => ({ ...prev, [type]: "preparing" }));
    setTimeout(() => {
      setExportState((prev) => ({ ...prev, [type]: "ready" }));
      setTimeout(() => {
        setExportState((prev) => ({ ...prev, [type]: "idle" }));
      }, 2000);
    }, 1500);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #bfc7d2; border-radius: 10px; }
      `}</style>

      <Sidebar />

      <main className="flex-1 ml-[280px] p-6 relative">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <nav className="flex items-center gap-2 text-[#3f4850] text-xs font-semibold mb-2">
              <span>Customers</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-[#006194]">Bulk Reports</span>
            </nav>
            <h2 className="text-[32px] font-bold">Bulk Customer Reports</h2>
            <p className="text-[#3f4850] text-sm">Configure and export detailed segments for marketing and accounting.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport("pdf")}
              disabled={exportState.pdf !== "idle"}
              className="bg-[#e0e3e5] px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm disabled:opacity-70"
            >
              {exportState.pdf === "preparing" ? (
                <>
                  <span className="material-symbols-outlined animate-spin">autorenew</span>
                  Preparing...
                </>
              ) : exportState.pdf === "ready" ? (
                <>
                  <span className="material-symbols-outlined">check_circle</span>
                  Ready!
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">description</span>
                  Export to PDF
                </>
              )}
            </button>
            <button
              onClick={() => handleExport("excel")}
              disabled={exportState.excel !== "idle"}
              className="bg-[#006194] text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm disabled:opacity-70"
            >
              {exportState.excel === "preparing" ? (
                <>
                  <span className="material-symbols-outlined animate-spin">autorenew</span>
                  Preparing...
                </>
              ) : exportState.excel === "ready" ? (
                <>
                  <span className="material-symbols-outlined">check_circle</span>
                  Ready!
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">table_chart</span>
                  Export to Excel
                </>
              )}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Filter configuration panel */}
          <section className="lg:col-span-4 flex flex-col gap-6">
            {/* Loyalty tiers */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2]/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[#006194]">military_tech</span>
                <h3 className="text-[20px] font-semibold">Loyalty Tiers</h3>
              </div>
              <div className="space-y-3">
                {tiers.map((tier) => (
                  <label
                    key={tier.key}
                    className="flex items-center justify-between p-3 rounded-lg border border-[#bfc7d2] hover:bg-[#f2f4f6] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: tier.swatch }}
                      >
                        <span className="material-symbols-outlined text-[18px]">{tier.icon}</span>
                      </div>
                      <span className="text-sm font-medium">{tier.label}</span>
                    </div>
                    <input
                      className="w-5 h-5 rounded border-[#707881] text-[#006194] focus:ring-[#006194]"
                      type="checkbox"
                      checked={tier.checked}
                      onChange={() => toggleTier(tier.key)}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Date ranges */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2]/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[#006194]">calendar_month</span>
                <h3 className="text-[20px] font-semibold">Date Ranges</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#3f4850] block mb-1">Activity From</label>
                  <input
                    className="w-full rounded-lg border-[#bfc7d2] focus:border-[#006194] focus:ring-[#006194] text-sm"
                    type="date"
                    defaultValue="2023-01-01"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#3f4850] block mb-1">Activity To</label>
                  <input
                    className="w-full rounded-lg border-[#bfc7d2] focus:border-[#006194] focus:ring-[#006194] text-sm"
                    type="date"
                    defaultValue="2023-12-31"
                  />
                </div>
                <div className="pt-2">
                  <p className="text-xs text-[#006194] mb-2 font-semibold">Preset Quick Filters</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PRESETS.map((preset, i) => (
                      <button
                        key={preset}
                        onClick={flashTable}
                        className={
                          i === 0
                            ? "px-3 py-1 rounded-full border border-[#006194] text-[#006194] text-xs font-semibold hover:bg-[#cce5ff] transition-colors"
                            : "px-3 py-1 rounded-full border border-[#bfc7d2] text-[#3f4850] text-xs font-semibold hover:bg-[#f2f4f6] transition-colors"
                        }
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Data field toggles */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2]/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[#006194]">list_alt</span>
                <h3 className="text-[20px] font-semibold">Included Data Points</h3>
              </div>
              <div className="space-y-3">
                {dataPoints.map((dp) => (
                  <div key={dp.key} className="flex items-center justify-between">
                    <span className="text-sm">{dp.label}</span>
                    <button
                      onClick={() => toggleDataPoint(dp.key)}
                      className="relative inline-flex items-center cursor-pointer"
                      aria-label={`Toggle ${dp.label}`}
                    >
                      <div
                        className="w-11 h-6 rounded-full transition-colors relative"
                        style={{ backgroundColor: dp.checked ? "#006194" : "#e0e3e5" }}
                      >
                        <div
                          className="absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-all"
                          style={{ transform: dp.checked ? "translateX(100%)" : "translateX(0)" }}
                        />
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Preview table */}
          <section className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-[#bfc7d2]/30 flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b border-[#bfc7d2]/30 flex items-center justify-between">
                <div>
                  <h3 className="text-[20px] font-semibold">Report Preview</h3>
                  <p className="text-[#3f4850] text-xs">Showing top 50 matches based on current filters</p>
                </div>
                <span className="px-3 py-1 bg-[#00855b] text-white rounded-full text-xs font-semibold">
                  Live Sync Active
                </span>
              </div>

              <div className="flex-1 overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f2f4f6] text-xs text-[#3f4850]">
                      <th className="p-4 font-semibold">Customer Name</th>
                      <th className="p-4 font-semibold">Tier</th>
                      <th className="p-4 font-semibold">Last Order</th>
                      <th className="p-4 font-semibold">Total Spent</th>
                      <th className="p-4 font-semibold">Outstanding</th>
                      <th className="p-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody
                    className="text-sm divide-y divide-[#bfc7d2]/20 transition-opacity duration-200"
                    style={{ opacity: tableFading ? 0.4 : 1 }}
                  >
                    {CUSTOMERS.map((c) => (
                      <tr key={c.id} className="hover:bg-[#f7f9fb] transition-colors">
                        <td className="p-4">
                          <div className="font-semibold">{c.name}</div>
                          <div className="text-[12px] text-[#3f4850]">{c.id}</div>
                        </td>
                        <td className="p-4">
                          <span
                            className="px-2 py-1 rounded-lg text-xs font-semibold"
                            style={{ backgroundColor: TIER_BADGE[c.tier].bg, color: TIER_BADGE[c.tier].text }}
                          >
                            {c.tier}
                          </span>
                        </td>
                        <td className="p-4">{c.lastOrder}</td>
                        <td className="p-4">{c.spent}</td>
                        <td className={`p-4 ${c.outstandingHighlight ? "text-[#ba1a1a]" : ""}`}>{c.outstanding}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[c.status]}`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-[#f2f4f6] border-t border-[#bfc7d2]/30 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[#3f4850] text-xs">
                  <span>
                    Total Rows: <strong>1,248</strong>
                  </span>
                  <span>
                    Filtered: <strong>412</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded hover:bg-[#e0e3e5] transition-colors">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <span className="text-xs">Page 1 of 9</span>
                  <button className="p-2 rounded hover:bg-[#e0e3e5] transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Floating recent reports widget */}
        <div className="fixed bottom-6 right-6 w-80 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#bfc7d2]/50 hidden xl:block">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold">Recent Reports</h4>
            <span className="material-symbols-outlined text-[#006194] text-[20px]">history</span>
          </div>
          <div className="space-y-3">
            {RECENT_REPORTS.map((report) => (
              <div
                key={report.name}
                className={`flex items-start gap-3 p-2 rounded-lg hover:bg-[#f2f4f6] transition-colors cursor-pointer ${report.faded ? "opacity-70" : ""}`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: report.iconBg, color: report.iconColor }}
                >
                  <span className="material-symbols-outlined text-[18px]">{report.icon}</span>
                </div>
                <div>
                  <p className="text-sm leading-tight">{report.name}</p>
                  <p className="text-[10px] text-[#3f4850]">{report.meta}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2 text-center text-[#006194] text-xs font-semibold border-t border-[#bfc7d2]/30 pt-3">
            View All Downloads
          </button>
        </div>
      </main>
    </div>
  );
}
