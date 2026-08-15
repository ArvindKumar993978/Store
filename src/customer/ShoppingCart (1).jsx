import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart, GST_RATE } from "../component/CartContext";

/*
  ShoppingCart
  ------------
  Reads items from the shared CartContext (same context StorefrontPage
  writes to with addToCart), so whatever was selected on the home page
  shows up here automatically — no more hardcoded initialItems.

  Icons use Google's Material Symbols font + Tailwind classes (no icon
  library import) to match the rest of the app.

  Close button (X) navigates back to the storefront ("/") instead of
  just hiding the sidebar, since this is a routed page. "Proceed to
  Billing" routes to /checkout. Change STOREFRONT_PATH below if your
  storefront route differs.
*/

const inr = (n) =>
  `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const TABS = [
  { key: "cart", label: "Current Cart", icon: "shopping_basket" },
  { key: "saved", label: "Saved", icon: "bookmark" },
  { key: "recent", label: "Recent", icon: "history" },
];

const STOREFRONT_PATH = "/"; // update if your storefront route differs

export default function ShoppingCart() {
  const navigate = useNavigate();
  const { items, updateQty, removeItem } = useCart();
  const [activeTab, setActiveTab] = useState("cart");
  const [visible, setVisible] = useState(false);

  // Slide-in on mount, mirrors the original entrance animation
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const goToStorefront = () => {
    setVisible(false);
    setTimeout(() => navigate("/storefront"), 300); // match the 300ms slide transition
  };

  const { subtotal, gst, total } = useMemo(() => {
    const sub = items.reduce((acc, it) => acc + it.price * it.qty, 0);
    const gstAmount = sub * GST_RATE;
    return { subtotal: sub, gst: gstAmount, total: sub + gstAmount };
  }, [items]);

  return (
    <div className="relative min-h-screen bg-[#f7f9fb] font-[Inter,sans-serif] overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={goToStorefront}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white z-[70] shadow-xl border-l border-[#bfc7d2] flex flex-col transform transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#bfc7d2] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#007bb9] flex items-center justify-center flex-shrink-0">
              <img
                className="w-full h-full object-cover"
                alt="Krishna Store logo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5jv2CQtwVBA8OOC0vhi4j-pj45I8aj3PNwUS1J3p8GTT_6RnQMV8xj5RPCWg8rkbFsUnrk-5kT_C91m9wCWWEHB10TNQ91PO4vp_gjETBoTyL__5C53SxgT2H6NI9MddQvNWvn46KDE7VhEVQBZii6g-QBCxtpEiiIjezQAG6irFuN2YmmBc7QckRY-PfI6QJnLo0MLC119y8anCUeCGHPN4260_FdFWDuZvzpcnhXbz27xoWeU5ujy2L_hnuinUGlc2lfxdVePaN"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#006194] leading-tight">
                Your Basket
              </h2>
              <p className="text-[10px] text-[#3f4850] uppercase tracking-wider font-semibold">
                Krishna Store
              </p>
            </div>
          </div>
          <button
            className="p-2 hover:bg-[#e6e8ea] rounded-full transition-colors active:scale-95"
            onClick={goToStorefront}
            aria-label="Close cart and return to storefront"
          >
            <span className="material-symbols-outlined text-[#3f4850] text-[20px]">close</span>
          </button>
        </div>

        {/* Tabs */}
        <nav className="flex px-6 py-4 gap-2 bg-[#f2f4f6] border-b border-[#bfc7d2]">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 px-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                  active
                    ? "bg-[#dae2fd] text-[#5c647a]"
                    : "text-[#3f4850] hover:bg-[#e6e8ea]"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={active ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}
                >
                  {tab.icon}
                </span>
                <span className="text-[10px] font-semibold tracking-wide">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Cart items */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {activeTab !== "cart" ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#3f4850] gap-2 py-16">
              <p className="font-semibold">Nothing here yet</p>
              <p className="text-sm opacity-70">
                Items you {activeTab === "saved" ? "save" : "recently viewed"} will show up in this tab.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#3f4850] gap-2 py-16">
              <p className="font-semibold">Your basket is empty</p>
              <p className="text-sm opacity-70 mb-4">Add products from the storefront to see them here.</p>
              <button
                onClick={goToStorefront}
                className="text-[#006194] font-semibold text-sm hover:underline"
              >
                Browse products
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center animate-in fade-in duration-300">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-[#bfc7d2] bg-[#f7f9fb]">
                  <img className="w-full h-full object-cover" alt={item.name} src={item.image} />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-[#191c1e] font-semibold truncate">{item.name}</h4>
                  {item.desc && (
                    <p className="text-xs text-[#707881] truncate">{item.desc}</p>
                  )}
                  <p className="text-[#006194] text-sm font-medium">{inr(item.price)}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center bg-[#e6e8ea] rounded-lg p-1">
                      <button
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                        onClick={() => updateQty(item.id, -1)}
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <span className="px-3 text-sm font-medium tabular-nums">{item.qty}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                        onClick={() => updateQty(item.id, 1)}
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-semibold text-[#191c1e] tabular-nums">
                    {inr(item.price * item.qty)}
                  </p>
                  <button
                    className="text-[#ba1a1a] mt-2 opacity-60 hover:opacity-100 transition-opacity"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout summary */}
        <div className="bg-[#eceef0] p-6 border-t border-[#bfc7d2] space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-[#3f4850]">
              <span>Subtotal</span>
              <span className="tabular-nums">{inr(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#3f4850]">
              <span className="flex items-center gap-1">
                GST <span className="text-[10px] bg-[#dae2fd] px-1 rounded">5%</span>
              </span>
              <span className="tabular-nums">{inr(gst)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#3f4850]">
              <span>Shipping</span>
              <span className="text-[#006947] font-medium">Free</span>
            </div>
          </div>
          <div className="pt-4 border-t border-[#bfc7d2] flex justify-between items-center">
            <span className="text-xl font-semibold text-[#191c1e]">Total Amount</span>
            <span className="text-3xl font-bold text-[#006194] tracking-tight tabular-nums">
              {inr(total)}
            </span>
          </div>
          <button
            disabled={items.length === 0}
            onClick={() => navigate("/checkout")}
            className="w-full bg-[#006194] text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-[#007bb9] transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Proceed to Billing</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
          <p className="text-center text-[10px] text-[#3f4850] opacity-70">
            Secure transaction by Efficient Ledger
          </p>
        </div>
      </aside>
    </div>
  );
}