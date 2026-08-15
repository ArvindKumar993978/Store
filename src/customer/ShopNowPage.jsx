import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
/*
  ShopNowPage
  -----------
  Same conventions as OrderHistoryPage / CustomerSupportPage:
  Material Symbols font + Tailwind arbitrary-hex classes, no icon
  library import. Cart count, category filter, and the "Add to
  Cart" micro-interaction are all React state instead of direct
  DOM manipulation.
*/

const CATEGORIES = ["All Items", "Dairy & Eggs", "Snacks", "Beverages", "Pantry"];

const PRODUCTS = [
  {
    id: 1,
    name: "Whole Milk 1L",
    category: "Dairy & Eggs",
    price: 65.0,
    badge: { label: "Organic", bg: "bg-[#00855b]", fg: "text-[#f5fff6]" },
    icon: "add_shopping_cart",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC28OYNrjySngEAz5-eoh4RsMV5p4ujMccEPUzjJ4s3iRPrQhcF3SozB1DX8rlLxaKKji-KzJMs_xaZr0gzvWosEeI_yIMO6nLor0Prv8wccWvYr4rAC8r7I95OFQvZv5zhhfvhdwjpRUuuk8SHyJYBZRyTC6fiD2stZCirmiELJ7XQb02GrONXCyMmIk9Ui7EsL_eFetBsbVga2ETsJAlBVnJNENU_mufawkJ7clDRHLgBoifTd1-9TQ",
  },
  {
    id: 2,
    name: "Roasted Almonds",
    category: "Snacks",
    price: 240.0,
    badge: { label: "Low Stock", bg: "bg-[#ffdad6]", fg: "text-[#93000a]" },
    icon: "shopping_basket",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCoWAdBQq7nHmJyLzAkkyN4Dre0p2yIN4kobqfoBGO2TibAGeCTnqNHt-ZjEvDjIz44Us1qGWWsQO3KNxCFtBu2ufmbYnukGXEYQgYiuj1neviv218Zb083cIZsy5ReAD5ibykPNmXZLktMrgq6_4ASOa0-Zytlu6Pe4h9bjxfS6qMuMIsF6pGHfRuoPmMixe_iqoU0yldFrKstbKepzE92oWUZvgntPoRxPsI4NWT2lIrhN4vW6jMtNA",
  },
  {
    id: 3,
    name: "Farm Fresh Eggs (6)",
    category: "Dairy & Eggs",
    price: 48.0,
    badge: null,
    icon: "add",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6nmq77z6-sZHOwAMgvYyZFwdiZOhy3nvH2SdPMKiZDpjpT9nBPUmbsxhLm6UPJRByrQ3Q0CiKaBI0uKd57k1dmlGQZde1tsrSgM1qt5evlf526cOtV1CbYwNgqRtFY9k9GdzlVGTyMKjp7h1X7CsgWrasNEZFJH_3VcbNt8T4V3I6C0UHoLtJAfVyLYPNYHR2gGhcs-aSgR_9yqpt6ue0R7a_Jc3nfc9R77y3PFg7a--sU8bRNImA4g",
  },
  {
    id: 4,
    name: "Cold Brew Coffee",
    category: "Beverages",
    price: 120.0,
    badge: null,
    icon: "local_cafe",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAnKuyBoNdC70ZYlQ9OmCBc_-lh7hLcEjpU-ZlIS7Y1mFXyfLNnFSuZ7Ixhr0VkOa3lL6oXuQiCJbWAIoVf0EaQIJ-MW7uqLPD0CPCNll-EI5mM5BQ0el3AuaMTBO1uqMKcu7-wRjm2UephSd-fJZFdS0OScucmAbwj1me6wzZ5ACtRtRolU7GqHep8xa0BBXFPDWVvBR4HfaUrXJcBgPtQX_ulp1BnE7Q6v7dQRcPxwt1B0sLxUaGqaA",
  },
  {
    id: 5,
    name: "Multi-Grain Bread",
    category: "Pantry",
    price: 55.0,
    badge: { label: "New", bg: "bg-[#dae2fd]", fg: "text-[#5c647a]" },
    icon: "add",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9CPiyExUuTgkougKL9AjlH27t9KwwxbHXcsAWc12_78Quqyqy6ozcFq87gOBxxNPSbDhMlqdn-eJv9P_w5qIBCeG9iVppphpwMVUXtjuTjywPUOPtOjFEsxsmvdMcTQ02f_b1tSLOi3CUPHcnuR6WCw1eJ2F87phwg1uTJCTqsvsLhfzvPLddTZUcQtJqRBpFx0frqLPbkJorqw0RgdlJ0zgCc5i_MS5CHS-aju_JHExQeb4vQPuW0A",
  },
  {
    id: 6,
    name: "Baked Veggie Chips",
    category: "Snacks",
    price: 85.0,
    badge: null,
    icon: "add",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAI6ZykRw949TmAQxA0XXKhPeEJB_2r2P9Y8M2Krxkp3Ogip7HVXDLwg3olyhDzNNmi3ACY6Af3EWaiJZ3XJuMN_bjdTw9AODFfZ6witznquKNlbvi2Hvx_eU_3PHKnRy7MTH5oTeldNjahJ_VCphtA2qfaSi21D2S5BUADuoQKnK3_sVSBzuvoBAYj7QA5OnzCXorFtt7TRNlgPOYfd1tiUFxSsH6tOn72DVvMxmJhuSeS3i-lDvU-Bw",
  },
];

