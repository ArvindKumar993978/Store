import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../component/CartContext";
import StorefrontNavbar from "../component/StorefrontNavbar.jsx";

/*
  OrderHistoryPage
  ----------------
  Reads real orders from CartContext (populated by CheckoutPage's
  placeOrder call) with full filter, CSV export, and view details modal.
*/

const PAGE_SIZE = 5;

const STATUS_STYLES = {
  Delivered: "bg-[#6ffbbe] text-[#005236]",
  Pending: "bg-[#dae2fd] text-[#5c647a]",
  "In Transit": "bg-[#cce5ff] text-[#004b73]",
  Cancelled: "bg-[#ffdad6] text-[#93000a]",
};

const inr = (n) =>
  `\u20B9${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  const d = new Date(isoString);
  return isNaN(d.getTime())
    ? isoString
    : d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { orders, orderStats } = useCart();
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter orders
  const filteredOrders = useMemo(() => {
    if (statusFilter === "ALL") return orders;
    return orders.filter((o) => o.status?.toLowerCase() === statusFilter.toLowerCase());
  }, [orders, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const visibleOrders = filteredOrders.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const rangeStart = filteredOrders.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const rangeEnd = Math.min(filteredOrders.length, page * PAGE_SIZE + PAGE_SIZE);

  // CSV Export handler
  const handleExportCSV = () => {
    if (!orders || orders.length === 0) {
      alert("No orders to export.");
      return;
    }
    const headers = ["Order ID", "Date", "Items Count", "Total Amount (INR)", "Status", "Payment Method"];
    const rows = orders.map((o) => [
      `"${o.id}"`,
      `"${formatDate(o.date)}"`,
      o.items ? o.items.length : 0,
      o.total,
      `"${o.status}"`,
      `"${o.paymentMethod || "Online/Card"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Order History</h1>
            <p className="text-[#3f4850] mt-1">Manage and track your recent purchases and business transactions.</p>
          </div>
          <button
            onClick={() => navigate("/storefront")}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2 bg-[#006194] text-white rounded-lg hover:bg-[#007bb9] transition-colors text-sm font-semibold shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            Continue Shopping
          </button>
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
          <div className="px-6 py-4 border-b border-[#bfc7d2]/30 flex flex-wrap justify-between items-center gap-3 bg-[#f7f9fb]">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold">Recent Transactions</h3>
              {statusFilter !== "ALL" && (
                <span className="text-xs bg-[#dae2fd] text-[#5c647a] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  Filter: {statusFilter}
                  <button onClick={() => setStatusFilter("ALL")} className="hover:text-black">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              )}
            </div>
            <div className="relative flex gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-[#bfc7d2] rounded-lg text-xs font-semibold hover:bg-[#f2f4f6] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  Filter
                </button>
                {showFilterMenu && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-[#bfc7d2]/50 py-1.5 z-20">
                    {["ALL", "Delivered", "In Transit", "Pending", "Cancelled"].map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          setStatusFilter(st);
                          setShowFilterMenu(false);
                          setPage(0);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-[#f2f4f6] flex items-center justify-between ${
                          statusFilter === st ? "text-[#006194] font-semibold bg-[#e6f2fb]" : "text-[#191c1e]"
                        }`}
                      >
                        {st === "ALL" ? "All Orders" : st}
                        {statusFilter === st && (
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-3 py-1.5 border border-[#bfc7d2] rounded-lg text-xs font-semibold hover:bg-[#f2f4f6] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export
              </button>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-semibold mb-2">No orders found</p>
              <p className="text-sm text-[#3f4850] mb-4">
                {orders.length === 0
                  ? "Orders you place at checkout will show up here."
                  : `No orders matching filter "${statusFilter}".`}
              </p>
              {statusFilter !== "ALL" ? (
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className="text-[#006194] font-semibold text-sm hover:underline"
                >
                  Clear filter
                </button>
              ) : (
                <button
                  onClick={() => navigate("/storefront")}
                  className="text-[#006194] font-semibold text-sm hover:underline"
                >
                  Browse products
                </button>
              )}
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
                        <td className="px-6 py-4 text-sm font-semibold tabular-nums text-[#006194]">#{order.id}</td>
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
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-[#006194] text-xs font-semibold hover:underline cursor-pointer"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-[#bfc7d2]/30 flex justify-between items-center">
                <span className="text-sm text-[#3f4850]">
                  Showing {rangeStart}-{rangeEnd} of {filteredOrders.length} orders
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#bfc7d2]/30 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#bfc7d2]/30 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#191c1e]">Order #{selectedOrder.id}</h3>
                <p className="text-xs text-[#707881] mt-0.5">Placed on {formatDate(selectedOrder.date)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-[#707881] hover:bg-[#f2f4f6] rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status & Delivery banner */}
              <div className="flex items-center justify-between p-3.5 bg-[#f7f9fb] rounded-xl border border-[#bfc7d2]/30">
                <div>
                  <span className="text-xs text-[#707881] block">Status</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                      STATUS_STYLES[selectedOrder.status] || "bg-[#e6e8ea] text-[#3f4850]"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#707881] block">Payment Method</span>
                  <span className="text-xs font-semibold text-[#191c1e] mt-1 block">
                    {selectedOrder.paymentMethod || "Prepaid"}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#707881] mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3">
                          {it.image && (
                            <img src={it.image} alt={it.name} className="w-10 h-10 object-cover rounded-lg border border-[#bfc7d2]/30" />
                          )}
                          <div>
                            <p className="font-semibold text-[#191c1e]">{it.name}</p>
                            <p className="text-xs text-[#707881]">Qty: {it.qty}</p>
                          </div>
                        </div>
                        <span className="font-medium text-[#191c1e] tabular-nums">{inr(it.price * (it.qty || 1))}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#707881]">No item details available.</p>
                  )}
                </div>
              </div>

              {/* Shipping Details */}
              {selectedOrder.shippingAddress && (
                <div className="pt-2 border-t border-[#bfc7d2]/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#707881] mb-2">Delivery Address</h4>
                  <p className="text-xs text-[#191c1e] font-medium">{selectedOrder.shippingAddress.name || "Default Address"}</p>
                  <p className="text-xs text-[#707881]">
                    {selectedOrder.shippingAddress.address || selectedOrder.shippingAddress.street || "Standard Delivery Destination"}
                  </p>
                </div>
              )}

              {/* Bill breakdown */}
              <div className="pt-3 border-t border-[#bfc7d2]/20 space-y-1.5 text-xs text-[#3f4850]">
                {selectedOrder.subtotal !== undefined && (
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{inr(selectedOrder.subtotal)}</span>
                  </div>
                )}
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-[#006947]">
                    <span>Coupon Discount</span>
                    <span className="tabular-nums">-{inr(selectedOrder.discount)}</span>
                  </div>
                )}
                {selectedOrder.tax !== undefined && (
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className="tabular-nums">{inr(selectedOrder.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#191c1e] pt-2 border-t border-gray-200">
                  <span>Total Paid</span>
                  <span className="text-[#006194] tabular-nums">{inr(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#f7f9fb] border-t border-[#bfc7d2]/30 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-[#006194] text-white rounded-lg hover:bg-[#007bb9] transition-colors text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-8 mt-8 bg-[#eceef0] border-t border-[#bfc7d2]">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1280px] mx-auto gap-4">
          <span className="text-xl font-semibold text-[#006194]">Efficient Ledger</span>
          <span className="text-sm text-[#3f4850]">© 2024 Efficient Ledger. All rights reserved.</span>
          <div className="flex gap-6">
            <button
              onClick={() => alert("Privacy Policy: Your data is safely protected with end-to-end encryption under Efficient Ledger guidelines.")}
              className="text-sm text-[#3f4850] hover:text-[#006194] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => alert("Terms of Service: By using this service you agree to store purchasing policies.")}
              className="text-sm text-[#3f4850] hover:text-[#006194] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => navigate("/help")}
              className="text-sm text-[#3f4850] hover:text-[#006194] transition-colors cursor-pointer"
            >
              Contact Support
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}