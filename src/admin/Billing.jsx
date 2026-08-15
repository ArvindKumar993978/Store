import React, { useMemo, useState } from "react";
import Sidebar from "../component/Sidebar";
import PosTopNav from "../component/PosTopNav";

/*
  EASY-TO-EDIT VERSION
  --------------------
  Colors as Tailwind arbitrary values, e.g. text-[#006194].

  Quick color reference:
    #006194  -> primary (blue)
    #007bb9  -> primary-container (Grand Total card, "add qty" hover)
    #ba1a1a  -> error (red, Cancel Sale / remove qty hover)
    #86f2e4  -> secondary-container (Search button)
    #f8f9ff  -> page background
    #eff4ff  -> light surface
    #bfc7d2  -> border color

  This is a WORKING cart, not just a static mockup:
  - CART_SEED below is the starting cart — edit it to change the
    default items/prices/quantities
  - +/- buttons update quantity in real state; qty can't go below 1
    from the buttons (use "Clear Cart" to empty it)
  - Subtotal, CGST (9%), SGST (9%), and Grand Total are all computed
    live from the cart plus the discount field — change a quantity
    or the discount and every number updates automatically
  - GST_RATE controls both tax lines (9% + 9% = 18% total by default)
*/

const GST_RATE = 0.09; // each of CGST/SGST; total GST = 2 * GST_RATE

const CART_SEED = [
  { id: 1, name: "Maggi Noodles 70g", hsn: "19023010", stock: 142, price: 14.0, qty: 2 },
  { id: 2, name: "Tata Salt 1kg", hsn: "25010010", stock: 85, price: 25.0, qty: 1 },
];

