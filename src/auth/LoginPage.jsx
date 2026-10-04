import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth, DEFAULT_ACCOUNTS } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAdmin, loginStaff, loginCustomer, signupCustomer, continueAsGuest } = useAuth();

  // Query parameter to default to specific tab: ?role=admin|staff|customer
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get("role") || "admin";
  const redirectPath = queryParams.get("redirect") || "";

  const [activeTab, setActiveTab] = useState(initialRole);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Admin form state
  const [adminInput, setAdminInput] = useState(DEFAULT_ACCOUNTS.admin.email);
  const [adminPassword, setAdminPassword] = useState(DEFAULT_ACCOUNTS.admin.password);

  // Staff form state
  const [selectedStaffEmail, setSelectedStaffEmail] = useState(DEFAULT_ACCOUNTS.staffList[0].email);
  const [staffPin, setStaffPin] = useState(DEFAULT_ACCOUNTS.staffList[0].pin);

  // Customer form state
  const [customerMode, setCustomerMode] = useState("login"); // 'login' or 'signup'
  const [custEmailOrPhone, setCustEmailOrPhone] = useState(DEFAULT_ACCOUNTS.demoCustomer.email);
  const [custPassword, setCustPassword] = useState(DEFAULT_ACCOUNTS.demoCustomer.password);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  useEffect(() => {
    setError("");
  }, [activeTab, customerMode]);

  // Navigate after successful login
  const handleSuccessRedirect = (role) => {
    if (redirectPath) {
      navigate(redirectPath);
      return;
    }
    if (role === "admin") navigate("/admin");
    else if (role === "staff") navigate("/staff");
    else navigate("/storefront");
  };

  // 1. Submit Admin Login
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await loginAdmin(adminInput, adminPassword);
    setLoading(false);
    if (result.success) {
      handleSuccessRedirect("admin");
    } else {
      setError(result.message || "Failed to log in as Admin");
    }
  };

  // 2. Submit Staff Login
  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await loginStaff({ emailOrStaffId: selectedStaffEmail, pin: staffPin });
    setLoading(false);
    if (result.success) {
      handleSuccessRedirect("staff");
    } else {
      setError(result.message || "Failed to log in as Staff");
    }
  };

  // 3. Submit Customer Login
  const handleCustomerLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await loginCustomer(custEmailOrPhone, custPassword);
    setLoading(false);
    if (result.success) {
      handleSuccessRedirect("customer");
    } else {
      setError(result.message || "Failed to log in as Customer");
    }
  };

  // 4. Submit Customer Signup
  const handleCustomerSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signupCustomer(signupData);
    setLoading(false);
    if (result.success) {
      handleSuccessRedirect("customer");
    } else {
      setError(result.message || "Failed to create account");
    }
  };

  // 5. Continue as Guest
  const handleGuestClick = () => {
    continueAsGuest();
    navigate("/storefront");
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      {/* Top Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#006194] hover:opacity-80 transition-opacity mb-4"
        >
          <span className="material-symbols-outlined text-3xl">shopping_basket</span>
          <span className="text-2xl font-bold tracking-tight">Krishna General Store</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-[#0b1c30]">
          Portal Authentication
        </h2>
        <p className="mt-1 text-sm text-[#3f4850]">
          Select your portal to securely access the retail management system
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-[#bfc7d2]/60 sm:px-10">
          
          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-[#eff4ff] p-1.5 rounded-xl mb-6 border border-[#bfc7d2]/40">
            <button
              type="button"
              onClick={() => setActiveTab("admin")}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "admin"
                  ? "bg-[#006194] text-white shadow-sm"
                  : "text-[#3f4850] hover:text-[#006194] hover:bg-white/60"
              }`}
            >
              <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              Admin
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("staff")}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "staff"
                  ? "bg-[#b45309] text-white shadow-sm"
                  : "text-[#3f4850] hover:text-[#b45309] hover:bg-white/60"
              }`}
            >
              <span className="material-symbols-outlined text-sm">badge</span>
              Staff
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("customer")}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "customer"
                  ? "bg-[#006a61] text-white shadow-sm"
                  : "text-[#3f4850] hover:text-[#006a61] hover:bg-white/60"
              }`}
            >
              <span className="material-symbols-outlined text-sm">person</span>
              Customer
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-xs font-medium flex items-center gap-2 border border-[#ba1a1a]/20 animate-shake">
              <span className="material-symbols-outlined text-sm flex-shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 1: SHOP OWNER / ADMIN                                      */}
          {/* ============================================================== */}
          {activeTab === "admin" && (
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#bfc7d2]/30">
                <span className="material-symbols-outlined text-[#006194]">verified_user</span>
                <div>
                  <h3 className="text-sm font-bold text-[#006194]">Store Owner & Back-Office</h3>
                  <p className="text-[11px] text-[#707881]">Access POS billing, inventory, settings, & reports</p>
                </div>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Admin Email or Master PIN (1234)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707881] text-lg">
                      account_circle
                    </span>
                    <input
                      type="text"
                      required
                      value={adminInput}
                      onChange={(e) => setAdminInput(e.target.value)}
                      placeholder="admin@krishnastore.in or PIN 1234"
                      className="w-full pl-10 pr-3 py-2 bg-[#f8f9ff] border border-[#bfc7d2] rounded-xl text-sm focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Password (Optional if using Master PIN)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707881] text-lg">
                      lock
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="admin123"
                      className="w-full pl-10 pr-10 py-2 bg-[#f8f9ff] border border-[#bfc7d2] rounded-xl text-sm focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707881] hover:text-[#006194]"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 1-Click Demo Buttons */}
                <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#bfc7d2]/30 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#006194]">
                    <span>Demo Quick Access:</span>
                    <span className="text-[#707881]">PIN: 1234</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAdminInput(DEFAULT_ACCOUNTS.admin.email);
                        setAdminPassword(DEFAULT_ACCOUNTS.admin.password);
                      }}
                      className="flex-1 py-1 px-2 bg-white rounded-lg text-[11px] font-bold text-[#006194] border border-[#006194]/30 hover:bg-[#006194]/10 transition-colors"
                    >
                      Fill Admin Demo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminInput(DEFAULT_ACCOUNTS.admin.pin);
                        setAdminPassword("");
                      }}
                      className="flex-1 py-1 px-2 bg-white rounded-lg text-[11px] font-bold text-[#006194] border border-[#006194]/30 hover:bg-[#006194]/10 transition-colors"
                    >
                      Use PIN 1234
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#006194] hover:bg-[#007bb9] active:scale-[0.99] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-spin material-symbols-outlined text-base">progress_activity</span>
                  ) : (
                    <>
                      <span>Sign In as Admin</span>
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: STAFF / EMPLOYEE                                        */}
          {/* ============================================================== */}
          {activeTab === "staff" && (
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#bfc7d2]/30">
                <span className="material-symbols-outlined text-[#b45309]">badge</span>
                <div>
                  <h3 className="text-sm font-bold text-[#b45309]">Cashier & Store Employee</h3>
                  <p className="text-[11px] text-[#707881]">Access POS billing counter, attendance & payroll</p>
                </div>
              </div>

              <form onSubmit={handleStaffSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Select Staff Member
                  </label>
                  <select
                    value={selectedStaffEmail}
                    onChange={(e) => {
                      setSelectedStaffEmail(e.target.value);
                      const member = DEFAULT_ACCOUNTS.staffList.find((s) => s.email === e.target.value);
                      if (member) setStaffPin(member.pin);
                    }}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#bfc7d2] rounded-xl text-sm focus:border-[#b45309] focus:ring-2 focus:ring-[#b45309]/20 outline-none"
                  >
                    {DEFAULT_ACCOUNTS.staffList.map((st) => (
                      <option key={st.id} value={st.email}>
                        {st.name} — {st.roleTitle} (PIN: {st.pin})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Employee 4-Digit Security PIN
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707881] text-lg">
                      pin
                    </span>
                    <input
                      type="password"
                      maxLength={6}
                      required
                      value={staffPin}
                      onChange={(e) => setStaffPin(e.target.value)}
                      placeholder="e.g. 1111"
                      className="w-full pl-10 pr-3 py-2 bg-[#f8f9ff] border border-[#bfc7d2] rounded-xl text-sm font-mono tracking-widest focus:border-[#b45309] focus:ring-2 focus:ring-[#b45309]/20 outline-none"
                    />
                  </div>
                </div>

                {/* Quick Staff Select Chips */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStaffEmail("priya.i@krishnastore.in");
                      setStaffPin("1111");
                    }}
                    className="py-1.5 px-2 bg-[#fffbeb] rounded-lg text-left border border-[#fde68a] text-[11px] font-semibold text-[#92400e] hover:bg-[#fef3c7]"
                  >
                    🛒 Priya (Cashier)
                    <span className="block text-[10px] text-[#b45309]">PIN: 1111</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStaffEmail("rajesh.k@krishnastore.in");
                      setStaffPin("2222");
                    }}
                    className="py-1.5 px-2 bg-[#fffbeb] rounded-lg text-left border border-[#fde68a] text-[11px] font-semibold text-[#92400e] hover:bg-[#fef3c7]"
                  >
                    👔 Rajesh (Manager)
                    <span className="block text-[10px] text-[#b45309]">PIN: 2222</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#b45309] hover:bg-[#92400e] active:scale-[0.99] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-spin material-symbols-outlined text-base">progress_activity</span>
                  ) : (
                    <>
                      <span>Enter Staff Workspace</span>
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: CUSTOMER (LOGIN / SIGN UP)                             */}
          {/* ============================================================== */}
          {activeTab === "customer" && (
            <div>
              {/* Login vs Sign Up Pill Toggle */}
              <div className="flex bg-[#f2f4f6] p-1 rounded-xl mb-4 border border-[#bfc7d2]/30">
                <button
                  type="button"
                  onClick={() => setCustomerMode("login")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    customerMode === "login"
                      ? "bg-white text-[#006a61] shadow-sm"
                      : "text-[#3f4850] hover:text-[#006a61]"
                  }`}
                >
                  Customer Login
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerMode("signup")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    customerMode === "signup"
                      ? "bg-white text-[#006a61] shadow-sm"
                      : "text-[#3f4850] hover:text-[#006a61]"
                  }`}
                >
                  Create New Account
                </button>
              </div>

              {/* Customer Login Form */}
              {customerMode === "login" ? (
                <form onSubmit={handleCustomerLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                      Email or Mobile Number
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707881] text-lg">
                        mail
                      </span>
                      <input
                        type="text"
                        required
                        value={custEmailOrPhone}
                        onChange={(e) => setCustEmailOrPhone(e.target.value)}
                        placeholder="arvind@krishnastore.in or 9939780000"
                        className="w-full pl-10 pr-3 py-2 bg-[#f8f9ff] border border-[#bfc7d2] rounded-xl text-sm focus:border-[#006a61] focus:ring-2 focus:ring-[#006a61]/20 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707881] text-lg">
                        lock
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={custPassword}
                        onChange={(e) => setCustPassword(e.target.value)}
                        placeholder="customer123"
                        className="w-full pl-10 pr-10 py-2 bg-[#f8f9ff] border border-[#bfc7d2] rounded-xl text-sm focus:border-[#006a61] focus:ring-2 focus:ring-[#006a61]/20 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707881] hover:text-[#006a61]"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCustEmailOrPhone(DEFAULT_ACCOUNTS.demoCustomer.email);
                        setCustPassword(DEFAULT_ACCOUNTS.demoCustomer.password);
                      }}
                      className="w-full py-1.5 bg-[#e6f7f5] rounded-lg text-xs font-bold text-[#006a61] border border-[#006a61]/30 hover:bg-[#86f2e4]/30"
                    >
                      Fill Demo Customer Credentials
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#006a61] hover:bg-[#004e47] active:scale-[0.99] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="animate-spin material-symbols-outlined text-base">progress_activity</span>
                    ) : (
                      <>
                        <span>Log In to Storefront</span>
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Customer Sign Up Form */
                <form onSubmit={handleCustomerSignupSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      placeholder="e.g. Ramesh Sharma"
                      className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#bfc7d2] rounded-xl text-sm focus:border-[#006a61] focus:ring-2 focus:ring-[#006a61]/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      placeholder="ramesh@example.com"
                      className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#bfc7d2] rounded-xl text-sm focus:border-[#006a61] focus:ring-2 focus:ring-[#006a61]/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#bfc7d2] rounded-xl text-sm focus:border-[#006a61] focus:ring-2 focus:ring-[#006a61]/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                      Create Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      placeholder="Min 6 characters"
                      className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#bfc7d2] rounded-xl text-sm focus:border-[#006a61] focus:ring-2 focus:ring-[#006a61]/20 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#006a61] hover:bg-[#004e47] active:scale-[0.99] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <span className="animate-spin material-symbols-outlined text-base">progress_activity</span>
                    ) : (
                      <>
                        <span>Create Account & Start Shopping</span>
                        <span className="material-symbols-outlined text-base">person_add</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Guest Checkout Option */}
              <div className="mt-4 pt-3 border-t border-[#bfc7d2]/30 text-center">
                <button
                  type="button"
                  onClick={handleGuestClick}
                  className="text-xs font-semibold text-[#3f4850] hover:text-[#006a61] flex items-center justify-center gap-1 mx-auto"
                >
                  <span>Skip and continue as Guest</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Return to Entrance */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs font-semibold text-[#3f4850] hover:text-[#006194] inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            Return to Store Entrance Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
