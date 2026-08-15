import React, { useState } from "react";
import StorefrontNavbar from "../component/StorefrontNavbar.jsx";
/*
  CustomerSupportPage
  --------------------
  Icons use Google's Material Symbols font + Tailwind classes (no icon
  library import), same pattern as OrderHistoryPage, so the two screens
  stay visually and technically consistent.
*/

const categories = [
  {
    label: "Order Tracking",
    sub: "Status & history",
    icon: "local_shipping",
    bg: "bg-[#dae2fd]",
    fg: "text-[#5c647a]",
  },
  {
    label: "Returns & Refunds",
    sub: "Easy resolutions",
    icon: "assignment_return",
    bg: "bg-[#00855b]",
    fg: "text-[#f5fff6]",
  },
  {
    label: "Payment Issues",
    sub: "Errors & security",
    icon: "payments",
    bg: "bg-[#ffdad6]",
    fg: "text-[#93000a]",
  },
  {
    label: "Invoices & Billing",
    sub: "Ledger access",
    icon: "receipt_long",
    bg: "bg-[#cce5ff]",
    fg: "text-[#001d31]",
  },
];

const faqs = [
  {
    q: "How do I update my billing address?",
    a: "Go to Account Settings > Billing Information to update your address. Changes will reflect on your next generated invoice.",
  },
  {
    q: "When will I receive my refund?",
    a: "Refunds typically process within 5-7 business days depending on your bank's policy after we receive the returned item.",
  },
];

const navItems = [
  { label: "Home", icon: "home" },
  { label: "Inventory", icon: "inventory_2" },
  { label: "Bills", icon: "receipt_long" },
  { label: "Support", icon: "support_agent", active: true },
];

function RippleButton({ className = "", children, ...props }) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
    props.onClick?.(e);
  };

  return (
    <button {...props} onClick={handleClick} className={`relative overflow-hidden ${className}`}>
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ping"
          style={{ left: r.x - 4, top: r.y - 4, width: 8, height: 8 }}
        />
      ))}
    </button>
  );
}

