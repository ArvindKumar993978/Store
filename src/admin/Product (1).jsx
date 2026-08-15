import React, { useState } from "react";
// import ProductsTopNav from "./ProductsTopNav";
import Sidebar from "../component/Sidebar";

import Topnav from "../component/Topnav";

/*
  EASY-TO-EDIT VERSION
  --------------------
  Colors as Tailwind arbitrary values, e.g. text-[#006194].

  Quick color reference:
    #006194  -> primary (blue)
    #006a61  -> secondary (teal, "In Stock")
    #894d00  -> tertiary (brown, "Low Stock")
    #ba1a1a  -> error (red, "Out of Stock")
    #0b1c30  -> main dark text
    #3f4850  -> secondary/gray text
    #f8f9ff  -> page background
    #e5eeff  -> surface-container (category pills, thumbnails)
    #eff4ff  -> light surface (table header, hover rows)
    #bfc7d2  -> border color

  DATA:
  Product rows live in the PRODUCTS_INITIAL array below, loaded into
  state so a delete can actually remove a row. Edit that array to
  add/remove/change products — the table renders from it automatically.

  Typing in the TopNav search box filters products live, same behavior
  as the original page's search script.

  DELETE FLOW:
  Clicking the delete icon on a row opens the confirmation modal
  (openModal). "Delete Product" removes it from state (confirmDelete);
  "Cancel" or clicking the backdrop closes it (closeModal) without
  changing anything.
*/

const CATEGORIES = ["All", "Dairy", "Snacks", "Staples", "Personal Care"];

const STOCK_FILTERS = [
  { label: "All Status", dot: null },
  { label: "In Stock", dot: "#006a61" },
  { label: "Low Stock", dot: "#894d00" },
  { label: "Out of Stock", dot: "#ba1a1a" },
];

const STATUS_COLORS = {
  "In Stock": "#006a61",
  "Low Stock": "#894d00",
  "Out of Stock": "#ba1a1a",
};

const PRODUCTS_INITIAL = [
  {
    name: "Whole Milk - 1L",
    brand: "Farm Fresh Organics",
    sku: "MK-10293",
    category: "Dairy",
    price: "$4.50",
    stock: 12,
    status: "Low Stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCrYvrSJ7OcbW0gUMWUZhjsLn4Pukj0UAun_Q0tyy8ObC0B4wHpGflnCEa4tsSp497gGwtn1sDQeZ-Vw20_QRCWGl5N3f2_otUNzNAa1jJH7GNG9Nt4rqxc8GeqYLQbOvkUSsvqNtNb4L7GXkE9VbD591Dt4h4oqdsaLfVr118UO_UWOfiIn96NFzFsXO8fVFionsDy1gN94cTzEXCZ64xGXyslRYLr7YKdH6Lrctay2TGuf29M6N65JNa1zl0U9Q3QIgunWh3vzzcL",
  },
  {
    name: "Honey Loops Cereal",
    brand: "Morning Joy Foods",
    sku: "SN-44582",
    category: "Snacks",
    price: "$3.25",
    stock: 148,
    status: "In Stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD75B0M5a_k3dNhXaVz3cSNSoUgZgmqeaLYFxo_kaDMrvuYRRgsNLsYGny-lQYAUl5J-EWqKJs33b3yKxrU5MOZqiZcHhQmhJtpDjZo87KCl4mzkSQspLPNaC6gL2UwrLDpTph6i6Z4ahPvm7xPKzVS15ScZkuzyci3w_TBdWRNaTmcqE68RV8aY1jDbcW2Y83RuZj_74I5mr1dn3hrqfVSqWbMVUMtN1uyjy3UbCCNW_SaV5FWc5Atti8Wk7dbvtLx54vVku8dE0Ri",
  },
  {
    name: "Luxury Aloe Soap",
    brand: "Pure Skin Essentials",
    sku: "PC-99012",
    category: "Personal Care",
    price: "$12.00",
    stock: 0,
    status: "Out of Stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAasGleJiiZ8iAmlKWmc-EL8-CR7ZNUfGxhKx056UQh8xiWoDlmSAL-mzHkJgR4iXqs5MT3vCNAMJaBzVBXxi9eph4NmNmAMY-yqP5rty2xWP3HhaQHJ22hlAylPGbxQLR7_VQ9ov8NsOj5-eUPBFXx-IN81ToxT70AIKNcNr6IIRjdYyGDQmmS2iUGqB70BG7q0eag-IFSutG3dlQ6jg4eqFTfRwpMTylj7dtXliNJrQISzzJguYEPWbUk3aTaOyE57tK28_rgPavB",
  },
  {
    name: "Premium Basmati Rice",
    brand: "Royal Grains Co.",
    sku: "ST-11223",
    category: "Staples",
    price: "$24.99",
    stock: 52,
    status: "In Stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC1yFWaAXcESGoqnqiUO8q00kspWzvzcj33bcf8VG_VyINE5Guojx3DsxfykrmlLX5CO0JIwe9KgQba-_3rFTfGB08RaWlbYR4Ef6jDsUbMYOHKYPuE-_eoS9ktU3Xw2RgreUYxXuSjElqFWu_ll3NoKUI7KCyBT_KHS7leFlPLDcV-x3iZ5CkADTI67V7sTzxduwHGa-sKCFZmjB0aE4cfcqt0ExBck1AtGjx6W7aICGDnOOKAAc1YKdJ8lFcWfOy5uORKCuf9ChbS",
  },
];

