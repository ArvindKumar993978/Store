import React, { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import PosTopNav from "../component/PosTopNav";
import { useStore } from "../context/StoreContext";
import { sendPosInvoiceSMS } from "../services/smsService";

/*
  POS Billing Terminal (Advanced Retail Edition)
  ----------------------------------------------
  Connected to centralized StoreContext with:
  - Real-time stock depletion upon invoice generation
  - Camera Barcode Scanner with realistic Web Audio API pos beep
  - Digital Udhar / Khata Book payment support with credit limit validation
  - WhatsApp E-Invoice dispatch button
  - Promo code validation engine
  - Printable receipt modal
*/

const GST_RATE = 0.09; // 9% CGST + 9% SGST = 18% total

export default function Billing() {
  const navigate = useNavigate();
  const { products, recordPosSale, applyPromoCode, customers, settings } = useStore();

  // Normalized catalog from reactive StoreContext
  const catalog = useMemo(() => {
    return products.map((p) => {
      const pVal = typeof p.price === "number" ? p.price : parseFloat(String(p.price).replace(/[^0-9.]/g, "") || 0);
      return {
        id: p.id,
        name: p.name,
        hsn: p.sku || `HSN-${p.id}`,
        sku: p.sku || `SKU-${p.id}`,
        stock: Number(p.stock ?? 0),
        price: pVal,
        category: p.category,
        image: p.image,
      };
    });
  }, [products]);

  // Cart & checkout state
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoStatus, setPromoStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customer, setCustomer] = useState({
    name: "Walk-in Customer",
    phone: "",
    points: 0,
    outstanding: "₹0",
    creditLimit: 5000,
  });
  const [paymentMode, setPaymentMode] = useState("UPI"); // "UPI" | "CASH" | "CREDIT"
  const [allowCreditOverride, setAllowCreditOverride] = useState(false);

  // Dynamic UPI Payment states
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiRefInput, setUpiRefInput] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);

  const storeName = settings?.storeName || "Krishna General Store";
  const storeUpiId = settings?.upiId || "krishnastore@upi";

  const getUpiPayload = (amount, note = "POS Bill Payment") => {
    return `upi://pay?pa=${encodeURIComponent(storeUpiId)}&pn=${encodeURIComponent(storeName)}&am=${Number(amount || 0).toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
  };

  const getUpiQrUrl = (amount, note = "POS Bill Payment") => {
    const payload = getUpiPayload(amount, note);
    return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(payload)}`;
  };

  // Modals state
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({ name: "", phone: "", creditLimit: "5000" });
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Video scanner ref
  const videoRef = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // Synthesized authentic POS Beep
  const playPosBeep = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1850, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  // Camera start / stop effect
  useEffect(() => {
    let activeStream = null;
    if (showCameraModal) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: "environment" } })
          .then((stream) => {
            activeStream = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          })
          .catch((err) => {
            console.warn("Camera access not available or permission denied:", err);
          });
      }
    }
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showCameraModal]);

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const product = catalog.find((p) => p.id === id);
            const currentStock = product ? product.stock : item.stock;
            const newQty = item.qty + delta;
            if (newQty > currentStock) {
              showToast(`Only ${currentStock} units available in stock!`);
              return item;
            }
            if (delta > 0) playPosBeep();
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setPromoCodeInput("");
    setPromoStatus(null);
    setAllowCreditOverride(false);
  };

  // Add item from catalog
  const addItemToCart = (item) => {
    if (item.stock <= 0) {
      showToast(`${item.name} is currently Out of Stock!`);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((it) => it.id === item.id);
      if (existing) {
        if (existing.qty >= item.stock) {
          showToast(`Cannot add more than available stock (${item.stock})!`);
          return prev;
        }
        playPosBeep();
        return prev.map((it) => (it.id === item.id ? { ...it, qty: it.qty + 1 } : it));
      }
      playPosBeep();
      return [...prev, { ...item, qty: 1 }];
    });
    showToast(`Added ${item.name} to bill`);
  };

  // Search and add item to cart
  const handleAddItem = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    const term = searchQuery.trim().toLowerCase();
    const found = catalog.find(
      (it) =>
        it.name.toLowerCase().includes(term) ||
        (it.hsn && it.hsn.toLowerCase().includes(term)) ||
        (it.sku && it.sku.toLowerCase().includes(term))
    );

    if (found) {
      addItemToCart(found);
      setSearchQuery("");
    } else {
      showToast(`No item found matching "${searchQuery}".`);
    }
  };

  // Filtered suggestions when searching
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const term = searchQuery.trim().toLowerCase();
    return catalog
      .filter(
        (it) =>
          it.name.toLowerCase().includes(term) ||
          (it.sku && it.sku.toLowerCase().includes(term)) ||
          (it.category && it.category.toLowerCase().includes(term))
      )
      .slice(0, 5);
  }, [catalog, searchQuery]);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discountedSubtotal = Math.max(0, subtotal - Number(discount || 0));
    const cgst = discountedSubtotal * GST_RATE;
    const sgst = discountedSubtotal * GST_RATE;
    const grandTotal = discountedSubtotal + cgst + sgst;
    return { subtotal, cgst, sgst, grandTotal };
  }, [cart, discount]);

  const handleApplyCoupon = (e) => {
    if (e) e.preventDefault();
    if (!promoCodeInput.trim()) return;
    const res = applyPromoCode(promoCodeInput.trim(), totals.subtotal);
    if (res.valid) {
      setDiscount(res.discount);
      setPromoStatus({ success: true, msg: `Applied ${res.code}: Saved ₹${res.discount}!` });
      playPosBeep();
    } else {
      setPromoStatus({ success: false, msg: res.message });
    }
  };

  const totalItems = cart.length;
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  // Customer due & limit calculation
  const customerNumericDue = useMemo(() => {
    if (!customer || !customer.outstanding) return 0;
    if (typeof customer.outstanding === "string") {
      return parseFloat(customer.outstanding.replace(/[^0-9.]/g, "")) || 0;
    }
    return Number(customer.outstanding) || 0;
  }, [customer]);

  const customerCreditLimit = Number(customer?.creditLimit) || 5000;
  const projectedDue = customerNumericDue + totals.grandTotal;
  const isCreditOverLimit = paymentMode === "CREDIT" && projectedDue > customerCreditLimit;

  // Select customer from list
  const handleSelectCustomer = (c) => {
    setCustomer(c);
    setShowCustomerModal(false);
    showToast(`Selected customer: ${c.name}`);
  };

  // Customer submit
  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (newCustomerForm.name.trim()) {
      setCustomer({
        name: newCustomerForm.name.trim(),
        phone: newCustomerForm.phone.trim() || "N/A",
        points: 50,
        outstanding: "₹0",
        creditLimit: parseFloat(newCustomerForm.creditLimit) || 5000,
      });
      setShowCustomerModal(false);
      setNewCustomerForm({ name: "", phone: "", creditLimit: "5000" });
      showToast(`Customer ${newCustomerForm.name} saved!`);
    }
  };

  // Generate invoice & record sale to database
  const handleGenerateInvoice = (customUpiRef = null) => {
    if (cart.length === 0) {
      alert("Cart is empty! Scan or add items to generate an invoice.");
      return;
    }

    // Validation for Udhar/Khata sale
    if (paymentMode === "CREDIT") {
      if (customer.name === "Walk-in Customer") {
        alert("Udhar/Khata sale requires selecting or registering a customer! Please choose a customer.");
        setShowCustomerModal(true);
        return;
      }
      if (isCreditOverLimit && !allowCreditOverride) {
        alert(
          `Customer's projected due (₹${projectedDue.toFixed(2)}) exceeds their credit limit of ₹${customerCreditLimit}. Check "Allow Override" if authorized by manager.`
        );
        return;
      }
    }

    const invId = `INV-${Math.floor(10000 + Math.random() * 90000)}`;
    const finalUpiRef = customUpiRef || (paymentMode === "UPI" ? `UPI-${Date.now().toString().slice(-6)}` : null);

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
      upiRef: finalUpiRef,
      items: [...cart],
      subtotal: totals.subtotal,
      discount: Number(discount || 0),
      cgst: totals.cgst,
      sgst: totals.sgst,
      grandTotal: totals.grandTotal,
    };

    // Save to centralized store and decrement stock
    recordPosSale(newInvoice);
    setGeneratedInvoice(newInvoice);
    setShowUpiModal(false);
    setUpiRefInput("");
    playPosBeep();

    // Automatically dispatch SMS bill if customer phone is provided
    if (customer.phone && customer.phone !== "N/A") {
      sendPosInvoiceSMS({
        invoiceId: invId,
        customerName: customer.name,
        phone: customer.phone,
        grandTotal: totals.grandTotal,
        paymentMode: paymentMode === "UPI" && finalUpiRef ? `UPI (${finalUpiRef})` : paymentMode,
        itemsCount: cart.length
      });
      showToast(`SMS Bill sent to ${customer.phone}!`);
    }
  };

  const completeAndNewSale = () => {
    setGeneratedInvoice(null);
    clearCart();
    setCustomer({ name: "Walk-in Customer", phone: "", points: 0, outstanding: "₹0", creditLimit: 5000 });
  };

  // Manual SMS invoice sharing
  const handleSendInvoiceSMS = () => {
    if (!generatedInvoice) return;
    sendPosInvoiceSMS({
      invoiceId: generatedInvoice.id,
      customerName: generatedInvoice.customer,
      phone: generatedInvoice.phone || "+91 98765 43210",
      grandTotal: generatedInvoice.grandTotal,
      paymentMode: generatedInvoice.paymentMode,
      itemsCount: generatedInvoice.items.length
    });
    showToast(`SMS Bill dispatched to ${generatedInvoice.phone || "customer"}!`);
  };

  // WhatsApp invoice sharing
  const handleShareInvoiceWhatsApp = () => {
    if (!generatedInvoice) return;
    const rawPhone = (generatedInvoice.phone || "").replace(/[^0-9]/g, "");
    const cleanPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const storeTitle = settings?.storeName || "Krishna General Store";
    const storePhone = settings?.phone || "+91 98765 43210";

    const itemsText = generatedInvoice.items
      .map((it, idx) => `${idx + 1}. ${it.name} x ${it.qty} = ₹${(it.price * it.qty).toFixed(2)}`)
      .join("\n");

    const text = encodeURIComponent(
      `🧾 *${storeTitle} - Tax Invoice*\n` +
      `Invoice No: *${generatedInvoice.id}*\n` +
      `Date: ${generatedInvoice.date}\n` +
      `Customer: *${generatedInvoice.customer}*\n` +
      `Payment Mode: *${generatedInvoice.paymentMode}*\n` +
      `Status: *${generatedInvoice.status || "Paid"}*\n` +
      `--------------------------------\n` +
      `${itemsText}\n` +
      `--------------------------------\n` +
      `Subtotal: ₹${generatedInvoice.subtotal.toFixed(2)}\n` +
      (generatedInvoice.discount > 0 ? `Discount: -₹${generatedInvoice.discount.toFixed(2)}\n` : "") +
      `CGST+SGST (18%): ₹${(generatedInvoice.cgst + generatedInvoice.sgst).toFixed(2)}\n` +
      `*Grand Total: ₹${generatedInvoice.grandTotal.toFixed(2)}*\n\n` +
      `Thank you for shopping at ${storeTitle}! 🙏\n` +
      `Helpline: ${storePhone}`
    );

    const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(waUrl, "_blank");
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

      <main className="md:ml-60 ml-0 flex flex-col lg:flex-row gap-6 p-4 sm:p-6 transition-all duration-300">
        {/* Left: Cart area */}
        <section className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Search / scan bar */}
          <form
            onSubmit={handleAddItem}
            className="bg-white p-4 rounded-xl shadow-sm border border-[#bfc7d2] flex items-center gap-3"
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
              type="button"
              onClick={() => setShowCameraModal(true)}
              className="px-3.5 py-2 rounded-lg border border-[#006194]/40 hover:bg-[#eff4ff] text-[#006194] transition-all flex items-center gap-1.5 cursor-pointer font-bold text-xs"
              title="Camera Barcode Scanner"
            >
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              <span className="hidden sm:inline">Camera Scan</span>
            </button>
            <button
              type="submit"
              className="bg-[#006194] text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#007bb9] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
              Add Item
            </button>
          </form>

          {/* Quick suggestions when typing */}
          {searchSuggestions.length > 0 && (
            <div className="bg-white p-3 rounded-xl shadow-sm border border-[#bfc7d2] -mt-3 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-[#707881] font-semibold mr-1">Matching:</span>
              {searchSuggestions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    addItemToCart(item);
                    setSearchQuery("");
                  }}
                  className="px-3 py-1 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006194] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{item.name}</span>
                  <span className="font-bold">₹{item.price}</span>
                  <span className="text-[10px] text-gray-400">({item.stock} left)</span>
                </button>
              ))}
            </div>
          )}

          {/* Cart Table Container */}
          <div className="bg-white rounded-xl shadow-sm border border-[#bfc7d2] flex flex-col flex-1 overflow-hidden">
            <div className="p-4 border-b border-[#bfc7d2] flex justify-between items-center bg-[#f8f9ff]">
              <span className="text-sm font-bold uppercase tracking-wider text-[#3f4850]">
                Current Billing Basket
              </span>
              <span className="px-2.5 py-0.5 bg-[#eff4ff] text-[#006194] rounded-full text-xs font-bold">
                {totalItems} Line Items
              </span>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#bfc7d2] text-xs text-[#3f4850] bg-white">
                    <th className="p-4 uppercase tracking-wider">Item Details</th>
                    <th className="p-4 uppercase tracking-wider text-center">HSN / SKU</th>
                    <th className="p-4 uppercase tracking-wider text-center">Quantity</th>
                    <th className="p-4 uppercase tracking-wider text-right">Price</th>
                    <th className="p-4 uppercase tracking-wider text-right">Total</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bfc7d2]">
                  {cart.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f8f9ff] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded-lg border border-[#bfc7d2]/50"
                            />
                          )}
                          <div>
                            <div className="font-bold text-[#191c1e] text-sm">{item.name}</div>
                            <div className="text-xs text-[#707881]">
                              Available stock:{" "}
                              <span
                                className={`font-semibold ${
                                  item.stock <= 5 ? "text-amber-600 font-bold" : "text-[#006194]"
                                }`}
                              >
                                {item.stock} units
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center text-xs font-mono text-[#3f4850]">{item.sku}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-8 h-8 rounded-lg border border-[#bfc7d2] flex items-center justify-center font-bold text-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-8 h-8 rounded-lg border border-[#bfc7d2] flex items-center justify-center font-bold text-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right text-sm font-semibold">₹{item.price.toFixed(2)}</td>
                      <td className="p-4 text-right text-sm font-bold text-[#006194]">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => updateQty(item.id, -item.qty)}
                          className="text-[#ba1a1a] hover:bg-[#ffdad6] p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {cart.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-[#707881]">
                        <span className="material-symbols-outlined text-5xl mb-2 text-gray-300">
                          shopping_cart
                        </span>
                        <p className="font-semibold text-sm">Cart is currently empty.</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Scan barcode, click Camera Scan, or search product names to begin billing.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Cart summary strip */}
            <div className="p-4 bg-[#f8f9ff] border-t border-[#bfc7d2] flex justify-between items-center">
              <div className="flex gap-6">
                <div className="text-sm">
                  <span className="text-[#3f4850]">Items:</span>{" "}
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
              Customer Details &amp; Khata
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
                {customer.name !== "Walk-in Customer" && (
                  <div className="text-[11px] font-semibold text-red-600 mt-0.5">
                    Khata Due: {customer.outstanding || "₹0"} • Limit: ₹{customerCreditLimit}
                  </div>
                )}
              </div>
              <span className="material-symbols-outlined text-[20px] text-[#707881]">edit</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setShowCustomerModal(true)}
                className="flex-1 bg-[#dce9ff] py-2 rounded-lg text-xs font-bold text-[#006194] flex items-center justify-center gap-1 hover:bg-[#cce5ff] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">person_search</span>
                Select / Add
              </button>
              <button
                onClick={() => navigate("/khata")}
                className="flex-1 bg-amber-50 py-2 rounded-lg text-xs font-bold text-amber-800 flex items-center justify-center gap-1 hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200"
              >
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                Khata Book
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

              {/* Promo Code Input */}
              <div className="pt-3 border-t border-[#bfc7d2]/30">
                <label className="block text-xs text-[#3f4850] mb-1 font-semibold">Apply Promo Coupon</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. SAVE50, FRESH20"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 border border-[#bfc7d2] rounded-lg px-3 py-1.5 uppercase font-mono text-xs focus:border-[#006194] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3 py-1.5 bg-[#006194] text-white text-xs font-bold rounded-lg hover:bg-[#007bb9] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoStatus && (
                  <p
                    className={`text-[11px] mt-1 font-semibold ${
                      promoStatus.success ? "text-emerald-700" : "text-rose-600"
                    }`}
                  >
                    {promoStatus.msg}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <label className="block text-xs text-[#3f4850] mb-1 font-semibold">Manual Discount (₹)</label>
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 border border-[#bfc7d2] rounded-lg px-3 py-1.5 text-right focus:border-[#006194] outline-none text-sm font-semibold"
                    type="number"
                    value={discount}
                    onChange={(e) => {
                      setDiscount(Math.max(0, Number(e.target.value) || 0));
                      setPromoStatus(null);
                    }}
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

            {/* Payment Modes */}
            <div className="space-y-3 mt-6">
              <label className="block text-xs text-[#3f4850] uppercase tracking-wider font-semibold">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode("UPI")}
                  className={`flex flex-col items-center justify-center p-2.5 border rounded-xl transition-all cursor-pointer ${
                    paymentMode === "UPI"
                      ? "border-[#006194] bg-[#eff4ff] text-[#006194] font-bold shadow-sm"
                      : "border-[#bfc7d2] hover:bg-gray-50 text-[#3f4850]"
                  }`}
                >
                  <span className="material-symbols-outlined mb-1 text-[20px]">qr_code_2</span>
                  <span className="text-[11px] uppercase font-bold">UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode("CASH")}
                  className={`flex flex-col items-center justify-center p-2.5 border rounded-xl transition-all cursor-pointer ${
                    paymentMode === "CASH"
                      ? "border-[#006194] bg-[#eff4ff] text-[#006194] font-bold shadow-sm"
                      : "border-[#bfc7d2] hover:bg-gray-50 text-[#3f4850]"
                  }`}
                >
                  <span className="material-symbols-outlined mb-1 text-[20px]">payments</span>
                  <span className="text-[11px] uppercase font-bold">Cash</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMode("CREDIT");
                    if (customer.name === "Walk-in Customer") {
                      setShowCustomerModal(true);
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 border rounded-xl transition-all cursor-pointer ${
                    paymentMode === "CREDIT"
                      ? "border-amber-600 bg-amber-50 text-amber-800 font-bold shadow-sm"
                      : "border-[#bfc7d2] hover:bg-gray-50 text-[#3f4850]"
                  }`}
                >
                  <span className="material-symbols-outlined mb-1 text-[20px]">menu_book</span>
                  <span className="text-[11px] uppercase font-bold">Udhar Khata</span>
                </button>
              </div>

              {/* Udhar / Khata Warnings & Details */}
              {paymentMode === "CREDIT" && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Account: {customer.name}</span>
                    <span>Existing Due: {customer.outstanding || "₹0"}</span>
                  </div>
                  <p className="text-[11px] text-amber-700">
                    Grand Total ₹{totals.grandTotal.toFixed(2)} will be debited to {customer.name}'s Khata.
                  </p>
                  {isCreditOverLimit && (
                    <div className="pt-1.5 border-t border-amber-200 text-red-600 font-bold flex flex-col gap-1">
                      <span>⚠️ Exceeds Credit Limit (₹{customerCreditLimit})!</span>
                      <label className="text-[11px] flex items-center gap-1.5 cursor-pointer text-gray-700 font-medium">
                        <input
                          type="checkbox"
                          checked={allowCreditOverride}
                          onChange={(e) => setAllowCreditOverride(e.target.checked)}
                          className="rounded text-[#006194]"
                        />
                        Supervisor credit override authorized
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Live Dynamic UPI QR Code Box */}
              {paymentMode === "UPI" && (
                <div className="p-3.5 bg-[#eff4ff] rounded-xl border border-[#006194]/30 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#006194]">
                      <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                      <span>Live UPI Payment QR</span>
                    </div>
                    <span className="text-[10px] bg-[#6ffbbe] text-[#002113] font-bold px-2 py-0.5 rounded-full uppercase">
                      Exact Amount
                    </span>
                  </div>

                  {totals.grandTotal > 0 ? (
                    <div className="flex flex-col items-center bg-white p-3 rounded-xl border border-[#bfc7d2]/40 text-center shadow-xs">
                      {/* Scannable Dynamic QR Code */}
                      <div
                        className="relative group cursor-pointer"
                        onClick={() => setShowUpiModal(true)}
                        title="Click to view full screen QR"
                      >
                        <img
                          src={getUpiQrUrl(totals.grandTotal, `Counter Bill ${customer.name}`)}
                          alt="UPI QR Code"
                          className="w-36 h-36 rounded-xl border-2 border-[#006194] p-1 bg-white object-contain shadow-xs"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">
                          <span className="material-symbols-outlined mr-1 text-[18px]">fullscreen</span>
                          Fullscreen
                        </div>
                      </div>

                      <div className="mt-2.5 w-full text-xs">
                        <div className="flex justify-between items-center text-[#191c1e] font-bold pb-1 border-b border-gray-100">
                          <span className="text-gray-500 font-normal">Account Holder:</span>
                          <span className="truncate max-w-[160px] text-[#006194]">{storeName}</span>
                        </div>
                        <div className="flex justify-between items-center text-[#191c1e] font-bold py-1 border-b border-gray-100">
                          <span className="text-gray-500 font-normal">Exact Bill:</span>
                          <span className="text-emerald-700 text-sm font-extrabold">₹{totals.grandTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[#3f4850] pt-1">
                          <span className="text-gray-500 font-normal">UPI VPA:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-[11px] font-semibold">{storeUpiId}</span>
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
                      </div>

                      <div className="mt-2.5 flex gap-1.5 w-full">
                        <a
                          href={getUpiPayload(totals.grandTotal, `Bill ${customer.name}`)}
                          className="flex-1 bg-[#006194] hover:bg-[#007bb9] text-white py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          Open UPI App
                        </a>
                        <button
                          type="button"
                          onClick={() => setShowUpiModal(true)}
                          className="bg-gray-100 hover:bg-gray-200 text-[#191c1e] px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center transition-colors cursor-pointer"
                          title="Open Full Screen Counter QR"
                        >
                          <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                        </button>
                      </div>

                      <p className="text-[10px] text-gray-500 mt-2">
                        Scan with GPay, PhonePe, Paytm, BHIM or any UPI App
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-[#707881] text-center py-2">
                      Scan or add items to generate the live UPI payment QR code with the exact bill amount.
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  if (paymentMode === "UPI") {
                    if (cart.length === 0) {
                      alert("Cart is empty! Scan or add items to generate an invoice.");
                      return;
                    }
                    setShowUpiModal(true);
                  } else {
                    handleGenerateInvoice();
                  }
                }}
                className="w-full bg-[#006194] text-white py-3.5 rounded-xl text-base font-bold shadow-md hover:bg-[#007bb9] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">
                  {paymentMode === "UPI" ? "qr_code_scanner" : "check_circle"}
                </span>
                {paymentMode === "UPI"
                  ? `Collect UPI Payment (₹${totals.grandTotal.toFixed(2)})`
                  : "Generate Invoice"}
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

      {/* Select / Register Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 border border-[#bfc7d2]">
            <div className="flex justify-between items-center mb-4 border-b border-[#bfc7d2]/30 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-[#191c1e]">Select or Add Customer</h3>
                <p className="text-xs text-[#565e74]">Choose an existing Khata customer or register a new one</p>
              </div>
              <button
                onClick={() => setShowCustomerModal(false)}
                className="p-1 text-gray-500 hover:text-black rounded-full"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Quick Pick from Existing Customers */}
            <div className="mb-6">
              <label className="text-xs font-bold text-[#3f4850] block uppercase mb-2">
                Registered Customers ({customers?.length || 0})
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-2 bg-[#f8f9ff]">
                <button
                  type="button"
                  onClick={() =>
                    handleSelectCustomer({
                      name: "Walk-in Customer",
                      phone: "",
                      points: 0,
                      outstanding: "₹0",
                      creditLimit: 5000,
                    })
                  }
                  className="w-full text-left p-2 rounded-lg hover:bg-white text-xs font-semibold flex justify-between items-center border border-transparent hover:border-gray-200 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-[#191c1e]">Walk-in Customer</span>
                  <span className="text-gray-400">Cash/UPI only</span>
                </button>
                {(customers || []).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCustomer(c)}
                    className="w-full text-left p-2 rounded-lg hover:bg-white text-xs font-semibold flex justify-between items-center border border-transparent hover:border-[#006194] transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-[#191c1e]">{c.name}</p>
                      <p className="text-[11px] text-gray-500">{c.phone || "No phone"}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-red-600 font-bold block">Due: {c.outstanding || "₹0"}</span>
                      <span className="text-[10px] text-gray-400">Limit: ₹{c.creditLimit || 5000}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Or Register New Customer */}
            <div className="pt-3 border-t">
              <p className="text-xs font-bold text-[#3f4850] uppercase mb-2">Or Register New Customer</p>
              <form onSubmit={handleSaveCustomer} className="space-y-3">
                <div>
                  <input
                    required
                    type="text"
                    placeholder="Customer Name *"
                    value={newCustomerForm.name}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-[#006194]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    placeholder="Mobile / WhatsApp *"
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-[#006194]"
                  />
                  <input
                    type="number"
                    placeholder="Credit Limit (e.g. 5000)"
                    value={newCustomerForm.creditLimit}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, creditLimit: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-[#006194]"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#006194] text-white rounded-xl text-xs font-bold hover:bg-[#007bb9]"
                  >
                    Save &amp; Select
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomerModal(false)}
                    className="flex-1 py-2.5 bg-gray-100 text-[#3f4850] rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Camera Barcode Scanner Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 border border-[#bfc7d2] overflow-hidden">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006194]">photo_camera</span>
                <h3 className="font-extrabold text-lg text-[#191c1e]">Camera Barcode Scanner</h3>
              </div>
              <button
                onClick={() => setShowCameraModal(false)}
                className="text-gray-400 hover:text-black p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Video Viewport */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-[#006194]">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-48 h-32 border-2 border-dashed border-white/80 rounded-xl relative">
                  <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_#f00] animate-bounce" />
                </div>
                <span className="text-[11px] text-white font-medium mt-2 bg-black/60 px-2.5 py-0.5 rounded-full">
                  Align Barcode Inside Box
                </span>
              </div>
            </div>

            {/* Quick-Tap Items Barcode Simulation */}
            <div className="mt-4">
              <p className="text-xs font-bold text-[#565e74] uppercase mb-2">
                Tap to Simulate Barcode Gun Scan (Plays POS Audio Beep):
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {catalog.slice(0, 8).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      addItemToCart(item);
                    }}
                    className="p-2 border rounded-xl hover:bg-[#eff4ff] text-left text-xs font-semibold flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div className="truncate mr-1">
                      <p className="font-bold text-[#191c1e] truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{item.sku}</p>
                    </div>
                    <span className="text-[11px] font-bold text-[#006194]">₹{item.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t flex justify-end">
              <button
                onClick={() => setShowCameraModal(false)}
                className="px-5 py-2.5 bg-[#006194] text-white rounded-xl text-xs font-bold hover:bg-[#007bb9] cursor-pointer"
              >
                Close Scanner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Fullscreen Counter UPI Modal */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 border border-[#bfc7d2] overflow-hidden text-center">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006194] text-[24px]">qr_code_2</span>
                <h3 className="font-extrabold text-lg text-[#191c1e]">UPI Counter Payment</h3>
              </div>
              <button
                onClick={() => setShowUpiModal(false)}
                className="text-gray-400 hover:text-black p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Account Holder & Amount Showcase */}
            <div className="bg-[#eff4ff] p-4 rounded-2xl border border-[#006194]/20 mb-4 text-center">
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#565e74]">Account Holder</p>
              <h4 className="text-lg font-black text-[#006194] mt-0.5">{storeName}</h4>
              <div className="flex items-center justify-center gap-1.5 mt-1 text-xs text-[#3f4850]">
                <span>UPI ID:</span>
                <span className="font-mono font-bold text-[#006194]">{storeUpiId}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(storeUpiId);
                    setCopiedUpi(true);
                    setTimeout(() => setCopiedUpi(false), 2000);
                  }}
                  className="text-[#006194] text-[11px] underline ml-1 cursor-pointer font-semibold"
                >
                  {copiedUpi ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-[#006194]/20 flex items-baseline justify-center gap-2">
                <span className="text-xs text-gray-500 font-semibold">Exact Payable:</span>
                <span className="text-3xl font-black text-[#191c1e] tabular-nums">
                  ₹{totals.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Large Scannable QR Code */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border-2 border-dashed border-[#006194] mb-4">
              <img
                src={getUpiQrUrl(totals.grandTotal, `Bill ${customer.name}`)}
                alt="UPI QR Code"
                className="w-56 h-56 object-contain rounded-xl p-1 bg-white shadow-sm"
              />
              <div className="mt-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-emerald-800">
                  Scan &amp; Pay exact ₹{totals.grandTotal.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Compatible with PhonePe, Google Pay, Paytm, BHIM, CRED
              </p>
            </div>

            {/* Optional UTR / Reference Input */}
            <div className="mb-4 text-left">
              <label className="block text-xs font-bold text-[#3f4850] mb-1">
                Customer UPI Ref / UTR No. (Optional):
              </label>
              <input
                type="text"
                value={upiRefInput}
                onChange={(e) => setUpiRefInput(e.target.value)}
                placeholder="e.g. 429381048201 or last 4 digits"
                className="w-full px-3 py-2 border border-[#bfc7d2] rounded-xl text-xs outline-none focus:border-[#006194] font-mono"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleGenerateInvoice(upiRefInput.trim() || `UPI-${Date.now().toString().slice(-6)}`);
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Payment Received &amp; Print Bill
              </button>
              <button
                type="button"
                onClick={() => setShowUpiModal(false)}
                className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-[#3f4850] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Printable Receipt Modal */}
      {generatedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 border border-[#bfc7d2]">
            {/* Printable ticket */}
            <div id="printable-receipt" className="border-b border-dashed border-gray-300 pb-4 text-center">
              <h2 className="text-xl font-extrabold text-[#006194]">
                {settings?.storeName || "KRISHNA GENERAL STORE"}
              </h2>
              <p className="text-xs text-[#707881]">Tax Invoice / Retail Sale</p>
              <p className="text-xs text-[#707881] mt-0.5">
                GSTIN: {settings?.gstin || "29AAAAA0000A1Z5"} | Phone: {settings?.phone || "+91 98765 43210"}
              </p>
              <div className="flex justify-between text-xs text-[#3f4850] mt-4 pt-2 border-t border-gray-200">
                <span>Invoice: <strong className="text-black">{generatedInvoice.id}</strong></span>
                <span>{generatedInvoice.date}</span>
              </div>
              <div className="flex justify-between text-xs text-[#3f4850] mt-1">
                <span>Customer: <strong>{generatedInvoice.customer}</strong></span>
                <span>Mode: <strong className="uppercase">{generatedInvoice.paymentMode}</strong></span>
              </div>
              {generatedInvoice.paymentMode === "UPI" && (
                <div className="mt-2 py-1.5 px-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-md border border-emerald-200 flex justify-between items-center">
                  <span>✓ PAID VIA UPI ({generatedInvoice.upiRef || "VERIFIED"})</span>
                  <span className="font-mono text-[11px]">{storeUpiId}</span>
                </div>
              )}
              {generatedInvoice.paymentMode === "CREDIT" && (
                <div className="mt-2 py-1 px-2 bg-amber-50 text-amber-800 text-xs font-extrabold rounded-md border border-amber-200">
                  ⚠️ BILLED ON UDHAR KHATA (PAYMENT DUE)
                </div>
              )}
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-6 border-t mt-4">
              <button
                onClick={() => window.print()}
                className="py-2.5 bg-gray-100 hover:bg-gray-200 text-[#191c1e] rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                Print Bill
              </button>
              <button
                onClick={handleShareInvoiceWhatsApp}
                className="py-2.5 bg-[#25d366] hover:bg-[#1ebd5a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                WhatsApp
              </button>
              <button
                onClick={handleSendInvoiceSMS}
                className="py-2.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006194] border border-[#006194]/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">sms</span>
                Send SMS
              </button>
              <button
                onClick={completeAndNewSale}
                className="py-2.5 bg-[#006194] hover:bg-[#007bb9] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">done_all</span>
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-[#006194] text-white px-5 py-3 rounded-2xl shadow-2xl z-50 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          {toastMsg}
        </div>
      )}
    </div>
  );
}
