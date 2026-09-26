import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Topnav from "../component/Topnav";
import { useStore } from "../context/StoreContext";

/*
  Product Inventory
  -----------------
  Full interactive admin product inventory management:
  - Table View / Grid View toggle
  - Live category & stock status filters
  - CSV Export
  - Add Product navigation
  - Inline Edit Product modal
  - Delete Product confirmation modal
  - Dynamic pagination
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

export default function Product() {
  const navigate = useNavigate();
  const { products, updateProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStockFilter, setSelectedStockFilter] = useState("All Status");
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals state
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    brand: "",
    category: "Dairy",
    price: "",
    stock: 0,
    status: "In Stock",
  });

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products.map((p) => {
      const priceStr = typeof p.price === "number" ? `₹${p.price.toFixed(2)}` : p.price;
      const statusStr = p.stock === 0 ? "Out of Stock" : p.stock <= (p.lowStockThreshold || 10) ? "Low Stock" : "In Stock";
      return {
        ...p,
        priceDisplay: priceStr,
        status: statusStr,
      };
    }).filter((p) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        (p.brand && p.brand.toLowerCase().includes(term)) ||
        (p.sku && p.sku.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term));

      const matchesCat =
        selectedCategory === "All" ||
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

      const matchesStock =
        selectedStockFilter === "All Status" ||
        p.status.toLowerCase() === selectedStockFilter.toLowerCase();

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [products, searchTerm, selectedCategory, selectedStockFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Delete handlers
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
    }
    closeDeleteModal();
  };

  // Edit handlers
  const openEditModal = (product) => {
    setProductToEdit(product);
    setEditFormData({
      name: product.name,
      brand: product.brand || "",
      category: product.category,
      price: typeof product.price === "number" ? product.price : parseFloat(String(product.price).replace(/[^0-9.]/g, "") || 0),
      stock: product.stock,
      status: product.status,
    });
  };

  const closeEditModal = () => {
    setProductToEdit(null);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!productToEdit) return;

    const stockNum = Number(editFormData.stock);
    const priceNum = parseFloat(String(editFormData.price).replace(/[^0-9.]/g, "") || 0);

    updateProduct(productToEdit.id, {
      name: editFormData.name,
      brand: editFormData.brand,
      category: editFormData.category,
      price: priceNum,
      stock: stockNum,
    });
    closeEditModal();
  };

  // CSV Export handler
  const handleExportCSV = () => {
    if (products.length === 0) {
      alert("No products to export.");
      return;
    }
    const headers = ["Product Name", "Brand", "SKU", "Category", "Price", "Stock", "Status"];
    const rows = products.map((p) => [
      `"${p.name}"`,
      `"${p.brand}"`,
      `"${p.sku}"`,
      `"${p.category}"`,
      `"${p.price}"`,
      p.stock,
      `"${p.status}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `products_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="text-[#0b1c30] min-h-screen bg-[#f8f9ff]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #f8f9ff; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
        .product-row { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .product-row:hover { transform: translateY(-1px); box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
      `}</style>

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
            <div className="flex flex-wrap items-center gap-3">
              {/* Table / Grid view switcher */}
              <div className="flex bg-[#e5eeff] rounded-lg p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                    viewMode === "table" ? "bg-white shadow-sm text-[#006194]" : "text-[#3f4850] hover:bg-[#dce9ff]"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">table_rows</span>
                    Table View
                  </span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                    viewMode === "grid" ? "bg-white shadow-sm text-[#006194]" : "text-[#3f4850] hover:bg-[#dce9ff]"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">grid_view</span>
                    Grid View
                  </span>
                </button>
              </div>

              {/* Export button */}
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#bfc7d2] rounded-lg text-sm font-semibold text-[#3f4850] hover:bg-[#eff4ff] transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">file_download</span>
                Export
              </button>

              {/* Add Product button */}
              <button
                onClick={() => navigate("/add-product")}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#006194] text-white rounded-lg text-sm font-semibold hover:bg-[#007bb9] transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Product
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707881] text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search products by name, SKU, brand..."
                  className="w-full pl-10 pr-10 py-2 bg-white border border-[#bfc7d2] rounded-lg text-sm text-[#0b1c30] placeholder-[#707881] focus:outline-none focus:ring-2 focus:ring-[#006194]"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707881] hover:text-[#0b1c30] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-[#3f4850] mr-2">Categories:</span>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#006194] text-white"
                        : "bg-[#e5eeff] hover:bg-[#dce9ff] text-[#3f4850]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-[#3f4850] mr-2">Stock Status:</span>
              {STOCK_FILTERS.map((f) => {
                const isActive = selectedStockFilter === f.label;
                return (
                  <button
                    key={f.label}
                    onClick={() => {
                      setSelectedStockFilter(f.label);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-1.5 border rounded-full text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "border-[#006194] bg-[#eff4ff] text-[#006194]"
                        : "border-[#bfc7d2] text-[#3f4850] hover:bg-[#eff4ff]"
                    }`}
                  >
                    {f.dot && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.dot }} />}
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content: Table View OR Grid View */}
          {viewMode === "table" ? (
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
                              <p className="text-xs text-[#3f4850]">{p.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#3f4850] font-mono">{p.sku}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-[#e5eeff] rounded text-xs font-semibold text-[#3f4850]">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-base font-medium">{p.priceDisplay || p.price}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex flex-col items-end">
                            <span className="text-base font-bold" style={{ color: STATUS_COLORS[p.status] }}>
                              {p.stock}
                            </span>
                            <span
                              className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded mt-0.5"
                              style={{ color: STATUS_COLORS[p.status], backgroundColor: `${STATUS_COLORS[p.status]}1A` }}
                            >
                              {p.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditModal(p)}
                              title="Edit Product"
                              className="p-2 text-[#3f4850] hover:text-[#006194] hover:bg-[#006194]/10 rounded-full transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button
                              onClick={() => openDeleteModal(p)}
                              title="Delete Product"
                              className="p-2 text-[#3f4850] hover:text-[#ba1a1a] hover:bg-[#ba1a1a]/10 rounded-full transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#3f4850]">
                          No products found matching the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((p) => (
                <div
                  key={p.sku}
                  className="bg-white rounded-xl shadow-sm border border-[#bfc7d2] overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video bg-[#f2f4f6] overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <span
                      className="absolute top-2 right-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm"
                      style={{ color: STATUS_COLORS[p.status], backgroundColor: "white" }}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[11px] font-semibold text-[#006194] uppercase tracking-wider">{p.category}</span>
                        <span className="text-[11px] text-[#707881] font-mono">{p.sku}</span>
                      </div>
                      <h4 className="font-bold text-sm text-[#191c1e] line-clamp-1">{p.name}</h4>
                      <p className="text-xs text-[#707881] mb-3">{p.brand}</p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-3 pt-2 border-t border-gray-100">
                        <span className="text-lg font-bold text-[#006194]">{p.priceDisplay || p.price}</span>
                        <span className="text-xs font-semibold text-[#3f4850]">Stock: {p.stock}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="flex-1 py-1.5 border border-[#bfc7d2] rounded-lg text-xs font-semibold text-[#3f4850] hover:bg-[#eff4ff] flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(p)}
                          className="p-1.5 border border-[#ba1a1a]/30 rounded-lg text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full bg-white rounded-xl p-12 text-center text-sm text-[#3f4850] border border-[#bfc7d2]">
                  No products found matching the selected filters.
                </div>
              )}
            </div>
          )}

          {/* Dynamic Pagination */}
          <div className="mt-6 px-6 py-4 bg-white rounded-xl shadow-sm border border-[#bfc7d2] flex flex-col sm:flex-row gap-4 items-center justify-between">
            <span className="text-sm text-[#3f4850]">
              Showing {filteredProducts.length === 0 ? 0 : startIndex + 1} to{" "}
              {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-2 rounded hover:bg-[#e5eeff] transition-colors disabled:opacity-30 cursor-pointer"
                disabled={currentPage === 1}
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded text-sm font-semibold transition-colors cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-[#006194] text-white"
                      : "hover:bg-[#e5eeff] text-[#3f4850]"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="p-2 rounded hover:bg-[#e5eeff] transition-colors disabled:opacity-30 cursor-pointer"
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Product Modal */}
      {productToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeEditModal}
          />
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl relative z-10 p-6 border border-[#bfc7d2] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#bfc7d2]/30 pb-4 mb-4">
              <h3 className="text-xl font-bold text-[#191c1e]">Edit Product</h3>
              <button
                onClick={closeEditModal}
                className="p-1.5 text-[#3f4850] hover:bg-[#f2f4f6] rounded-full"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg text-sm outline-none focus:border-[#006194]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={editFormData.brand}
                    onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg text-sm outline-none focus:border-[#006194]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg text-sm outline-none focus:border-[#006194]"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Selling Price (₹)</label>
                  <input
                    type="text"
                    required
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg text-sm outline-none focus:border-[#006194]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3f4850] block uppercase mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-[#bfc7d2] rounded-lg text-sm outline-none focus:border-[#006194]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#bfc7d2]/30">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#006194] text-white rounded-lg text-sm font-semibold hover:bg-[#007bb9] transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 py-2.5 bg-gray-100 text-[#3f4850] rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 transition-opacity bg-black/40 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />
          <div className="bg-white rounded-[28px] max-w-md w-full shadow-xl relative z-10 p-6 flex flex-col items-center text-center space-y-4 border border-[#bfc7d2] animate-in fade-in zoom-in-95">
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
                action cannot be undone and will remove it from inventory.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row-reverse w-full gap-2 pt-4">
              <button
                onClick={confirmDelete}
                className="w-full sm:flex-1 py-3 bg-[#ba1a1a] text-white rounded-xl text-sm font-semibold hover:brightness-110 active:scale-95 transition-all"
              >
                Delete Product
              </button>
              <button
                onClick={closeDeleteModal}
                className="w-full sm:flex-1 py-3 bg-[#e5eeff] text-[#006194] rounded-xl text-sm font-semibold hover:bg-[#dce9ff] active:scale-95 transition-all"
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