export default function Product() {
  const [products, setProducts] = useState(PRODUCTS_INITIAL);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  });

  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // ---- Delete confirmation flow ----
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
    document.body.style.overflow = "auto";
  };

  const confirmDelete = () => {
    setProducts((prev) => prev.filter((p) => p.sku !== productToDelete.sku));
    closeModal();
  };

  return (
    <div className="text-[#0b1c30]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #f8f9ff; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .product-row { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .product-row:hover { transform: translateY(-1px); box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
      `}</style>

      {/* TopNav owns the search input; its value filters products below */}
      {/* <ProductsTopNav searchTerm={searchTerm} onSearchChange={setSearchTerm} /> */}

      <Sidebar />
      <Topnav />

      <main className="ml-60 p-6">
        <div className="max-w-[1440px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-[32px] font-bold leading-tight tracking-tight mb-1">Product Inventory</h2>
              <p className="text-[#3f4850]">Manage your store's stock levels and product details in one place.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex bg-[#e5eeff] rounded-lg p-1">
                <button className="px-6 py-2 rounded-md bg-white shadow-sm text-sm font-semibold text-[#006194]">
                  Table View
                </button>
                <button

                  className="px-6 py-2 rounded-md text-sm font-semibold text-[#3f4850] hover:bg-[#dce9ff]">
                  Grid View
                </button>
              </div>
              <button className="flex items-center gap-1 px-6 py-2 bg-white border border-[#bfc7d2] rounded-lg text-sm font-semibold text-[#3f4850] hover:bg-[#eff4ff] transition-colors">
                <span className="material-symbols-outlined">file_download</span>
                Export
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-[#3f4850] mr-4">Categories:</span>
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat}
                  className={
                    i === 0
                      ? "px-4 py-1.5 bg-[#006194] text-white rounded-full text-sm font-semibold"
                      : "px-4 py-1.5 bg-[#e5eeff] hover:bg-[#dce9ff] rounded-full text-sm font-semibold text-[#3f4850] transition-colors"
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-[#3f4850] mr-4">Stock Status:</span>
              {STOCK_FILTERS.map((f, i) => (
                <button
                  key={f.label}
                  className={
                    i === 2
                      ? "px-4 py-1.5 border border-[#bfc7d2] rounded-full text-sm font-semibold text-[#3f4850] bg-[#eff4ff] transition-colors flex items-center gap-1"
                      : "px-4 py-1.5 border border-[#bfc7d2] rounded-full text-sm font-semibold text-[#3f4850] hover:bg-[#eff4ff] transition-colors flex items-center gap-1"
                  }
                >
                  {f.dot && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.dot }} />}
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-[#bfc7d2] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#eff4ff] border-b border-[#bfc7d2]">
                  <tr>
                    <th className="px-6 py-4 text-sm text-[#3f4850] uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-sm text-[#3f4850] uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-4 text-sm text-[#3f4850] uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-sm text-[#3f4850] uppercase tracking-wider text-right">Price</th>
                    <th className="px-6 py-4 text-sm text-[#3f4850] uppercase tracking-wider text-right">Stock Qty</th>
                    <th className="px-6 py-4 text-sm text-[#3f4850] uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bfc7d2]/30">
                  {currentProducts.map((p) => (
                    <tr key={p.sku} className="product-row hover:bg-[#eff4ff]">
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-4 ${p.status === "Out of Stock" ? "opacity-60" : ""}`}>
                          <div className="w-12 h-12 rounded-lg bg-[#e5eeff] overflow-hidden flex-shrink-0">
                            <img className="w-full h-full object-cover" alt={p.name} src={p.image} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{p.name}</p>
                            <p className="text-sm text-[#3f4850]">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#3f4850]">{p.sku}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-[#e5eeff] rounded text-sm font-semibold text-[#3f4850]">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-base">{p.price}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex flex-col items-end">
                          <span className="text-base font-bold" style={{ color: STATUS_COLORS[p.status] }}>
                            {p.stock}
                          </span>
                          <span
                            className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded"
                            style={{ color: STATUS_COLORS[p.status], backgroundColor: `${STATUS_COLORS[p.status]}1A` }}
                          >
                            {p.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 text-[#3f4850] hover:text-[#006194] hover:bg-[#006194]/10 rounded-full transition-colors">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            onClick={() => openModal(p)}
                            className="p-2 text-[#3f4850] hover:text-[#ba1a1a] hover:bg-[#ba1a1a]/10 rounded-full transition-colors"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm text-[#3f4850]">
                        No products match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-white border-t border-[#bfc7d2] flex items-center justify-between">
              <span className="text-sm text-[#3f4850]">
                Showing {filteredProducts.length === 0 ? 0 : startIndex + 1} to{" "}
                {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="p-2 rounded hover:bg-[#e5eeff] transition-colors disabled:opacity-30"
                  disabled={currentPage === 1}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>

                <button
                  onClick={() => setCurrentPage(1)}
                  className={`w-8 h-8 rounded text-sm font-semibold ${currentPage === 1
                      ? "bg-[#006194] text-white"
                      : "hover:bg-[#e5eeff] text-[#3f4850] transition-colors"
                    }`}
                >
                  1
                </button>

                <button
                  onClick={() => setCurrentPage(2)}
                  className={`w-8 h-8 rounded text-sm font-semibold ${currentPage === 2
                      ? "bg-[#006194] text-white"
                      : "hover:bg-[#e5eeff] text-[#3f4850] transition-colors"
                    }`}
                >
                  2
                </button>

                <button
                  onClick={() => setCurrentPage(3)}
                  className={`w-8 h-8 rounded text-sm font-semibold ${currentPage === 3
                      ? "bg-[#006194] text-white"
                      : "hover:bg-[#e5eeff] text-[#3f4850] transition-colors"
                    }`}
                >
                  3
                </button>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="p-2 rounded hover:bg-[#e5eeff] transition-colors disabled:opacity-30"
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 transition-opacity"
            style={{ backgroundColor: "rgba(11, 28, 48, 0.4)", backdropFilter: "blur(4px)" }}
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="bg-white rounded-[28px] max-w-md w-full shadow-xl transform transition-all relative p-6 flex flex-col items-center text-center space-y-4 border border-[#bfc7d2]">
            <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center mb-2">
              <span
                className="material-symbols-outlined text-[#ba1a1a]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-[20px] leading-[28px] font-semibold">Delete Product?</h3>
              <p className="text-[16px] leading-[24px] text-[#3f4850] px-4">
                Are you sure you want to delete{" "}
                <span className="font-bold text-[#0b1c30]">{productToDelete?.name}</span>? This
                action cannot be undone and will remove all associated sales history records.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row-reverse w-full gap-2 pt-4">
              <button
                onClick={confirmDelete}
                className="w-full sm:flex-1 py-4 bg-[#ba1a1a] text-white rounded-full text-sm font-semibold hover:brightness-110 active:scale-95 transition-all"
              >
                Delete Product
              </button>
              <button
                onClick={closeModal}
                className="w-full sm:flex-1 py-4 bg-[#e5eeff] text-[#006194] rounded-full text-sm font-semibold hover:bg-[#dce9ff] active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}