export default function Billing() {
  const [cart, setCart] = useState(CART_SEED);
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState("Walk-in Customer");

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
    );
  };

  const clearCart = () => setCart([]);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discountedSubtotal = Math.max(0, subtotal - Number(discount || 0));
    const cgst = discountedSubtotal * GST_RATE;
    const sgst = discountedSubtotal * GST_RATE;
    const grandTotal = discountedSubtotal + cgst + sgst;
    return { subtotal, cgst, sgst, grandTotal };
  }, [cart, discount]);

  const totalItems = cart.length;
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <Sidebar />
      <PosTopNav />

      <main className="ml-60 flex gap-6 p-6">
        {/* Left: Cart area */}
        <section className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Search / scan bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#bfc7d2] flex items-center gap-4">
            <span className="material-symbols-outlined text-[#707881] text-3xl">barcode_scanner</span>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-[20px] font-medium placeholder:text-[#bfc7d2] outline-none"
              placeholder="Scan Barcode or Search Products (F1)..."
              type="text"
            />
            <div className="flex gap-2">
              <kbd className="px-2 py-1 bg-[#e5eeff] rounded-lg text-xs font-bold text-[#3f4850] border border-[#bfc7d2]">
                ALT+S
              </kbd>
              <button className="bg-[#86f2e4] text-[#006f66] px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">search</span>
                Search
              </button>
            </div>
          </div>

          {/* Items list */}
          <div className="flex-1 bg-white rounded-xl my-10 shadow-sm border border-[#bfc7d2] overflow-hidden flex flex-col">
            <div className="grid grid-cols-12 gap-4 p-4 bg-[#eff4ff] border-b border-[#bfc7d2] text-sm font-semibold text-[#3f4850]">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5 text-left">Item Description</div>
              <div className="col-span-2 text-center">Price (\u20B9)</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total (\u20B9)</div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide ">
              {cart.length === 0 && (
                <div className="p-8 text-center text-sm text-[#3f4850]">Cart is empty — scan or search to add items.</div>
              )}
              {cart.map((item, i) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-[#bfc7d2] items-center hover:bg-[#eff4ff] transition-colors"
                >
                  <div className="col-span-1 text-center text-[#3f4850]">{String(i + 1).padStart(2, "0")}</div>
                  <div className="col-span-5">
                    <div className="font-bold">{item.name}</div>
                    <div className="text-xs text-[#3f4850]">
                      HSN: {item.hsn} | Stock: {item.stock} units
                    </div>
                  </div>
                  <div className="col-span-2 text-center">{item.price.toFixed(2)}</div>
                  <div className="col-span-2 flex justify-center items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-8 h-8 rounded-lg border border-[#bfc7d2] flex items-center justify-center hover:bg-[#ffdad6] hover:text-[#93000a] transition-colors active:scale-90"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <span className="w-8 text-center font-bold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-8 h-8 rounded-lg border border-[#bfc7d2] flex items-center justify-center hover:bg-[#cce5ff] hover:text-[#004b73] transition-colors active:scale-90"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                  <div className="col-span-2 text-right font-bold">{(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Quick summary footer */}
            <div className="p-4 bg-[#eff4ff] flex justify-between items-center border-t border-[#bfc7d2]">
              <div className="flex gap-6">
                <div className="text-sm">
                  <span className="text-[#3f4850]">Total Items:</span> <span className="font-bold">{totalItems}</span>
                </div>
                <div className="text-sm">
                  <span className="text-[#3f4850]">Total Qty:</span> <span className="font-bold">{totalQty}</span>
                </div>
              </div>
              <button
                onClick={clearCart}
                className="text-[#ba1a1a] font-bold flex items-center gap-1 px-4 py-1 rounded-lg hover:bg-[#ffdad6] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
                Clear Cart
              </button>
            </div>
          </div>
        </section>

        {/* Right: Invoice summary panel */}
        <aside className="w-96 flex flex-col gap-6">
          {/* Customer card */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#bfc7d2]">
            <label className="block text-sm text-[#3f4850] mb-2 uppercase tracking-wider font-semibold">
              Customer Details
            </label>
            <div className="flex items-center border border-[#707881] rounded-lg px-4 py-2 bg-[#f8f9ff] hover:border-[#006194] transition-all cursor-pointer">
              <span className="material-symbols-outlined mr-2 text-[#006194]">person</span>
              <div className="flex-1">
                <div className="text-base font-bold">{customerName}</div>
                <div className="text-xs text-[#3f4850]">No Loyalty Points</div>
              </div>
              <span className="material-symbols-outlined">expand_more</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="flex-1 bg-[#dce9ff] py-2 rounded-lg text-xs font-bold text-[#006194] flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                New Customer
              </button>
              <button className="flex-1 bg-[#dce9ff] py-2 rounded-lg text-xs font-bold text-[#006194] flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[16px]">history</span>
                History
              </button>
            </div>
          </div>

          {/* Billing breakdown */}
          <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2] flex flex-col">
            <h3 className="text-[20px] font-semibold mb-6 flex justify-between items-center">
              Invoice Summary
              <span className="material-symbols-outlined text-[#707881]">description</span>
            </h3>

            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center text-base">
                <span className="text-[#3f4850]">Subtotal</span>
                <span className="font-medium">\u20B9{totals.subtotal.toFixed(2)}</span>
              </div>

              <div className="pt-4 border-t border-[#bfc7d2] space-y-2">
                <div className="flex justify-between items-center text-sm text-[#3f4850]">
                  <span>CGST ({Math.round(GST_RATE * 100)}%)</span>
                  <span>\u20B9{totals.cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-[#3f4850]">
                  <span>SGST ({Math.round(GST_RATE * 100)}%)</span>
                  <span>\u20B9{totals.sgst.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#bfc7d2]">
                <label className="block text-sm text-[#3f4850] mb-1 font-semibold">Discount Amount (\u20B9)</label>
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 border border-[#bfc7d2] rounded-lg px-2 py-1 text-right focus:border-[#006194] focus:ring-0 outline-none"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    min={0}
                  />
                  <button className="bg-[#dce9ff] p-2 rounded-lg text-[#006194] hover:bg-[#cce5ff] transition-all">
                    <span className="material-symbols-outlined">local_offer</span>
                  </button>
                </div>
              </div>

              <div className="mt-8 p-4 bg-[#007bb9] rounded-xl text-white flex flex-col gap-1 shadow-md">
                <span className="text-sm opacity-80 uppercase font-semibold">Grand Total</span>
                <div className="flex justify-between items-baseline">
                  <span className="text-[32px] font-extrabold tracking-tight">\u20B9{totals.grandTotal.toFixed(2)}</span>
                  <span className="text-sm font-medium opacity-80">Inclusive of Taxes</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 mt-6">
              <div className="grid grid-cols-2 gap-2">
                <button className="flex flex-col items-center justify-center p-4 border border-[#707881] rounded-xl hover:bg-[#e5eeff] transition-all active:scale-95">
                  <span className="material-symbols-outlined mb-1">qr_code_2</span>
                  <span className="font-bold text-xs uppercase">UPI</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 border border-[#707881] rounded-xl hover:bg-[#e5eeff] transition-all active:scale-95">
                  <span className="material-symbols-outlined mb-1">payments</span>
                  <span className="font-bold text-xs uppercase">Cash</span>
                </button>
              </div>
              <button className="w-full bg-[#006194] text-white py-4 rounded-xl text-[20px] font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-4">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
                Generate Invoice
              </button>
              <button
                onClick={clearCart}
                className="w-full border border-[#ba1a1a] text-[#ba1a1a] py-2 rounded-xl font-bold hover:bg-[#ffdad6] transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
                Cancel Sale
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* Hotkeys toast */}
      <div className="fixed bottom-6 left-[calc(50%+120px)] -translate-x-1/2 flex gap-4 bg-[#d3e4fe]/80 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-xl pointer-events-none">
        {[
          { key: "F1", label: "Search" },
          { key: "F2", label: "Focus Qty" },
          { key: "F8", label: "Payment" },
          { key: "F10", label: "Print" },
        ].map((hk) => (
          <div key={hk.key} className="flex items-center gap-1 text-[10px] font-bold text-[#3f4850]">
            <kbd className="bg-[#f8f9ff] px-1 py-0.5 rounded border border-[#bfc7d2]">{hk.key}</kbd> {hk.label}
          </div>
        ))}
      </div>
    </div>
  );
}
