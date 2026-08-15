import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart , GST_RATE } from "../component/CartContext";
import StorefrontNavbar from "../component/StorefrontNavbar.jsx";

/*
  OrderHistoryPage
  ----------------
  Reads real orders from CartContext (populated by CheckoutPage's
  placeOrder call) instead of hardcoded rows. Summary cards
  (Total Orders / In Transit / Total Spent) come from the context's
  orderStats, so they always match the table below.

  Icons use Google's Material Symbols font + Tailwind classes (no icon
  library import) to match the rest of the app.
*/

const PAGE_SIZE = 5;

const STATUS_STYLES = {
  Delivered: "bg-[#6ffbbe] text-[#005236]",
  Pending: "bg-[#dae2fd] text-[#5c647a]",
  "In Transit": "bg-[#dae2fd] text-[#5c647a]",
  Cancelled: "bg-[#ffdad6] text-[#93000a]",
};

const inr = (n) =>
  `\u20B9${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { orders, orderStats } = useCart();
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const visibleOrders = orders.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const rangeStart = orders.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const rangeEnd = Math.min(orders.length, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-[Inter,sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      {/* Top nav */}
      <StorefrontNavbar cartCount={0} />

      <main className="pt-24 pb-12 px-6 max-w-[1280px] mx-auto min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="text-[#3f4850] mt-1">Manage and track your recent purchases and business transactions.</p>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-2 border border-[#bfc7d2]/20">
            <div className="flex justify-between items-start">
              <span className="p-3 bg-[#cce5ff] text-[#004b73] rounded-lg">
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              </span>
            </div>
            <div className="mt-4">
              <p className="text-[10px] text-[#707881] uppercase tracking-wider font-semibold">Total Orders</p>
              <p className="text-3xl font-bold">{String(orderStats.totalOrders).padStart(2, "0")}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-2 border border-[#bfc7d2]/20">
            <div className="flex justify-between items-start">
              <span className="p-3 bg-[#dae2fd] text-[#5c647a] rounded-lg">
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              </span>
              {orderStats.inTransit > 0 && (
                <span className="text-[#565e74] text-xs font-medium bg-[#e6e8ea] px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-[10px] text-[#707881] uppercase tracking-wider font-semibold">In Transit</p>
              <p className="text-3xl font-bold">{String(orderStats.inTransit).padStart(2, "0")}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-2 border border-[#bfc7d2]/20">
            <div className="flex justify-between items-start">
              <span className="p-3 bg-[#6ffbbe] text-[#005236] rounded-lg">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </span>
              <span className="text-[#006947] text-xs font-medium bg-[#6ffbbe]/20 px-2 py-1 rounded-full">
                Lifetime
              </span>
            </div>
            <div className="mt-4">
              <p className="text-[10px] text-[#707881] uppercase tracking-wider font-semibold">Total Spent</p>
              <p className="text-3xl font-bold tabular-nums">{inr(orderStats.totalSpent)}</p>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfc7d2]/30">
          <div className="px-6 py-4 border-b border-[#bfc7d2]/30 flex justify-between items-center bg-[#f7f9fb]">
            <h3 className="text-xl font-semibold">Recent Transactions</h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 border border-[#bfc7d2] rounded-lg text-xs font-semibold hover:bg-[#f2f4f6] transition-colors">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Filter
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-[#bfc7d2] rounded-lg text-xs font-semibold hover:bg-[#f2f4f6] transition-colors">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export
              </button>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-semibold mb-2">No orders yet</p>
              <p className="text-sm text-[#3f4850] mb-4">
                Orders you place at checkout will show up here.
              </p>
              <button
                onClick={() => navigate("/")}
                className="text-[#006194] font-semibold text-sm hover:underline"
              >
                Browse products
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f2f4f6]">
                      <th className="px-6 py-4 text-xs font-semibold text-[#707881]">Order ID</th>
                      <th className="px-6 py-4 text-xs font-semibold text-[#707881]">Date</th>
                      <th className="px-6 py-4 text-xs font-semibold text-[#707881]">Amount</th>
                      <th className="px-6 py-4 text-xs font-semibold text-[#707881]">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-[#707881] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#bfc7d2]/20">
                    {visibleOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#f7f9fb] transition-colors">
                        <td className="px-6 py-4 text-sm tabular-nums">#{order.id}</td>
                        <td className="px-6 py-4 text-sm text-[#3f4850]">{formatDate(order.date)}</td>
                        <td className="px-6 py-4 text-sm font-semibold tabular-nums">{inr(order.total)}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_STYLES[order.status] || "bg-[#e6e8ea] text-[#3f4850]"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a className="text-[#006194] text-xs font-semibold hover:underline" href="#">
                            View Details
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-[#bfc7d2]/30 flex justify-between items-center">
                <span className="text-sm text-[#3f4850]">
                  Showing {rangeStart}-{rangeEnd} of {orders.length} orders
                </span>
                <div className="flex gap-2">
                  <button
                    className="p-2 border border-[#bfc7d2] rounded-lg hover:bg-[#f2f4f6] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button
                    className="p-2 border border-[#bfc7d2] rounded-lg hover:bg-[#f2f4f6] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 mt-8 bg-[#eceef0] border-t border-[#bfc7d2]">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1280px] mx-auto gap-4">
          <span className="text-xl font-semibold text-[#006194]">Efficient Ledger</span>
          <span className="text-sm text-[#3f4850]">© 2024 Efficient Ledger. All rights reserved.</span>
          <div className="flex gap-6">
            <a className="text-sm text-[#3f4850] hover:text-[#006194] transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="text-sm text-[#3f4850] hover:text-[#006194] transition-colors" href="#">
              Terms of Service
            </a>
            <a className="text-sm text-[#3f4850] hover:text-[#006194] transition-colors" href="#">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}