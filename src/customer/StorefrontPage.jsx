import React, { useState, useMemo } from "react";
import StorefrontNavbar from "../component/StorefrontNavbar";
import { useNavigate } from "react-router-dom";
import { useCart } from "../component/CartContext";
import { useStore } from "../context/StoreContext";

const CATEGORIES = [
  { icon: "bakery_dining", label: "All Fresh" },
  { icon: "egg", label: "Dairy & Eggs" },
  { icon: "cookie", label: "Snacks & Drinks" },
  { icon: "nutrition", label: "Staples & Grains" },
  { icon: "spa", label: "Personal Care" },
];

export default function StorefrontPage() {
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  const { products } = useStore();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Fresh");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [onlySale, setOnlySale] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [addedIds, setAddedIds] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  // Quick View Product Modal State
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewQty, setQuickViewQty] = useState(1);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleAddToCart = (product, qty = 1) => {
    if (product.stock === 0) {
      showToast(`${product.name} is currently Out of Stock!`);
      return;
    }
    addToCart(product, qty);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    showToast(`Added ${qty > 1 ? qty + "x " : ""}${product.name} to basket!`);
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleClaimCoupon = () => {
    navigator.clipboard?.writeText("SAVE50");
    showToast("Coupon SAVE50 copied! Use at checkout to save ₹50.");
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      showToast("Please enter a valid email address.");
      return;
    }
    showToast("Subscribed successfully! Weekly offers will be sent to your inbox.");
    setNewsletterEmail("");
  };

  const displayedProducts = useMemo(() => {
    const list = products.map((p) => {
      const pVal = typeof p.price === "number" ? p.price : parseFloat(String(p.price).replace(/[^0-9.]/g, "") || 0);
      return {
        ...p,
        priceValue: pVal,
        priceDisplay: typeof p.price === "number" ? `₹${p.price.toFixed(2)}` : p.price,
      };
    });

    return list.filter((p) => {
      const cat = p.category ? p.category.toLowerCase() : "";
      const matchesCat =
        selectedCategory === "All Fresh" ||
        cat.includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === "Dairy & Eggs" && (cat.includes("dairy") || cat.includes("egg"))) ||
        (selectedCategory === "Snacks & Drinks" && (cat.includes("snack") || cat.includes("drink"))) ||
        (selectedCategory === "Staples & Grains" && (cat.includes("staple") || cat.includes("grain"))) ||
        (selectedCategory === "Personal Care" && (cat.includes("personal") || cat.includes("care") || cat.includes("soap") || cat.includes("beauty")));

      const matchesPrice = p.priceValue <= maxPrice;
      const matchesSale = !onlySale || Boolean(p.badge === "OFFER" || p.badge === "SALE" || p.originalPrice);
      const matchesStock = !onlyInStock || p.stock > 0;
      const matchesSearch =
        !searchValue ||
        p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        cat.includes(searchValue.toLowerCase());

      return matchesCat && matchesPrice && matchesSale && matchesStock && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "low-to-high") return a.priceValue - b.priceValue;
      if (sortBy === "high-to-low") return b.priceValue - a.priceValue;
      if (sortBy === "newest") return b.id - a.id;
      return a.id - b.id;
    });
  }, [products, selectedCategory, maxPrice, onlySale, onlyInStock, searchValue, sortBy]);

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
      `}</style>

      <StorefrontNavbar cartCount={cartCount} searchValue={searchValue} onSearchChange={setSearchValue} />

      <main className="pt-20">
        {/* Hero Banner */}
        <section className="relative h-[440px] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#006194]/90 to-transparent z-10" />
          <img
            className="absolute inset-0 w-full h-full object-cover"
            alt="Fresh grocery display"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK_WHGMEf0rExad0RE3zwofpTiooLW8SJ52gpx7O5r5swGfCtbEWUljC60rQlZ1p5bDSzJZsTZuQ9sKFl-N7USb45Y_fPiH4F79xB49wk-QO_zrbXNmLB7Dbjk7XQzfarorcVMox70ZO6f7LEOM-SItIHvF9Y_YrUzQrMrXHutnXx9mhBcMwXbY1eVwCpahpNprh7d0Un3TjBvk64yMtPC2yihYhMrENQRrXzSXl36hX5r707muxDgbFE3GjaAutvOP_F2476-yTU-"
          />
          <div className="relative z-20 max-w-[1280px] mx-auto h-full px-8 flex flex-col justify-center items-start">
            <div className="max-w-2xl bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20">
              <span className="inline-block bg-[#00855b] text-white px-3 py-1 rounded-full text-xs font-semibold mb-4">
                FRESH ARRIVALS
              </span>
              <h2 className="text-white text-[32px] font-bold mb-4 leading-tight">
                Farm Fresh Goodness
                <br />
                Delivered to Your Doorstep.
              </h2>
              <p className="text-white/90 text-base mb-6">
                Experience the finest quality dairy, staples, and organic produce sourced directly from the best farms in India.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => navigate("/shopnow")}
                  className="bg-[#006194] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#007bb9] transition-all active:scale-95 shadow-md flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                  Shop Now
                </button>
                <button 
                  onClick={() => navigate("/offers")}
                  className="bg-white/20 text-white border border-white/40 px-6 py-3 rounded-lg font-bold backdrop-blur-sm hover:bg-white/30 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">local_offer</span>
                  View Offers
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1280px] mx-auto px-8 py-8 flex flex-col md:flex-row gap-6">
          {/* Sidebar filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-5 shadow-sm sticky top-24 border border-[#bfc7d2]/30 space-y-6">
              <div>
                <h3 className="text-[18px] font-semibold mb-3 text-[#006194] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">category</span>
                  Categories
                </h3>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat.label;
                    return (
                      <button
                        key={cat.label}
                        onClick={() => setSelectedCategory(cat.label)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-sm transition-all ${
                          isActive
                            ? "bg-[#cce5ff] text-[#004b73] font-bold"
                            : "text-[#3f4850] hover:bg-[#f2f4f6]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                          {cat.label}
                        </span>
                        {isActive && <span className="material-symbols-outlined text-sm">check</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#bfc7d2]/30">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-[#006194]">Max Price</h3>
                  <span className="text-sm font-bold text-[#006194]">₹{maxPrice}</span>
                </div>
                <input
                  className="w-full h-2 bg-[#e6e8ea] rounded-lg appearance-none cursor-pointer accent-[#006194]"
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
                <div className="flex justify-between mt-1 text-xs text-[#3f4850]">
                  <span>₹50</span>
                  <span>₹2000+</span>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      checked={onlySale}
                      onChange={(e) => setOnlySale(e.target.checked)}
                      className="rounded border-[#bfc7d2] text-[#006194] focus:ring-[#006194] w-4 h-4 cursor-pointer" 
                      type="checkbox" 
                    />
                    <span>On Sale Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="rounded border-[#bfc7d2] text-[#006194] focus:ring-[#006194] w-4 h-4 cursor-pointer" 
                      type="checkbox" 
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>

                {(selectedCategory !== "All Fresh" || maxPrice < 2000 || onlySale || onlyInStock) && (
                  <button
                    onClick={() => {
                      setSelectedCategory("All Fresh");
                      setMaxPrice(2000);
                      setOnlySale(false);
                      setOnlyInStock(false);
                    }}
                    className="w-full mt-4 py-1.5 text-xs text-[#ba1a1a] font-semibold border border-[#ba1a1a]/30 rounded-lg hover:bg-[#ffdad6]/20 transition-colors"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-[28px] font-bold">Trending Products</h2>
                <p className="text-xs text-[#707881]">Showing {displayedProducts.length} items</p>
              </div>
              <div className="flex items-center gap-2 text-[#3f4850] bg-white px-3 py-1.5 rounded-lg border border-[#bfc7d2]/30 shadow-sm">
                <span className="text-xs uppercase tracking-wider font-semibold">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none font-bold text-[#006194] focus:ring-0 cursor-pointer text-sm outline-none"
                >
                  <option value="popularity">Popularity</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {displayedProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-[#bfc7d2]/30 text-center space-y-3">
                <span className="material-symbols-outlined text-4xl text-[#707881]">search_off</span>
                <p className="font-semibold text-lg">No products match your criteria</p>
                <p className="text-sm text-[#3f4850]">Try adjusting category filters or increasing the max price.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All Fresh");
                    setMaxPrice(2000);
                    setOnlySale(false);
                    setSearchValue("");
                  }}
                  className="px-4 py-2 bg-[#006194] text-white rounded-lg text-sm font-semibold hover:bg-[#007bb9]"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedProducts.map((product) => {
                  const isAdded = addedIds[product.id];
                  const isOutOfStock = product.stock === 0;
                  const isLowStock = product.stock > 0 && product.stock <= 5;
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-sm border border-[#bfc7d2]/30 overflow-hidden flex flex-col transition-all hover:shadow-md group relative"
                    >
                      <div
                        onClick={() => {
                          setQuickViewProduct(product);
                          setQuickViewQty(1);
                        }}
                        className="relative aspect-square overflow-hidden bg-[#f2f4f6] cursor-pointer"
                      >
                        <img
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          alt={product.name}
                          src={product.image}
                        />
                        {product.badge && (
                          <span
                            className="absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm z-10"
                            style={{ backgroundColor: product.badgeColor || "#006194" }}
                          >
                            {product.badge}
                          </span>
                        )}
                        {/* Out of Stock overlay */}
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center z-10">
                            <span className="bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                              Out of Stock
                            </span>
                            <span className="text-white text-xs mt-1 opacity-90">Restocking soon</span>
                          </div>
                        )}
                        {/* Quick View Button on Hover */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="bg-white/95 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">visibility</span> Quick View
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-[#707881] uppercase tracking-wider">{product.category}</p>
                          {isLowStock && (
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              Only {product.stock} left
                            </span>
                          )}
                        </div>
                        <h3
                          onClick={() => {
                            setQuickViewProduct(product);
                            setQuickViewQty(1);
                          }}
                          className="text-[18px] font-semibold mb-1 leading-tight hover:text-[#006194] cursor-pointer transition-colors"
                        >
                          {product.name}
                        </h3>
                        <p className="text-sm text-[#3f4850] mb-4 line-clamp-2">{product.desc}</p>
                        <div className="mt-auto flex items-center justify-between">
                          {product.originalPrice ? (
                            <div className="flex flex-col">
                              <span className="text-[#3f4850] line-through text-xs">{product.originalPrice}</span>
                              <span className="text-[20px] text-[#006194] font-bold">{product.priceDisplay || product.price}</span>
                            </div>
                          ) : (
                            <span className="text-[20px] text-[#006194] font-bold">{product.priceDisplay || product.price}</span>
                          )}
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={isOutOfStock}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                              isOutOfStock
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "active:scale-90 text-white"
                            }`}
                            style={{ backgroundColor: isOutOfStock ? undefined : (isAdded ? "#00855b" : "#006194") }}
                            title={isOutOfStock ? "Out of Stock" : "Add to Basket"}
                          >
                            <span className="material-symbols-outlined text-base">
                              {isOutOfStock ? "block" : (isAdded ? "check" : "add_shopping_cart")}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Promo banner */}
            <div className="mt-8 bg-[#dae2fd] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between border border-[#bfc7d2]/20 overflow-hidden relative shadow-sm">
              <div className="relative z-10">
                <span className="text-xs font-bold text-[#006194] uppercase tracking-wider bg-white/70 px-2.5 py-1 rounded-full mb-2 inline-block">
                  Special Offer
                </span>
                <h3 className="text-[28px] font-bold mb-2">Save extra ₹100 on your first order!</h3>
                <p className="text-[#5c647a] mb-4">
                  Use coupon code{" "}
                  <span className="font-bold border-2 border-dashed border-[#006194] px-2 py-1 rounded bg-white text-[#006194]">
                    KRISHNA100
                  </span>
                </p>
                <button 
                  onClick={handleClaimCoupon}
                  className="bg-[#006194] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#007bb9] active:scale-95 transition-all shadow-md flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  Claim Now
                </button>
              </div>
              <div className="md:w-64 w-full h-40 relative mt-4 md:mt-0">
                <img
                  className="w-full h-full object-contain"
                  alt="Delivery illustration"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzmvTfp_L_gnXh2eB7c56Ur0WH3XpKTa5GrIgAF7A4G-ZAos1tSUosEaHNvz9fhaiEJiN-voaS21mXIF-vaPmYXdMmzn5RvENvGXZmvO7bOTJkMP0NBTseR2TU1n9vOu5x1Y5PsIiaM20fnChVmiB1YopfkuAaosyLyckLuBJF5qIYiRCJk9WLEa70mz_t-h-sHbwwHMZo6c5CLsh0wfxEVYRfys1jg9WFb52-bixPgwzBX7L7ttYSMYGvr_L3VjMiVJog0bwETTMD"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#e6e8ea] border-t border-[#bfc7d2] mt-8">
        <div className="max-w-[1280px] mx-auto py-8 px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="col-span-1 md:col-span-1">
              <h2 className="text-[20px] font-semibold mb-4 text-[#006194]">Krishna Store</h2>
              <p className="text-[#3f4850] text-sm mb-4">
                Delivering freshness and quality to Indian households for over a decade. Your trusted neighborhood grocery partner.
              </p>
              <div className="flex gap-2">
                <button onClick={() => navigate("/storefront")} className="w-8 h-8 rounded-full bg-[#eceef0] flex items-center justify-center text-[#006194] hover:bg-[#006194] hover:text-white transition-all">
                  <span className="material-symbols-outlined text-sm">public</span>
                </button>
                <button onClick={() => navigate("/help")} className="w-8 h-8 rounded-full bg-[#eceef0] flex items-center justify-center text-[#006194] hover:bg-[#006194] hover:text-white transition-all">
                  <span className="material-symbols-outlined text-sm">alternate_email</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs text-[#006194] uppercase tracking-widest mb-4 font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-[#3f4850] text-sm">
                <li><button onClick={() => navigate("/storefront")} className="hover:text-[#006194] transition-colors">Storefront</button></li>
                <li><button onClick={() => navigate("/shopnow")} className="hover:text-[#006194] transition-colors">Shop Now</button></li>
                <li><button onClick={() => navigate("/orders")} className="hover:text-[#006194] transition-colors">Orders & Tracking</button></li>
                <li><button onClick={() => navigate("/offers")} className="hover:text-[#006194] transition-colors">Offers & Coupons</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs text-[#006194] uppercase tracking-widest mb-4 font-semibold">Support</h3>
              <ul className="space-y-2 text-[#3f4850] text-sm">
                <li><button onClick={() => navigate("/help")} className="hover:text-[#006194] transition-colors">Help Center</button></li>
                <li><button onClick={() => navigate("/help")} className="hover:text-[#006194] transition-colors">Contact Support</button></li>
                <li><button onClick={() => navigate("/orders")} className="hover:text-[#006194] transition-colors">Returns & Refunds</button></li>
                <li><button onClick={() => navigate("/")} className="hover:text-[#006194] transition-colors">Main Hub Portal</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs text-[#006194] uppercase tracking-widest mb-4 font-semibold">Newsletter</h3>
              <p className="text-[#3f4850] text-sm mb-4">Subscribe for weekly fresh offers and instant discounts.</p>
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <input
                  className="bg-[#f2f4f6] border border-[#bfc7d2] rounded-l-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#006194] w-full outline-none"
                  placeholder="Email address"
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button type="submit" className="bg-[#006194] text-white px-4 rounded-r-lg hover:bg-[#007bb9] font-semibold text-sm transition-colors">
                  Join
                </button>
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-[#bfc7d2]/30 flex flex-col md:flex-row justify-between items-center gap-4 text-[#3f4850] text-sm">
            <p>© 2024 Krishna Store Ecosystem. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span> Main Market, Bengaluru
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#00855b]">verified_user</span> 100% Secure Payments
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Quick View Product Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 flex flex-col md:flex-row">
            {/* Modal Image */}
            <div className="md:w-1/2 bg-slate-50 relative p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="max-h-64 object-contain rounded-xl shadow-sm"
              />
              {quickViewProduct.stock === 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Modal Details */}
            <div className="p-6 md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#006194] bg-[#dae2fd] px-2.5 py-0.5 rounded-full">
                    {quickViewProduct.category || "Grocery"}
                  </span>
                  <button
                    onClick={() => setQuickViewProduct(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">{quickViewProduct.name}</h2>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  {quickViewProduct.desc || "Fresh and authentic premium grocery product supplied directly from certified farms & partners."}
                </p>

                {/* Pricing & Stock Status */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl font-black text-[#006194]">
                    {quickViewProduct.priceDisplay || quickViewProduct.price}
                  </span>
                  {quickViewProduct.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      {quickViewProduct.originalPrice}
                    </span>
                  )}
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    quickViewProduct.stock > 5 ? "bg-emerald-100 text-emerald-800" :
                    quickViewProduct.stock > 0 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                  }`}>
                    {quickViewProduct.stock > 0 ? `${quickViewProduct.stock} Available` : "Sold Out"}
                  </span>
                </div>

                {/* SKU & Brand info */}
                <div className="text-xs text-slate-500 space-y-1 mb-6 border-t border-slate-100 pt-3">
                  <p><span className="font-semibold text-slate-700">SKU:</span> {quickViewProduct.sku || `SKU-${quickViewProduct.id}`}</p>
                  <p><span className="font-semibold text-slate-700">Delivery:</span> In stock & ready for immediate same-day dispatch</p>
                </div>
              </div>

              {/* Quantity selector & Add to cart button */}
              <div>
                {quickViewProduct.stock > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-700 uppercase">Quantity:</span>
                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setQuickViewQty((q) => Math.max(1, q - 1))}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 font-bold text-sm min-w-[2.5rem] text-center">
                          {quickViewQty}
                        </span>
                        <button
                          onClick={() => setQuickViewQty((q) => Math.min(quickViewProduct.stock, q + 1))}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleAddToCart(quickViewProduct, quickViewQty);
                        setQuickViewProduct(null);
                      }}
                      className="w-full bg-[#006194] hover:bg-[#007bb9] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#006194]/20 transition-all active:scale-[0.98]"
                    >
                      <span className="material-symbols-outlined text-lg">shopping_basket</span>
                      Add {quickViewQty} to Basket • ₹{((parseFloat(String(quickViewProduct.price).replace(/[^0-9.]/g, "") || 0)) * quickViewQty).toFixed(2)}
                    </button>
                  </div>
                ) : (
                  <button
                    disabled
                    className="w-full bg-slate-200 text-slate-400 py-3 rounded-xl font-bold cursor-not-allowed text-center"
                  >
                    Item Out of Stock
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating notification toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#006194] text-white px-5 py-3 rounded-xl shadow-2xl z-50 text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-300">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
