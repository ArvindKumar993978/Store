import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
/*
  EASY-TO-EDIT VERSION
  --------------------
  Every color, spacing, and font-size is written directly inside the
  className as a Tailwind "arbitrary value", e.g. bg-[#006194].
  No separate CSS file, no variables, no indirection.

  To change a color: just edit the hex code inside the [ ] brackets.
  To change spacing: edit the px value inside p-[24px], gap-[16px], etc.
  To change text size: edit the value inside text-[20px].

  Quick color reference (so you know what each hex means):
    #006194  -> primary (blue)
    #006a61  -> secondary (teal)
    #007bb9  -> primary-container (lighter blue, used in icon boxes)
    #86f2e4  -> secondary-container (light teal, used in icon boxes)
    #0b1c30  -> main dark text
    #3f4850  -> secondary/gray text
    #f8f9ff  -> page background
    #ffffff  -> card background
    #bfc7d2  -> border color
*/

const Entrance = () => {

  const navigate = useNavigate();
  // Card icon hover animation (same behavior as the original <script>)
  useEffect(() => {
    const cards = document.querySelectorAll(".portal-card");
    const cleanupFns = [];

    cards.forEach((card) => {
      const icon = card.querySelector(".card-icon");
      if (!icon) return;

      const onEnter = () => {
        icon.style.transform = "scale(1.1) rotate(5deg)";
        icon.style.transition = "transform 0.3s ease";
      };
      const onLeave = () => {
        icon.style.transform = "scale(1) rotate(0deg)";
      };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      cleanupFns.push(() => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanupFns.forEach((fn) => fn());
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30] font-sans">
      {/* Load fonts + icon font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          vertical-align: middle;
        }
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* ---------- Header ---------- */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur bg-[#f8f9ff]/80 border-b border-[#bfc7d2]">
        <div className="flex justify-between items-center w-full px-[24px] py-[8px] max-w-[1440px] mx-auto h-16">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006194] text-3xl">
              account_balance_wallet
            </span>
            <span className="text-[20px] font-semibold text-[#006194]">
              Efficient Ledger
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[#3f4850] hover:text-[#006194] transition-colors p-2 rounded-full">
              <span className="material-symbols-outlined">help</span>
            </button>
            <button className="text-[#3f4850] hover:text-[#006194] transition-colors p-2 rounded-full">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Main ---------- */}
      <main className="flex-grow flex flex-col pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 md:py-24 px-6 flex flex-col items-center text-center">
          <div
            className="absolute inset-0 -z-10 opacity-60"
            style={{ background: "linear-gradient(to bottom, #eff4ff, #f8f9ff)" }}
          />
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#007bb9]/10 text-[#006194] text-sm font-semibold mb-2">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Central Management Hub
            </div>
            <h1 className="text-[32px] md:text-[48px] font-bold leading-tight tracking-tight">
              Welcome to <span className="text-[#006194]">Krishna Store</span>
            </h1>
            <p className="text-[#3f4850] text-base max-w-xl mx-auto">
              A  business ecosystem powered by Efficient Ledger. Select your entry point to manage operations or explore the storefront.
            </p>
          </div>
        </section>

        {/* Portal cards */}
        <section className="max-w-6xl mx-auto w-full px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Admin card */}
            <div className="portal-card group bg-white border border-[#bfc7d2] rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-2 bg-[#006194]" />
              <div className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="card-icon w-14 h-14 rounded-xl bg-[#007bb9] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#006194] bg-[#007bb9]/10 px-3 py-1 rounded-full">
                    Secure Access
                  </span>
                </div>

                <h2 className="text-[20px] font-semibold mb-3">Shop Owner / Admin</h2>
                <p className="text-[#3f4850] text-sm mb-8">
                  Manage your inventory, sales, GST billing, and view business analytics in real-time. Designed for high-efficiency back-office operations.
                </p>

                <div className="bg-[#eff4ff] rounded-lg p-4 mb-8 grid grid-cols-3 gap-2 border border-[#bfc7d2]/30">
                  {[
                    { icon: "dashboard", label: "Dashboard" },
                    { icon: "receipt_long", label: "Billing" },
                    { icon: "inventory_2", label: "Inventory" },
                  ].map((item) => (
                    <div
                      key={item.icon}
                      className="flex flex-col items-center gap-2 p-2 bg-white rounded-md shadow-sm border border-[#bfc7d2]/10"
                    >
                      <span className="material-symbols-outlined text-[#006194]">{item.icon}</span>
                      <span className="text-[10px] text-[#3f4850]">{item.label}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/admin")}
                className="mt-auto w-full py-4 bg-[#006194] hover:bg-[#006398] text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98]">
                  Enter Admin Dashboard
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Customer card */}
            <div className="portal-card group bg-white border border-[#bfc7d2] rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-2 bg-[#006a61]" />
              <div className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="card-icon w-14 h-14 rounded-xl bg-[#86f2e4] flex items-center justify-center text-[#006f66]">
                    <span className="material-symbols-outlined text-3xl">person</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#006a61] bg-[#86f2e4]/10 px-3 py-1 rounded-full">
                    Public Portal
                  </span>
                </div>

                <h2 className="text-[20px] font-semibold mb-3">Customer</h2>
                <p className="text-[#3f4850] text-sm mb-8">
                  Browse the storefront, place new orders, and track your purchase history. A seamless shopping experience tailored for modern buyers.
                </p>

                <div className="bg-[#eff4ff] rounded-lg p-4 mb-8 grid grid-cols-3 gap-2 border border-[#bfc7d2]/30">
                  {[
                    { icon: "shopping_cart", label: "Storefront" },
                    { icon: "local_shipping", label: "Orders" },
                    { icon: "category", label: "Products" },
                  ].map((item) => (
                    <div
                      key={item.icon}
                      className="flex flex-col items-center gap-2 p-2 bg-white rounded-md shadow-sm border border-[#bfc7d2]/10"
                    >
                      <span className="material-symbols-outlined text-[#006a61]">{item.icon}</span>
                      <span className="text-[10px] text-[#3f4850]">{item.label}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/storefront")}
                  className="mt-auto w-full py-4 border-2 border-[#006a61] text-[#006a61] hover:bg-[#86f2e4]/10 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98]">
                  Go to Storefront
                  <span className="material-symbols-outlined">shopping_bag</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Info strip */}
        <section className="bg-[#eff4ff] py-12 border-t border-[#bfc7d2]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-[#006194]">Secure Infrastructure</h4>
                <p className="text-sm text-[#3f4850]">
                  Banking-grade encryption protecting every ledger entry and customer transaction.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-[#006194]">Unified Database</h4>
                <p className="text-sm text-[#3f4850]">
                  Real-time sync between shop inventory and customer storefront views.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-[#006194]">Compliance Ready</h4>
                <p className="text-sm text-[#3f4850]">
                  Automated GST calculation and professional digital receipt generation.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="w-full py-4 mt-auto bg-white border-t border-[#bfc7d2]">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1440px] mx-auto gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#006194]">Efficient Ledger</span>
            <span className="text-[#3f4850] text-sm">|</span>
            <span className="text-[#3f4850] text-sm">© 2024 Krishna Store. All rights reserved.</span>
          </div>
          <nav className="flex gap-4">
            <a className="text-[#3f4850] text-sm hover:underline" href="#">Privacy Policy</a>
            <a className="text-[#3f4850] text-sm hover:underline" href="#">Terms of Service</a>
            <a className="text-[#3f4850] text-sm hover:underline" href="#">Support</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default Entrance;
