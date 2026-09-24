import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";

const DEFAULT_CUSTOMER = {
  name: "Rajesh Jha",
  tier: "Platinum",
  email: "rajesh.jha@example.com",
  phone: "+91 98765 43210",
  photo:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDTXXi6joZoh-Zs92h7sttgbIVgu7CVoLElxlj7jGIteC_hyTYZB-kxEcBcELDDmz2eeReCxCANpT6eFz8GDSJ00YtXZC6Fk6-wmYHhSsp50IlzGcfBt_KkFU16UBeu5wOa3wuepHJZeEGmmzYwm17eel4-Cv9fICNc3gQzgfHHpdE0vMSGGnhmB8RKiuz-eI_gO85h5escbB5kw5sAek_a_LnTDVrPtdHJAY0Psop1HgFAue9NyiXNEq5RptVNZjb0YB0d5vZcYYV_",
};

const METRICS = [
  { label: "Total Lifetime Value", value: 142850, prefix: "₹", note: "+12% from last month", noteColor: "#006947" },
  { label: "Total Orders", value: 54, note: "Avg. 4.5 orders/mo" },
  { label: "Average Order Value", value: 2645, prefix: "₹", note: "High preference for bulk" },
];

const LAST_PURCHASE = { date: "Oct 24, 2023", note: "3 days ago" };

const PURCHASE_HISTORY = [
  { id: "#ORD-99821", date: "Oct 24, 2023", amount: "₹4,200.00", status: "Completed", items: "10x Whole Milk 1L, 2x Honey Loops" },
  { id: "#ORD-99754", date: "Oct 18, 2023", amount: "₹1,150.00", status: "Completed", items: "2x Premium Basmati Rice" },
  { id: "#ORD-99612", date: "Oct 12, 2023", amount: "₹8,900.00", status: "Refunded", items: "Bulk Groceries Package" },
  { id: "#ORD-99505", date: "Oct 05, 2023", amount: "₹3,450.00", status: "Completed", items: "5x Sunflower Oil, 4x Amul Butter" },
];

const STATUS_STYLES = {
  Completed: { bg: "#00855b1A", text: "#006947" },
  Refunded: { bg: "#dae2fd", text: "#5c647a" },
};

const TOP_CATEGORIES = [
  { name: "Dairy & Eggs", pct: 45, opacity: 1 },
  { name: "Snacks & Beverages", pct: 30, opacity: 0.7 },
  { name: "Personal Care", pct: 25, opacity: 0.4 },
];

const FREQUENTLY_BOUGHT = [
  { icon: "glass_cup", name: "Organic Milk 1L", times: "12x" },
  { icon: "bakery_dining", name: "Whole Wheat Bread", times: "8x" },
  { icon: "local_cafe", name: "Premium Filter Coffee", times: "5x" },
];

const INITIAL_TIMELINE = [
  { date: "Today, 10:30 AM", dateColor: "#006194", dotColor: "#006194", title: "Last purchase processed", detail: "Order #ORD-99821 successfully delivered." },
  { date: "Oct 20, 2023", dotColor: "#006947", title: "Redeemed 500 points", detail: "Used for ₹100 discount on snacks category." },
  { date: "Sep 15, 2023", dotColor: "#565e74", title: "Upgraded to Platinum", detail: "Reached ₹1,00,000 lifetime spend milestone." },
  { date: "Jan 12, 2023", dotColor: "#707881", title: "Joined Loyalty Program", detail: "Welcome bonus of 100 points added." },
];

function CountUp({ value, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.floor(progress * value));
      if (progress < 1) frameRef.current = requestAnimationFrame(update);
    };
    frameRef.current = requestAnimationFrame(update);

    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  return (
    <>
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </>
  );
}

