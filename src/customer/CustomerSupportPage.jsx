import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StorefrontNavbar from "../component/StorefrontNavbar.jsx";
import { useCart } from "../component/CartContext.jsx";

const categories = [
  {
    id: "tracking",
    label: "Order Tracking",
    sub: "Status & history",
    icon: "local_shipping",
    bg: "bg-[#dae2fd]",
    fg: "text-[#5c647a]",
  },
  {
    id: "returns",
    label: "Returns & Refunds",
    sub: "Easy resolutions",
    icon: "assignment_return",
    bg: "bg-[#00855b]",
    fg: "text-[#f5fff6]",
  },
  {
    id: "payments",
    label: "Payment Issues",
    sub: "Errors & security",
    icon: "payments",
    bg: "bg-[#ffdad6]",
    fg: "text-[#93000a]",
  },
  {
    id: "invoices",
    label: "Invoices & Billing",
    sub: "Ledger access",
    icon: "receipt_long",
    bg: "bg-[#cce5ff]",
    fg: "text-[#001d31]",
  },
];

const faqs = [
  {
    q: "How do I update my billing or shipping address?",
    a: "Go to your Account Settings or when placing a new order at Checkout, click 'Add New' under Delivery Address. Changes will automatically apply to future orders and invoices.",
  },
  {
    q: "When will I receive my refund?",
    a: "Refunds typically process within 5-7 business days depending on your bank's policy after we verify the returned item.",
  },
  {
    q: "How does the GST invoice work for business purchases?",
    a: "Every transaction generates a compliant digital invoice with detailed CGST/SGST breakdowns available to download in Order History.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support instant UPI (GPay, PhonePe, Paytm), all major Credit & Debit cards (Visa, Mastercard, RuPay), and Cash on Delivery (COD).",
  },
];

