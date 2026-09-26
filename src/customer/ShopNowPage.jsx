import React, { useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../component/CartContext";
import { useStore } from "../context/StoreContext";

const inr = (n) => `₹${Number(n || 0).toFixed(2)}`;

function ProductCard({ product, onAdd, justAdded }) {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group border border-[#bfc7d2]/30 relative">
      <div className="aspect-square relative overflow-hidden bg-[#eceef0]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span
            className="absolute top-2 left-2 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm z-10"
            style={{ backgroundColor: product.badgeColor || "#006194" }}
          >
            {product.badge}
          </span>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center p-2 z-10">
            <span className="bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[12px] font-semibold tracking-wide text-[#707881] uppercase">{product.category || "Grocery"}</p>
          {isLowStock && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              Only {product.stock} left
            </span>
          )}
        </div>
        <h3 className="text-base font-semibold text-[#191c1e] line-clamp-1">{product.name}</h3>
        <p className="text-xs text-[#5c647a] line-clamp-1 mb-2">{product.desc}</p>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-[#006194] text-base font-bold tabular-nums">{inr(product.numPrice)}</span>
          {product.originalPrice && (
            <span className="text-xs text-[#707881] line-through">{product.originalPrice}</span>
          )}
        </div>
        <button
          onClick={() => onAdd(product)}
          disabled={isOutOfStock}
          className={`mt-3 w-full py-2 rounded-lg text-[12px] font-semibold active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm ${
            isOutOfStock
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : justAdded
              ? "bg-[#006947] text-white"
              : "bg-[#006194] hover:bg-[#007bb9] text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isOutOfStock ? "block" : justAdded ? "check" : "add_shopping_cart"}
          </span>
          {isOutOfStock ? "Out of Stock" : justAdded ? "Added to Basket" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default function ShopNowPage() {
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  const { products } = useStore();
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [justAddedId, setJustAddedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const scrollRef = useRef(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All Items", ...Array.from(set)];
  }, [products]);

  const visibleProducts = useMemo(() => {
    return products
      .map((p) => ({
        ...p,
        numPrice: typeof p.price === "number" ? p.price : parseFloat(String(p.price).replace(/[^0-9.]/g, "") || 0),
      }))
      .filter((p) => {
        const matchCat = activeCategory === "All Items" || p.category === activeCategory;
        const matchSearch =
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchCat && matchSearch;
      });
  }, [products, activeCategory, searchQuery]);

  const handleAdd = (product) => {
    if (product.stock === 0) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.numPrice,
      image: product.image,
      desc: product.category,
      stock: product.stock,
      sku: product.sku,
    });
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId((current) => (current === product.id ? null : current)), 2000);
  };

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
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen pb-24 font-[Inter,sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        body { font-family: 'Inter', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-16 px-4 bg-white border-b border-[#bfc7d2]/40 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/storefront")}
            className="p-2 text-[#006194] hover:bg-[#eff4ff] rounded-full active:scale-95 transition-transform" 
            aria-label="Go back to Storefront"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div 
            onClick={() => navigate("/storefront")}
            className="cursor-pointer"
          >
            <h1 className="text-lg font-bold text-[#006194] leading-tight">Krishna Store</h1>
            <p className="text-[10px] text-[#707881]">All Products</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showSearch ? (
            <input
              autoFocus
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#f2f4f6] px-3 py-1.5 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#006194] w-36 sm:w-48"
            />
          ) : null}

          <button 
            onClick={() => setShowSearch((v) => !v)}
            className="p-2 text-[#006194] hover:bg-[#eff4ff] rounded-full active:scale-95 transition-transform" 
            aria-label="Search"
          >
            <span className="material-symbols-outlined">{showSearch ? "close" : "search"}</span>
          </button>
          <button 
            onClick={() => navigate("/orders")}
            className="p-2 text-[#006194] hover:bg-[#eff4ff] rounded-full active:scale-95 transition-transform" 
            aria-label="View Orders"
            title="My Orders"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-4 max-w-[1280px] mx-auto">
        {/* Category Chips */}
        <section
          ref={scrollRef}
          className="mt-2 py-2 overflow-x-auto flex gap-3 custom-scrollbar cursor-grab active:cursor-grabbing"
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeaveOrUp}
          onMouseUp={onMouseLeaveOrUp}
          onMouseMove={onMouseMove}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold tracking-wide active:scale-95 transition-all ${
                activeCategory === cat
                  ? "bg-[#006194] text-white shadow-sm"
                  : "bg-[#e6e8ea] text-[#3f4850] hover:bg-[#e0e3e5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* Offer Banner */}
        <section className="mt-4 rounded-xl overflow-hidden relative h-36 bg-[#dae2fd] shadow-sm">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3_aPzRvApClZPt_t9obXTNr-iUrn-K2YDCWbly5_OkdFTs4a8yR5LKnNHvGJJGD7P877sc4yfLrLnhZj3Gvb7QRmaWhb_Q5zJQvUN9hiyorW4zW1n5scXioTVhjijdQRYt4dzQVdBMC98wnFxvJO5lL8AlMRuMF2eN2gO_51dOVUv8jWVXSAkMx1saTiSika3cuyO-rzvjrkOVaLeXfQQWoNbhxEYJGVjNWlhjrK3YG22xwdleHgaCQ')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#dae2fd] via-[#dae2fd]/80 to-transparent z-10 p-6 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-[#006194] bg-[#cce5ff] px-2 py-0.5 rounded w-fit mb-1 uppercase">
              WEEKLY SPECIAL
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#131b2e]">20% Off All Dairy Products</h2>
            <p className="text-xs text-[#5c647a] mt-0.5">Use code KRISHNA100 at checkout</p>
          </div>
        </section>

        {/* Product Grid */}
        <section className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={handleAdd}
              justAdded={justAddedId === product.id}
            />
          ))}
        </section>

        {visibleProducts.length === 0 && (
          <div className="text-center py-16 text-[#707881]">
            <p className="font-semibold">No products found in this category.</p>
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      <button   
        onClick={() => navigate("/shop")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#006194] text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-90 hover:bg-[#007bb9] transition-all"
        title="View Basket"
      >
        <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
        {cartCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-[#ba1a1a] text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md">
            {cartCount}
          </div>
        )}
      </button>
    </div>
  );
}
