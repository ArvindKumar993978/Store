import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart, GST_RATE } from "../component/CartContext";
import StorefrontNavbar from "../component/StorefrontNavbar.jsx";

/*
  CheckoutPage
  ------------
  Pulls its order summary and price details straight from CartContext
  — the same items added on the storefront and reviewed in
  ShoppingCart. No hardcoded products here.

  Icons use Google's Material Symbols font + Tailwind classes (no icon
  library import) to match the rest of the app.

  Delivery address and payment method are page-local UI state (they
  don't belong in the cart). Placing an order simulates processing,
  then records it in order history (via CartContext's placeOrder,
  which also empties the cart) and redirects to /orders — swap the
  simulated delay for a real order API call when ready.
*/

const ADDRESSES = [
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
    phone: null,
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
  `\u20B9${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, updateQty, placeOrder: placeOrderInHistory } = useCart();
  const [addressId, setAddressId] = useState("home");
  const [paymentId, setPaymentId] = useState("upi");
  const [couponCode, setCouponCode] = useState("");
  const [status, setStatus] = useState("idle"); // idle | processing | success

  const itemCount = items.reduce((sum, it) => sum + it.qty, 0);
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const gst = subtotal * GST_RATE;
  const total = subtotal + gst;

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    setStatus("processing");
    setTimeout(() => {
      // Snapshot the cart into a real order record (this also empties the cart)
      placeOrderInHistory(paymentId);
      setStatus("success");
      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    }, 2500);
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
              <div className="bg-white rounded-xl p-10 shadow-sm border border-[#bfc7d2]/30 text-center">
                <p className="font-semibold mb-2">Your cart is empty</p>
                <p className="text-sm text-[#3f4850] mb-4">Add something to your basket before checking out.</p>
                <button
                  onClick={() => navigate("/")}
                  className="text-[#006194] font-semibold text-sm hover:underline"
                >
                  Browse products
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
                    <button className="text-[#006194] text-xs font-semibold hover:underline">Add New</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ADDRESSES.map((addr) => {
                      const active = addressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setAddressId(addr.id)}
                          className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            active
                              ? "border-[#006194] bg-[#cce5ff]/20"
                              : "border-[#bfc7d2] bg-[#f7f9fb] hover:border-[#006194]/50"
                          }`}
                        >
                          {addr.label && (
                            <span className="inline-block px-2 py-0.5 mb-2 rounded-full bg-[#006194] text-white text-[10px] font-bold uppercase tracking-wider">
                              {addr.label}
                            </span>
                          )}
                          <p className="font-bold">{addr.name}</p>
                          {addr.lines.map((line) => (
                            <p key={line} className="text-sm text-[#3f4850] mt-1">
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
                    <h2 className="text-xl font-semibold">Order Summary</h2>
                  </div>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 py-4 border-b border-[#bfc7d2]/20 last:border-0"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#f2f4f6]">
                          <img className="w-full h-full object-cover" alt={item.name} src={item.image} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold truncate">{item.name}</h3>
                          {item.desc && (
                            <p className="text-xs text-[#3f4850] truncate">{item.desc}</p>
                          )}
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-sm text-[#006194] font-medium tabular-nums">
                              {inr(item.price)}
                            </span>
                            <div className="flex items-center border border-[#bfc7d2] rounded-lg overflow-hidden">
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
                              ? "border-[#006194] bg-[#cce5ff]/10"
                              : "border-[#bfc7d2] hover:bg-[#f7f9fb]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            className="w-5 h-5 text-[#006194] focus:ring-[#006194]"
                            checked={active}
                            onChange={() => setPaymentId(method.id)}
                          />
                          <div className="ml-4 flex-1 flex items-center justify-between">
                            <div>
                              <p className="font-bold">{method.title}</p>
                              <p className="text-sm text-[#3f4850]">{method.subtitle}</p>
                            </div>
                            <span className="material-symbols-outlined text-[#3f4850] text-[20px]">{method.icon}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Right column: sticky summary */}
          {items.length > 0 && (
            <aside className="lg:w-[380px]">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#bfc7d2]/30">
                  <h2 className="text-xl font-semibold mb-6">Price Details</h2>
                  <div className="space-y-4 border-b border-[#bfc7d2]/20 pb-6">
                    <div className="flex justify-between text-sm text-[#3f4850]">
                      <span>Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})</span>
                      <span className="tabular-nums">{inr(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#3f4850]">
                      <span>GST ({Math.round(GST_RATE * 100)}%)</span>
                      <span className="tabular-nums">{inr(gst)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#3f4850]">
                      <span>Delivery Fee</span>
                      <div className="flex items-center gap-2">
                        <span className="line-through text-[#707881] tabular-nums">
                          {inr(DELIVERY_FEE_WAIVED)}
                        </span>
                        <span className="text-[#006947] font-bold">FREE</span>
                      </div>
                    </div>
                  </div>
                  <div className="py-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xl">Grand Total</span>
                      <span className="font-bold text-xl text-[#006194] tabular-nums">{inr(total)}</span>
                    </div>
                    <p className="text-[10px] text-[#3f4850] bg-[#eceef0] rounded-lg p-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      You are saving {inr(DELIVERY_FEE_WAIVED)} on this order with free delivery.
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
                  <div className="mt-6 flex items-center justify-center gap-4 text-[#707881]">
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                      <span className="text-[10px] mt-1">Secure</span>
                    </div>
                    <div className="w-px h-8 bg-[#bfc7d2]" />
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                      <span className="text-[10px] mt-1">Fast Delivery</span>
                    </div>
                    <div className="w-px h-8 bg-[#bfc7d2]" />
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-[18px]">assignment_return</span>
                      <span className="text-[10px] mt-1">Easy Return</span>
                    </div>
                  </div>
                </div>

                {/* Coupon */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#bfc7d2]/30">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-[#006194] text-[16px]">sell</span>
                    <h3 className="font-bold text-sm">Apply Coupon</h3>
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 bg-[#f7f9fb] border border-[#bfc7d2] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006194] focus:outline-none"
                      placeholder="Enter code"
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button className="px-4 py-2 border border-[#006194] text-[#006194] font-bold rounded-lg hover:bg-[#006194]/5 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#eceef0] border-t border-[#bfc7d2]">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1280px] mx-auto w-full py-8">
          <div className="mb-4 md:mb-0">
            <p className="text-xl font-bold text-[#006194]">Efficient Ledger</p>
            <p className="text-[#565e74] text-sm mt-1">© 2024 Efficient Ledger. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <a className="text-[#3f4850] hover:text-[#006194] transition-colors text-sm" href="#">
              Privacy Policy
            </a>
            <a className="text-[#3f4850] hover:text-[#006194] transition-colors text-sm" href="#">
              Terms of Service
            </a>
            <a className="text-[#3f4850] hover:text-[#006194] transition-colors text-sm" href="#">
              Contact Support
            </a>
          </div>
        </div>
      </footer>

      {/* Payment Processing Overlay */}
      {status !== "idle" && (
        <div className="fixed inset-0 bg-[#2d3133]/60 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center shadow-2xl">
            {status === "processing" ? (
              <>
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-[#006194]/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-[#006194] rounded-full border-t-transparent animate-spin" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
                <p className="text-[#3f4850] text-sm">Please do not refresh the page or close this window.</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#006947] text-[64px]">check_circle</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Order Placed!</h3>
                <p className="text-[#3f4850] text-sm">Redirecting you to your order confirmation...</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}