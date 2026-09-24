import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../component/CartContext";

const START_SECONDS = 60 * 60 * 5;

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function ViewOffersPage() {
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  const [secondsLeft, setSecondsLeft] = useState(START_SECONDS);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev - 1 < 0 ? START_SECONDS : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleClaimStaples = () => {
    addToCart({
      id: 201,
      name: "Staples Quarterly Restock Bundle",
      price: 425.0,
      desc: "50% off promotion",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgxBqv0CGG0VOcvKnK0MsawyXO--_qru1r7q2loGcbxFIeToGclbo0-tZVj6OWCbLO37cCdxJAWyru5vc8jNug6n-4-qIJWP55LFJy6rB2KSWQYBWsWMgGIiLMtE7H-FMJMeoD0-0_hf5eAa95RCsRjTiDmD8KAMHV9XBsnDCwDMYCKfGL2-G0nW1Lz9-0P7tQdhO6M-doAkMIPwg6cNGRiDreH9tok-ytG5DtA7qy5AOPO-9Tfr6jIA",
    });
    showToast("Added Staples Restock Bundle to your basket!");
  };

  const handleShopPOSDeal = () => {
    addToCart({
      id: 202,
      name: "POS Upgrade Kit (25% Cashback)",
      price: 12499.0,
      desc: "Hardware & barcode bundle",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDK9pXbB744y1sHT-NNPedUGTLygonWNle0nbSRhGpDROOwrxNrM5gtvS8xPbCzdLvr1QaCqQ87MBu7rMO6IE7KVUDOMM_AWCt7JU9JaGhk1wMFccGCfdoG3TlFg7u9nGcx4pxd-ItGwmTx6e_6E_d_3AyQuaw0-i7jJvs0IIs32UXFWDYT5ZlHvGfhZZRLjRQvYF1HkJQNVFrr9ahfNb7fsFHj5u5X0A-3W5bwLQqxODI1LbHUtCPV5Q",
    });
    showToast("Added POS Upgrade Kit to your basket!");
  };

  const handleRedeemBulk = () => {
    addToCart({
      id: 203,
      name: "Paper & Printing Supplies (Bulk Pack)",
      price: 4250.0,
      desc: "B2B Special 15% off",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8dSUdHrcmzlDPugfs_2ITXmIjWb8jLLMafpY06TGxn99dN0TrD7m0LAFV8Hsc0kJVX0fQAWsg32-lLq8kUXo3VQcyh4_4_iMCj4YYz9U0-KzZyWJ8BX6N173o0FxNaakIAmxGk0njP-kWb_QUP3vVkVJsIGEk4C3yPe6jJ3T4C_hR0Snaqy--vLbZzIydPJopBJj-URg7vSiD90PlYODps3S2xojxdlEN6Iv67N1H2lRpax0Y260zYQ",
    });
    showToast("Bulk Printing Supplies added to your basket!");
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen pb-24 font-[Inter,sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-16 px-4 bg-white border-b border-[#bfc7d2]/40 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/storefront")}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#f2f4f6] transition-colors active:scale-95" 
            aria-label="Go back"
            title="Return to Storefront"
          >
            <span className="material-symbols-outlined text-[#006194]">arrow_back</span>
          </button>
          <div onClick={() => navigate("/storefront")} className="cursor-pointer">
            <h1 className="text-lg font-bold text-[#006194] leading-tight">Krishna Store</h1>
            <p className="text-[10px] text-[#707881]">Exclusive Offers</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate("/shop")}
            className="relative p-2 text-[#006194] hover:bg-[#eff4ff] rounded-full active:scale-95"
            title="Basket"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#ba1a1a] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => navigate("/orders")}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#f2f4f6] transition-colors active:scale-95" 
            aria-label="Account"
            title="My Orders"
          >
            <span className="material-symbols-outlined text-[#006194]">account_circle</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-4 max-w-[1000px] mx-auto">
        {/* Flash Sale Section */}
        <section className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">Flash Deals</h2>
            <div className="bg-[#ffdad6] text-[#93000a] px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                timer
              </span>
              <span className="tabular-nums font-bold">{formatTime(secondsLeft)}</span>
            </div>
          </div>

          {/* Featured Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-[#006194] shadow-md aspect-[16/9] md:aspect-[21/9] mb-6 group">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAgxBqv0CGG0VOcvKnK0MsawyXO--_qru1r7q2loGcbxFIeToGclbo0-tZVj6OWCbLO37cCdxJAWyru5vc8jNug6n-4-qIJWP55LFJy6rB2KSWQYBWsWMgGIiLMtE7H-FMJMeoD0-0_hf5eAa95RCsRjTiDmD8KAMHV9XBsnDCwDMYCKfGL2-G0nW1Lz9-0P7tQdhO6M-doAkMIPwg6cNGRiDreH9tok-ytG5DtA7qy5AOPO-9Tfr6jIA')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#006194] via-[#006194]/40 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-6 z-20 w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="inline-block bg-[#006947] text-white px-3 py-1 rounded-full text-[12px] font-bold mb-2 shadow-sm">
                  LIMITED TIME OFFER
                </span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-1">50% off on Staples</h3>
                <p className="text-sm text-white/90">Stock up for your quarterly pantry & inventory at half price.</p>
              </div>
              <button 
                onClick={handleClaimStaples}
                className="bg-white text-[#006194] px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#e0e3e5] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                Claim Deal
              </button>
            </div>
          </div>
        </section>

        {/* Promotional Grid */}
        <section className="grid grid-cols-1 gap-6 mt-8">
          <h2 className="text-xl font-bold">Curated for You</h2>

          {/* Deal Card 1 */}
          <div className="bg-white rounded-xl shadow-sm border border-[#bfc7d2]/30 flex flex-col sm:flex-row overflow-hidden group hover:shadow-md transition-shadow">
            <div className="sm:w-1/2 h-48 sm:h-auto overflow-hidden relative">
              <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur text-[#006194] px-2.5 py-1 rounded-lg text-[12px] font-bold shadow-sm">
                25% CASHBACK
              </div>
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK9pXbB744y1sHT-NNPedUGTLygonWNle0nbSRhGpDROOwrxNrM5gtvS8xPbCzdLvr1QaCqQ87MBu7rMO6IE7KVUDOMM_AWCt7JU9JaGhk1wMFccGCfdoG3TlFg7u9nGcx4pxd-ItGwmTx6e_6E_d_3AyQuaw0-i7jJvs0IIs32UXFWDYT5ZlHvGfhZZRLjRQvYF1HkJQNVFrr9ahfNb7fsFHj5u5X0A-3W5bwLQqxODI1LbHUtCPV5Q"
                alt="POS upgrade kit"
              />
            </div>
            <div className="p-6 sm:w-1/2 flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-bold">POS Upgrade Kit</h4>
                <p className="text-sm text-[#3f4850] mt-1">High-speed scanner + thermal printer bundle for swift counters.</p>
                <div className="flex items-center gap-3 my-4">
                  <span className="text-[#006194] font-bold tabular-nums text-2xl">₹12,499</span>
                  <span className="text-[#3f4850] line-through text-sm opacity-60">₹16,665</span>
                  <span className="text-xs bg-[#e5eeff] text-[#006194] font-bold px-2 py-0.5 rounded">Save ₹4,166</span>
                </div>
              </div>
              <button 
                onClick={handleShopPOSDeal}
                className="w-full py-3 bg-[#006194] text-white rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-[#007bb9] transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                Add Deal to Cart
              </button>
            </div>
          </div>

          {/* Deal Card 2 */}
          <div className="bg-[#dae2fd] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#bfc7d2]/20 shadow-sm relative overflow-hidden">
            <div className="z-10 flex-1">
              <span className="text-[12px] font-bold text-[#006194] uppercase tracking-wider mb-1 block">B2B Bulk Offer</span>
              <h4 className="text-xl font-bold text-[#131b2e] mb-2">Paper &amp; Printing Supplies</h4>
              <p className="text-sm text-[#5c647a] mb-4">Get extra 15% off on bulk orders over ₹5,000 for your billing terminals.</p>
              <button 
                onClick={handleRedeemBulk}
                className="bg-[#006194] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#007bb9] transition-all active:scale-95 shadow-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">local_mall</span>
                Redeem Bulk Deal
              </button>
            </div>
            <div className="w-24 h-24 bg-white/60 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[#006194] text-5xl">inventory_2</span>
            </div>
          </div>
        </section>

        {/* Stock Alert */}
        <div className="mt-8 p-6 bg-[#e6e8ea] rounded-xl border-l-4 border-[#ba1a1a] flex items-start gap-4">
          <span className="material-symbols-outlined text-[#ba1a1a] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
          <div>
            <h5 className="text-base font-bold text-[#191c1e]">Stock Alert</h5>
            <p className="text-sm text-[#3f4850] mt-0.5">
              Thermal paper rolls are running low. Claim your discount today before stocks deplete.
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-white border-t border-[#bfc7d2] shadow-lg">
        <button 
          onClick={() => navigate("/storefront")}
          className="flex flex-col items-center justify-center text-[#5c647a] hover:text-[#006194] transition-colors p-2"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-[11px] font-semibold mt-0.5">Home</span>
        </button>
        <button 
          onClick={() => navigate("/shopnow")}
          className="flex flex-col items-center justify-center text-[#5c647a] hover:text-[#006194] transition-colors p-2"
        >
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="text-[11px] font-semibold mt-0.5">Products</span>
        </button>
        <button 
          onClick={() => navigate("/orders")}
          className="flex flex-col items-center justify-center text-[#5c647a] hover:text-[#006194] transition-colors p-2"
        >
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-[11px] font-semibold mt-0.5">Orders</span>
        </button>
        <button 
          onClick={() => navigate("/help")}
          className="flex flex-col items-center justify-center text-[#5c647a] hover:text-[#006194] transition-colors p-2"
        >
          <span className="material-symbols-outlined">support_agent</span>
          <span className="text-[11px] font-semibold mt-0.5">Support</span>
        </button>
      </nav>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#006194] text-white px-6 py-3 rounded-full shadow-2xl z-50 text-sm font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
