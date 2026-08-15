import React, { useState } from "react";
import Sidebar from "../component/Sidebar";
import SubscriptionTopNav from "../component/SubscriptionTopNav";

const billingHistory = [
  { date: "Oct 24, 2023", plan: "Business Pro (Annual)", amount: "₹4,999.00" },
  { date: "Oct 24, 2022", plan: "Business Pro (Annual)", amount: "₹4,999.00" },
  { date: "Sep 15, 2022", plan: "Plan Upgrade Fee", amount: "₹1,200.00" },
];

export default function SubscriptionPlans() {
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setShowModal(true);
    setTimeout(() => setModalVisible(true), 10);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setShowModal(false), 300);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      <Sidebar />
      <SubscriptionTopNav />

      {/* Main Content Canvas */}
      <main className="ml-60 p-8 max-w-7xl">
        {/* Subscription Header Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[32px] leading-[40px] tracking-[-0.02em] font-bold text-[#191c1e]">
                Subscription &amp; Plans
              </h2>
              <span className="bg-[#6ffbbe] text-[#002113] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Active
              </span>
            </div>
            <p className="text-[14px] leading-[20px] text-[#3f4850]">
              Manage your account tier, billing frequency, and payment methods for the Efficient
              Ledger portal.
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-right">
              <p className="text-[12px] tracking-[0.05em] font-semibold text-[#3f4850]">
                Current Plan
              </p>
              <p className="text-[20px] leading-[28px] font-semibold text-[#006194]">
                Business Pro
              </p>
            </div>
            <div className="flex gap-4 mt-2">
              <div className="text-right border-r border-[#bfc7d2] pr-4">
                <p className="text-[10px] text-[#3f4850] uppercase">Next Renewal</p>
                <p className="text-[14px] leading-[20px] font-bold">Oct 24, 2024</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#3f4850] uppercase">Cost</p>
                <p className="text-[14px] leading-[20px] font-bold">₹4,999/year</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Grid (Bento Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tier 1: Starter */}
          <div className="bg-white rounded-xl border border-[#bfc7d2] p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="mb-6">
              <span className="text-[#3f4850] text-[12px] tracking-[0.05em] font-semibold">
                Starter
              </span>
              <h3 className="text-[32px] leading-[40px] tracking-[-0.02em] font-bold mt-1">
                Free
              </h3>
              <p className="text-[14px] leading-[20px] text-[#3f4850] mt-2">
                For single-counter shops and hobbyist merchants.
              </p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-3 text-[14px] leading-[20px]">
                <span className="material-symbols-outlined text-[#006947] text-sm">
                  check_circle
                </span>
                Up to 50 Invoices / mo
              </li>
              <li className="flex items-center gap-3 text-[14px] leading-[20px]">
                <span className="material-symbols-outlined text-[#006947] text-sm">
                  check_circle
                </span>
                1 Staff Account
              </li>
              <li className="flex items-center gap-3 text-[14px] leading-[20px] opacity-40">
                <span className="material-symbols-outlined text-sm">block</span>
                Inventory Forecasting
              </li>
              <li className="flex items-center gap-3 text-[14px] leading-[20px] opacity-40">
                <span className="material-symbols-outlined text-sm">block</span>
                Priority Support
              </li>
            </ul>
            <button className="w-full py-2 px-4 border border-[#707881] text-[#191c1e] text-[12px] tracking-[0.05em] font-semibold rounded-lg hover:bg-[#f2f4f6] transition-colors">
              Downgrade
            </button>
          </div>

          {/* Tier 2: Business Pro (Current) */}
          <div className="relative bg-[#007bb9]/10 rounded-xl border-2 border-[#006194] p-6 flex flex-col shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#006194] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase">
              Current Plan
            </div>
            <div className="mb-6">
              <span className="text-[#006194] text-[12px] tracking-[0.05em] font-semibold">
                Business Pro
              </span>
              <h3 className="text-[32px] leading-[40px] tracking-[-0.02em] font-bold mt-1">
                ₹4,999<span className="text-[14px] leading-[20px] font-normal">/yr</span>
              </h3>
              <p className="text-[14px] leading-[20px] text-[#3f4850] mt-2">
                Best for growing retail chains and pharmacies.
              </p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-3 text-[14px] leading-[20px]">
                <span className="material-symbols-outlined text-[#006947] text-sm">
                  check_circle
                </span>
                Unlimited Invoices
              </li>
              <li className="flex items-center gap-3 text-[14px] leading-[20px]">
                <span className="material-symbols-outlined text-[#006947] text-sm">
                  check_circle
                </span>
                5 Staff Accounts
              </li>
              <li className="flex items-center gap-3 text-[14px] leading-[20px]">
                <span className="material-symbols-outlined text-[#006947] text-sm">
                  check_circle
                </span>
                Advanced Inventory Analytics
              </li>
              <li className="flex items-center gap-3 text-[14px] leading-[20px] opacity-40">
                <span className="material-symbols-outlined text-sm">block</span>
                Priority Support
              </li>
            </ul>
            <button className="w-full py-2 px-4 bg-[#006194] text-white text-[12px] tracking-[0.05em] font-semibold rounded-lg opacity-50 cursor-not-allowed">
              Active Tier
            </button>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="bg-white rounded-xl border border-[#bfc7d2] p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="mb-6">
              <span className="text-[#3f4850] text-[12px] tracking-[0.05em] font-semibold">
                Enterprise
              </span>
              <h3 className="text-[32px] leading-[40px] tracking-[-0.02em] font-bold mt-1">
                Custom
              </h3>
              <p className="text-[14px] leading-[20px] text-[#3f4850] mt-2">
                White-label solutions and multi-region logistics.
              </p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-3 text-[14px] leading-[20px]">
                <span className="material-symbols-outlined text-[#006947] text-sm">
                  check_circle
                </span>
                Unlimited Invoices
              </li>
              <li className="flex items-center gap-3 text-[14px] leading-[20px]">
                <span className="material-symbols-outlined text-[#006947] text-sm">
                  check_circle
                </span>
                Unlimited Staff
              </li>
              <li className="flex items-center gap-3 text-[14px] leading-[20px]">
                <span className="material-symbols-outlined text-[#006947] text-sm">
                  check_circle
                </span>
                Inventory Forecasting (AI Driven)
              </li>
              <li className="flex items-center gap-3 text-[14px] leading-[20px]">
                <span className="material-symbols-outlined text-[#006947] text-sm">
                  check_circle
                </span>
                24/7 Priority Support
              </li>
            </ul>
            <button className="w-full py-2 px-4 bg-[#2d3133] text-[#eff1f3] text-[12px] tracking-[0.05em] font-semibold rounded-lg hover:opacity-90 transition-opacity">
              Contact Sales
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Billing History Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#bfc7d2] overflow-hidden">
            <div className="p-6 border-b border-[#bfc7d2] flex justify-between items-center">
              <h3 className="text-[20px] leading-[28px] font-semibold">Billing History</h3>
              <button className="text-[#006194] text-[12px] tracking-[0.05em] font-semibold hover:underline">
                Download All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f2f4f6]">
                  <tr>
                    <th className="px-6 py-3 text-[12px] tracking-[0.05em] font-semibold text-[#3f4850]">
                      Invoice Date
                    </th>
                    <th className="px-6 py-3 text-[12px] tracking-[0.05em] font-semibold text-[#3f4850]">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-[12px] tracking-[0.05em] font-semibold text-[#3f4850]">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-[12px] tracking-[0.05em] font-semibold text-[#3f4850]">
                      Status
                    </th>
                    <th className="px-6 py-3 text-[12px] tracking-[0.05em] font-semibold text-[#3f4850] text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bfc7d2]">
                  {billingHistory.map((row) => (
                    <tr
                      key={row.date}
                      onClick={() => console.log(`Opening invoice for ${row.date}`)}
                      className="hover:bg-[#f2f4f6] transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 text-[14px] leading-[20px] font-medium">
                        {row.date}
                      </td>
                      <td className="px-6 py-4 text-[14px] leading-[20px]">{row.plan}</td>
                      <td className="px-6 py-4 text-[14px] leading-[20px] font-medium">
                        {row.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-[#006947]/10 text-[#006947] px-3 py-1 rounded-full text-[10px] font-bold">
                          PAID
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1 hover:bg-[#e0e3e5] rounded text-[#006194]">
                          <span className="material-symbols-outlined text-[20px]">download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-[#bfc7d2] p-6 h-fit">
              <h3 className="text-[20px] leading-[28px] font-semibold mb-4">Payment Method</h3>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden mb-6">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full"></div>
                <div className="absolute right-8 top-8 w-12 h-12 bg-white/5 rounded-full"></div>
                <div className="flex justify-between items-start mb-10">
                  <span className="material-symbols-outlined text-4xl">credit_card</span>
                  <span className="text-sm font-bold tracking-widest italic opacity-60">VISA</span>
                </div>
                <div className="mb-4">
                  <p className="text-xs opacity-50 uppercase tracking-widest mb-1">Card Number</p>
                  <p className="text-xl tracking-widest">•••• •••• •••• 4242</p>
                </div>
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] opacity-50 uppercase tracking-widest">Expires</p>
                    <p className="text-sm font-bold">12 / 26</p>
                  </div>
                  <div>
                    <p className="text-[10px] opacity-50 uppercase tracking-widest">Card Holder</p>
                    <p className="text-sm font-bold uppercase tracking-tight">Rajesh Kumar</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={openModal}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-[#707881] text-[#191c1e] text-[12px] tracking-[0.05em] font-semibold rounded-lg hover:bg-[#f2f4f6] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Update Details
                </button>
                <button className="w-full py-2 px-4 text-[#ba1a1a] text-[12px] tracking-[0.05em] font-semibold text-center hover:bg-[#ba1a1a]/5 rounded-lg transition-colors">
                  Remove Method
                </button>
              </div>
            </div>

            {/* Support Anchor */}
            <div className="bg-[#006194]/5 border border-[#006194]/20 p-6 rounded-xl">
              <h4 className="text-[20px] leading-[28px] font-semibold text-[#006194] mb-2">
                Need help?
              </h4>
              <p className="text-[14px] leading-[20px] text-[#3f4850] mb-4">
                Having trouble with your subscription or need a custom quote for 10+ stores?
              </p>
              <button className="text-[#006194] font-bold flex items-center gap-1 group">
                Talk to a Specialist
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div
            className={`bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 ${
              modalVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#00855b] rounded-full flex items-center justify-center mb-6">
                <span
                  className="material-symbols-outlined text-[#006947] text-4xl"
                  style={{ fontVariationSettings: "'wght' 700" }}
                >
                  check
                </span>
              </div>
              <h3 className="text-[32px] leading-[40px] tracking-[-0.02em] font-bold mb-2">
                Settings Updated
              </h3>
              <p className="text-[16px] leading-[24px] text-[#3f4850] mb-8">
                Your subscription preferences and payment methods have been successfully updated.
              </p>
              <button
                onClick={closeModal}
                className="w-full bg-[#006194] text-white py-3 rounded-xl font-bold hover:shadow-lg active:scale-95 transition-all"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