const inr = (n) => `\u20B9${n.toFixed(2)}`;

function ProductCard({ product, onAdd, justAdded }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_1px_2px_rgba(0,0,0,0.03)] flex flex-col group">
      <div className="aspect-square relative overflow-hidden bg-[#eceef0]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.badge && (
          <span
            className={`absolute top-2 left-2 ${product.badge.bg} ${product.badge.fg} text-[12px] font-semibold px-2 py-1 rounded-full`}
          >
            {product.badge.label}
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-base font-semibold text-[#191c1e] line-clamp-1">{product.name}</h3>
        <p className="text-[12px] font-semibold tracking-wide text-[#3f4850]">{product.category}</p>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-[#006194] text-base font-medium tabular-nums">{inr(product.price)}</span>
        </div>
        <button
          onClick={() => {
            onAdd(product.id);
          }}
          className={`mt-3 w-full py-2 rounded-lg text-[12px] font-semibold active:scale-95 transition-all flex items-center justify-center gap-2 text-white ${
            justAdded ? "bg-[#006947]" : "bg-[#006194]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {justAdded ? "check" : product.icon}
          </span>
          {justAdded ? "Added" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default function ShopNowPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [cartCount, setCartCount] = useState(2);
  const [justAddedId, setJustAddedId] = useState(null);

  const scrollRef = useRef(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const visibleProducts =
    activeCategory === "All Items"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  const handleAdd = (id) => {
    setCartCount((c) => c + 1);
    setJustAddedId(id);
    setTimeout(() => setJustAddedId((current) => (current === id ? null : current)), 2000);
  };

  // Drag-to-scroll for the category chip row (mirrors the original mouse handlers)
  const onMouseDown = (e) => {
    dragState.current.isDown = true;
    dragState.current.startX = e.pageX - scrollRef.current.offsetLeft;
    dragState.current.scrollLeft = scrollRef.current.scrollLeft;
  };
  const onMouseLeaveOrUp = () => {
    dragState.current.isDown = false;
  };
  const onMouseMove = (e) => {
    if (!dragState.current.isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 2;
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen pb-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; display: inline-block; line-height: 1; text-transform: none; letter-spacing: normal; word-wrap: normal; white-space: nowrap; direction: ltr; }
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-16 px-4 bg-[#f7f9fb]">
        <div className="flex items-center gap-4">
          <button className="text-[#006194] active:scale-95 transition-transform" aria-label="Go back">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold text-[#006194]">Efficient Ledger</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-[#006194] active:scale-95 transition-transform" aria-label="Search">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button className="text-[#006194] active:scale-95 transition-transform" aria-label="Account">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      <main className="pt-16 px-4">
        {/* Category Chips */}
        <section
          ref={scrollRef}
          className="mt-4 py-4 overflow-x-auto flex gap-3 custom-scrollbar cursor-grab active:cursor-grabbing"
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeaveOrUp}
          onMouseUp={onMouseLeaveOrUp}
          onMouseMove={onMouseMove}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold tracking-wide active:scale-95 transition-all ${
                activeCategory === cat
                  ? "bg-[#007bb9] text-white"
                  : "bg-[#e6e8ea] text-[#3f4850] hover:bg-[#e0e3e5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* Offer Banner */}
        <section
          className="mt-2 rounded-xl overflow-hidden relative h-40 bg-[#dae2fd]"
        >
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3_aPzRvApClZPt_t9obXTNr-iUrn-K2YDCWbly5_OkdFTs4a8yR5LKnNHvGJJGD7P877sc4yfLrLnhZj3Gvb7QRmaWhb_Q5zJQvUN9hiyorW4zW1n5scXioTVhjijdQRYt4dzQVdBMC98wnFxvJO5lL8AlMRuMF2eN2gO_51dOVUv8jWVXSAkMx1saTiSika3cuyO-rzvjrkOVaLeXfQQWoNbhxEYJGVjNWlhjrK3YG22xwdleHgaCQ')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#dae2fd] via-[#dae2fd]/60 to-transparent z-10 p-6 flex flex-col justify-center">
            <span className="text-[12px] font-semibold text-[#006194] bg-[#cce5ff] px-2 py-1 rounded w-fit mb-2">
              WEEKLY SPECIAL
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#131b2e]">20% Off All Dairy</h2>
            <p className="text-sm text-[#5c647a] mt-1">Valid till Sunday</p>
          </div>
        </section>

        {/* Product Grid */}
        <section className="mt-8 grid grid-cols-2 gap-4">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={handleAdd}
              justAdded={justAddedId === product.id}
            />
          ))}
        </section>
      </main>

      {/* Floating Cart Button */}
      <button   
        onClick={() => navigate("/shop")}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#006194] text-white rounded-full shadow-lg flex items-center justify-center z-40 active:scale-90 transition-transform">
        <span className="material-symbols-outlined">shopping_cart</span>
        {cartCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-[#ba1a1a] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
            {cartCount}
          </div>
        )}
      </button>

      
    </div>
  );
}
