import React, { useEffect } from "react";

/*
  EASY-TO-EDIT VERSION
  --------------------
  Every color, spacing, and font-size is written directly inside the
  className as a Tailwind "arbitrary value", e.g. bg-[#006194].

  Quick color reference:
    #006194  -> primary (blue)
    #007bb9  -> primary-container (icon backgrounds)
    #006a61  -> secondary (teal)
    #86f2e4  -> secondary-container (light teal, "Paid" badge)
    #894d00  -> tertiary (brown/orange)
    #ac6200  -> tertiary-container ("Pending" badge)
    #ba1a1a  -> error (red)
    #ffdad6  -> error-container ("Cancelled" badge)
    #0b1c30  -> main dark text
    #3f4850  -> secondary/gray text
    #f8f9ff  -> page background
    #eff4ff  -> light surface (table header, hover rows)
    #bfc7d2  -> border color

  DATA:
  Transactions, low-stock items, and summary stats are pulled from plain
  arrays near the top of the component (TRANSACTIONS, LOW_STOCK, STATS) —
  edit those arrays to change the numbers/rows, no need to touch the JSX.
*/

const STATS = [
  {
    icon: "payments",
    iconBg: "#007bb9",
    label: "Today's Sales",
    value: "\u20B912,450",
    sub: "vs \u20B911,100 yesterday",
    change: "+12%",
    changeColor: "#006a61",
  },
  {
    icon: "account_balance_wallet",
    iconBg: "#006a61",
    label: "Monthly Revenue",
    value: "\u20B93.2L",
    sub: "Oct 2023 Performance",
    change: "+8.4%",
    changeColor: "#006a61",
  },
  {
    icon: "percent",
    iconBg: "#894d00",
    label: "Profit Margin",
    value: "18%",
    sub: "Average across categories",
    change: "-1.2%",
    changeColor: "#ba1a1a",
  },
  {
    icon: "inventory",
    iconBg: "#bfc7d2",
    label: "Active Stock",
    value: "452",
    sub: "SKUs in inventory",
    change: "Stable",
    changeColor: "#006a61",
  },
];

const TRANSACTIONS = [
  { date: "Oct 24, 2023", id: "#INV-8921", customer: "Rajesh Kumar", amount: "\u20B92,450.00", status: "Paid" },
  { date: "Oct 24, 2023", id: "#INV-8920", customer: "Anjali Sharma", amount: "\u20B9890.00", status: "Pending" },
  { date: "Oct 23, 2023", id: "#INV-8919", customer: "Walk-in Customer", amount: "\u20B912,400.00", status: "Paid" },
  { date: "Oct 23, 2023", id: "#INV-8918", customer: "Suresh Prabhu", amount: "\u20B94,200.00", status: "Paid" },
  { date: "Oct 22, 2023", id: "#INV-8917", customer: "Meena Gupta", amount: "\u20B91,150.00", status: "Cancelled" },
];

const STATUS_STYLES = {
  Paid: { bg: "#86f2e4", text: "#006f66" },
  Pending: { bg: "#ac6200", text: "#fffbff" },
  Cancelled: { bg: "#ffdad6", text: "#93000a" },
};

const QUICK_ACTIONS = [
  { icon: "point_of_sale", bg: "#cce5ff", color: "#001d31", label: "New Sale", sub: "Process POS checkout" },
  { icon: "shopping_bag", bg: "#89f5e7", color: "#00201d", label: "New Purchase", sub: "Restock inventory" },
  { icon: "add_box", bg: "#ffdcc0", color: "#2d1600", label: "Add Product", sub: "List a new item" },
];

const LOW_STOCK = [
  { name: "Amul Butter 500g", note: "Only 2 units left", noteColor: "#ba1a1a" },
  { name: "Parle-G 20pk", note: "Only 5 units left", noteColor: "#ba1a1a" },
  { name: "Fortune Sunflower Oil 1L", note: "Out of stock", noteColor: "#ba1a1a" },
  { name: "Aashirvaad Atta 5kg", note: "3 units remaining", noteColor: "#894d00" },
];

const NAV_ITEMS = [
  { icon: "dashboard", label: "Dashboard", active: true },
  { icon: "inventory_2", label: "Products" },
  { icon: "receipt_long", label: "Billing" },
  { icon: "payments", label: "Sales" },
  { icon: "shopping_cart", label: "Purchases" },
  { icon: "bar_chart", label: "Reports" },
  { icon: "groups", label: "Customers" },
  { icon: "settings", label: "Settings" },
];

