import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import AddproTopNav from "../component/AddproTopNav";
import { useStore } from "../context/StoreContext";

const CATEGORY_OPTIONS = ["Groceries", "Dairy", "Snacks", "Staples", "Beauty & Health", "Electronics", "Apparel"];
const GST_OPTIONS = ["GST 0% (Exempt)", "GST 5%", "GST 12%", "GST 18%", "GST 28%"];

export default function AddNewProductPage() {
  const navigate = useNavigate();
  const { addProduct } = useStore();
  const fileInputRef = useRef(null);

  // Form states
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [description, setDescription] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [gst, setGst] = useState("GST 5%");
  const [initialStock, setInitialStock] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [active, setActive] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRandomSKU = () => {
    const prefix = category.slice(0, 2).toUpperCase();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    setSku(`${prefix}-${randomNum}`);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please provide a product name.");
      return;
    }
    if (!sellingPrice) {
      alert("Please provide a selling price.");
      return;
    }

    addProduct({
      name,
      sku: sku || undefined,
      category,
      description,
      purchasePrice,
      sellingPrice,
      gst,
      initialStock: initialStock || "0",
      lowStockThreshold: lowStockThreshold || "10",
      imagePreview
    });

    setSavedSuccess(true);
    setTimeout(() => {
      navigate("/product");
    }, 900);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
        .custom-shadow { box-shadow: 0px 1px 3px rgba(0,0,0,0.05), 0px 1px 2px rgba(0,0,0,0.03); }
      `}</style>

      <Sidebar />
      <AddproTopNav />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      <main className="md:ml-[240px] p-8">
        <div className="max-w-[1100px] mx-auto">
          {savedSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl flex items-center gap-3 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-emerald-600">check_circle</span>
              <span className="font-semibold text-sm">Product added successfully! Redirecting to inventory...</span>
            </div>
          )}

          <form onSubmit={handleSaveProduct} className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Column: Primary Details */}
            <div className="flex-1 space-y-8 w-full">
              {/* Basic Information */}
              <section className="bg-white p-6 rounded-lg custom-shadow space-y-6">
                <div className="flex items-center justify-between border-b border-[#bfc7d2] pb-4">
                  <h3 className="text-[20px] font-semibold">Product Details</h3>
                  <span className="text-xs text-[#006194] uppercase tracking-widest font-semibold">Core Data</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-full space-y-2">
                    <label className="text-xs text-[#3f4850] block uppercase tracking-wider font-semibold">
                      Product Name *
                    </label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#bfc7d2] focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all text-sm outline-none"
                      placeholder="e.g. Premium Basmati Rice"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#3f4850] block uppercase tracking-wider font-semibold">
                      SKU / Barcode
                    </label>
                    <div className="relative">
                      <input
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="w-full pl-4 pr-12 py-2.5 rounded-lg border border-[#bfc7d2] focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all text-sm outline-none"
                        placeholder="Scan or enter code"
                        type="text"
                      />
                      <button
                        type="button"
                        onClick={generateRandomSKU}
                        title="Generate SKU"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#007bb9] hover:bg-[#006194]/10 rounded-md transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">barcode_scanner</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#3f4850] block uppercase tracking-wider font-semibold">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#bfc7d2] focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all text-sm outline-none"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-full space-y-2">
                    <label className="text-xs text-[#3f4850] block uppercase tracking-wider font-semibold">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#bfc7d2] focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all text-sm outline-none resize-none"
                      placeholder="Briefly describe the product's features and specifications..."
                      rows={4}
                    />
                  </div>
                </div>
              </section>

              {/* Inventory & Pricing */}
              <section className="bg-white p-6 rounded-lg custom-shadow space-y-6">
                <div className="flex items-center justify-between border-b border-[#bfc7d2] pb-4">
                  <h3 className="text-[20px] font-semibold">Inventory &amp; Pricing</h3>
                  <span className="text-xs text-[#006947] uppercase tracking-widest font-semibold">Financials</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs text-[#3f4850] block uppercase tracking-wider font-semibold">
                      Purchase Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#3f4850]">₹</span>
                      <input
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(e.target.value)}
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-[#bfc7d2] focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all text-sm outline-none"
                        placeholder="0.00"
                        type="number"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#3f4850] block uppercase tracking-wider font-semibold">
                      Selling Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#3f4850]">₹</span>
                      <input
                        required
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value)}
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-[#bfc7d2] focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all text-sm outline-none"
                        placeholder="0.00"
                        type="number"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#3f4850] block uppercase tracking-wider font-semibold">
                      Tax (GST)
                    </label>
                    <select
                      value={gst}
                      onChange={(e) => setGst(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#bfc7d2] focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all text-sm outline-none"
                    >
                      {GST_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#3f4850] block uppercase tracking-wider font-semibold">
                      Initial Stock
                    </label>
                    <input
                      value={initialStock}
                      onChange={(e) => setInitialStock(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#bfc7d2] focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all text-sm outline-none"
                      placeholder="0"
                      type="number"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs text-[#3f4850] block uppercase tracking-wider font-semibold">
                      Low Stock Alert Threshold
                    </label>
                    <div className="flex gap-4">
                      <input
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-[#bfc7d2] focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all text-sm outline-none"
                        placeholder="e.g. 10"
                        type="number"
                        min="0"
                      />
                      <div className="flex items-center gap-2 px-3 py-2 bg-[#ffdad6]/40 rounded-lg text-[#ba1a1a] text-xs font-bold">
                        <span className="material-symbols-outlined text-lg">warning</span>
                        <span>Notify Me</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Media & Status */}
            <aside className="w-full lg:w-[320px] space-y-8">
              {/* Media */}
              <section className="bg-white p-6 rounded-lg custom-shadow space-y-4">
                <div className="flex items-center justify-between border-b border-[#bfc7d2] pb-4">
                  <h3 className="text-[20px] font-semibold">Media</h3>
                </div>
                <div className="space-y-4">
                  <div
                    onClick={handleUploadClick}
                    className="aspect-square w-full rounded-xl border-2 border-dashed border-[#bfc7d2] bg-[#f2f4f6] flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-[#eceef0] transition-colors group relative overflow-hidden"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-[#cce5ff] flex items-center justify-center text-[#006194] mb-3 group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                        </div>
                        <p className="text-xs uppercase tracking-tight font-semibold">Upload Image</p>
                        <p className="text-xs text-[#3f4850] mt-1">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </div>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="text-xs text-red-600 hover:underline block text-center w-full"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </section>

              {/* Visibility */}
              <section className="bg-white p-6 rounded-lg custom-shadow space-y-6">
                <div className="flex items-center justify-between border-b border-[#bfc7d2] pb-4">
                  <h3 className="text-[20px] font-semibold">Visibility</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-sm">Product Status</p>
                    <p className="text-xs text-[#3f4850]">Live in storefront?</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActive((a) => !a)}
                    className="relative inline-flex items-center cursor-pointer"
                    aria-label="Toggle product status"
                  >
                    <div
                      className="w-12 h-6 rounded-full transition-colors relative"
                      style={{ backgroundColor: active ? "#006194" : "#e0e3e5" }}
                    >
                      <div
                        className="absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-all"
                        style={{ transform: active ? "translateX(24px)" : "translateX(0)" }}
                      />
                    </div>
                  </button>
                </div>
                {active && (
                  <div className="flex items-center gap-3 p-3 bg-[#00855b]/10 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-[#006947] animate-pulse" />
                    <span className="text-xs text-[#006947] uppercase font-semibold">Currently Active</span>
                  </div>
                )}
              </section>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#006194] text-white font-semibold py-3.5 rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#006194]/20 hover:bg-[#007bb9] cursor-pointer"
                >
                  <span className="material-symbols-outlined">save</span>
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/product")}
                  className="w-full bg-white text-[#3f4850] border border-[#bfc7d2] font-semibold py-3.5 rounded-lg hover:bg-[#f2f4f6] transition-all active:scale-[0.98] cursor-pointer"
                >
                  Cancel &amp; Discard
                </button>
              </div>
            </aside>
          </form>

          {/* Quick Tip banner */}
          <div className="mt-8 p-6 bg-[#dae2fd]/20 rounded-xl border border-[#dae2fd]/30 flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg custom-shadow text-[#565e74]">
              <span className="material-symbols-outlined">info</span>
            </div>
            <div>
              <h4 className="text-[20px] font-semibold mb-1">Quick Tip</h4>
              <p className="text-sm text-[#3f4850]">
                Adding accurate SKU numbers helps in fast billing via barcode scanners. Click the barcode icon next to SKU to automatically generate a unique store SKU.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="md:ml-[240px] bg-[#e6e8ea] border-t border-[#bfc7d2] py-8 px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-[1100px] mx-auto">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-[20px] font-semibold text-[#006194]">Efficient Ledger</h2>
            <p className="text-sm text-[#3f4850] mt-1">© 2024 Efficient Ledger Ecosystem. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => alert("Contact: support@efficientledger.com\nPhone: +91 98765 43210")}
              className="text-sm text-[#3f4850] hover:text-[#006194] transition-colors cursor-pointer"
            >
              Contact Info
            </button>
            <button
              onClick={() => alert("Shop Address: Sector 62, Noida, Uttar Pradesh, India - 201309")}
              className="text-sm text-[#3f4850] hover:text-[#006194] transition-colors cursor-pointer"
            >
              Shop Address
            </button>
            <button
              onClick={() => alert("Privacy Policy: Enterprise-grade security for your store data.")}
              className="text-sm text-[#3f4850] hover:text-[#006194] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate("/help")}
              className="text-sm text-[#3f4850] hover:text-[#006194] transition-colors cursor-pointer"
            >
              Support
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
