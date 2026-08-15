import React, { useMemo, useState } from "react";
import PurchaseOrderSidebar from "../component/PurchaseOrderSidebar (1)";
import Sidebar from "../component/Sidebar.jsx";

/*
  EASY-TO-EDIT VERSION
  --------------------
  Colors are kept EXACTLY as the original design (same hex values,
  just written as Tailwind arbitrary values instead of custom
  theme names), so nothing visually changes:

    #006194  -> primary
    #007bb9  -> primary-container
    #cce5ff  -> primary-fixed
    #004b73  -> on-primary-fixed-variant
    #565e74  -> secondary
    #dae2fd  -> secondary-container / secondary-fixed
    #5c647a  -> on-secondary-container
    #006947  -> tertiary
    #00855b  -> tertiary-container
    #ba1a1a  -> error
    #ffdad6  -> error-container
    #93000a  -> on-error-container
    #f7f9fb  -> surface / surface-bright
    #ffffff  -> surface-container-lowest / on-primary
    #f2f4f6  -> surface-container-low
    #eceef0  -> surface-container
    #e6e8ea  -> surface-container-high
    #e0e3e5  -> surface-container-highest
    #707881  -> outline
    #bfc7d2  -> outline-variant
    #191c1e  -> on-surface
    #3f4850  -> on-surface-variant

  NOTE: This page has no separate top navbar in the original design —
  only a sidebar plus a breadcrumb/title header inside the main
  content. Per your request the sidebar is its own component; the
  breadcrumb header stays here since it was never a standalone navbar.

  DATA:
  LINE_ITEMS below feeds the table. Quantity inputs are live state —
  Subtotal, Tax (GST 18%), and Total Payable all recalculate
  automatically as you change quantities or delete rows.
*/

const GST_RATE = 0.18;

const LINE_ITEMS = [
  {
    id: 1,
    name: "Logitech MX Master 3S",
    sku: "SKU: LOG-MX3-BLK",
    stockLabel: "Low (3)",
    stockStyle: { bg: "#ffdad6", text: "#93000a" },
    unitPrice: 7499.0,
    qty: 12,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6x5s3b_bAYS9srg1WW_osyi4OMAR0bOfiFZ_jBlM0kf_jFmSl5Agu2f2Zy3_iR0zP96k84dgYxvKjixxSO9Sm-gOvOjl-oLRHZ9EKYUaWoS5Na18gh6qdIcVIUin_5yyw2JYffGN5-CcnHN-KXf4fiAypmEq4Ub-nCqeOshqHxBW72fO7-eNd9VJNVVhwZ0cPPYvtgjlX3fluNITwv_OUAPtONZZH1VxaRJlzQmSJq44gBtjn3OFpbJ-dnEu2eCB5VjrK9W5tNe9s",
  },
  {
    id: 2,
    name: "Keychron K2 Mechanical",
    sku: "SKU: KEY-K2-RGB",
    stockLabel: "15",
    stockStyle: { bg: "#e0e3e5", text: "#3f4850" },
    unitPrice: 4250.0,
    qty: 8,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA8gEXujCqDLVtr5W2V375MhhaIHxK7MjsvDZBzY9TS9OBdILd0KZkizQgUByz7ewjSKLoYFXq2TDafHbap4xny8KDoPf7z_23FnuhY2dAYTXaw3HgoXMfvHh-oGNG98kQzNnv5k6ff9z8HuEScQOAil_noBeCLdtXdlDs8UWF0sLs1Q5eWjWuTS421WPeiQEANeNFHweGyKx7oE2DdYVXLn6Qjg9sEQhDvvjm9j1SlcEJ8D13mDQyoKbHAtgSYmDPV4RzVkjZw_ZA5",
  },
];

const SUPPLIER_OPTIONS = ["Select a supplier", "Global Electronics Ltd.", "Standard Stationery Hub", "Prime Textiles Inc."];