export default function iAdminDashboard() {
  // Card hover lift + button press-scale (same behavior as the original <script>)
  useEffect(() => {
    const cards = document.querySelectorAll(".glass-card");
    const cardCleanup = [];
    cards.forEach((card) => {
      const onEnter = () => {
        card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        card.style.transform = "translateY(-2px)";
      };
      const onLeave = () => {
        card.style.boxShadow = "";
        card.style.transform = "translateY(0px)";
      };
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      cardCleanup.push(() => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    const buttons = document.querySelectorAll("button");
    const btnCleanup = [];
    buttons.forEach((btn) => {
      const onDown = () => (btn.style.transform = "scale(0.95)");
      const onUp = () => (btn.style.transform = "scale(1)");
      btn.addEventListener("mousedown", onDown);
      btn.addEventListener("mouseup", onUp);
      btn.addEventListener("mouseleave", onUp);
      btnCleanup.push(() => {
        btn.removeEventListener("mousedown", onDown);
        btn.removeEventListener("mouseup", onUp);
        btn.removeEventListener("mouseleave", onUp);
      });
    });

    return () => {
      cardCleanup.forEach((fn) => fn());
      btnCleanup.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #bfc7d2; border-radius: 10px; }
        .glass-card {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(226,232,240,0.8);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
      `}</style>

      {/* ---------- Side Nav ---------- */}
      <aside className="fixed left-0 top-0 h-screen w-60 bg-[#f8f9ff] border-r border-[#bfc7d2] flex flex-col py-6 px-4 z-50">
        <div className="mb-8 px-2">
          <h1 className="text-[20px] font-bold text-[#006194]">Krishna Store</h1>
          <p className="text-[#3f4850] text-sm opacity-70">Inventory Admin</p>
        </div>

        <button className="mb-6 flex items-center justify-center gap-2 bg-[#006194] text-white py-4 px-6 rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
          <span className="material-symbols-outlined">add</span>
          New Sale
        </button>

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) =>
            item.active ? (
              <a
                key={item.label}
                href="#"
                className="flex items-center gap-4 px-4 py-2 rounded-lg text-[#006194] font-bold border-r-4 border-[#006194] bg-[#eff4ff] transition-colors"
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-base">{item.label}</span>
              </a>
            ) : (
              <a
                key={item.label}
                href="#"
                className="flex items-center gap-4 px-4 py-2 rounded-lg text-[#3f4850] hover:text-[#006194] hover:bg-[#e5eeff] transition-colors group"
              >
                <span className="material-symbols-outlined group-hover:text-[#006194]">{item.icon}</span>
                <span className="text-base">{item.label}</span>
              </a>
            )
          )}
        </nav>

        <div className="mt-auto pt-4 border-t border-[#bfc7d2]">
          <div className="flex items-center gap-4 px-2">
            <img
              className="w-10 h-10 rounded-full border border-[#bfc7d2]"
              alt="Admin profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCud5CkBYUASAGbSCh1h2HyR2xtAUt1Fa59QjWSOrxFwKIR4ReqAgyKB_q1i_4Ab5s1HiyFNwGUKg8tEykIS4dowDlg3uB6CB33wPJrUIEfgERo3c5MN3_mlUF-tJPdybd8cvJLdoxH1esWY86mEZuX5DqcO6CgFbMOYO112WxG5uve8MqgnyV86M845jNB2UAe33kRkBWQYc2nvGigRRjyy1eNXzSqMF17Vm5ObduXtD1H_unAuiIx1RodcNPPIg5Ivlj8ujUzCPgv"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">Krishna Murthy</p>
              <p className="text-[11px] text-[#3f4850] opacity-70">Admin Level 4</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ---------- Top Nav ---------- */}
      <header className="flex justify-between items-center h-16 px-6 sticky top-0 z-40 ml-60 bg-[#f8f9ff] border-b border-[#bfc7d2] shadow-sm">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#3f4850]">search</span>
            <input
              className="w-full bg-[#eff4ff] border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#006194]/20 transition-all"
              placeholder="Search products, invoices, customers..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-[#dce9ff] transition-all text-[#3f4850]">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full border-2 border-[#f8f9ff]" />
            </button>
            <button className="text-sm font-semibold text-[#3f4850] hover:text-[#006194] transition-all">Help</button>
          </div>
          <button className="bg-[#007bb9] text-white px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Product
          </button>
        </div>
      </header>

      {/* ---------- Main Content ---------- */}
      <main className="ml-60 p-6 min-h-screen">
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="glass-card p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.iconBg}1A`, color: stat.iconBg }}
                >
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <span className="flex items-center gap-1 text-[12px] font-bold" style={{ color: stat.changeColor }}>
                  {stat.change !== "Stable" && (
                    <span className="material-symbols-outlined text-[14px]">
                      {stat.changeColor === "#ba1a1a" ? "trending_down" : "trending_up"}
                    </span>
                  )}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-[#3f4850] text-sm uppercase tracking-wider mb-1">{stat.label}</h3>
              <p className="text-[32px] font-bold leading-tight">{stat.value}</p>
              <p className="text-sm text-[#3f4850] opacity-60 mt-2">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Recent Transactions */}
          <div className="col-span-12 lg:col-span-8 glass-card rounded-xl shadow-sm flex flex-col">
            <div className="p-6 border-b border-[#bfc7d2]/30 flex justify-between items-center">
              <h2 className="text-[20px] font-semibold">Recent Transactions</h2>
              <button className="text-[#006194] text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                <thead className="bg-[#eff4ff]/50">
                  <tr>
                    <th className="px-6 py-4 text-sm text-[#3f4850] uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-sm text-[#3f4850] uppercase tracking-wider">Invoice ID</th>
                    <th className="px-6 py-4 text-sm text-[#3f4850] uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-sm text-[#3f4850] uppercase tracking-wider text-right">Amount</th>
                    <th className="px-6 py-4 text-sm text-[#3f4850] uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bfc7d2]/20">
                  {TRANSACTIONS.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#eff4ff] transition-colors">
                      <td className="px-6 py-4 text-sm">{tx.date}</td>
                      <td className="px-6 py-4 text-base text-[#006194] font-bold">{tx.id}</td>
                      <td className="px-6 py-4 text-sm font-medium">{tx.customer}</td>
                      <td className="px-6 py-4 text-base text-right">{tx.amount}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className="px-4 py-1 rounded-full text-[12px] font-semibold"
                          style={{
                            backgroundColor: STATUS_STYLES[tx.status].bg,
                            color: STATUS_STYLES[tx.status].text,
                          }}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar widgets */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Quick actions */}
            <div className="glass-card rounded-xl p-6 shadow-sm">
              <h2 className="text-[20px] font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-4">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#e5eeff] transition-all border border-[#bfc7d2]/20"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: action.bg, color: action.color }}
                    >
                      <span className="material-symbols-outlined">{action.icon}</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold">{action.label}</p>
                      <p className="text-sm text-[#3f4850] opacity-70">{action.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Low stock alerts */}
            <div className="glass-card rounded-xl p-6 shadow-sm border-l-4 border-[#ba1a1a]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[20px] font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ba1a1a]">warning</span>
                  Low Stock
                </h2>
                <span className="bg-[#ffdad6] text-[#93000a] px-2 py-1 rounded-md text-[12px] font-bold">
                  {LOW_STOCK.length} Alerts
                </span>
              </div>
              <div className="space-y-4">
                {LOW_STOCK.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center p-2 rounded-lg hover:bg-[#eff4ff]"
                  >
                    <div>
                      <p className="text-base font-medium">{item.name}</p>
                      <p className="text-sm font-bold" style={{ color: item.noteColor }}>
                        {item.note}
                      </p>
                    </div>
                    <button className="p-2 text-[#006194] hover:bg-[#007bb9]/20 rounded-full transition-all">
                      <span className="material-symbols-outlined">refresh</span>
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 text-[#006194] text-sm font-semibold border border-[#006194]/20 rounded-lg hover:bg-[#006194] hover:text-white transition-all">
                Restock All Low Items
              </button>
            </div>

            {/* Goal progress */}
            <div className="glass-card rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-sm uppercase tracking-widest text-[#3f4850] mb-4">Goal Progress</h2>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-[32px] font-bold">72%</span>
                  <span className="text-sm text-[#3f4850] pb-1.5">of Monthly Goal Reached</span>
                </div>
                <div className="w-full bg-[#d3e4fe] rounded-full h-2.5 mb-6 overflow-hidden">
                  <div
                    className="bg-[#006194] h-full rounded-full transition-all duration-1000"
                    style={{ width: "72%", boxShadow: "0 0 10px rgba(0,97,148,0.5)" }}
                  />
                </div>
                <p className="text-sm text-[#3f4850] opacity-70">Need \u20B990,000 more to hit October target.</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[120px] text-[#006194]">analytics</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}