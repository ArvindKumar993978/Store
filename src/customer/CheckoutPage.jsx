import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart, GST_RATE } from "../component/CartContext";
import { useStore } from "../context/StoreContext";
import { useNotifications } from "../context/NotificationContext";
import { sendOrderConfirmationSMS, sendPaymentReceiptSMS } from "../services/smsService";
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
    name: "Harsh Vardhan (Office)",
    lines: ["Krishna Tech Park East, 4th Floor", "Whitefield, Bengaluru - 560066"],
    phone: "+91 98765 01234",
  },
];

const PAYMENT_METHODS = [
  {
    id: "upi",
    title: "UPI (GPay, PhonePe, Paytm, BHIM)",
    subtitle: "Scan QR code or enter your UPI ID",
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
    title: "Cash on Delivery (COD)",
    subtitle: "Pay in cash or UPI when order arrives",
    icon: "payments",
  },
  {
    id: "netbanking",
    title: "Net Banking",
    subtitle: "All major Indian banks supported",
    icon: "account_balance",
  },
];

const DELIVERY_FEE_WAIVED = 150;

const inr = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, updateQty, clearCart } = useCart();
  const { recordCustomerOrder, applyPromoCode, settings } = useStore();
  const { addNotification } = useNotifications();

  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [addressId, setAddressId] = useState("home");
  const [paymentId, setPaymentId] = useState("upi");
  const [copiedUpi, setCopiedUpi] = useState(false);
  
  // Specific payment inputs
  const [upiId, setUpiId] = useState("harsh@okhdfcbank");
  const [cardDetails, setCardDetails] = useState({
    name: "Harsh Vardhan",
    number: "4532 •••• •••• 8829",
    expiry: "09/28",
    cvv: "821"
  });
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  // Promo code
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponStatus, setCouponStatus] = useState(null);

  // Flow states
  const [status, setStatus] = useState("idle"); // idle | processing | success
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Address Modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({ name: "", line1: "", line2: "", phone: "", label: "Other" });

  const itemCount = items.reduce((sum, it) => sum + it.qty, 0);
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const gst = subtotal * GST_RATE;
  const grandTotal = Math.max(0, subtotal + gst - couponDiscount);

  const storeName = settings?.storeName || "Krishna General Store";
  const storeUpiId = settings?.upiId || "krishnastore@upi";

  const upiPayload = `upi://pay?pa=${encodeURIComponent(storeUpiId)}&pn=${encodeURIComponent(storeName)}&am=${grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent("Grocery Order Checkout")}`;
  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(upiPayload)}`;

  const handleApplyCoupon = (e) => {
    e?.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyPromoCode(couponCode.trim(), subtotal);
    if (res.valid) {
      setCouponDiscount(res.discount);
      setCouponStatus({ success: true, msg: `Coupon ${res.code} applied! Saved ₹${res.discount}.` });
    } else {
      setCouponDiscount(0);
      setCouponStatus({ success: false, msg: res.message });
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
      phone: newAddr.phone || "+91 98765 43210",
    };
    setAddresses((prev) => [...prev, created]);
    setAddressId(newId);
    setShowAddressModal(false);
    setNewAddr({ name: "", line1: "", line2: "", phone: "", label: "Other" });
  };

  // Process checkout & payment
  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    setStatus("processing");

    const activeAddress = addresses.find((a) => a.id === addressId) || addresses[0];
    const generatedOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const generatedTxnId = `TXN-${Date.now().toString().slice(-6)}`;
    const paymentMethodTitle = PAYMENT_METHODS.find((p) => p.id === paymentId)?.title || paymentId;

    const orderData = {
      id: generatedOrderId,
      transactionId: generatedTxnId,
      date: new Date().toISOString(),
      customerName: activeAddress.name,
      phone: activeAddress.phone || "+91 98765 43210",
      shippingAddress: `${activeAddress.name}, ${activeAddress.lines.join(", ")}, Phone: ${activeAddress.phone || "N/A"}`,
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        qty: it.qty,
        image: it.image,
      })),
      total: grandTotal,
      subtotal: subtotal,
      discount: couponDiscount,
      gst: gst,
      paymentMethod: paymentMethodTitle,
      paymentStatus: paymentId === "cod" ? "Pending (Cash on Delivery)" : "Paid",
      status: "In Transit"
    };

    setTimeout(() => {
      // 1. Record customer order in StoreContext
      const createdOrder = recordCustomerOrder(orderData);
      setConfirmedOrder(createdOrder || orderData);

      // 2. Dispatch live SMS notifications to customer phone
      sendOrderConfirmationSMS({
        orderId: generatedOrderId,
        customerName: activeAddress.name,
        phone: activeAddress.phone,
        total: grandTotal,
        itemCount: itemCount
      });

      if (paymentId !== "cod") {
        sendPaymentReceiptSMS({
          orderId: generatedOrderId,
          customerName: activeAddress.name,
          phone: activeAddress.phone,
          amount: grandTotal,
          paymentMethod: paymentMethodTitle.split(" ")[0],
          txnId: generatedTxnId
        });
      }

      // 3. Add to live notification store
      addNotification({
        type: "order",
        title: "Order Placed Successfully",
        message: `Order #${generatedOrderId} for ₹${grandTotal.toFixed(2)} placed via ${paymentMethodTitle.split(" ")[0]}`,
        link: "/orders",
        icon: "check_circle",
        color: "#006a61"
      });

      // 4. Clear shopping cart
      clearCart();
      setStatus("success");
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-family: 'Material Symbols Outlined' !important; vertical-align: middle; }
      `}</style>

      {/* Top Navigation */}
      <StorefrontNavbar cartCount={itemCount} />

      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-[1280px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Form & Options */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0b1c30]">Secure Checkout</h1>
              <p className="text-xs sm:text-sm text-[#707881] mt-1">Review items, select payment mode, and confirm your order.</p>
            </div>

            {items.length === 0 && status === "idle" ? (
              <div className="bg-white rounded-2xl p-10 shadow-sm border border-[#bfc7d2]/30 text-center space-y-4">
                <span className="material-symbols-outlined text-6xl text-[#707881]">shopping_basket</span>
                <p className="font-bold text-lg text-[#0b1c30]">Your shopping cart is empty</p>
                <p className="text-sm text-[#3f4850]">Add groceries from our fresh catalog before checking out.</p>
                <button
                  onClick={() => navigate("/storefront")}
                  className="px-6 py-2.5 bg-[#006194] text-white rounded-xl font-bold text-sm hover:bg-[#007bb9] transition-all inline-flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">storefront</span>
                  Explore Grocery Catalog
                </button>
              </div>
            ) : (
              <>
                {/* 1. Delivery Address Card */}
                <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#bfc7d2]/40">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[#006194] text-[22px]">location_on</span>
                      <h2 className="text-lg font-bold text-[#0b1c30]">Delivery Address</h2>
                    </div>
                    <button 
                      onClick={() => setShowAddressModal(true)}
                      className="text-[#006194] text-xs font-bold hover:underline flex items-center gap-1 bg-[#eff4ff] px-3 py-1.5 rounded-lg"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      Add New Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {addresses.map((addr) => {
                      const active = addressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setAddressId(addr.id)}
                          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            active
                              ? "border-[#006194] bg-[#eff4ff] shadow-xs"
                              : "border-[#bfc7d2]/50 bg-white hover:border-[#006194]/40"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-bold text-sm text-[#0b1c30]">{addr.name}</p>
                            {addr.label && (
                              <span className="px-2 py-0.5 rounded-full bg-[#006194] text-white text-[9px] font-bold uppercase tracking-wider">
                                {addr.label}
                              </span>
                            )}
                          </div>
                          {addr.lines.map((line, idx) => (
                            <p key={idx} className="text-xs text-[#3f4850] mt-0.5 leading-relaxed">
                              {line}
                            </p>
                          ))}
                          {addr.phone && (
                            <p className="text-xs text-[#006194] mt-2 font-semibold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">phone</span>
                              {addr.phone}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* 2. Order Items Review */}
                <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#bfc7d2]/40">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[#006194] text-[22px]">shopping_bag</span>
                      <h2 className="text-lg font-bold text-[#0b1c30]">Order Items ({itemCount})</h2>
                    </div>
                    <span className="text-xs font-semibold text-[#006194]">Review Quantities</span>
                  </div>

                  <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#bfc7d2]/30 flex-shrink-0"
                          />
                          <div>
                            <h3 className="font-bold text-xs sm:text-sm text-[#0b1c30]">{item.name}</h3>
                            <span className="text-xs text-[#006194] font-semibold">{inr(item.price)} each</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-[#bfc7d2] rounded-lg overflow-hidden bg-[#f8f9ff]">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="px-2 py-1 hover:bg-[#e6e8ea] text-xs transition-colors"
                            >
                              -
                            </button>
                            <span className="px-2.5 text-xs font-bold">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="px-2 py-1 hover:bg-[#e6e8ea] text-xs transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm font-bold tabular-nums text-[#0b1c30] min-w-[70px] text-right">
                            {inr(item.price * item.qty)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 3. Interactive Payment Methods Card */}
                <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#bfc7d2]/40">
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="material-symbols-outlined text-[#006194] text-[22px]">payment</span>
                    <h2 className="text-lg font-bold text-[#0b1c30]">Payment Options</h2>
                  </div>

                  {/* Payment Tabs / Radio Options */}
                  <div className="space-y-3 mb-6">
                    {PAYMENT_METHODS.map((method) => {
                      const active = paymentId === method.id;
                      return (
                        <div
                          key={method.id}
                          onClick={() => setPaymentId(method.id)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            active
                              ? "border-[#006194] bg-[#eff4ff]/60 shadow-xs"
                              : "border-[#bfc7d2]/40 hover:bg-[#f8f9ff]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                active ? "border-[#006194] bg-[#006194]" : "border-gray-400"
                              }`}>
                                {active && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <div>
                                <p className="font-bold text-sm text-[#0b1c30]">{method.title}</p>
                                <p className="text-xs text-[#707881]">{method.subtitle}</p>
                              </div>
                            </div>
                            <span className="material-symbols-outlined text-[#006194] text-[24px]">
                              {method.icon}
                            </span>
                          </div>

                          {/* Interactive Sub-Panel for Selected Method */}
                          {active && (
                            <div className="mt-4 pt-4 border-t border-[#006194]/20 animate-in fade-in">
                              {/* UPI Interactive Panel */}
                              {method.id === "upi" && (
                                <div className="space-y-4 bg-white p-4 sm:p-5 rounded-xl border border-[#006194]/30 shadow-xs">
                                  <div className="flex flex-col sm:flex-row items-center gap-5">
                                    {/* Real Dynamic UPI QR Code */}
                                    <div className="p-3 bg-white border-2 border-dashed border-[#006194] rounded-2xl text-center shadow-xs flex-shrink-0 flex flex-col items-center">
                                      <img
                                        src={upiQrUrl}
                                        alt="UPI QR Code"
                                        className="w-36 h-36 rounded-xl border border-[#006194]/30 p-1 bg-white object-contain"
                                      />
                                      <div className="mt-2 text-center">
                                        <span className="text-[10px] uppercase font-bold text-[#006194] tracking-wider block">
                                          Scan to Pay
                                        </span>
                                        <span className="text-sm font-extrabold text-[#0b1c30] tabular-nums">
                                          {inr(grandTotal)}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Account Holder & Payment Details */}
                                    <div className="flex-1 space-y-3 text-left w-full">
                                      <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#006194]/20 space-y-1.5">
                                        <div className="flex justify-between items-center text-xs">
                                          <span className="text-[#565e74] font-medium">Account Holder:</span>
                                          <span className="font-bold text-[#0b1c30]">{storeName}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                          <span className="text-[#565e74] font-medium">Store UPI ID:</span>
                                          <div className="flex items-center gap-1.5">
                                            <span className="font-mono font-bold text-[#006194]">{storeUpiId}</span>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                navigator.clipboard?.writeText(storeUpiId);
                                                setCopiedUpi(true);
                                                setTimeout(() => setCopiedUpi(false), 2000);
                                              }}
                                              className="text-[#006194] hover:underline text-[10px] font-bold cursor-pointer"
                                            >
                                              {copiedUpi ? "Copied!" : "Copy"}
                                            </button>
                                          </div>
                                        </div>
                                        <div className="flex justify-between items-center text-xs pt-1 border-t border-[#006194]/10">
                                          <span className="text-[#565e74] font-medium">Bill Amount:</span>
                                          <span className="font-black text-emerald-700 text-sm">{inr(grandTotal)}</span>
                                        </div>
                                      </div>

                                      <div className="flex flex-col sm:flex-row gap-2">
                                        <a
                                          href={upiPayload}
                                          className="flex-1 bg-[#006194] hover:bg-[#007bb9] text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                                        >
                                          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                          Pay via UPI App (GPay / PhonePe)
                                        </a>
                                      </div>

                                      <div className="space-y-1">
                                        <label className="text-xs font-bold text-[#0b1c30] block">
                                          Or Enter Customer UPI ID (VPA)
                                        </label>
                                        <div className="flex gap-2">
                                          <input
                                            type="text"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            placeholder="username@okaxis"
                                            className="flex-1 border border-[#bfc7d2] rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#006194]"
                                          />
                                          <span className="text-xs font-bold text-[#006a61] bg-[#6ffbbe]/20 px-2.5 py-2 rounded-lg flex items-center">
                                            Verified ✓
                                          </span>
                                        </div>
                                      </div>

                                      <p className="text-[11px] text-[#707881]">
                                        Compatible with Google Pay, PhonePe, Paytm, CRED &amp; Amazon Pay.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Card Interactive Panel */}
                              {method.id === "card" && (
                                <div className="space-y-3 bg-white p-4 rounded-xl border border-[#006194]/20 text-xs">
                                  <div>
                                    <label className="font-bold text-[#0b1c30] block mb-1">Cardholder Name</label>
                                    <input
                                      type="text"
                                      value={cardDetails.name}
                                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                      className="w-full border border-[#bfc7d2] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#006194]"
                                    />
                                  </div>
                                  <div>
                                    <label className="font-bold text-[#0b1c30] block mb-1">Card Number</label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        value={cardDetails.number}
                                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                        className="w-full border border-[#bfc7d2] rounded-lg pl-3 pr-16 py-2 outline-none focus:ring-2 focus:ring-[#006194] font-mono"
                                      />
                                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-[#006194] text-white px-2 py-0.5 rounded">
                                        VISA / RuPay
                                      </span>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="font-bold text-[#0b1c30] block mb-1">Valid Thru</label>
                                      <input
                                        type="text"
                                        value={cardDetails.expiry}
                                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                        placeholder="MM/YY"
                                        className="w-full border border-[#bfc7d2] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#006194]"
                                      />
                                    </div>
                                    <div>
                                      <label className="font-bold text-[#0b1c30] block mb-1">CVV / CVC</label>
                                      <input
                                        type="password"
                                        maxLength="3"
                                        value={cardDetails.cvv}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                        className="w-full border border-[#bfc7d2] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#006194]"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Cash on Delivery Panel */}
                              {method.id === "cod" && (
                                <div className="bg-[#fffbeb] p-3 rounded-xl border border-[#b45309]/20 text-xs text-[#92400e] flex items-center gap-2">
                                  <span className="material-symbols-outlined text-[18px]">verified</span>
                                  <span>Cash or QR on Delivery enabled! No advance online payment required.</span>
                                </div>
                              )}

                              {/* Net Banking Panel */}
                              {method.id === "netbanking" && (
                                <div className="bg-white p-3 rounded-xl border border-[#006194]/20 space-y-2">
                                  <label className="text-xs font-bold text-[#0b1c30] block">Select Your Bank</label>
                                  <select
                                    value={selectedBank}
                                    onChange={(e) => setSelectedBank(e.target.value)}
                                    className="w-full border border-[#bfc7d2] rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#006194]"
                                  >
                                    <option>HDFC Bank</option>
                                    <option>State Bank of India (SBI)</option>
                                    <option>ICICI Bank</option>
                                    <option>Axis Bank</option>
                                    <option>Kotak Mahindra Bank</option>
                                    <option>Punjab National Bank</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Right Column: Pricing Summary & Confirm Button */}
          {items.length > 0 && (
            <aside className="lg:w-[380px]">
              <div className="sticky top-24 space-y-4">
                {/* Price Breakdown */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#bfc7d2]/40">
                  <h2 className="text-lg font-bold text-[#0b1c30] mb-4">Payment Summary</h2>
                  
                  <div className="space-y-3 border-b border-[#bfc7d2]/20 pb-4 text-xs sm:text-sm text-[#3f4850]">
                    <div className="flex justify-between">
                      <span>Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})</span>
                      <span className="tabular-nums font-semibold">{inr(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        GST Tax <span className="text-[10px] bg-[#eff4ff] text-[#006194] font-bold px-1.5 py-0.5 rounded">5%</span>
                      </span>
                      <span className="tabular-nums font-semibold">{inr(gst)}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-[#006a61] font-bold">
                        <span>Coupon Savings</span>
                        <span className="tabular-nums">-{inr(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Express Delivery</span>
                      <div className="text-right">
                        <span className="line-through text-gray-400 text-xs mr-1.5">₹150.00</span>
                        <span className="text-[#006a61] font-bold text-xs">FREE</span>
                      </div>
                    </div>
                  </div>

                  <div className="py-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-[#0b1c30]">Grand Total</span>
                      <span className="font-bold text-2xl text-[#006194] tabular-nums">{inr(grandTotal)}</span>
                    </div>
                    <p className="text-[11px] text-[#006a61] bg-[#6ffbbe]/20 rounded-lg p-2.5 flex items-center gap-1.5 font-medium">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      You saved {inr(DELIVERY_FEE_WAIVED + couponDiscount)} on this order!
                    </p>
                  </div>

                  {/* Place Order CTA */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={status !== "idle"}
                    className="w-full py-4 bg-[#006194] hover:bg-[#007bb9] text-white rounded-xl font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 active:scale-98 cursor-pointer"
                  >
                    <span>
                      {paymentId === "upi" ? `Pay via UPI ${inr(grandTotal)}` : `Confirm & Pay ${inr(grandTotal)}`}
                    </span>
                    <span className="material-symbols-outlined text-[20px]">
                      {paymentId === "upi" ? "qr_code_scanner" : "arrow_forward"}
                    </span>
                  </button>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-around text-gray-400 text-center">
                    <div>
                      <span className="material-symbols-outlined text-[#006194] text-[20px]">verified_user</span>
                      <p className="text-[9px] mt-0.5 text-gray-500 font-semibold">100% Secure</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div>
                      <span className="material-symbols-outlined text-[#006194] text-[20px]">sms</span>
                      <p className="text-[9px] mt-0.5 text-gray-500 font-semibold">SMS Alerts</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div>
                      <span className="material-symbols-outlined text-[#006194] text-[20px]">receipt_long</span>
                      <p className="text-[9px] mt-0.5 text-gray-500 font-semibold">GST Invoice</p>
                    </div>
                  </div>
                </div>

                {/* Coupon Code Box */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#bfc7d2]/40">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#006194] text-[18px]">sell</span>
                    <h3 className="font-bold text-xs text-[#0b1c30]">Apply Store Promo Code</h3>
                  </div>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      className="flex-1 bg-[#f8f9ff] border border-[#bfc7d2] rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006194] outline-none uppercase font-mono"
                      placeholder="e.g. KRISHNA100"
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-[#006194] text-white font-bold text-xs rounded-xl hover:bg-[#007bb9] active:scale-95 transition-all shadow-sm"
                    >
                      Apply
                    </button>
                  </form>
                  {couponStatus && (
                    <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${
                      couponStatus.success ? "text-[#006a61]" : "text-[#ba1a1a]"
                    }`}>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#bfc7d2]/30">
              <h3 className="font-bold text-base text-[#006194]">Add New Delivery Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="p-1 hover:bg-[#f2f4f6] rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveNewAddress} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#3f4850] block mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newAddr.name}
                  onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  className="w-full border border-[#bfc7d2] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#006194]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#3f4850] block mb-1">Address Line 1</label>
                <input
                  required
                  type="text"
                  placeholder="House / Flat No., Building, Street"
                  value={newAddr.line1}
                  onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })}
                  className="w-full border border-[#bfc7d2] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#006194]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#3f4850] block mb-1">City, State & Pincode</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Karnataka - 560034"
                  value={newAddr.line2}
                  onChange={(e) => setNewAddr({ ...newAddr, line2: e.target.value })}
                  className="w-full border border-[#bfc7d2] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#006194]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#3f4850] block mb-1">Phone Number (For SMS Updates)</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="w-full border border-[#bfc7d2] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#006194]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border border-[#bfc7d2] rounded-lg font-semibold hover:bg-[#f2f4f6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#006194] text-white rounded-lg font-bold hover:bg-[#007bb9]"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Processing & Success Confirmation Modal */}
      {status !== "idle" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
            {status === "processing" ? (
              <div className="py-6">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-[#006194]/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-[#006194] rounded-full border-t-transparent animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-[#0b1c30] mb-2">Processing Payment</h3>
                <p className="text-gray-500 text-xs">Communicating with payment gateway & verifying transaction...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#6ffbbe]/30 text-[#005236] flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[42px]">check_circle</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0b1c30]">Payment & Order Confirmed!</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Thank you! Your grocery order has been placed successfully.
                  </p>
                </div>

                {confirmedOrder && (
                  <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#bfc7d2]/40 text-left text-xs space-y-2">
                    <div className="flex justify-between pb-2 border-b border-gray-200">
                      <span className="text-gray-500">Order ID:</span>
                      <span className="font-bold text-[#006194]">#{confirmedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Transaction ID:</span>
                      <span className="font-mono font-bold text-gray-700">{confirmedOrder.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Paid:</span>
                      <span className="font-bold text-[#006a61]">{inr(confirmedOrder.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Mode:</span>
                      <span className="font-semibold text-gray-700">{confirmedOrder.paymentMethod}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 flex items-center gap-1.5 text-[#006194] font-medium">
                      <span className="material-symbols-outlined text-[16px]">sms</span>
                      <span>Order Confirmation SMS sent to your phone!</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => navigate("/orders")}
                    className="flex-1 py-3 bg-[#006194] hover:bg-[#007bb9] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">local_shipping</span>
                    Track in Orders
                  </button>
                  <button
                    onClick={() => navigate("/storefront")}
                    className="flex-1 py-3 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006194] rounded-xl text-xs font-bold transition-all border border-[#006194]/20"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}