export default function PurchaseOrderPage() {
  const [items, setItems] = useState(LINE_ITEMS);
  const [shippingMethod, setShippingMethod] = useState("standard");

  const updateQty = (id, value) => {
    const qty = Math.max(0, Number(value) || 0);
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
    const tax = subtotal * GST_RATE;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [items]);

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .glass-card { background: rgba(255,255,255,0.8); backdrop-filter: blur(12px); border: 1px solid rgba(226,232,240,0.8); }
      `}</style>

      <Sidebar  />

      <main className="ml-[240px] min-h-screen p-6 bg-[#f7f9fb]">
        {/* Header & breadcrumbs */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#565e74] mb-2">
            <span>Product</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Purchase Orders</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#006194] font-bold">New PO</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-[32px] font-bold">Create Purchase Order</h2>
              <p className="text-base text-[#3f4850]">Restock inventory and manage supplier relationships.</p>
            </div>
            <div className="flex gap-2">
              <button className="px-6 py-2 border border-[#bfc7d2] text-[#565e74] rounded-lg font-medium hover:bg-[#e6e8ea] transition-all active:scale-95">
                Cancel
              </button>
              <button className="px-6 py-2 bg-[#006194] text-white rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-all active:scale-95">
                <span className="material-symbols-outlined text-[20px]">description</span>
                Generate PO
              </button>
            </div>
          </div>
        </header>

        {/* Form layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Supplier & logistics */}
          <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2]/30 flex flex-col gap-5">
              <div className="flex items-center gap-3 border-b border-[#bfc7d2] pb-4">
                <div className="w-10 h-10 rounded-lg bg-[#007bb9]/20 flex items-center justify-center text-[#006194]">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <h3 className="text-[20px] font-semibold">Logistics</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[#3f4850] mb-1 ml-1">Supplier Name</label>
                  <div className="relative">
                    <select className="w-full bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] outline-none appearance-none cursor-pointer">
                      {SUPPLIER_OPTIONS.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#707881]">
                      expand_more
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#3f4850] mb-1 ml-1">Expected Delivery Date</label>
                  <input
                    className="w-full bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] outline-none"
                    type="date"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#3f4850] mb-1 ml-1">Shipping Method</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShippingMethod("standard")}
                      className={
                        shippingMethod === "standard"
                          ? "flex-1 py-2 border-2 border-[#006194] bg-[#cce5ff] text-[#004b73] rounded-lg text-sm font-semibold"
                          : "flex-1 py-2 border border-[#bfc7d2] text-[#3f4850] rounded-lg text-sm hover:bg-[#e6e8ea] transition-all"
                      }
                    >
                      Standard
                    </button>
                    <button
                      onClick={() => setShippingMethod("express")}
                      className={
                        shippingMethod === "express"
                          ? "flex-1 py-2 border-2 border-[#006194] bg-[#cce5ff] text-[#004b73] rounded-lg text-sm font-semibold"
                          : "flex-1 py-2 border border-[#bfc7d2] text-[#3f4850] rounded-lg text-sm hover:bg-[#e6e8ea] transition-all"
                      }
                    >
                      Express
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Supplier quick info */}
            <div className="bg-[#006194]/5 p-6 rounded-xl border border-[#006194]/10 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  store
                </span>
              </div>
              <div className="relative z-10">
                <h4 className="text-xs font-bold text-[#006194] uppercase tracking-wider mb-2">Supplier Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#3f4850]">Last Order:</span>
                    <span className="font-medium">12 Oct 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3f4850]">Active POs:</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3f4850]">Rating:</span>
                    <span className="flex items-center text-[#006194]">
                      {[0, 1, 2, 3].map((i) => (
                        <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                      ))}
                      <span className="material-symbols-outlined text-[16px]">star_half</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Line items table */}
          <section className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-[#bfc7d2]/30 flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b border-[#bfc7d2] flex justify-between items-center bg-[#f7f9fb]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#00855b]/20 flex items-center justify-center text-[#006947]">
                    <span className="material-symbols-outlined">inventory</span>
                  </div>
                  <h3 className="text-[20px] font-semibold">Product Line Items</h3>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#dae2fd] text-[#5c647a] rounded-lg font-medium hover:bg-[#bec6e0] transition-all active:scale-95">
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  Add Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f2f4f6]">
                      <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider font-semibold border-b border-[#bfc7d2]">
                        Product Details
                      </th>
                      <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider font-semibold border-b border-[#bfc7d2] text-center">
                        In Stock
                      </th>
                      <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider font-semibold border-b border-[#bfc7d2] text-center">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider font-semibold border-b border-[#bfc7d2] text-right">
                        Unit Price
                      </th>
                      <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider font-semibold border-b border-[#bfc7d2] text-right">
                        Subtotal
                      </th>
                      <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider font-semibold border-b border-[#bfc7d2]" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#bfc7d2]">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-[#f2f4f6] transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-[#eceef0] flex-shrink-0">
                              <img className="w-full h-full object-cover rounded-lg" alt={item.name} src={item.image} />
                            </div>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-[#3f4850]">{item.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span
                            className="px-3 py-1 rounded-full text-[11px] font-bold"
                            style={{ backgroundColor: item.stockStyle.bg, color: item.stockStyle.text }}
                          >
                            {item.stockLabel}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <input
                            className="w-20 mx-auto block bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg px-2 py-1.5 text-center focus:ring-1 focus:ring-[#006194] outline-none"
                            type="number"
                            value={item.qty}
                            onChange={(e) => updateQty(item.id, e.target.value)}
                          />
                        </td>
                        <td className="px-6 py-5 text-right text-[#3f4850]">
                          \u20B9{item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-5 text-right font-bold">
                          \u20B9{(item.unitPrice * item.qty).toFixed(2)}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#707881] hover:text-[#ba1a1a] transition-colors p-1 rounded-md hover:bg-[#ffdad6]/20"
                          >
                            <span className="material-symbols-outlined">delete_outline</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* Empty state / add more row */}
                    <tr className="bg-white">
                      <td className="px-6 py-4" colSpan={6}>
                        <div className="border-2 border-dashed border-[#bfc7d2]/50 rounded-xl p-8 flex flex-col items-center justify-center text-[#3f4850] hover:border-[#006194]/50 hover:bg-[#006194]/5 transition-all cursor-pointer group">
                          <span className="material-symbols-outlined text-[40px] mb-2 group-hover:scale-110 duration-300">
                            search_insights
                          </span>
                          <p className="text-sm font-medium">Click to search and add more products to this order</p>
                          <p className="text-xs opacity-60">or drag and drop a CSV manifest</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary section */}
              <div className="mt-auto p-8 bg-[#f2f4f6]/50 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#bfc7d2]">
                <div>
                  <label className="block text-xs text-[#3f4850] mb-2 ml-1">Additional Notes</label>
                  <textarea
                    className="w-full bg-white border border-[#bfc7d2] rounded-xl p-4 h-24 focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] outline-none resize-none"
                    placeholder="Enter special delivery instructions or billing notes..."
                  />
                </div>
                <div className="flex flex-col gap-3 justify-end">
                  <div className="flex justify-between items-center">
                    <span className="text-[#3f4850]">Subtotal</span>
                    <span className="text-[20px]">\u20B9{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#3f4850]">Tax (GST {Math.round(GST_RATE * 100)}%)</span>
                    <span className="text-[20px]">\u20B9{totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#bfc7d2] pt-3 mt-1">
                    <span className="text-[20px] font-bold">Total Payable</span>
                    <span className="text-[32px] font-bold text-[#006194]">\u20B9{totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-8 w-full py-8 border-t border-[#bfc7d2] flex flex-col md:flex-row justify-between items-center text-sm text-[#565e74]">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <span className="text-[20px] text-[#006194] font-bold">Efficient Ledger</span>
            <span className="hidden md:block w-px h-4 bg-[#bfc7d2]" />
            <p>© 2024 Efficient Ledger. All rights reserved.</p>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a className="hover:text-[#006194] transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-[#006194] transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-[#006194] transition-colors" href="#">Contact Support</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
