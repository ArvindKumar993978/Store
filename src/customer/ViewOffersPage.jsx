import React, { useEffect, useRef, useState } from "react";

/*
  ViewOffersPage
  --------------
  Same conventions as the other converted pages: Material Symbols
  font + Tailwind arbitrary-hex classes, no icon library import.
  The countdown timer is a React state + useEffect interval instead
  of a global setInterval/DOM query.
*/

const START_SECONDS = 60 * 60 * 5; // 5 hours, matches the original script

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function ViewOffersPage() {
  const [secondsLeft, setSecondsLeft] = useState(START_SECONDS);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev - 1 < 0 ? START_SECONDS : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen pb-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; display: inline-block; line-height: 1; text-transform: none; letter-spacing: normal; word-wrap: normal; white-space: nowrap; direction: ltr; }
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
      `}</style>

      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-16 px-4 bg-[#f7f9fb]">
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#f2f4f6] transition-colors active:scale-95" aria-label="Go back">
            <span className="material-symbols-outlined text-[#006194]">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold text-[#006194]">Efficient Ledger</h1>
        </div>
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#f2f4f6] transition-colors active:scale-95" aria-label="Account">
          <span className="material-symbols-outlined text-[#006194]">account_circle</span>
        </button>
      </header>

      <main className="pt-20 px-4">
        {/* Flash Sale Section */}
        <section className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Flash Deals</h2>
            <div className="bg-[#ffdad6] text-[#93000a] px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                timer
              </span>
              <span className="tabular-nums font-medium">{formatTime(secondsLeft)}</span>
            </div>
          </div>

          {/* Featured Banner */}
          <div className="relative overflow-hidden rounded-xl bg-[#006194] shadow-md aspect-[16/9] mb-4 group">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAgxBqv0CGG0VOcvKnK0MsawyXO--_qru1r7q2loGcbxFIeToGclbo0-tZVj6OWCbLO37cCdxJAWyru5vc8jNug6n-4-qIJWP55LFJy6rB2KSWQYBWsWMgGIiLMtE7H-FMJMeoD0-0_hf5eAa95RCsRjTiDmD8KAMHV9XBsnDCwDMYCKfGL2-G0nW1Lz9-0P7tQdhO6M-doAkMIPwg6cNGRiDreH9tok-ytG5DtA7qy5AOPO-9Tfr6jIA')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#006194]/90 via-[#006194]/20 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
              <span className="inline-block bg-[#006947] text-white px-3 py-1 rounded-full text-[12px] font-semibold mb-2">
                LIMITED TIME
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-1">50% off on Staples</h3>
              <p className="text-sm text-white/80 mb-4">Stock up for your quarterly inventory at half price.</p>
              <button className="bg-white text-[#006194] px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#e0e3e5] transition-colors active:scale-95">
                Claim Now
              </button>
            </div>
          </div>
        </section>

        {/* Promotional Grid */}
        <section className="grid grid-cols-1 gap-6 mt-8">
          <h2 className="text-xl font-semibold">Curated for You</h2>

          {/* Deal Card 1 */}
          <div className="bg-white rounded-xl shadow-sm border border-[#bfc7d2]/30 flex flex-col overflow-hidden group">
            <div className="h-40 overflow-hidden relative">
              <div className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur text-[#006194] px-2 py-1 rounded-lg text-[12px] font-bold">
                NEW
              </div>
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK9pXbB744y1sHT-NNPedUGTLygonWNle0nbSRhGpDROOwrxNrM5gtvS8xPbCzdLvr1QaCqQ87MBu7rMO6IE7KVUDOMM_AWCt7JU9JaGhk1wMFccGCfdoG3TlFg7u9nGcx4pxd-ItGwmTx6e_6E_d_3AyQuaw0-i7jJvs0IIs32UXFWDYT5ZlHvGfhZZRLjRQvYF1HkJQNVFrr9ahfNb7fsFHj5u5X0A-3W5bwLQqxODI1LbHUtCPV5Q"
                alt="POS upgrade kit"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-lg font-semibold">POS Upgrade Kit</h4>
                  <p className="text-sm text-[#3f4850]">25% Cash back on full kits</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#006194] font-bold tabular-nums text-lg">₹12,499</span>
                <span className="text-[#3f4850] line-through text-[12px] opacity-60">₹16,665</span>
              </div>
              <button className="w-full py-3 bg-[#006194] text-white rounded-lg text-[12px] font-bold uppercase tracking-wider hover:bg-[#007bb9] transition-all active:scale-95">
                Shop Deal
              </button>
            </div>
          </div>

          {/* Deal Card 2 (Asymmetric) */}
          <div className="bg-[#dae2fd] rounded-xl p-6 flex items-center justify-between gap-4 border border-[#bfc7d2]/20 overflow-hidden relative">
            <div className="z-10 w-2/3">
              <span className="text-[12px] font-semibold text-[#5c647a] uppercase mb-1 block">B2B Bulk Offer</span>
              <h4 className="text-lg font-semibold text-[#131b2e] mb-2">Paper &amp; Printing Supplies</h4>
              <p className="text-sm text-[#5c647a] mb-4">Get extra 15% off on bulk orders over ₹5,000</p>
              <button className="bg-[#131b2e] text-white px-5 py-2 rounded-lg text-[12px] font-bold transition-transform active:scale-95">
                Redeem
              </button>
            </div>
            <div className="w-1/3 flex justify-end">
              <div className="w-24 h-24 bg-[#131b2e]/5 rounded-full flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[#006194] text-5xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  inventory_2
                </span>
              </div>
            </div>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#006194]/10 rounded-full blur-3xl" />
          </div>

          {/* Deal Card 3 */}
          <div className="bg-white rounded-xl shadow-sm border border-[#bfc7d2]/30 flex flex-col overflow-hidden group">
            <div className="h-40 overflow-hidden relative">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8dSUdHrcmzlDPugfs_2ITXmIjWb8jLLMafpY06TGxn99dN0TrD7m0LAFV8Hsc0kJVX0fQAWsg32-lLq8kUXo3VQcyh4_4_iMCj4YYz9U0-KzZyWJ8BX6N173o0FxNaakIAmxGk0njP-kWb_QUP3vVkVJsIGEk4C3yPe6jJ3T4C_hR0Snaqy--vLbZzIydPJopBJj-URg7vSiD90PlYODps3S2xojxdlEN6Iv67N1H2lRpax0Y260zYQ"
                alt="Store restock beverage bundles"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            <div className="p-4">
              <h4 className="text-lg font-semibold">Store Restock Pack</h4>
              <p className="text-sm text-[#3f4850] mb-4">Save ₹2,000 on beverage bundles</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <img
                    className="w-8 h-8 rounded-full border-2 border-white object-cover bg-[#eceef0]"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjWBnvZJT1fcWf-D0DGJj09r9sbDbGS1JA3BqG8d8gTdBiE9caCVNpG6rA6uARIiLd8ej7QwARKbBv_l2EEkb0omgvXxqql8A5oqnV1_Ujk7Ha8qhT75TLA-SSAdAQOrCZaDmV7sznqYuPxaAOx5anOnee0hFuWByUqUF4wZ65lQhV31_PP2ydOUcLHNcjjS8FkAh9fpHdEyo2VfX0kea0D7gS5cbwIHnefyLD5EYGcmqds9UhiXVH2A"
                    alt="Store manager"
                  />
                  <img
                    className="w-8 h-8 rounded-full border-2 border-white object-cover bg-[#eceef0]"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzhB3BeLSTIWM-bCGwJ5OwHxRldzS64fDvk_tpPRndLKkYAnO0TmY5HRtyKYwG2mYfkQHRblIVC2qzZf2f6dNoXO6KPyu8NxBKlncletdwcK1Gqrl-ub9wGR9X5ezX6sxEKJ9Ihr8eqs8TYtbeP5T0mkfRHY7MSLH6ZKGvpYlq_J08bTmbDSKWwDyk1sXHeMYLvS7lLqjFxFZqSUhHN3hcNpipJzBO3Zm70Rxom1c68Z1Qy74sTPsTMA"
                    alt="Entrepreneur"
                  />
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#006194] flex items-center justify-center text-[10px] text-white font-bold">
                    +12
                  </div>
                </div>
                <button className="text-[#006194] font-bold text-[12px] flex items-center gap-1 hover:underline">
                  View Details <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stock Alert */}
        <div className="mt-8 p-6 bg-[#e6e8ea] rounded-xl border-l-4 border-[#ba1a1a] flex items-start gap-4">
          <span className="material-symbols-outlined text-[#ba1a1a]" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
          <div>
            <h5 className="text-lg font-semibold">Stock Alert</h5>
            <p className="text-sm text-[#3f4850]">
              Thermal paper rolls are running low. Claim the discount today to avoid service interruptions.
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-[#f7f9fb] border-t border-[#bfc7d2] shadow-md rounded-t-xl">
        <div className="flex flex-col items-center justify-center text-[#5c647a] opacity-70 hover:bg-[#e6e8ea] transition-all duration-150 active:scale-90 p-2">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[11px] font-semibold tracking-wide">Home</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#5c647a] opacity-70 hover:bg-[#e6e8ea] transition-all duration-150 active:scale-90 p-2">
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="text-[11px] font-semibold tracking-wide">Inventory</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-[#dae2fd] text-[#5c647a] rounded-full px-4 py-1 transition-all duration-150 active:scale-90">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            receipt_long
          </span>
          <span className="text-[11px] font-semibold tracking-wide">Bills</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#5c647a] opacity-70 hover:bg-[#e6e8ea] transition-all duration-150 active:scale-90 p-2">
          <span className="material-symbols-outlined">support_agent</span>
          <span className="text-[11px] font-semibold tracking-wide">Support</span>
        </div>
      </nav>
    </div>
  );
}
