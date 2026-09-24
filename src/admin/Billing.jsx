import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import PosTopNav from "../component/PosTopNav";

/*
  POS Billing Terminal
  --------------------
  Fully functional Point of Sale system:
  - Barcode search & item addition
  - Dynamic live recalculation of quantities, discounts, CGST, SGST, Grand Total
  - Payment method toggle (UPI / Cash)
  - New Customer creation modal
  - View sales history navigation
  - Generate & Print Invoice modal with printable receipt
*/

const GST_RATE = 0.09; // 9% CGST + 9% SGST = 18% total

const INVENTORY_CATALOG = [
  { id: 1, name: "Maggi Noodles 70g", hsn: "19023010", stock: 142, price: 14.0 },
  { id: 2, name: "Tata Salt 1kg", hsn: "25010010", stock: 85, price: 25.0 },
  { id: 3, name: "Whole Milk - 1L", hsn: "04012000", stock: 12, price: 45.0 },
  { id: 4, name: "Honey Loops Cereal", hsn: "19041090", stock: 148, price: 185.0 },
  { id: 5, name: "Premium Basmati Rice 5kg", hsn: "10063020", stock: 52, price: 450.0 },
  { id: 6, name: "Fortune Sunflower Oil 1L", hsn: "15121910", stock: 35, price: 195.0 },
  { id: 7, name: "Amul Butter 500g", hsn: "04051000", stock: 20, price: 275.0 },
];

const INITIAL_CART = [
  { id: 1, name: "Maggi Noodles 70g", hsn: "19023010", stock: 142, price: 14.0, qty: 2 },
  { id: 2, name: "Tata Salt 1kg", hsn: "25010010", stock: 85, price: 25.0, qty: 1 },
];