export default function CustomerProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(() => {
    const passed = location.state?.customer;
    if (passed) {
      return {
        name: passed.name || DEFAULT_CUSTOMER.name,
        tier: passed.tier || DEFAULT_CUSTOMER.tier,
        email: passed.email || `${passed.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        phone: passed.phone || DEFAULT_CUSTOMER.phone,
        photo: DEFAULT_CUSTOMER.photo,
      };
    }
    return DEFAULT_CUSTOMER;
  });

  const [timeline, setTimeline] = useState(INITIAL_TIMELINE);

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Form states
  const [editForm, setEditForm] = useState({ name: customer.name, email: customer.email, tier: customer.tier });
  const [messageText, setMessageText] = useState("");
  const [refundForm, setRefundForm] = useState({ orderId: "#ORD-99821", amount: "4200", reason: "Damaged packaging" });
  const [pointsInput, setPointsInput] = useState("100");

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCustomer((prev) => ({
      ...prev,
      name: editForm.name,
      email: editForm.email,
      tier: editForm.tier,
    }));
    setShowEditModal(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    alert(`Message dispatched to ${customer.name}:\n\n"${messageText}"`);
    setShowMessageModal(false);
    setMessageText("");
  };

  const handleProcessRefund = (e) => {
    e.preventDefault();
    alert(`Refund of ₹${refundForm.amount} processed for order ${refundForm.orderId}. Reason: ${refundForm.reason}`);
    setTimeline((prev) => [
      {
        date: "Just now",
        dateColor: "#ba1a1a",
        dotColor: "#ba1a1a",
        title: `Manual Refund Processed (₹${refundForm.amount})`,
        detail: `Refund for ${refundForm.orderId}: ${refundForm.reason}`,
      },
      ...prev,
    ]);
    setShowRefundModal(false);
  };

  const handleAdjustPoints = (e) => {
    e.preventDefault();
    const pts = Number(pointsInput) || 0;
    alert(`${pts >= 0 ? "Added" : "Deducted"} ${Math.abs(pts)} loyalty points for ${customer.name}.`);
    setTimeline((prev) => [
      {
        date: "Just now",
        dateColor: "#006194",
        dotColor: "#006194",
        title: `Points Adjusted (${pts >= 0 ? `+${pts}` : pts} pts)`,
        detail: `Manual admin loyalty balance adjustment.`,
      },
      ...prev,
    ]);
    setShowPointsModal(false);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
      `}</style>

      <Sidebar />

      <main className="ml-[280px] min-h-screen p-6 max-w-[1280px] mx-auto">
        {/* Header & breadcrumbs */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-[#3f4850] mb-2">
              <button
                onClick={() => navigate("/customer")}
                className="text-xs font-semibold hover:text-[#006194] hover:underline cursor-pointer"
              >
                Customers
              </button>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-xs font-semibold text-[#006194]">Customer Profile</span>
            </nav>
            <div className="flex items-center gap-4">
              <img className="w-20 h-20 rounded-xl object-cover shadow-sm border border-gray-200" alt={customer.name} src={customer.photo} />
              <div>
                <h2 className="text-[32px] font-bold">{customer.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="px-3 py-1 bg-[#006194]/10 text-[#006194] rounded-full text-[12px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    {customer.tier} Tier
                  </span>
                  <span className="text-[#3f4850] text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                    {customer.email}
                  </span>
                  <span className="text-[#3f4850] text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    {customer.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditForm({ name: customer.name, email: customer.email, tier: customer.tier });
                setShowEditModal(true);
              }}
              className="px-4 py-2 border border-[#bfc7d2] hover:bg-[#f2f4f6] transition-all text-sm font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
              Edit Profile
            </button>
            <button
              onClick={() => setShowMessageModal(true)}
              className="px-4 py-2 bg-[#006194] text-white hover:bg-[#007bb9] active:scale-[0.98] transition-all text-sm font-semibold rounded-lg flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
              Send Message
            </button>
          </div>
        </header>

        {/* Bento grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Metric cards */}
          {METRICS.map((m) => (
            <div key={m.label} className="col-span-12 md:col-span-3 p-6 bg-white rounded-xl shadow-sm border border-[#bfc7d2]/20">
              <p className="text-[#3f4850] text-xs mb-2">{m.label}</p>
              <h3 className="text-[32px] font-bold text-[#006194]">
                <CountUp value={m.value} prefix={m.prefix} />
              </h3>
              <p className="text-xs mt-2 flex items-center gap-1" style={{ color: m.noteColor || "#3f4850" }}>
                {m.noteColor && <span className="material-symbols-outlined text-[14px]">trending_up</span>}
                {m.note}
              </p>
            </div>
          ))}
          <div className="col-span-12 md:col-span-3 p-6 bg-white rounded-xl shadow-sm border border-[#bfc7d2]/20">
            <p className="text-[#3f4850] text-xs mb-2">Last Purchase</p>
            <h3 className="text-[32px] font-bold">{LAST_PURCHASE.date}</h3>
            <p className="text-[#3f4850] text-xs mt-2">{LAST_PURCHASE.note}</p>
          </div>

          {/* Left column */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Purchase history */}
            <div className="bg-white rounded-xl shadow-sm border border-[#bfc7d2]/20 overflow-hidden">
              <div className="p-6 border-b border-[#bfc7d2]/20 flex justify-between items-center">
                <h4 className="text-[20px] font-semibold">Purchase History</h4>
                <button
                  onClick={() => navigate("/sales")}
                  className="text-[#006194] text-sm font-semibold hover:underline cursor-pointer"
                >
                  View All Transactions
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#f2f4f6] text-[#3f4850] text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#bfc7d2]/10">
                    {PURCHASE_HISTORY.map((order) => (
                      <tr key={order.id} className="hover:bg-[#f2f4f6] transition-colors">
                        <td className="px-6 py-4 text-[#006194] text-sm font-semibold">{order.id}</td>
                        <td className="px-6 py-4 text-sm">{order.date}</td>
                        <td className="px-6 py-4 text-sm font-semibold">{order.amount}</td>
                        <td className="px-6 py-4">
                          <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                            style={{ backgroundColor: STATUS_STYLES[order.status]?.bg, color: STATUS_STYLES[order.status]?.text }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-[#3f4850] hover:text-[#006194] transition-colors cursor-pointer"
                            title="View Order Details"
                          >
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Buying preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2]/20">
                <h4 className="text-[20px] font-semibold mb-6">Top Categories</h4>
                <div className="space-y-4">
                  {TOP_CATEGORIES.map((cat) => (
                    <div key={cat.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{cat.name}</span>
                        <span>{cat.pct}%</span>
                      </div>
                      <div className="w-full bg-[#eceef0] rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${cat.pct}%`, backgroundColor: `rgba(0,97,148,${cat.opacity})` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2]/20">
                <h4 className="text-[20px] font-semibold mb-4">Frequently Bought</h4>
                <ul className="space-y-3">
                  {FREQUENTLY_BOUGHT.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-center justify-between p-2 hover:bg-[#f2f4f6] rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#eceef0] rounded flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#006194]">{item.icon}</span>
                        </div>
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-[#3f4850] text-sm font-semibold">{item.times}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right column: timeline + quick actions */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2]/20 h-full flex flex-col justify-between">
              <div>
                <h4 className="text-[20px] font-semibold mb-6">Engagement Timeline</h4>
                <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[2px] before:bg-[#bfc7d2]/30">
                  {timeline.map((event, idx) => (
                    <div key={idx} className="relative pl-8">
                      <div
                        className="absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white z-10"
                        style={{ backgroundColor: event.dotColor }}
                      />
                      <p className="text-xs font-semibold" style={{ color: event.dateColor || "#3f4850" }}>
                        {event.date}
                      </p>
                      <p className="text-sm mt-1 font-semibold">{event.title}</p>
                      <p className="text-[12px] text-[#3f4850]">{event.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-[#bfc7d2]/20">
                <h5 className="text-xs text-[#3f4850] uppercase tracking-wider mb-4 font-semibold">
                  Quick Admin Actions
                </h5>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => window.print()}
                    className="w-full px-4 py-3 bg-[#f2f4f6] hover:bg-[#dae2fd] transition-all rounded-lg flex items-center justify-between group cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-[#006194]">
                      <span className="material-symbols-outlined">picture_as_pdf</span>
                      Print / PDF Customer Report
                    </span>
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>

                  <button
                    onClick={() => setShowRefundModal(true)}
                    className="w-full px-4 py-3 bg-[#f2f4f6] hover:bg-[#ffdad6] transition-all rounded-lg flex items-center justify-between group cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-[#ba1a1a]">
                      <span className="material-symbols-outlined">assignment_return</span>
                      Issue Manual Refund
                    </span>
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>

                  <button
                    onClick={() => setShowPointsModal(true)}
                    className="w-full px-4 py-3 bg-[#f2f4f6] hover:bg-[#cce5ff] transition-all rounded-lg flex items-center justify-between group cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-[#006194]">
                      <span className="material-symbols-outlined">loyalty</span>
                      Adjust Loyalty Points
                    </span>
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-[#bfc7d2]/30 flex flex-col md:flex-row justify-between items-center text-[#3f4850]">
          <p className="text-sm">© 2024 Efficient Ledger. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <button
              onClick={() => alert("Privacy Policy: Customer data is strictly confidential.")}
              className="text-sm hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => alert("Terms of Service: Customer profile management guidelines.")}
              className="text-sm hover:underline cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => navigate("/help")}
              className="text-sm hover:underline cursor-pointer"
            >
              Help Center
            </button>
            <button
              onClick={() => navigate("/help")}
              className="text-sm hover:underline cursor-pointer"
            >
              Contact Us
            </button>
          </div>
        </footer>
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-[#bfc7d2] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="font-bold text-lg text-[#191c1e]">Edit Customer Profile</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-black">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#006194]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#006194]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Tier</label>
                <select
                  value={editForm.tier}
                  onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#006194]"
                >
                  <option value="Platinum">Platinum</option>
                  <option value="Gold">Gold</option>
                  <option value="Regular">Regular</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#006194] text-white rounded-lg text-sm font-semibold hover:bg-[#007bb9]"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-[#3f4850] rounded-lg text-sm font-semibold hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-[#bfc7d2] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="font-bold text-lg text-[#191c1e]">Message {customer.name}</h3>
              <button onClick={() => setShowMessageModal(false)} className="text-gray-500 hover:text-black">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Send To</label>
                <p className="text-xs text-[#565e74] bg-gray-50 p-2 rounded border">{customer.phone} / {customer.email}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message, discount notice, or transaction update..."
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#006194] resize-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#006194] text-white rounded-lg text-sm font-semibold hover:bg-[#007bb9]"
                >
                  Dispatch Message
                </button>
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-[#3f4850] rounded-lg text-sm font-semibold hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-[#bfc7d2] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="font-bold text-lg text-[#ba1a1a] flex items-center gap-2">
                <span className="material-symbols-outlined">assignment_return</span>
                Issue Manual Refund
              </h3>
              <button onClick={() => setShowRefundModal(false)} className="text-gray-500 hover:text-black">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleProcessRefund} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Order ID</label>
                <select
                  value={refundForm.orderId}
                  onChange={(e) => setRefundForm({ ...refundForm, orderId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#ba1a1a]"
                >
                  {PURCHASE_HISTORY.map((o) => (
                    <option key={o.id} value={o.id}>{o.id} ({o.amount}) - {o.date}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Refund Amount (₹)</label>
                <input
                  required
                  type="number"
                  value={refundForm.amount}
                  onChange={(e) => setRefundForm({ ...refundForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#ba1a1a]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Reason for Refund</label>
                <input
                  required
                  type="text"
                  value={refundForm.reason}
                  onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#ba1a1a]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#ba1a1a] text-white rounded-lg text-sm font-semibold hover:bg-red-700"
                >
                  Confirm Refund
                </button>
                <button
                  type="button"
                  onClick={() => setShowRefundModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-[#3f4850] rounded-lg text-sm font-semibold hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Points Modal */}
      {showPointsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-[#bfc7d2] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="font-bold text-lg text-[#006194] flex items-center gap-2">
                <span className="material-symbols-outlined">loyalty</span>
                Adjust Loyalty Points
              </h3>
              <button onClick={() => setShowPointsModal(false)} className="text-gray-500 hover:text-black">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAdjustPoints} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">
                  Points Delta (e.g. +100 or -50)
                </label>
                <input
                  required
                  type="number"
                  value={pointsInput}
                  onChange={(e) => setPointsInput(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#006194]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#006194] text-white rounded-lg text-sm font-semibold hover:bg-[#007bb9]"
                >
                  Update Points
                </button>
                <button
                  type="button"
                  onClick={() => setShowPointsModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-[#3f4850] rounded-lg text-sm font-semibold hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-[#bfc7d2] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-[#191c1e]">{selectedOrder.id}</h3>
                <p className="text-xs text-[#707881]">{selectedOrder.date}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-black">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#707881]">Status</span>
                <span className="font-semibold text-emerald-700">{selectedOrder.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707881]">Items</span>
                <span className="font-medium text-right text-xs max-w-[200px]">{selectedOrder.items}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-bold">Total Amount</span>
                <span className="font-extrabold text-[#006194]">{selectedOrder.amount}</span>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-[#006194] text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