function CategoryCard({ icon, label, sub, bg, fg }) {
  return (
    <RippleButton className="flex flex-col items-start p-5 bg-white rounded-xl shadow-sm border border-[#bfc7d2]/20 hover:border-[#006194] active:scale-95 transition-all text-left group">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${bg} ${fg}`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <span className="text-sm font-semibold text-[#191c1e]">{label}</span>
      <span className="text-xs mt-1 opacity-70 tracking-wide text-[#3f4850]">{sub}</span>
    </RippleButton>
  );
}

function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#eceef0] transition-colors"
      >
        <span className="text-sm font-medium text-[#191c1e]">{q}</span>
        <span
          className={`material-symbols-outlined text-[#3f4850] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>
      {isOpen && <div className="p-4 text-sm bg-[#f7f9fb] text-[#3f4850]">{a}</div>}
    </div>
  );
}

export default function CustomerSupportPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-[Inter,sans-serif] antialiased pb-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      {/* Top App Bar */}
      {/* <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-16 px-4 bg-[#f7f9fb]">
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#006194] active:scale-95 transition-transform" aria-label="Go back">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold text-[#006194]">Customer Support</h1>
        </div>
        <button className="p-2 text-[#006194] active:scale-95 transition-transform" aria-label="Account">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </header> */}
      <StorefrontNavbar/>
      <main
        className="pt-20 px-16  flex flex-col gap-8 min-h-screen"
        style={{
          backgroundImage:
            "radial-gradient(at 0% 0%, rgba(0, 97, 148, 0.05) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(0, 105, 71, 0.03) 0px, transparent 50%)",
        }}
      >
        {/* Hero / Search */}
        <section className="flex flex-col gap-4 py-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Hello, how can we help?</h2>
            <p className="text-sm text-[#3f4850]">Find answers to your questions instantly.</p>
          </div>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#707881] group-focus-within:text-[#006194] transition-colors">
              search
            </span>
            <input
              type="text"
              placeholder="How can we help you?"
              className="w-full bg-white border border-[#bfc7d2] rounded-xl py-4 pl-12 pr-4 text-base shadow-sm focus:outline-none focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all"
            />
          </div>
        </section>

        {/* Categories */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Top Categories</h3>
            <button className="text-xs font-semibold tracking-wide text-[#006194] hover:underline">
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((c) => (
              <CategoryCard key={c.label} {...c} />
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold mb-2">Common Questions</h3>
          <div className="bg-white rounded-xl shadow-sm border border-[#bfc7d2]/30 divide-y divide-[#bfc7d2]/30 overflow-hidden">
            {faqs.map((f, i) => (
              <FaqItem
                key={f.q}
                q={f.q}
                a={f.a}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </section>

        {/* Contact options */}
        <section className="flex flex-col gap-4 pt-4">
          <h3 className="text-lg font-semibold text-center">Still need help?</h3>
          <div className="flex flex-col gap-3">
            <RippleButton className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold shadow-lg bg-[#006194] text-white active:scale-95 transition-all">
              <span className="material-symbols-outlined">chat_bubble</span>
              <span>Chat with Us</span>
            </RippleButton>
            <div className="grid grid-cols-2 gap-3">
              <RippleButton className="flex items-center justify-center gap-2 py-4 rounded-xl font-semibold bg-white border border-[#bfc7d2] text-[#3f4850] hover:bg-[#eceef0] transition-colors active:scale-95">
                <span className="material-symbols-outlined text-[#006194]">mail</span>
                <span>Email Support</span>
              </RippleButton>
              <RippleButton className="flex items-center justify-center gap-2 py-4 rounded-xl font-semibold bg-white border border-[#bfc7d2] text-[#3f4850] hover:bg-[#eceef0] transition-colors active:scale-95">
                <span className="material-symbols-outlined text-[#006194]">call</span>
                <span>Call Us</span>
              </RippleButton>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="flex -space-x-2">
              <img
                className="w-8 h-8 rounded-full border-2 border-[#f7f9fb] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJnwG2xt9hKGxoOctakzcSU-gzB_TROvgfVZug3QcqMek7fqGzqcik2vaM8hkO6ugg5p5YTXMvIPgz0lViWX_lfBOEO8YFPvh1HsQLMK3vhldBVIum6WOgDv_O0CYwVfShks8SV2myQ7RcCEN138m-EP7WBI4my_dJAqQenaLNrO9RvS5lYvJoR_V_klt6x17JQYTNfAJoOIj-Cevun0IRhUouqWEggzF24btcxkNDMoY-yl2aoNzs-w"
                alt="Support representative"
              />
              <img
                className="w-8 h-8 rounded-full border-2 border-[#f7f9fb] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgjdHw1vVHBoiPg9cFskK5idLqXNWZ88-LsjMhfpyYXuMU2Bpr2HbEC7jfF1OUzkp0xv7JIkBpySFPOPGArtUg7HY0GxoviG6rHCiCI0Rp-3djQc2WLR1xm-e8orQ35SbsYGNEkdt7zU1bkBDt9B7Max2n6w2waqVJvt1XJi9wrciJpTgCL4P5ERGrHOzfUjoUSsig_1kpLO90bYI0phmwSTHXsLRdTwT0WDTIblWq2jf1YdocFSrvYw"
                alt="Support agent"
              />
              <div className="w-8 h-8 rounded-full border-2 border-[#f7f9fb] bg-[#dae2fd] text-[#5c647a] flex items-center justify-center text-[10px] font-bold">
                +12
              </div>
            </div>
            <p className="text-xs text-[#3f4850]">Our team is active and ready to help.</p>
          </div>
        </section>

        <div className="h-10" />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-[#f7f9fb] border-t border-[#bfc7d2] shadow-md rounded-t-xl">
        {navItems.map(({ label, icon, active }) => (
          <a
            key={label}
            href="#"
            className={`flex flex-col items-center justify-center transition-all duration-150 active:scale-90 p-2 ${
              active
                ? "bg-[#dae2fd] text-[#5c647a] rounded-full px-4 py-1"
                : "text-[#5c647a] opacity-70 hover:bg-[#e6e8ea]"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span className="text-[11px] font-semibold tracking-wide mt-0.5">{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}