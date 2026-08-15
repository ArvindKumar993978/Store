import React, { useRef, useState } from "react";
import Sidebar from "../component/Sidebar";
import AddproTopNav from "../component/AddproTopNav";

/*
  EASY-TO-EDIT VERSION
  --------------------
  Colors as Tailwind arbitrary values, e.g. text-[#006194].

  Quick color reference:
    #006194  -> primary (blue)
    #007bb9  -> primary-container (SKU scan icon, avatar bg)
    #006947  -> tertiary (green, "Financials" label, active pulse dot)
    #565e74  -> secondary (used in the tip banner icon)
    #dae2fd  -> secondary-container (tip banner background)
    #ba1a1a  -> error (red)
    #ffdad6  -> error-container (low stock notify chip)
    #f7f9fb  -> page background
    #f2f4f6  -> surface-container-low (inputs' resting bg on some elements)
    #eceef0  -> surface-container
    #e0e3e5  -> surface-container-highest (toggle off-state)
    #bfc7d2  -> border color
    #3f4850  -> secondary/gray text

  This page keeps a bit of React state:
  - CATEGORY options and GST options are plain arrays (easy to edit)
  - `active` (Product Status toggle) is real state so the switch works
  - Clicking "Upload Image" opens a real file picker (same as the
    original page's mock upload behavior)
*/

const CATEGORY_OPTIONS = ["Groceries", "Electronics", "Apparel", "Home Decor", "Beauty & Health"];
const GST_OPTIONS = ["GST 0% (Exempt)", "GST 5%", "GST 12%", "GST 18%", "GST 28%"];

const FOOTER_LINKS = ["Contact Info", "Shop Address", "Privacy Policy", "Support"];

export default function AddNewProductPage() {
  const fileInputRef = useRef(null);
  const [active, setActive] = useState(true);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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

      {/* hidden file input used by the "Upload Image" box */}
      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" />

      <main className="md:ml-[240px] p-8">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
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
                      Product Name
                    </label>
                    <input
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
                        className="w-full pl-4 pr-12 py-2.5 rounded-lg border border-[#bfc7d2] focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all text-sm outline-none"
                        placeholder="Scan or enter code"
                        type="text"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#007bb9] hover:bg-[#006194]/5 rounded-md transition-colors">
                        <span className="material-symbols-outlined">barcode_scanner</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#3f4850] block uppercase tracking-wider font-semibold">
                      Category
                    </label>
                    <select className="w-full px-4 py-2.5 rounded-lg border border-[#bfc7d2] focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all text-sm outline-none appearance-none">
                      <option disabled value="">
                        Select a category
                      </option>
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-full space-y-2">
                    <label className="text-xs text-[#3f4850] block uppercase tracking-wider font-semibold">
                      Description
                    </label>
                    <textarea
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
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-[#bfc7d2] focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all text-sm outline-none"
                        placeholder="0.00"
                        type="number"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#3f4850] block uppercase tracking-wider font-semibold">
                      Selling Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#3f4850]">₹</span>
                      <input
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-[#bfc7d2] focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all text-sm outline-none"
                        placeholder="0.00"
                        type="number"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#3f4850] block uppercase tracking-wider font-semibold">
                      Tax (GST)
                    </label>
                    <select
                      defaultValue="GST 18%"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#bfc7d2] focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all text-sm outline-none"
                    >
                      {GST_OPTIONS.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#3f4850] block uppercase tracking-wider font-semibold">
                      Initial Stock
                    </label>
                    <input
                      className="w-full px-4 py-2.5 rounded-lg border border-[#bfc7d2] focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all text-sm outline-none"
                      placeholder="0"
                      type="number"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs text-[#3f4850] block uppercase tracking-wider font-semibold">
                      Low Stock Alert threshold
                    </label>
                    <div className="flex gap-4">
                      <input
                        className="flex-1 px-4 py-2.5 rounded-lg border border-[#bfc7d2] focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all text-sm outline-none"
                        placeholder="e.g. 10"
                        type="number"
                      />
                      <div className="flex items-center gap-2 px-3 py-2 bg-[#ffdad6]/20 rounded-lg text-[#ba1a1a] text-xs font-bold">
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
                    className="aspect-square w-full rounded-xl border-2 border-dashed border-[#bfc7d2] bg-[#f2f4f6] flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:bg-[#eceef0] transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#cce5ff] flex items-center justify-center text-[#006194] mb-3 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                    </div>
                    <p className="text-xs uppercase tracking-tight font-semibold">Upload Image</p>
                    <p className="text-xs text-[#3f4850] mt-1">PNG, JPG up to 5MB</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="aspect-square bg-[#eceef0] rounded-lg opacity-40" />
                    <div className="aspect-square bg-[#eceef0] rounded-lg opacity-40" />
                    <div className="aspect-square bg-[#eceef0] rounded-lg opacity-40" />
                    <div
                      onClick={handleUploadClick}
                      className="aspect-square flex items-center justify-center rounded-lg border border-[#bfc7d2] text-[#3f4850] cursor-pointer hover:bg-[#f2f4f6] transition-colors"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </div>
                  </div>
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
                        style={{ transform: active ? "translateX(100%)" : "translateX(0)" }}
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
                <button className="w-full bg-[#006194] text-white font-semibold py-3.5 rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#006194]/20">
                  <span className="material-symbols-outlined">save</span>
                  Save Product
                </button>
                <button className="w-full bg-white text-[#3f4850] border border-[#bfc7d2] font-semibold py-3.5 rounded-lg hover:bg-[#f2f4f6] transition-all active:scale-[0.98]">
                  Cancel &amp; Discard
                </button>
              </div>
            </aside>
          </div>

          {/* Quick Tip banner */}
          <div className="mt-8 p-6 bg-[#dae2fd]/20 rounded-xl border border-[#dae2fd]/30 flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg custom-shadow text-[#565e74]">
              <span className="material-symbols-outlined">info</span>
            </div>
            <div>
              <h4 className="text-[20px] font-semibold mb-1">Quick Tip</h4>
              <p className="text-sm text-[#3f4850]">
                Adding accurate SKU numbers helps in fast billing via barcode scanners. You can also generate random
                SKUs if you don't have manufacturer barcodes.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="md:ml-[280px] bg-[#e6e8ea] border-t border-[#bfc7d2] py-8 px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-[20px] font-semibold">Efficient Ledger</h2>
            <p className="text-sm text-[#3f4850] mt-1">© 2024 Efficient Ledger Ecosystem. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {FOOTER_LINKS.map((link) => (
              <a key={link} className="text-sm text-[#3f4850] hover:text-[#006194] transition-colors" href="#">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
