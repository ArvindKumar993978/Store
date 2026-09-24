import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart, GST_RATE } from "../component/CartContext";
import StorefrontNavbar from "../component/StorefrontNavbar.jsx";

const INITIAL_ADDRESSES = [
  {
    id: "home",
    label: "Default",
    name: "Harsh Vardhan",
    lines: ["402, Sapphire Heights, HSR Layout Sector 2", "Bengaluru, Karnataka - 560102"],
    phone: "+91 98765 43210",
  },
  {
    id: "office",
    label: null,
    name: "Office",
    lines: ["Efficient Ledger HQ, Tech Park East", "Whitefield, Bengaluru - 560066"],
    phone: "+91 98765 01234",
  },
];

const PAYMENT_METHODS = [
  {
    id: "upi",
    title: "UPI (GPay, PhonePe, Paytm)",
    subtitle: "Instant confirmation via your UPI app",
    icon: "qr_code_2",
  },
  {
    id: "card",
    title: "Credit / Debit Card",
    subtitle: "Visa, Mastercard, RuPay, Amex",
    icon: "credit_card",
  },
  {
    id: "cod",
    title: "Cash on Delivery",
    subtitle: "Pay when you receive your order",
    icon: "payments",
  },
];

const DELIVERY_FEE_WAIVED = 150;

