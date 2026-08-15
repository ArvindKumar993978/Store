import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/*
  ExportModal
  -----------
  Popup that opens when the "Export" button on the Product page is
  clicked. Ported from the static HTML export mock into a React
  component, using the same color values as Product.jsx.

  Props:
    isOpen   -> boolean, controls visibility
    onClose  -> function, called when user closes / cancels the modal
*/

const ALL_COLUMNS = [
  { key: "sku", label: "SKU", defaultChecked: true },
  { key: "name", label: "Product Name", defaultChecked: true },
  { key: "category", label: "Category", defaultChecked: true },
  { key: "stock", label: "Stock Level", defaultChecked: true },
  { key: "cost", label: "Cost Price", defaultChecked: false },
  { key: "price", label: "Selling Price", defaultChecked: true },
];

export default function ExportModal({ isOpen, onClose }) {
  const [format, setFormat] = useState("excel");
  const navigate = useNavigate();

  const [columns, setColumns] = useState(
    ALL_COLUMNS.reduce((acc, col) => {
      acc[col.key] = col.defaultChecked;
      return acc;
    }, {})
  );

  // ---- Filters ----
  const [category, setCategory] = useState("All Categories");
  const [stockStatus, setStockStatus] = useState("Show All");
  const [priceRange, setPriceRange] = useState("Any Price");
  const [dateAdded, setDateAdded] = useState("Any Time");

  if (!isOpen) return null;

  const toggleColumn = (key) => {
    setColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAllColumns = () => {
    setColumns(
      ALL_COLUMNS.reduce((acc, col) => {
        acc[col.key] = true;
        return acc;
      }, {})
    );
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleGenerate = () => {
    // Hook up real export logic here (CSV/PDF/Excel generation, API call, etc.)
    console.log("Generating report", {
      format,
      columns,
      filters: { category, stockStatus, priceRange, dateAdded },
    });
    onClose();
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(11, 28, 48, 0.4)" }}
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#bfc7d2] flex justify-between items-center bg-[#ffffff]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#e5eeff] rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-[#006194]">file_download</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#006194]">Export Inventory</h2>
              <p className="text-sm text-[#3f4850]">
                Generate a downloadable report of your current stock levels.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#eff4ff] text-[#3f4850] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
          {/* 1. Format */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-[#006194] tracking-wider uppercase">
              1. Select Format
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "excel", icon: "table_chart", label: "Excel (.xlsx)" },
                { value: "pdf", icon: "picture_as_pdf", label: "PDF Report" },
                { value: "csv", icon: "csv", label: "CSV Data" },
              ].map((opt) => {
                const active = format === opt.value;
                return (
                  <label key={opt.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value={opt.value}
                      checked={active}
                      onChange={() => setFormat(opt.value)}
                      className="hidden"
                    />
                    <div
                      className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all ${
                        active
                          ? "border-[#006194] bg-[#cce5ff]"
                          : "border-[#bfc7d2] hover:bg-[#eff4ff]"
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[32px] mb-1"
                        style={{ color: active ? "#006194" : "#3f4850" }}
                      >
                        {opt.icon}
                      </span>
                      <span className="text-sm font-semibold">{opt.label}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* 2. Columns */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="text-xs font-bold text-[#006194] tracking-wider uppercase">
                2. Choose Data Columns
              </h3>
              <button
                onClick={selectAllColumns}
                className="text-sm font-semibold text-[#006194] hover:underline"
              >
                Select All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
              {ALL_COLUMNS.map((col) => (
                <label
                  key={col.key}
                  className="flex items-center gap-3 p-2 bg-[#eff4ff] rounded-lg border border-[#bfc7d2] cursor-pointer hover:bg-[#dce9ff] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={columns[col.key]}
                    onChange={() => toggleColumn(col.key)}
                    className="w-5 h-5 rounded border-[#bfc7d2] text-[#006194] focus:ring-[#006194]"
                  />
                  <span className="text-sm">{col.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* 3. Filters */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-[#006194] tracking-wider uppercase">
              3. Filter Dataset
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#3f4850]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 bg-[#eff4ff] border border-[#bfc7d2] rounded-lg focus:ring-2 focus:ring-[#006194] outline-none text-sm"
                >
                  <option>All Categories</option>
                  <option>Dairy</option>
                  <option>Snacks</option>
                  <option>Staples</option>
                  <option>Personal Care</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#3f4850]">Stock Status</label>
                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                  className="w-full p-3 bg-[#eff4ff] border border-[#bfc7d2] rounded-lg focus:ring-2 focus:ring-[#006194] outline-none text-sm"
                >
                  <option>Show All</option>
                  <option>In Stock Only</option>
                  <option>Low Stock Alerts</option>
                  <option>Out of Stock</option>
                </select>
              </div>

              {/* New filter: price range */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#3f4850]">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full p-3 bg-[#eff4ff] border border-[#bfc7d2] rounded-lg focus:ring-2 focus:ring-[#006194] outline-none text-sm"
                >
                  <option>Any Price</option>
                  <option>Under $5</option>
                  <option>$5 - $15</option>
                  <option>$15 - $30</option>
                  <option>Above $30</option>
                </select>
              </div>

              {/* New filter: date added */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#3f4850]">Date Added</label>
                <select
                  value={dateAdded}
                  onChange={(e) => setDateAdded(e.target.value)}
                  className="w-full p-3 bg-[#eff4ff] border border-[#bfc7d2] rounded-lg focus:ring-2 focus:ring-[#006194] outline-none text-sm"
                >
                  <option>Any Time</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>This Year</option>
                </select>
              </div>
            </div>
          </section>

          <div className="bg-[#cce5ff] p-4 rounded-xl flex items-start gap-4">
            <span className="material-symbols-outlined text-[#006194]">info</span>
            <p className="text-sm text-[#004b73]">
              Report generation might take a few moments for large datasets. You will receive a
              notification when it's ready for download.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#bfc7d2] bg-white flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-[#3f4850] font-semibold text-sm hover:bg-[#eff4ff] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            onClick={() => navigate("/export-progress")}
            className="px-8 py-2 bg-[#006194] text-white font-semibold text-sm rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-lg active:scale-95"
          >
            <span>Generate Report</span>
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
          </button>
        </div>
      </div>
    </div>
  );
}