export default function Billing() {
  const navigate = useNavigate();

  // Cart & checkout state
  const [cart, setCart] = useState(INITIAL_CART);
  const [discount, setDiscount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [customer, setCustomer] = useState({ name: "Walk-in Customer", phone: "", points: 0 });
  const [paymentMode, setPaymentMode] = useState("UPI"); // "UPI" | "CASH"

  // Modals state
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({ name: "", phone: "" });
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  // Search and add item to cart
  const handleAddItem = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    const term = searchQuery.trim().toLowerCase();
    const found = INVENTORY_CATALOG.find(
      (it) => it.name.toLowerCase().includes(term) || it.hsn.includes(term)
    );

    if (found) {
      setCart((prev) => {
        const existing = prev.find((it) => it.id === found.id);
        if (existing) {
          return prev.map((it) => (it.id === found.id ? { ...it, qty: it.qty + 1 } : it));
        }
        return [...prev, { ...found, qty: 1 }];
      });
      setSearchQuery("");
    } else {
      alert(`No product found for "${searchQuery}". Try "Milk", "Rice", "Amul", "Oil", or "Salt".`);
    }
  };

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

  // Customer submit
  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (newCustomerForm.name.trim()) {
      setCustomer({
        name: newCustomerForm.name.trim(),
        phone: newCustomerForm.phone.trim() || "N/A",
        points: 50,
      });
      setShowCustomerModal(false);
      setNewCustomerForm({ name: "", phone: "" });
    }
  };

  // Generate invoice
  const handleGenerateInvoice = () => {
    if (cart.length === 0) {
      alert("Cart is empty! Scan or add items to generate an invoice.");
      return;
    }
    const invId = `INV-${Math.floor(10000 + Math.random() * 90000)}`;
    const newInvoice = {
      id: invId,
      date: new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      customer: customer.name,
      phone: customer.phone,
      paymentMode,
      items: [...cart],
      subtotal: totals.subtotal,
      discount: Number(discount || 0),
      cgst: totals.cgst,
      sgst: totals.sgst,
      grandTotal: totals.grandTotal,
    };
    setGeneratedInvoice(newInvoice);
  };

  const completeAndNewSale = () => {
    setGeneratedInvoice(null);
    setCart([]);
    setDiscount(0);
    setCustomer({ name: "Walk-in Customer", phone: "", points: 0 });
  };

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <Sidebar />
      <PosTopNav />

      <main className="ml-60 flex flex-col lg:flex-row gap-6 p-6">
        {/* Left: Cart area */}
        <section className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Search / scan bar */}
          <form
            onSubmit={handleAddItem}
            className="bg-white p-4 rounded-xl shadow-sm border border-[#bfc7d2] flex items-center gap-4"
          >
            <span className="material-symbols-outlined text-[#707881] text-3xl">barcode_scanner</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-[18px] font-medium placeholder:text-[#bfc7d2] outline-none"
              placeholder="Scan Barcode or Search Products (e.g. Milk, Rice, Oil)..."
              type="text"
            />
            <button
              type="submit"
              className="bg-[#006194] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#007bb9] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
              Search / Add
            </button>
          </form>

          {/* Items list */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-[#bfc7d2] overflow-hidden flex flex-col min-h-[420px]">
            <div className="grid grid-cols-12 gap-4 p-4 bg-[#eff4ff] border-b border-[#bfc7d2] text-sm font-semibold text-[#3f4850]">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5 text-left">Item Description</div>
              <div className="col-span-2 text-center">Price (₹)</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total (₹)</div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide divide-y divide-[#bfc7d2]/20">
              {cart.length === 0 ? (
                <div className="p-12 text-center text-sm text-[#3f4850] flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-[#bfc7d2] mb-2">shopping_cart</span>
                  <p className="font-semibold text-base">Cart is empty</p>
                  <p className="text-xs text-[#707881] mt-1">Scan barcode or search for items to add to bill.</p>
                </div>
              ) : (
                cart.map((item, i) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-[#eff4ff] transition-colors"
                  >
                    <div className="col-span-1 text-center text-[#3f4850]">{String(i + 1).padStart(2, "0")}</div>
                    <div className="col-span-5">
                      <div className="font-bold text-sm text-[#191c1e]">{item.name}</div>
                      <div className="text-xs text-[#3f4850]">
                        HSN: {item.hsn} | Stock: {item.stock} units
                      </div>
                    </div>
                    <div className="col-span-2 text-center font-medium">₹{item.price.toFixed(2)}</div>
                    <div className="col-span-2 flex justify-center items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-8 h-8 rounded-lg border border-[#bfc7d2] flex items-center justify-center hover:bg-[#ffdad6] hover:text-[#93000a] transition-colors active:scale-90 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <span className="w-8 text-center font-bold">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-8 h-8 rounded-lg border border-[#bfc7d2] flex items-center justify-center hover:bg-[#cce5ff] hover:text-[#004b73] transition-colors active:scale-90 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>
                    <div className="col-span-2 text-right font-bold text-[#006194]">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick summary footer */}
            <div className="p-4 bg-[#eff4ff] flex justify-between items-center border-t border-[#bfc7d2]">
              <div className="flex gap-6">
                <div className="text-sm">
                  <span className="text-[#3f4850]">Total Items:</span>{" "}
                  <span className="font-bold">{totalItems}</span>
                </div>
                <div className="text-sm">
                  <span className="text-[#3f4850]">Total Qty:</span>{" "}
                  <span className="font-bold">{totalQty}</span>
                </div>
              </div>
              <button
                onClick={clearCart}
                disabled={cart.length === 0}
                className="text-[#ba1a1a] font-bold flex items-center gap-1 px-4 py-1 rounded-lg hover:bg-[#ffdad6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
                Clear Cart
              </button>
            </div>
          </div>
        </section>

        {/* Right: Invoice summary panel */}
        <aside className="w-full lg:w-96 flex flex-col gap-6">
          {/* Customer card */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#bfc7d2]">
            <label className="block text-xs text-[#3f4850] mb-2 uppercase tracking-wider font-semibold">
              Customer Details
            </label>
            <div
              onClick={() => setShowCustomerModal(true)}
              className="flex items-center border border-[#bfc7d2] rounded-lg px-4 py-2.5 bg-[#f8f9ff] hover:border-[#006194] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined mr-2 text-[#006194]">person</span>
              <div className="flex-1">
                <div className="text-sm font-bold text-[#191c1e]">{customer.name}</div>
                <div className="text-xs text-[#3f4850]">
                  {customer.phone ? `Phone: ${customer.phone}` : "Walk-in Buyer"}
                </div>
              </div>
              <span className="material-symbols-outlined text-[20px] text-[#707881]">edit</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setShowCustomerModal(true)}
                className="flex-1 bg-[#dce9ff] py-2 rounded-lg text-xs font-bold text-[#006194] flex items-center justify-center gap-1 hover:bg-[#cce5ff] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                New Customer
              </button>
              <button
                onClick={() => navigate("/sales")}
                className="flex-1 bg-[#dce9ff] py-2 rounded-lg text-xs font-bold text-[#006194] flex items-center justify-center gap-1 hover:bg-[#cce5ff] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">history</span>
                History
              </button>
            </div>
          </div>

          {/* Billing breakdown */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2] flex flex-col">
            <h3 className="text-lg font-semibold mb-6 flex justify-between items-center text-[#191c1e]">
              Invoice Summary
              <span className="material-symbols-outlined text-[#707881]">description</span>
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#3f4850]">Subtotal</span>
                <span className="font-semibold">₹{totals.subtotal.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-[#bfc7d2]/30 space-y-2">
                <div className="flex justify-between items-center text-xs text-[#3f4850]">
                  <span>CGST (9%)</span>
                  <span>₹{totals.cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-[#3f4850]">
                  <span>SGST (9%)</span>
                  <span>₹{totals.sgst.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#bfc7d2]/30">
                <label className="block text-xs text-[#3f4850] mb-1 font-semibold">Discount Amount (₹)</label>
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 border border-[#bfc7d2] rounded-lg px-3 py-1.5 text-right focus:border-[#006194] outline-none text-sm font-semibold"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, Number(e.target.value) || 0))}
                    min={0}
                  />
                  <span className="bg-[#dce9ff] p-2 rounded-lg text-[#006194]">
                    <span className="material-symbols-outlined text-[18px]">local_offer</span>
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-[#006194] rounded-xl text-white flex flex-col gap-1 shadow-md">
                <span className="text-xs opacity-80 uppercase font-semibold">Grand Total</span>
                <div className="flex justify-between items-baseline">
                  <span className="text-3xl font-extrabold tracking-tight">₹{totals.grandTotal.toFixed(2)}</span>
                  <span className="text-xs font-medium opacity-80">Inclusive of Taxes</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 mt-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMode("UPI")}
                  className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-all cursor-pointer ${
                    paymentMode === "UPI"
                      ? "border-[#006194] bg-[#eff4ff] text-[#006194] font-bold shadow-sm"
                      : "border-[#bfc7d2] hover:bg-gray-50 text-[#3f4850]"
                  }`}
                >
                  <span className="material-symbols-outlined mb-1">qr_code_2</span>
                  <span className="text-xs uppercase font-bold">UPI / QR</span>
                </button>
                <button
                  onClick={() => setPaymentMode("CASH")}
                  className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-all cursor-pointer ${
                    paymentMode === "CASH"
                      ? "border-[#006194] bg-[#eff4ff] text-[#006194] font-bold shadow-sm"
                      : "border-[#bfc7d2] hover:bg-gray-50 text-[#3f4850]"
                  }`}
                >
                  <span className="material-symbols-outlined mb-1">payments</span>
                  <span className="text-xs uppercase font-bold">Cash</span>
                </button>
              </div>

              <button
                onClick={handleGenerateInvoice}
                className="w-full bg-[#006194] text-white py-3.5 rounded-xl text-base font-bold shadow-md hover:bg-[#007bb9] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">check_circle</span>
                Generate Invoice
              </button>

              <button
                onClick={() => {
                  if (window.confirm("Cancel this sale and clear the cart?")) {
                    clearCart();
                  }
                }}
                className="w-full border border-[#ba1a1a] text-[#ba1a1a] py-2 rounded-xl font-bold hover:bg-[#ffdad6]/40 transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
                Cancel Sale
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* New Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-[#bfc7d2] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b border-[#bfc7d2]/30 pb-3">
              <h3 className="font-bold text-lg text-[#191c1e]">Customer Information</h3>
              <button
                onClick={() => setShowCustomerModal(false)}
                className="p-1 text-gray-500 hover:text-black rounded-full"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveCustomer} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Customer Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ramesh Sharma"
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg text-sm outline-none focus:border-[#006194]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={newCustomerForm.phone}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg text-sm outline-none focus:border-[#006194]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#006194] text-white rounded-lg text-sm font-semibold hover:bg-[#007bb9]"
                >
                  Save Customer
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomerModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-[#3f4850] rounded-lg text-sm font-semibold hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generated Printable Receipt Modal */}
      {generatedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 border border-[#bfc7d2] animate-in fade-in zoom-in-95">
            {/* Printable ticket */}
            <div id="printable-receipt" className="border-b border-dashed border-gray-300 pb-4 text-center">
              <h2 className="text-xl font-extrabold text-[#006194]">KRISHNA GENERAL STORE</h2>
              <p className="text-xs text-[#707881]">Tax Invoice / Retail Sale</p>
              <p className="text-xs text-[#707881] mt-0.5">GSTIN: 07AAAAA0000A1Z5 | Phone: +91 98765 43210</p>
              <div className="flex justify-between text-xs text-[#3f4850] mt-4 pt-2 border-t border-gray-200">
                <span>Invoice: <strong className="text-black">{generatedInvoice.id}</strong></span>
                <span>{generatedInvoice.date}</span>
              </div>
              <div className="flex justify-between text-xs text-[#3f4850] mt-1">
                <span>Customer: <strong>{generatedInvoice.customer}</strong></span>
                <span>Mode: <strong className="uppercase">{generatedInvoice.paymentMode}</strong></span>
              </div>
            </div>

            {/* Receipt Table */}
            <div className="py-4 space-y-2 text-xs">
              <div className="grid grid-cols-12 font-bold text-gray-500 border-b pb-1">
                <span className="col-span-6">Item</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-2 text-right">Price</span>
                <span className="col-span-2 text-right">Total</span>
              </div>
              {generatedInvoice.items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-12 py-1 text-[#191c1e]">
                  <span className="col-span-6 truncate">{it.name}</span>
                  <span className="col-span-2 text-center">{it.qty}</span>
                  <span className="col-span-2 text-right">₹{it.price.toFixed(2)}</span>
                  <span className="col-span-2 text-right font-semibold">₹{(it.price * it.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Bill totals */}
            <div className="border-t border-dashed border-gray-300 pt-3 space-y-1.5 text-xs text-[#3f4850]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{generatedInvoice.subtotal.toFixed(2)}</span>
              </div>
              {generatedInvoice.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span>-₹{generatedInvoice.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>CGST (9%)</span>
                <span>₹{generatedInvoice.cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (9%)</span>
                <span>₹{generatedInvoice.sgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#006194] pt-2 border-t">
                <span>Grand Total</span>
                <span>₹{generatedInvoice.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-6 border-t mt-4">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#191c1e] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                Print Receipt
              </button>
              <button
                onClick={completeAndNewSale}
                className="flex-1 py-2.5 bg-[#006194] hover:bg-[#007bb9] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">done_all</span>
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
