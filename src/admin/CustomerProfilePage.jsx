import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../component/Sidebar";
import { useLocation } from "react-router-dom";

/*
  EASY-TO-EDIT VERSION
  --------------------
  Colors as Tailwind arbitrary values, e.g. text-[#006194].

  Quick color reference:
    #006194  -> primary (blue)
    #006947  -> tertiary (green, "Completed" badges, growth text)
    #565e74  -> secondary text
    #ba1a1a  -> error (red, "Issue Manual Refund")
    #f7f9fb  -> page background
    #f2f4f6  -> surface-container-low
    #bfc7d2  -> border color

  DATA:
  CUSTOMER, METRICS, PURCHASE_HISTORY, TOP_CATEGORIES,
  FREQUENTLY_BOUGHT, TIMELINE, and QUICK_ACTIONS below feed every
  section on the page — edit those arrays to change the content.

  The four top metric numbers (₹1,42,850 / 54 / ₹2,645) count up from
  0 on page load, same animation as the original page's script — see
  the <CountUp> component at the bottom of this file.
*/



const CUSTOMER = {
  name: "Rajesh Jha",
  tier: "Platinum Tier",
  email: "rajesh.jha@example.com",
  photo:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDTXXi6joZoh-Zs92h7sttgbIVgu7CVoLElxlj7jGIteC_hyTYZB-kxEcBcELDDmz2eeReCxCANpT6eFz8GDSJ00YtXZC6Fk6-wmYHhSsp50IlzGcfBt_KkFU16UBeu5wOa3wuepHJZeEGmmzYwm17eel4-Cv9fICNc3gQzgfHHpdE0vMSGGnhmB8RKiuz-eI_gO85h5escbB5kw5sAek_a_LnTDVrPtdHJAY0Psop1HgFAue9NyiXNEq5RptVNZjb0YB0d5vZcYYV_",
};

const METRICS = [
  { label: "Total Lifetime Value", value: 142850, prefix: "\u20B9", note: "+12% from last month", noteColor: "#006947" },
  { label: "Total Orders", value: 54, note: "Avg. 4.5 orders/mo" },
  { label: "Average Order Value", value: 2645, prefix: "\u20B9", note: "High preference for bulk" },
];

const LAST_PURCHASE = { date: "Oct 24, 2023", note: "3 days ago" };

const PURCHASE_HISTORY = [
  { id: "#ORD-99821", date: "Oct 24, 2023", amount: "\u20B94,200.00", status: "Completed" },
  { id: "#ORD-99754", date: "Oct 18, 2023", amount: "\u20B91,150.00", status: "Completed" },
  { id: "#ORD-99612", date: "Oct 12, 2023", amount: "\u20B98,900.00", status: "Refunded" },
  { id: "#ORD-99505", date: "Oct 05, 2023", amount: "\u20B93,450.00", status: "Completed" },
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

const TIMELINE = [
  { date: "Today, 10:30 AM", dateColor: "#006194", dotColor: "#006194", title: "Last purchase processed", detail: "Order #ORD-99821 successfully delivered." },
  { date: "Oct 20, 2023", dotColor: "#006947", title: "Redeemed 500 points", detail: "Used for \u20B9100 discount on snacks category." },
  { date: "Sep 15, 2023", dotColor: "#565e74", title: "Upgraded to Platinum", detail: "Reached \u20B91,00,000 lifetime spend milestone." },
  { date: "Jan 12, 2023", dotColor: "#707881", title: "Joined Loyalty Program", detail: "Welcome bonus of 100 points added." },
];

const QUICK_ACTIONS = [
  { icon: "picture_as_pdf", iconColor: "#006194", hoverBg: "#dae2fd80", label: "Generate PDF Report", trailIcon: "download" },
  { icon: "assignment_return", iconColor: "#ba1a1a", hoverBg: "#ffdad633", label: "Issue Manual Refund", trailIcon: "chevron_right" },
  { icon: "loyalty", iconColor: "#006194", hoverBg: "#007bb933", label: "Adjust Loyalty Points", trailIcon: "add_circle" },
];

const FOOTER_LINKS = ["Privacy Policy", "Terms of Service", "Help Center", "Contact Us"];

// Counts up from 0 to `value` over ~1s on mount, same as the original page's script.
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

  const selectedCustomer = location.state?.customer || CUSTOMER;

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
              <span className="text-xs font-semibold">Customers</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-xs font-semibold text-[#006194]">Customer Profile</span>
            </nav>
            <div className="flex items-center gap-4">
              <img className="w-20 h-20 rounded-xl object-cover shadow-sm" alt={selectedCustomer.name} src={selectedCustomer.photo} />
              <div>
                <h2 className="text-[32px] font-bold">{selectedCustomer.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="px-3 py-1 bg-[#006194]/10 text-[#006194] rounded-full text-[12px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    {selectedCustomer.tier}
                  </span>
                  <span className="text-[#3f4850] text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                    {selectedCustomer.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-[#bfc7d2] hover:bg-[#f2f4f6] transition-all text-sm font-semibold rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">edit</span>
              Edit Profile
            </button>
            <button className="px-4 py-2 bg-[#006194] text-white hover:opacity-90 active:scale-[0.98] transition-all text-sm font-semibold rounded-lg flex items-center gap-2 shadow-sm">
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
                <button className="text-[#006194] text-sm font-semibold hover:underline">View All Transactions</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#f2f4f6] text-[#3f4850] text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#bfc7d2]/10">
                    {PURCHASE_HISTORY.map((order) => (
                      <tr key={order.id} className="hover:bg-[#f2f4f6] transition-colors">
                        <td className="px-6 py-4 text-[#006194] text-sm">{order.id}</td>
                        <td className="px-6 py-4 text-sm">{order.date}</td>
                        <td className="px-6 py-4 text-sm">{order.amount}</td>
                        <td className="px-6 py-4">
                          <span
                            className="px-2 py-1 rounded-full text-[10px] font-bold uppercase"
                            style={{ backgroundColor: STATUS_STYLES[order.status].bg, color: STATUS_STYLES[order.status].text }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-[#3f4850] hover:text-[#006194] transition-colors">
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
            <div className="grid grid-cols-2 gap-6">
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
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-[#3f4850] text-sm">{item.times}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right column: timeline + quick actions */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2]/20 h-full">
              <h4 className="text-[20px] font-semibold mb-6">Engagement Timeline</h4>
              <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[2px] before:bg-[#bfc7d2]/30">
                {TIMELINE.map((event) => (
                  <div key={event.title} className="relative pl-8">
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

              <div className="mt-12 pt-6 border-t border-[#bfc7d2]/20">
                <h5 className="text-xs text-[#3f4850] uppercase tracking-wider mb-4 font-semibold">
                  Quick Admin Actions
                </h5>
                <div className="grid grid-cols-1 gap-3">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      className="w-full px-4 py-3 bg-[#f2f4f6] transition-all rounded-lg flex items-center justify-between group"
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = action.hoverBg)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        <span className="material-symbols-outlined" style={{ color: action.iconColor }}>
                          {action.icon}
                        </span>
                        {action.label}
                      </span>
                      <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">
                        {action.trailIcon}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-[#bfc7d2]/30 flex flex-col md:flex-row justify-between items-center text-[#3f4850]">
          <p className="text-sm">© 2024 Efficient Ledger. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {FOOTER_LINKS.map((link) => (
              <a key={link} className="text-sm hover:underline decoration-[#006194] transition-all" href="#">
                {link}
              </a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
