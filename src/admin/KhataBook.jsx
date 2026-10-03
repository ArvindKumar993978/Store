import React, { useState, useMemo } from "react";
import Sidebar from "../component/Sidebar";
import Topnav from "../component/Topnav";
import { useStore } from "../context/StoreContext";

export default function KhataBook() {
  const {
    customers,
    khataLedger,
    settings,
    recordKhataPayment,
    recordKhataDebit,
    updateCustomerCreditLimit,
    addCustomer,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("all"); // "all" | "pending" | "settled" | "limit_exceeded"
  const [sortBy, setSortBy] = useState("highest_due");

  // Modals
  const [selectedCustomer, setSelectedCustomer] = useState(null); // for viewing ledger
  const [paymentModalCustomer, setPaymentModalCustomer] = useState(null); // for recording Jama
  const [debitModalCustomer, setDebitModalCustomer] = useState(null); // for adding manual Udhar
  const [limitModalCustomer, setLimitModalCustomer] = useState(null); // for setting limit
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [paymentNote, setPaymentNote] = useState("");

  // Debit form state
  const [debitAmount, setDebitAmount] = useState("");
  const [debitNote, setDebitNote] = useState("");

  // Limit form state
  const [newCreditLimit, setNewCreditLimit] = useState("");

  // Add customer form state
  const [newCustForm, setNewCustForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "Bengaluru, Karnataka",
    initialCredit: "",
    creditLimit: "5000",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Helper to parse numeric outstanding
  const getCustomerDue = (c) => {
    if (typeof c.outstanding === "string") {
      return parseFloat(c.outstanding.replace(/[^0-9.]/g, "")) || 0;
    }
    return Number(c.outstanding) || 0;
  };

  // Format currency
  const formatINR = (num) => {
    return `₹${Math.round(num).toLocaleString("en-IN")}`;
  };

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    return (customers || [])
      .map((c) => {
        const due = getCustomerDue(c);
        const limit = Number(c.creditLimit) || 5000;
        const isLimitExceeded = due > limit;
        return {
          ...c,
          numericDue: due,
          creditLimitVal: limit,
          isLimitExceeded,
        };
      })
      .filter((c) => {
        // Tab filter
        if (filterTab === "pending" && c.numericDue <= 0) return false;
        if (filterTab === "settled" && c.numericDue > 0) return false;
        if (filterTab === "limit_exceeded" && !c.isLimitExceeded) return false;

        // Search query
        const term = searchQuery.toLowerCase().trim();
        if (!term) return true;
        return (
          c.name.toLowerCase().includes(term) ||
          (c.phone && c.phone.includes(term)) ||
          (c.id && c.id.toLowerCase().includes(term))
        );
      })
      .sort((a, b) => {
        if (sortBy === "highest_due") return b.numericDue - a.numericDue;
        if (sortBy === "lowest_due") return a.numericDue - b.numericDue;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [customers, filterTab, sortBy, searchQuery]);

  // Overall Khata Metrics
  const khataMetrics = useMemo(() => {
    const totalDue = (customers || []).reduce((sum, c) => sum + getCustomerDue(c), 0);
    const customersWithDue = (customers || []).filter((c) => getCustomerDue(c) > 0).length;
    const totalCollected = (khataLedger || [])
      .filter((k) => k.type === "CREDIT")
      .reduce((sum, k) => sum + (Number(k.amount) || 0), 0);
    const limitExceededCount = (customers || []).filter(
      (c) => getCustomerDue(c) > (Number(c.creditLimit) || 5000)
    ).length;

    return {
      totalDue,
      customersWithDue,
      totalCollected,
      limitExceededCount,
    };
  }, [customers, khataLedger]);

  // Get transactions for a selected customer
  const customerTransactions = useMemo(() => {
    if (!selectedCustomer) return [];
    return (khataLedger || []).filter(
      (t) =>
        t.customerId === selectedCustomer.id ||
        (selectedCustomer.phone && t.customerPhone === selectedCustomer.phone) ||
        t.customerName.toLowerCase() === selectedCustomer.name.toLowerCase()
    );
  }, [selectedCustomer, khataLedger]);

  // Handlers
  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!paymentModalCustomer || !paymentAmount) return;
    const res = recordKhataPayment({
      customerId: paymentModalCustomer.id,
      amount: paymentAmount,
      paymentMode,
      note: paymentNote || "Payment Received (Jama)",
    });

    if (res.success) {
      showToast(res.message);
      setPaymentModalCustomer(null);
      setPaymentAmount("");
      setPaymentNote("");
      // Update selected customer if drawer is open
      if (selectedCustomer && selectedCustomer.id === paymentModalCustomer.id) {
        setSelectedCustomer((prev) => ({
          ...prev,
          numericDue: Math.max(0, prev.numericDue - parseFloat(paymentAmount)),
        }));
      }
    }
  };

  const handleRecordDebit = (e) => {
    e.preventDefault();
    if (!debitModalCustomer || !debitAmount) return;
    const res = recordKhataDebit({
      customerId: debitModalCustomer.id,
      amount: debitAmount,
      note: debitNote || "Store Credit Given (Udhar)",
    });

    if (res.success) {
      showToast(res.message);
      setDebitModalCustomer(null);
      setDebitAmount("");
      setDebitNote("");
      if (selectedCustomer && selectedCustomer.id === debitModalCustomer.id) {
        setSelectedCustomer((prev) => ({
          ...prev,
          numericDue: prev.numericDue + parseFloat(debitAmount),
        }));
      }
    }
  };

  const handleSaveLimit = (e) => {
    e.preventDefault();
    if (!limitModalCustomer || !newCreditLimit) return;
    updateCustomerCreditLimit(limitModalCustomer.id, newCreditLimit);
    showToast(`Credit limit for ${limitModalCustomer.name} set to ₹${newCreditLimit}!`);
    setLimitModalCustomer(null);
    setNewCreditLimit("");
  };

  const handleCreateCustomerSubmit = (e) => {
    e.preventDefault();
    if (!newCustForm.name.trim() || !newCustForm.phone.trim()) {
      alert("Customer Name and Phone are required!");
      return;
    }

    const created = addCustomer({
      name: newCustForm.name.trim(),
      phone: newCustForm.phone.trim(),
      email: newCustForm.email.trim(),
      location: newCustForm.location.trim() || "Bengaluru, Karnataka",
      creditLimit: parseFloat(newCustForm.creditLimit) || 5000,
      outstanding: newCustForm.initialCredit ? `₹${parseFloat(newCustForm.initialCredit).toLocaleString("en-IN")}` : "₹0",
    });

    if (newCustForm.initialCredit && parseFloat(newCustForm.initialCredit) > 0) {
      recordKhataDebit({
        customerId: created.id,
        amount: newCustForm.initialCredit,
        note: "Initial Opening Balance Udhar",
      });
    }

    showToast(`Customer ${newCustForm.name} registered into Khata Book!`);
    setShowAddCustomerModal(false);
    setNewCustForm({
      name: "",
      phone: "",
      email: "",
      location: "Bengaluru, Karnataka",
      initialCredit: "",
      creditLimit: "5000",
    });
  };

  const generateWhatsAppReminderText = (cust) => {
    const storeTitle = settings?.storeName || "Krishna General Store";
    const storePhone = settings?.phone || "+91 98765 43210";
    const upiId = settings?.upiId || "krishnastore@upi";
    const dueAmount = cust.numericDue || getCustomerDue(cust);

    return encodeURIComponent(
      `🙏 *Namaste ${cust.name} ji!*\n\n` +
      `This is a gentle payment reminder from *${storeTitle}*.\n` +
      `Your current pending balance (Udhar/Khata) is: *₹${dueAmount.toLocaleString("en-IN")}*.\n\n` +
      `💳 *UPI Payment ID:* \`${upiId}\`\n` +
      `Or pay at counter: ${storeTitle} (${storePhone}).\n\n` +
      `Please clear your pending dues at your earliest convenience. Thank you for your continued patronage! 🛒`
    );
  };

  const handleOpenWhatsApp = (cust) => {
    const rawPhone = (cust.phone || "").replace(/[^0-9]/g, "");
    const cleanPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const text = generateWhatsAppReminderText(cust);
    const url = `https://wa.me/${cleanPhone}?text=${text}`;
    window.open(url, "_blank");
  };

  const handleExportCSV = () => {
    const headers = ["Customer ID", "Name", "Phone", "Outstanding Due (₹)", "Credit Limit (₹)", "Tier", "Location"];
    const rows = filteredCustomers.map((c) => [
      `"${c.id}"`,
      `"${c.name}"`,
      `"${c.phone}"`,
      c.numericDue,
      c.creditLimitVal,
      `"${c.tier || "Regular"}"`,
      `"${c.location || "N/A"}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `khatabook_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <Topnav />

      <main className="ml-[240px] pt-6 min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header & Page Title */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-[#006194]">menu_book</span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">
                  Digital Khata Book (उधार खाता)
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#006194]/10 text-[#006194]">
                  LIVE LEDGER
                </span>
              </div>
              <p className="text-sm text-[#565e74] mt-1">
                Track customer credit balances, record payments (जमा), set credit limits, and send 1-click WhatsApp reminders.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#3f4850] bg-white rounded-xl border border-[#bfc7d2] hover:bg-[#f2f4f6] transition-all cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export Khata (CSV)
              </button>
              <button
                onClick={() => setShowAddCustomerModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#006194] text-white rounded-xl text-xs font-bold hover:bg-[#007bb9] transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                + Naya Khata Grahak
              </button>
            </div>
          </div>

          {/* 4 Summary Stat Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Market Udhar */}
            <div className="bg-white p-5 rounded-2xl border border-red-200/80 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-3">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                  <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-red-700">
                  Market Udhar
                </span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#565e74] font-semibold">Total Pending Due</p>
                <p className="text-2xl lg:text-3xl font-extrabold text-red-600 mt-1">
                  {formatINR(khataMetrics.totalDue)}
                </p>
                <p className="text-xs text-[#707881] mt-1">Across {khataMetrics.customersWithDue} customer accounts</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[100px] text-red-600">currency_rupee</span>
              </div>
            </div>

            {/* Total Collected / Jama */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-3">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <span className="material-symbols-outlined text-2xl">payments</span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-700">
                  Total Jama
                </span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#565e74] font-semibold">Payments Collected</p>
                <p className="text-2xl lg:text-3xl font-extrabold text-emerald-600 mt-1">
                  {formatINR(khataMetrics.totalCollected)}
                </p>
                <p className="text-xs text-[#707881] mt-1">Received via Cash, UPI &amp; Bank</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[100px] text-emerald-600">check_circle</span>
              </div>
            </div>

            {/* Active Udhar Customers */}
            <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-3">
                <div className="p-3 bg-blue-50 text-[#006194] rounded-xl">
                  <span className="material-symbols-outlined text-2xl">groups</span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-[#006194]">
                  Active Accounts
                </span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#565e74] font-semibold">Customers in Udhar</p>
                <p className="text-2xl lg:text-3xl font-extrabold text-[#191c1e] mt-1">
                  {khataMetrics.customersWithDue}{" "}
                  <span className="text-sm font-normal text-gray-500">/ {customers.length}</span>
                </p>
                <p className="text-xs text-[#707881] mt-1">Regular Kirana Credit buyers</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[100px] text-[#006194]">person</span>
              </div>
            </div>

            {/* Overdue / High Risk Alert */}
            <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-3">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <span className="material-symbols-outlined text-2xl">warning</span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800">
                  Credit Check
                </span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#565e74] font-semibold">Exceeded Credit Limit</p>
                <p className="text-2xl lg:text-3xl font-extrabold text-amber-700 mt-1">
                  {khataMetrics.limitExceededCount} Accounts
                </p>
                <p className="text-xs text-[#707881] mt-1">Needs immediate reminder</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[100px] text-amber-600">report</span>
              </div>
            </div>
          </section>

          {/* Table Container & Filter Toolbar */}
          <section className="bg-white rounded-2xl border border-[#bfc7d2]/60 shadow-sm overflow-hidden">
            {/* Filter bar */}
            <div className="p-5 border-b border-[#bfc7d2]/60 flex flex-col md:flex-row items-center justify-between gap-4 bg-white">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707881] text-lg">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search customer name, phone, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#f2f4f6] border border-[#bfc7d2] rounded-xl text-xs outline-none focus:border-[#006194]"
                />
              </div>

              {/* Status Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                <button
                  onClick={() => setFilterTab("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterTab === "all"
                      ? "bg-[#006194] text-white shadow-sm"
                      : "bg-[#f2f4f6] text-[#3f4850] hover:bg-gray-200"
                  }`}
                >
                  All ({customers.length})
                </button>
                <button
                  onClick={() => setFilterTab("pending")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterTab === "pending"
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-[#f2f4f6] text-red-600 hover:bg-red-50"
                  }`}
                >
                  Pending Due ({khataMetrics.customersWithDue})
                </button>
                <button
                  onClick={() => setFilterTab("settled")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterTab === "settled"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-[#f2f4f6] text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  Settled (₹0 Due)
                </button>
                <button
                  onClick={() => setFilterTab("limit_exceeded")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterTab === "limit_exceeded"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-[#f2f4f6] text-amber-700 hover:bg-amber-50"
                  }`}
                >
                  ⚠️ Limit Exceeded ({khataMetrics.limitExceededCount})
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <span className="text-xs text-[#565e74] font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 bg-[#f2f4f6] border border-[#bfc7d2] rounded-xl text-xs font-semibold text-[#3f4850] outline-none cursor-pointer"
                >
                  <option value="highest_due">Highest Udhar First</option>
                  <option value="lowest_due">Lowest Udhar First</option>
                  <option value="name">Customer Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Khata List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f7f9fb] border-b border-[#bfc7d2]/60 text-xs uppercase tracking-wider text-[#565e74]">
                    <th className="px-6 py-4">Customer Details</th>
                    <th className="px-6 py-4 text-right">Pending Balance (उधार)</th>
                    <th className="px-6 py-4">Credit Limit Status</th>
                    <th className="px-6 py-4">Loyalty Tier</th>
                    <th className="px-6 py-4 text-center">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bfc7d2]/40">
                  {filteredCustomers.map((cust) => {
                    const isDue = cust.numericDue > 0;
                    const limitPct = Math.min(100, Math.round((cust.numericDue / cust.creditLimitVal) * 100));

                    return (
                      <tr key={cust.id} className="hover:bg-[#f8f9ff] transition-colors">
                        {/* Customer Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-[#006194]/10 text-[#006194]">
                              {cust.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-sm text-[#191c1e]">{cust.name}</p>
                                {cust.isLimitExceeded && (
                                  <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-extrabold rounded">
                                    EXCEEDED
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#565e74] flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px]">call</span>
                                {cust.phone || "No phone"}
                              </p>
                              <p className="text-[11px] text-[#707881]">ID: {cust.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Outstanding Due */}
                        <td className="px-6 py-4 text-right">
                          <p
                            className={`text-lg font-black ${
                              isDue ? "text-red-600" : "text-emerald-600"
                            }`}
                          >
                            {formatINR(cust.numericDue)}
                          </p>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isDue ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {isDue ? "Udhar Baki Hai" : "Nill (Settled)"}
                          </span>
                        </td>

                        {/* Credit Limit Bar */}
                        <td className="px-6 py-4">
                          <div className="w-36 space-y-1">
                            <div className="flex justify-between text-[11px] font-semibold text-[#565e74]">
                              <span>Limit: {formatINR(cust.creditLimitVal)}</span>
                              <span className={cust.isLimitExceeded ? "text-red-600 font-bold" : ""}>
                                {limitPct}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  cust.isLimitExceeded
                                    ? "bg-red-600"
                                    : limitPct > 70
                                    ? "bg-amber-500"
                                    : "bg-[#006194]"
                                }`}
                                style={{ width: `${limitPct}%` }}
                              />
                            </div>
                            <button
                              onClick={() => {
                                setLimitModalCustomer(cust);
                                setNewCreditLimit(cust.creditLimitVal);
                              }}
                              className="text-[10px] text-[#006194] font-semibold hover:underline"
                            >
                              Edit Limit
                            </button>
                          </div>
                        </td>

                        {/* Tier */}
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-lg flex items-center gap-1 w-max">
                            <span className="material-symbols-outlined text-[14px] text-amber-500">stars</span>
                            {cust.tier || "Regular"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* View Ledger */}
                            <button
                              onClick={() => setSelectedCustomer(cust)}
                              className="px-3 py-1.5 bg-[#eff4ff] text-[#006194] hover:bg-[#dce9ff] text-xs font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                              title="View Hisab Ledger"
                            >
                              <span className="material-symbols-outlined text-[16px]">menu_book</span>
                              Hisab
                            </button>

                            {/* Record Payment (Jama) */}
                            <button
                              onClick={() => {
                                setPaymentModalCustomer(cust);
                                setPaymentAmount(cust.numericDue > 0 ? cust.numericDue : "");
                              }}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                              title="Record Payment / Jama Kijiye"
                            >
                              <span className="material-symbols-outlined text-[16px]">add_circle</span>
                              Jama
                            </button>

                            {/* Manual Udhar (Debit) */}
                            <button
                              onClick={() => {
                                setDebitModalCustomer(cust);
                                setDebitAmount("");
                              }}
                              className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
                              title="+ Add Udhar Manually"
                            >
                              <span className="material-symbols-outlined text-[18px]">remove_circle</span>
                            </button>

                            {/* WhatsApp Reminder */}
                            {isDue && (
                              <button
                                onClick={() => handleOpenWhatsApp(cust)}
                                className="px-2.5 py-1.5 bg-[#25d366]/10 text-[#128c7e] hover:bg-[#25d366]/20 text-xs font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                                title="Send WhatsApp Payment Reminder"
                              >
                                <span className="material-symbols-outlined text-[16px]">chat</span>
                                Reminder
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#707881]">
                        No customer accounts match the current filter or search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 bg-[#f7f9fb] border-t border-[#bfc7d2]/60 flex justify-between items-center text-xs text-[#565e74]">
              <span>Showing {filteredCustomers.length} of {customers.length} customer khata entries</span>
              <span className="font-semibold">
                Total Filtered Udhar: {formatINR(filteredCustomers.reduce((s, c) => s + c.numericDue, 0))}
              </span>
            </div>
          </section>
        </div>
      </main>

      {/* MODAL 1: Customer Hisab / Ledger History Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl flex flex-col border border-[#bfc7d2] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 bg-[#006194] text-white flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined">menu_book</span>
                  <h3 className="text-xl font-extrabold">{selectedCustomer.name}'s Khata Ledger</h3>
                </div>
                <p className="text-xs text-blue-100 mt-0.5">
                  Phone: {selectedCustomer.phone} | ID: {selectedCustomer.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Current Balance Bar */}
            <div className="px-6 py-4 bg-[#eff4ff] border-b border-[#bfc7d2]/60 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-xs uppercase font-bold text-[#565e74]">Current Outstanding Due</p>
                <p
                  className={`text-2xl font-black ${
                    selectedCustomer.numericDue > 0 ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  {formatINR(selectedCustomer.numericDue)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPaymentModalCustomer(selectedCustomer);
                    setPaymentAmount(selectedCustomer.numericDue > 0 ? selectedCustomer.numericDue : "");
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  Record Jama (Payment)
                </button>
                {selectedCustomer.numericDue > 0 && (
                  <button
                    onClick={() => handleOpenWhatsApp(selectedCustomer)}
                    className="px-3 py-2 bg-[#25d366] text-white rounded-xl text-xs font-bold hover:bg-[#1ebd5a] transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    WhatsApp
                  </button>
                )}
              </div>
            </div>

            {/* Transaction Timeline */}
            <div className="p-6 overflow-y-auto flex-1 space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#565e74] mb-2">
                Transaction History ({customerTransactions.length})
              </h4>

              {customerTransactions.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <span className="material-symbols-outlined text-4xl mb-1">receipt_long</span>
                  <p className="text-sm">No ledger entries recorded yet for this customer.</p>
                </div>
              ) : (
                customerTransactions.map((txn) => {
                  const isDebit = txn.type === "DEBIT"; // Udhar Diya
                  return (
                    <div
                      key={txn.id}
                      className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                        isDebit
                          ? "bg-red-50/50 border-red-200/70"
                          : "bg-emerald-50/50 border-emerald-200/70"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg text-lg ${
                            isDebit ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {isDebit ? "arrow_upward" : "arrow_downward"}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded ${
                                isDebit ? "bg-red-200 text-red-800" : "bg-emerald-200 text-emerald-800"
                              }`}
                            >
                              {isDebit ? "Udhar Diya (Debit)" : "Jama Kiya (Credit)"}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">{txn.date}</span>
                          </div>
                          <p className="text-sm font-semibold text-[#191c1e] mt-1">{txn.note}</p>
                          <p className="text-[11px] text-[#707881]">
                            Ref/Bill ID: <span className="font-mono">{txn.billId || txn.id}</span> • Mode:{" "}
                            <span className="font-bold">{txn.paymentMode}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-lg font-black ${
                            isDebit ? "text-red-600" : "text-emerald-600"
                          }`}
                        >
                          {isDebit ? `+ ${formatINR(txn.amount)}` : `- ${formatINR(txn.amount)}`}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Bal: {formatINR(txn.balanceAfter || 0)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-[#f7f9fb] border-t border-[#bfc7d2]/60 flex justify-between items-center">
              <button
                onClick={() => {
                  const headers = ["Txn ID", "Date", "Type", "Amount", "Mode", "Note", "Balance After"];
                  const rows = customerTransactions.map((t) => [
                    `"${t.id}"`,
                    `"${t.date}"`,
                    `"${t.type}"`,
                    t.amount,
                    `"${t.paymentMode}"`,
                    `"${t.note}"`,
                    t.balanceAfter,
                  ]);
                  const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
                  const link = document.createElement("a");
                  link.setAttribute("href", encodeURI(csv));
                  link.setAttribute("download", `${selectedCustomer.name.replace(/\s+/g, "_")}_statement.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-4 py-2 border border-[#bfc7d2] rounded-xl text-xs font-bold text-[#3f4850] hover:bg-gray-100 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                Download Statement (CSV)
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-xl text-xs font-bold hover:bg-gray-300 cursor-pointer"
              >
                Close Hisab
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Record Payment (Jama Kijiye) */}
      {paymentModalCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-[#bfc7d2]">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
              <div>
                <h3 className="font-extrabold text-lg text-emerald-700 flex items-center gap-1.5">
                  <span className="material-symbols-outlined">payments</span>
                  Record Jama (Payment)
                </h3>
                <p className="text-xs text-[#565e74]">
                  Customer: <span className="font-bold text-[#191c1e]">{paymentModalCustomer.name}</span>
                </p>
              </div>
              <button
                onClick={() => setPaymentModalCustomer(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-100 flex justify-between items-center">
              <span className="text-xs font-bold text-red-700">Current Outstanding Due:</span>
              <span className="text-base font-black text-red-600">
                {formatINR(paymentModalCustomer.numericDue)}
              </span>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3f4850] uppercase mb-1">
                  Amount Received (₹) *
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  step="any"
                  placeholder="e.g. 1500"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#bfc7d2] rounded-xl text-base font-bold outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3f4850] uppercase mb-1">
                  Payment Mode *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["CASH", "UPI", "BANK"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      className={`py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                        paymentMode === mode
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3f4850] uppercase mb-1">
                  Payment Note / Reference ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. GPay UPI Ref #401928"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full px-4 py-2 border border-[#bfc7d2] rounded-xl text-xs outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Confirm Jama (Receive)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentModalCustomer(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Manual Udhar (Debit) */}
      {debitModalCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-[#bfc7d2]">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
              <div>
                <h3 className="font-extrabold text-lg text-red-600 flex items-center gap-1.5">
                  <span className="material-symbols-outlined">remove_circle</span>
                  Add Udhar Manually
                </h3>
                <p className="text-xs text-[#565e74]">
                  Customer: <span className="font-bold text-[#191c1e]">{debitModalCustomer.name}</span>
                </p>
              </div>
              <button
                onClick={() => setDebitModalCustomer(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleRecordDebit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3f4850] uppercase mb-1">
                  Udhar Amount (₹) *
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  step="any"
                  placeholder="e.g. 850"
                  value={debitAmount}
                  onChange={(e) => setDebitAmount(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#bfc7d2] rounded-xl text-base font-bold outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3f4850] uppercase mb-1">
                  Reason / Item Description *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 5kg Atta and cooking oil"
                  value={debitNote}
                  onChange={(e) => setDebitNote(e.target.value)}
                  className="w-full px-4 py-2 border border-[#bfc7d2] rounded-xl text-xs outline-none focus:border-red-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add to Udhar Balance
                </button>
                <button
                  type="button"
                  onClick={() => setDebitModalCustomer(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Set Credit Limit */}
      {limitModalCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl p-6 border border-[#bfc7d2]">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
              <h3 className="font-extrabold text-base text-[#191c1e]">Set Credit Limit</h3>
              <button onClick={() => setLimitModalCustomer(null)} className="text-gray-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-xs text-[#565e74] mb-3">
              Configure maximum credit allowed for <strong>{limitModalCustomer.name}</strong>.
            </p>
            <form onSubmit={handleSaveLimit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3f4850] uppercase mb-1">
                  Credit Limit (₹)
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  step="500"
                  value={newCreditLimit}
                  onChange={(e) => setNewCreditLimit(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl text-sm font-bold outline-none focus:border-[#006194]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#006194] text-white rounded-xl text-xs font-bold hover:bg-[#007bb9]"
                >
                  Save Limit
                </button>
                <button
                  type="button"
                  onClick={() => setLimitModalCustomer(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Register New Khata Customer */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 border border-[#bfc7d2]">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
              <div>
                <h3 className="font-extrabold text-lg text-[#006194] flex items-center gap-1.5">
                  <span className="material-symbols-outlined">person_add</span>
                  + Naya Khata Grahak
                </h3>
                <p className="text-xs text-[#565e74]">Add customer account with credit limits</p>
              </div>
              <button onClick={() => setShowAddCustomerModal(false)} className="text-gray-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3f4850] uppercase mb-1">
                  Customer / Business Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ramesh Chandra"
                  value={newCustForm.name}
                  onChange={(e) => setNewCustForm({ ...newCustForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-[#006194]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3f4850] uppercase mb-1">
                  Mobile Number (WhatsApp) *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="+91 98765 00000"
                  value={newCustForm.phone}
                  onChange={(e) => setNewCustForm({ ...newCustForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-[#006194]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3f4850] uppercase mb-1">
                    Opening Udhar (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newCustForm.initialCredit}
                    onChange={(e) => setNewCustForm({ ...newCustForm, initialCredit: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-[#006194]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3f4850] uppercase mb-1">
                    Credit Limit (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={newCustForm.creditLimit}
                    onChange={(e) => setNewCustForm({ ...newCustForm, creditLimit: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-[#006194]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3f4850] uppercase mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  placeholder="Bengaluru, Karnataka"
                  value={newCustForm.location}
                  onChange={(e) => setNewCustForm({ ...newCustForm, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-[#006194]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#006194] text-white rounded-xl text-xs font-bold hover:bg-[#007bb9] shadow-sm cursor-pointer"
                >
                  Create Khata Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#006194] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 z-50 animate-in fade-in">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <p className="text-xs font-bold">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