const inr = (n) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, updateQty, placeOrder: placeOrderInHistory } = useCart();
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [addressId, setAddressId] = useState("home");
  const [paymentId, setPaymentId] = useState("upi");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponStatus, setCouponStatus] = useState(null); // { success: boolean, msg: string }
  const [status, setStatus] = useState("idle"); // idle | processing | success

  // Add Address Modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({ name: "", line1: "", line2: "", phone: "", label: "Other" });

  const itemCount = items.reduce((sum, it) => sum + it.qty, 0);
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const gst = subtotal * GST_RATE;
  const grandTotal = Math.max(0, subtotal + gst - couponDiscount);

  const handleApplyCoupon = (e) => {
    e?.preventDefault();
    if (couponCode.trim().toUpperCase() === "KRISHNA100") {
      setCouponDiscount(100);
      setCouponStatus({ success: true, msg: "Coupon KRISHNA100 applied! Saved ₹100." });
    } else {
      setCouponDiscount(0);
      setCouponStatus({ success: false, msg: "Invalid coupon. Use KRISHNA100 for ₹100 off." });
    }
  };

  const handleSaveNewAddress = (e) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.line1) return;
    const newId = `addr-${Date.now()}`;
    const created = {
      id: newId,
      name: newAddr.name,
      label: newAddr.label,
      lines: [newAddr.line1, newAddr.line2].filter(Boolean),
      phone: newAddr.phone || null,
    };
    setAddresses((prev) => [...prev, created]);
    setAddressId(newId);
    setShowAddressModal(false);
    setNewAddr({ name: "", line1: "", line2: "", phone: "", label: "Other" });
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    setStatus("processing");
    setTimeout(() => {
      placeOrderInHistory(paymentId);
      setStatus("success");
      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-[Inter,sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      {/* Top nav */}
      <StorefrontNavbar cartCount={itemCount} />

      <main className="pt-24 pb-16 px-6 max-w-[1280px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column */}
          <div className="flex-1 space-y-8">
            <h1 className="text-3xl font-bold">Secure Checkout</h1>

            {items.length === 0 && status === "idle" ? (
              <div className="bg-white rounded-xl p-10 shadow-sm border border-[#bfc7d2]/30 text-center space-y-3">
                <span className="material-symbols-outlined text-5xl text-[#707881]">shopping_basket</span>
                <p className="font-bold text-lg">Your cart is empty</p>
                <p className="text-sm text-[#3f4850]">Add fresh produce and groceries before checking out.</p>
                <button
                  onClick={() => navigate("/storefront")}
                  className="px-6 py-2.5 bg-[#006194] text-white rounded-lg font-bold text-sm hover:bg-[#007bb9] transition-all inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">storefront</span>
                  Browse Storefront
                </button>
              </div>
            ) : (
              <>
                {/* Delivery Address */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-[#bfc7d2]/30">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#006194] text-[20px]">location_on</span>
                      <h2 className="text-xl font-semibold">Delivery Address</h2>
                    </div>
                    <button 
                      onClick={() => setShowAddressModal(true)}
                      className="text-[#006194] text-xs font-semibold hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      Add New Address
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => {
                      const active = addressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setAddressId(addr.id)}
                          className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            active
                              ? "border-[#006194] bg-[#cce5ff]/20 shadow-sm"
                              : "border-[#bfc7d2] bg-[#f7f9fb] hover:border-[#006194]/50"
                          }`}
                        >
                          {addr.label && (
                            <span className="inline-block px-2 py-0.5 mb-2 rounded-full bg-[#006194] text-white text-[10px] font-bold uppercase tracking-wider">
                              {addr.label}
                            </span>
                          )}
                          <p className="font-bold">{addr.name}</p>
                          {addr.lines.map((line, idx) => (
                            <p key={idx} className="text-sm text-[#3f4850] mt-1">
                              {line}
                            </p>
                          ))}
                          {addr.phone && (
                            <p className="text-sm text-[#3f4850] mt-2 font-medium">{addr.phone}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Order Summary */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-[#bfc7d2]/30">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-[#006194] text-[20px]">shopping_bag</span>
                    <h2 className="text-xl font-semibold">Order Summary ({itemCount} items)</h2>
                  </div>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 py-4 border-b border-[#bfc7d2]/20 last:border-0"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#f2f4f6]">
                          <img className="w-full h-full object-cover" alt={item.name} src={item.image} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold truncate text-sm">{item.name}</h3>
                          {item.desc && (
                            <p className="text-xs text-[#3f4850] truncate">{item.desc}</p>
                          )}
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-sm text-[#006194] font-bold tabular-nums">
                              {inr(item.price)}
                            </span>
                            <div className="flex items-center border border-[#bfc7d2] rounded-lg overflow-hidden bg-white">
                              <button
                                className="px-2 py-1 hover:bg-[#e6e8ea] transition-colors"
                                onClick={() => updateQty(item.id, -1)}
                                aria-label={`Decrease ${item.name} quantity`}
                              >
                                <span className="material-symbols-outlined text-[16px]">remove</span>
                              </button>
                              <span className="px-3 text-sm font-bold tabular-nums">{item.qty}</span>
                              <button
                                className="px-2 py-1 hover:bg-[#e6e8ea] transition-colors"
                                onClick={() => updateQty(item.id, 1)}
                                aria-label={`Increase ${item.name} quantity`}
                              >
                                <span className="material-symbols-outlined text-[16px]">add</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Payment Method */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-[#bfc7d2]/30">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-[#006194] text-[20px]">credit_card</span>
                    <h2 className="text-xl font-semibold">Payment Method</h2>
                  </div>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((method) => {
                      const active = paymentId === method.id;
                      return (
                        <label
                          key={method.id}
                          className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                            active
                              ? "border-[#006194] bg-[#cce5ff]/10 shadow-sm"
                              : "border-[#bfc7d2] hover:bg-[#f7f9fb]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            className="w-5 h-5 text-[#006194] focus:ring-[#006194] cursor-pointer"
                            checked={active}
                            onChange={() => setPaymentId(method.id)}
                          />
                          <div className="ml-4 flex-1 flex items-center justify-between">
                            <div>
                              <p className="font-bold">{method.title}</p>
                              <p className="text-sm text-[#3f4850]">{method.subtitle}</p>
                            </div>
                            <span className="material-symbols-outlined text-[#006194] text-[24px]">{method.icon}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Right column: summary & coupon */}
          {items.length > 0 && (
            <aside className="lg:w-[380px]">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#bfc7d2]/30">
                  <h2 className="text-xl font-semibold mb-6">Price Details</h2>
                  <div className="space-y-3 border-b border-[#bfc7d2]/20 pb-4">
                    <div className="flex justify-between text-sm text-[#3f4850]">
                      <span>Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})</span>
                      <span className="tabular-nums font-semibold">{inr(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#3f4850]">
                      <span className="flex items-center gap-1">
                        GST <span className="text-[10px] bg-[#dae2fd] text-[#006194] font-bold px-1.5 py-0.5 rounded">5%</span>
                      </span>
                      <span className="tabular-nums font-semibold">{inr(gst)}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-sm text-[#006947] font-semibold">
                        <span>Coupon Discount (KRISHNA100)</span>
                        <span className="tabular-nums">- {inr(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-[#3f4850]">
                      <span>Delivery Fee</span>
                      <div className="flex items-center gap-2">
                        <span className="line-through text-[#707881] tabular-nums text-xs">
                          {inr(DELIVERY_FEE_WAIVED)}
                        </span>
                        <span className="text-[#006947] font-bold text-xs">FREE</span>
                      </div>
                    </div>
                  </div>
                  <div className="py-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xl">Grand Total</span>
                      <span className="font-bold text-2xl text-[#006194] tabular-nums">{inr(grandTotal)}</span>
                    </div>
                    <p className="text-[11px] text-[#006947] bg-[#6ffbbe]/20 rounded-lg p-2.5 flex items-center gap-2 font-medium">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      You saved {inr(DELIVERY_FEE_WAIVED + couponDiscount)} on this order!
                    </p>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={status !== "idle"}
                    className="w-full py-4 bg-[#006194] text-white rounded-lg font-bold text-lg hover:bg-[#007bb9] active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    Place Order
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                  <div className="mt-4 flex items-center justify-around text-[#707881] pt-2">
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-[18px] text-[#006194]">verified_user</span>
                      <span className="text-[10px] mt-1">100% Secure</span>
                    </div>
                    <div className="w-px h-6 bg-[#bfc7d2]" />
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-[18px] text-[#006194]">local_shipping</span>
                      <span className="text-[10px] mt-1">Free Delivery</span>
                    </div>
                    <div className="w-px h-6 bg-[#bfc7d2]" />
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-[18px] text-[#006194]">receipt_long</span>
                      <span className="text-[10px] mt-1">GST Invoice</span>
                    </div>
                  </div>
                </div>

                {/* Coupon Box */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-[#bfc7d2]/30">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-[#006194] text-[18px]">sell</span>
                    <h3 className="font-bold text-sm">Have a Coupon Code?</h3>
                  </div>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      className="flex-1 bg-[#f7f9fb] border border-[#bfc7d2] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006194] focus:outline-none uppercase font-mono"
                      placeholder="e.g. KRISHNA100"
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-[#006194] text-white font-bold text-xs rounded-lg hover:bg-[#007bb9] active:scale-95 transition-all shadow-sm"
                    >
                      Apply
                    </button>
                  </form>
                  {couponStatus && (
                    <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${couponStatus.success ? "text-[#006947]" : "text-[#ba1a1a]"}`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {couponStatus.success ? "check_circle" : "error"}
                      </span>
                      {couponStatus.msg}
                    </p>
                  )}
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#bfc7d2]/30">
              <h3 className="font-bold text-lg text-[#006194]">Add New Delivery Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="p-1 hover:bg-[#f2f4f6] rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveNewAddress} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newAddr.name}
                  onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  className="w-full border border-[#bfc7d2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006194]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block mb-1">Address Line 1</label>
                <input
                  required
                  type="text"
                  placeholder="House / Flat No., Building, Street"
                  value={newAddr.line1}
                  onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })}
                  className="w-full border border-[#bfc7d2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006194]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block mb-1">City, State & Pincode</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Karnataka - 560034"
                  value={newAddr.line2}
                  onChange={(e) => setNewAddr({ ...newAddr, line2: e.target.value })}
                  className="w-full border border-[#bfc7d2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006194]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="w-full border border-[#bfc7d2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006194]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border border-[#bfc7d2] rounded-lg text-sm font-semibold hover:bg-[#f2f4f6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#006194] text-white rounded-lg text-sm font-bold hover:bg-[#007bb9]"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#eceef0] border-t border-[#bfc7d2] py-8">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1280px] mx-auto w-full gap-4">
          <div>
            <p className="text-xl font-bold text-[#006194]">Krishna Store</p>
            <p className="text-[#565e74] text-xs mt-0.5">© 2024 Krishna Store Ecosystem. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm">
            <button onClick={() => navigate("/help")} className="text-[#3f4850] hover:text-[#006194] transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => navigate("/help")} className="text-[#3f4850] hover:text-[#006194] transition-colors">
              Terms of Service
            </button>
            <button onClick={() => navigate("/help")} className="text-[#3f4850] hover:text-[#006194] transition-colors font-semibold text-[#006194]">
              Contact Support
            </button>
          </div>
        </div>
      </footer>

      {/* Payment Processing Overlay */}
      {status !== "idle" && (
        <div className="fixed inset-0 bg-[#2d3133]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center shadow-2xl">
            {status === "processing" ? (
              <>
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-[#006194]/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-[#006194] rounded-full border-t-transparent animate-spin" />
                </div>
                <h3 className="text-xl font-bold mb-2">Processing Order</h3>
                <p className="text-[#3f4850] text-sm">Confirming transaction with your bank...</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#006947] text-[64px]">check_circle</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Order Confirmed!</h3>
                <p className="text-[#3f4850] text-sm">Redirecting you to your order history...</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}