function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#eceef0] transition-colors"
      >
        <span className="text-sm font-semibold text-[#191c1e]">{q}</span>
        <span
          className={`material-symbols-outlined text-[#3f4850] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>
      {isOpen && <div className="p-4 text-sm bg-[#f7f9fb] text-[#3f4850] border-t border-[#bfc7d2]/20">{a}</div>}
    </div>
  );
}

export default function CustomerSupportPage() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [openFaq, setOpenFaq] = useState(0);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "agent", text: "Namaste! Welcome to Krishna Store support. How can I help you today?" }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const userText = inputMsg;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputMsg("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: `Thank you for your message regarding: "${userText}". An executive is reviewing this. You can also track active orders directly from your Orders page.`
        }
      ]);
    }, 1000);
  };

  const handleCategoryClick = (id) => {
    if (id === "tracking" || id === "invoices") {
      navigate("/orders");
    } else {
      setShowAllFaqs(true);
      setOpenFaq(id === "returns" ? 1 : 2);
    }
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      !searchQuery ||
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-[Inter,sans-serif] antialiased pb-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
      `}</style>

      <StorefrontNavbar cartCount={cartCount} />

      <main className="pt-24 px-4 sm:px-8 max-w-4xl mx-auto flex flex-col gap-8 min-h-screen">
        {/* Hero / Search */}
        <section className="flex flex-col gap-3 text-center sm:text-left py-2">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-[#006194]">Hello, how can we help?</h2>
            <p className="text-sm text-[#3f4850]">Find quick answers to your questions or reach our support specialists.</p>
          </div>
          <div className="relative group max-w-2xl mt-2">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#707881] group-focus-within:text-[#006194] transition-colors">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics, refunds, tracking, GST invoices..."
              className="w-full bg-white border border-[#bfc7d2] rounded-xl py-3.5 pl-12 pr-4 text-sm shadow-sm focus:outline-none focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all"
            />
          </div>
        </section>

        {/* Categories */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Top Categories</h3>
            <span className="text-xs text-[#707881]">Click to open quick solutions</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryClick(c.id)}
                className="flex flex-col items-start p-5 bg-white rounded-xl shadow-sm border border-[#bfc7d2]/20 hover:border-[#006194] hover:shadow-md active:scale-95 transition-all text-left group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${c.bg} ${c.fg}`}>
                  <span className="material-symbols-outlined text-[20px]">{c.icon}</span>
                </div>
                <span className="text-sm font-bold text-[#191c1e]">{c.label}</span>
                <span className="text-xs mt-1 text-[#707881]">{c.sub}</span>
              </button>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">Common Questions</h3>
            <button
              onClick={() => setShowAllFaqs((v) => !v)}
              className="text-xs font-semibold text-[#006194] hover:underline"
            >
              {showAllFaqs ? "Collapse All" : "Expand All"}
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-[#bfc7d2]/30 divide-y divide-[#bfc7d2]/30 overflow-hidden">
            {filteredFaqs.map((f, i) => (
              <FaqItem
                key={f.q}
                q={f.q}
                a={f.a}
                isOpen={showAllFaqs || openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </section>

        {/* Contact options */}
        <section className="flex flex-col gap-4 pt-4">
          <h3 className="text-lg font-bold text-center">Still need assistance?</h3>
          <div className="flex flex-col gap-3 max-w-lg mx-auto w-full">
            <button
              onClick={() => setChatOpen(true)}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold shadow-md bg-[#006194] text-white hover:bg-[#007bb9] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">chat_bubble</span>
              <span>Chat with Us Live</span>
            </button>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="mailto:support@krishnastore.com?subject=Krishna%20Store%20Support%20Request"
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-white border border-[#bfc7d2] text-[#3f4850] hover:bg-[#eceef0] transition-colors active:scale-95 text-sm"
              >
                <span className="material-symbols-outlined text-[#006194] text-lg">mail</span>
                <span>Email Support</span>
              </a>
              <a
                href="tel:+918001234567"
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-white border border-[#bfc7d2] text-[#3f4850] hover:bg-[#eceef0] transition-colors active:scale-95 text-sm"
              >
                <span className="material-symbols-outlined text-[#006194] text-lg">call</span>
                <span>Call Us</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Live Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-[#006194] text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">support_agent</span>
                <div>
                  <h4 className="font-bold text-sm">Krishna Store Support</h4>
                  <p className="text-[10px] text-white/80">Online | Average reply: 1m</p>
                </div>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f7f9fb]">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#006194] text-white rounded-br-none"
                        : "bg-white border border-[#bfc7d2]/30 text-[#191c1e] rounded-bl-none shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="p-3 border-t border-[#bfc7d2]/30 bg-white flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-[#bfc7d2] rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#006194]"
              />
              <button 
                type="submit" 
                className="bg-[#006194] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#007bb9]"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-2 bg-white border-t border-[#bfc7d2] shadow-lg">
        <button 
          onClick={() => navigate("/storefront")}
          className="flex flex-col items-center justify-center text-[#5c647a] hover:text-[#006194] transition-colors p-2"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-[11px] font-semibold mt-0.5">Home</span>
        </button>
        <button 
          onClick={() => navigate("/shopnow")}
          className="flex flex-col items-center justify-center text-[#5c647a] hover:text-[#006194] transition-colors p-2"
        >
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="text-[11px] font-semibold mt-0.5">Products</span>
        </button>
        <button 
          onClick={() => navigate("/orders")}
          className="flex flex-col items-center justify-center text-[#5c647a] hover:text-[#006194] transition-colors p-2"
        >
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-[11px] font-semibold mt-0.5">Orders</span>
        </button>
        <button 
          onClick={() => navigate("/help")}
          className="flex flex-col items-center justify-center bg-[#dae2fd] text-[#006194] rounded-full px-4 py-1"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            support_agent
          </span>
          <span className="text-[11px] font-bold mt-0.5">Support</span>
        </button>
      </nav>
    </div>
  );
}