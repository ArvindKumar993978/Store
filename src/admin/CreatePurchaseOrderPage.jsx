import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar.jsx";

const GST_RATE = 0.18;

const INITIAL_LINE_ITEMS = [
  {
    id: 1,
    name: "Logitech MX Master 3S",
    sku: "SKU: LOG-MX3-BLK",
    stockLabel: "Low (3)",
    stockStyle: { bg: "#ffdad6", text: "#93000a" },
    unitPrice: 7499.0,
    qty: 12,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6x5s3b_bAYS9srg1WW_osyi4OMAR0bOfiFZ_jBlM0kf_jFmSl5Agu2f2Zy3_iR0zP96k84dgYxvKjixxSO9Sm-gOvOjl-oLRHZ9EKYUaWoS5Na18gh6qdIcVIUin_5yyw2JYffGN5-CcnHN-KXf4fiAypmEq4Ub-nCqeOshqHxBW72fO7-eNd9VJNVVhwZ0cPPYvtgjlX3fluNITwv_OUAPtONZZH1VxaRJlzQmSJq44gBtjn3OFpbJ-dnEu2eCB5VjrK9W5tNe9s",
  },
  {
    id: 2,
    name: "Keychron K2 Mechanical",
    sku: "SKU: KEY-K2-RGB",
    stockLabel: "15",
    stockStyle: { bg: "#e0e3e5", text: "#3f4850" },
    unitPrice: 4250.0,
    qty: 8,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA8gEXujCqDLVtr5W2V375MhhaIHxK7MjsvDZBzY9TS9OBdILd0KZkizQgUByz7ewjSKLoYFXq2TDafHbap4xny8KDoPf7z_23FnuhY2dAYTXaw3HgoXMfvHh-oGNG98kQzNnv5k6ff9z8HuEScQOAil_noBeCLdtXdlDs8UWF0sLs1Q5eWjWuTS421WPeiQEANeNFHweGyKx7oE2DdYVXLn6Qjg9sEQhDvvjm9j1SlcEJ8D13mDQyoKbHAtgSYmDPV4RzVkjZw_ZA5",
  },
];

const AVAILABLE_CATALOG = [
  {
    id: 3,
    name: "Whole Milk - 1L (Bulk Crate)",
    sku: "SKU: MK-10293",
    stockLabel: "Low (12)",
    stockStyle: { bg: "#ffdad6", text: "#93000a" },
    unitPrice: 40.0,
    qty: 50,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrYvrSJ7OcbW0gUMWUZhjsLn4Pukj0UAun_Q0tyy8ObC0B4wHpGflnCEa4tsSp497gGwtn1sDQeZ-Vw20_QRCWGl5N3f2_otUNzNAa1jJH7GNG9Nt4rqxc8GeqYLQbOvkUSsvqNtNb4L7GXkE9VbD591Dt4h4oqdsaLfVr118UO_UWOfiIn96NFzFsXO8fVFionsDy1gN94cTzEXCZ64xGXyslRYLr7YKdH6Lrctay2TGuf29M6N65JNa1zl0U9Q3QIgunWh3vzzcL",
  },
  {
    id: 4,
    name: "Honey Loops Cereal 500g",
    sku: "SKU: SN-44582",
    stockLabel: "24",
    stockStyle: { bg: "#e0e3e5", text: "#3f4850" },
    unitPrice: 150.0,
    qty: 20,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD75B0M5a_k3dNhXaVz3cSNSoUgZgmqeaLYFxo_kaDMrvuYRRgsNLsYGny-lQYAUl5J-EWqKJs33b3yKxrU5MOZqiZcHhQmhJtpDjZo87KCl4mzkSQspLPNaC6gL2UwrLDpTph6i6Z4ahPvm7xPKzVS15ScZkuzyci3w_TBdWRNaTmcqE68RV8aY1jDbcW2Y83RuZj_74I5mr1dn3hrqfVSqWbMVUMtN1uyjy3UbCCNW_SaV5FWc5Atti8Wk7dbvtLx54vVku8dE0Ri",
  },
  {
    id: 5,
    name: "Premium Basmati Rice 25kg",
    sku: "SKU: ST-11223",
    stockLabel: "8",
    stockStyle: { bg: "#ffdad6", text: "#93000a" },
    unitPrice: 1800.0,
    qty: 15,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1yFWaAXcESGoqnqiUO8q00kspWzvzcj33bcf8VG_VyINE5Guojx3DsxfykrmlLX5CO0JIwe9KgQba-_3rFTfGB08RaWlbYR4Ef6jDsUbMYOHKYPuE-_eoS9ktU3Xw2RgreUYxXuSjElqFWu_ll3NoKUI7KCyBT_KHS7leFlPLDcV-x3iZ5CkADTI67V7sTzxduwHGa-sKCFZmjB0aE4cfcqt0ExBck1AtGjx6W7aICGDnOOKAAc1YKdJ8lFcWfOy5uORKCuf9ChbS",
  },
];

const SUPPLIER_OPTIONS = [
  "Select a supplier",
  "Global Electronics Ltd.",
  "Standard Stationery Hub",
  "Prime Textiles Inc.",
  "Farm Fresh Direct",
];

export default function CreatePurchaseOrderPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(INITIAL_LINE_ITEMS);
  const [supplier, setSupplier] = useState("Global Electronics Ltd.");
  const [deliveryDate, setDeliveryDate] = useState("2024-11-15");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [notes, setNotes] = useState("");
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [poGenerated, setPoGenerated] = useState(null);

  const updateQty = (id, value) => {
    const qty = Math.max(0, Number(value) || 0);
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addItemToPO = (product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + product.qty } : i));
      }
      return [...prev, { ...product }];
    });
    setShowCatalogModal(false);
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
    const tax = subtotal * GST_RATE;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [items]);

  const handleGeneratePO = () => {
    if (items.length === 0) {
      alert("Please add at least one line item to generate a Purchase Order.");
      return;
    }
    const poNum = `PO-${Math.floor(10000 + Math.random() * 90000)}`;
    setPoGenerated({
      poNum,
      supplier,
      deliveryDate,
      total: totals.total,
    });
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; vertical-align: middle; }
      `}</style>

      <Sidebar />

      <main className="ml-[240px] min-h-screen p-6 bg-[#f7f9fb]">
        {/* Header & breadcrumbs */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#565e74] mb-2">
            <button
              onClick={() => navigate("/product")}
              className="hover:text-[#006194] hover:underline cursor-pointer"
            >
              Product
            </button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <button
              onClick={() => navigate("/sales")}
              className="hover:text-[#006194] hover:underline cursor-pointer"
            >
              Purchase Orders
            </button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#006194] font-bold">New PO</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-[32px] font-bold">Create Purchase Order</h2>
              <p className="text-base text-[#3f4850]">Restock inventory and manage supplier relationships.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/product")}
                className="px-6 py-2 border border-[#bfc7d2] text-[#565e74] rounded-lg font-medium hover:bg-[#e6e8ea] transition-all active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleGeneratePO}
                className="px-6 py-2 bg-[#006194] text-white rounded-lg font-medium flex items-center gap-2 hover:bg-[#007bb9] transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">description</span>
                Generate PO
              </button>
            </div>
          </div>
        </header>

        {/* Form layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Supplier & logistics */}
          <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bfc7d2]/30 flex flex-col gap-5">
              <div className="flex items-center gap-3 border-b border-[#bfc7d2] pb-4">
                <div className="w-10 h-10 rounded-lg bg-[#007bb9]/20 flex items-center justify-center text-[#006194]">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <h3 className="text-[20px] font-semibold">Logistics</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[#3f4850] mb-1 ml-1 font-semibold">Supplier Name</label>
                  <div className="relative">
                    <select
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      className="w-full bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg px-4 py-2.5 focus:border-[#006194] outline-none cursor-pointer"
                    >
                      {SUPPLIER_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#3f4850] mb-1 ml-1 font-semibold">Expected Delivery Date</label>
                  <input
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg px-4 py-2.5 focus:border-[#006194] outline-none"
                    type="date"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#3f4850] mb-1 ml-1 font-semibold">Shipping Method</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShippingMethod("standard")}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                        shippingMethod === "standard"
                          ? "border-2 border-[#006194] bg-[#cce5ff] text-[#004b73]"
                          : "border border-[#bfc7d2] text-[#3f4850] hover:bg-[#e6e8ea]"
                      }`}
                    >
                      Standard
                    </button>
                    <button
                      onClick={() => setShippingMethod("express")}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                        shippingMethod === "express"
                          ? "border-2 border-[#006194] bg-[#cce5ff] text-[#004b73]"
                          : "border border-[#bfc7d2] text-[#3f4850] hover:bg-[#e6e8ea]"
                      }`}
                    >
                      Express
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Supplier summary */}
            <div className="bg-[#006194]/5 p-6 rounded-xl border border-[#006194]/10 flex flex-col gap-4 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xs font-bold text-[#006194] uppercase tracking-wider mb-2">Supplier Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#3f4850]">Selected:</span>
                    <span className="font-semibold text-[#191c1e]">{supplier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3f4850]">Active POs:</span>
                    <span className="font-medium">2 pending</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#3f4850]">Rating:</span>
                    <span className="flex items-center text-[#006194]">
                      {[0, 1, 2, 3].map((i) => (
                        <span key={i} className="material-symbols-outlined text-[16px]">star</span>
                      ))}
                      <span className="material-symbols-outlined text-[16px]">star_half</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Line items table */}
          <section className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-[#bfc7d2]/30 flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b border-[#bfc7d2] flex justify-between items-center bg-[#f7f9fb]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#00855b]/20 flex items-center justify-center text-[#006947]">
                    <span className="material-symbols-outlined">inventory</span>
                  </div>
                  <h3 className="text-[20px] font-semibold">Product Line Items</h3>
                </div>
                <button
                  onClick={() => setShowCatalogModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#006194] text-white rounded-lg font-medium hover:bg-[#007bb9] transition-all active:scale-95 cursor-pointer shadow-sm text-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  Add Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f2f4f6]">
                      <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider font-semibold border-b border-[#bfc7d2]">
                        Product Details
                      </th>
                      <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider font-semibold border-b border-[#bfc7d2] text-center">
                        Current Stock
                      </th>
                      <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider font-semibold border-b border-[#bfc7d2] text-center">
                        PO Quantity
                      </th>
                      <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider font-semibold border-b border-[#bfc7d2] text-right">
                        Unit Price
                      </th>
                      <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider font-semibold border-b border-[#bfc7d2] text-right">
                        Subtotal
                      </th>
                      <th className="px-6 py-4 text-xs text-[#3f4850] uppercase tracking-wider font-semibold border-b border-[#bfc7d2]" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#bfc7d2]">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-[#f2f4f6] transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-[#eceef0] flex-shrink-0 overflow-hidden border border-[#bfc7d2]/30">
                              <img className="w-full h-full object-cover" alt={item.name} src={item.image} />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{item.name}</p>
                              <p className="text-xs text-[#3f4850]">{item.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span
                            className="px-3 py-1 rounded-full text-[11px] font-bold"
                            style={{ backgroundColor: item.stockStyle?.bg || "#e0e3e5", color: item.stockStyle?.text || "#3f4850" }}
                          >
                            {item.stockLabel}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <input
                            className="w-20 mx-auto block bg-[#f2f4f6] border border-[#bfc7d2] rounded-lg px-2 py-1.5 text-center focus:border-[#006194] outline-none font-semibold text-sm"
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => updateQty(item.id, e.target.value)}
                          />
                        </td>
                        <td className="px-6 py-5 text-right text-[#3f4850] font-medium">
                          ₹{item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-5 text-right font-bold text-[#006194]">
                          ₹{(item.unitPrice * item.qty).toFixed(2)}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#707881] hover:text-[#ba1a1a] transition-colors p-1 rounded-md hover:bg-[#ffdad6]/20 cursor-pointer"
                            title="Remove item"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete_outline</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-sm text-[#707881]">
                          No items added yet. Click "Add Product" or the button below.
                        </td>
                      </tr>
                    )}
                    {/* Empty state / add more row */}
                    <tr className="bg-white">
                      <td className="px-6 py-4" colSpan={6}>
                        <div
                          onClick={() => setShowCatalogModal(true)}
                          className="border-2 border-dashed border-[#bfc7d2]/50 rounded-xl p-6 flex flex-col items-center justify-center text-[#3f4850] hover:border-[#006194]/50 hover:bg-[#006194]/5 transition-all cursor-pointer group"
                        >
                          <span className="material-symbols-outlined text-[36px] text-[#006194] mb-1 group-hover:scale-110 duration-200">
                            add_circle_outline
                          </span>
                          <p className="text-sm font-semibold">Click to select products from inventory to restock</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary section */}
              <div className="mt-auto p-6 bg-[#f2f4f6]/50 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#bfc7d2]">
                <div>
                  <label className="block text-xs font-semibold text-[#3f4850] mb-2 ml-1">Additional Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white border border-[#bfc7d2] rounded-xl p-3 text-sm focus:border-[#006194] outline-none resize-none h-24"
                    placeholder="Enter special delivery instructions or supplier terms..."
                  />
                </div>
                <div className="flex flex-col gap-2 justify-end">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#3f4850]">Subtotal</span>
                    <span className="font-semibold">₹{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#3f4850]">Tax (GST 18%)</span>
                    <span className="font-semibold">₹{totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#bfc7d2] pt-3 mt-1">
                    <span className="text-base font-bold text-[#191c1e]">Total Payable</span>
                    <span className="text-2xl font-extrabold text-[#006194]">₹{totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-8 w-full py-8 border-t border-[#bfc7d2] flex flex-col md:flex-row justify-between items-center text-sm text-[#565e74]">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <span className="text-[20px] text-[#006194] font-bold">Efficient Ledger</span>
            <span className="hidden md:block w-px h-4 bg-[#bfc7d2]" />
            <p>© 2024 Efficient Ledger. All rights reserved.</p>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <button onClick={() => alert("Privacy Policy: Supplier agreements are confidential.")} className="hover:text-[#006194] cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => alert("Terms of Service: Procurement agreements apply.")} className="hover:text-[#006194] cursor-pointer">
              Terms of Service
            </button>
            <button onClick={() => navigate("/help")} className="hover:text-[#006194] cursor-pointer">
              Contact Support
            </button>
          </div>
        </footer>
      </main>

      {/* Catalog Selector Modal */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6 border border-[#bfc7d2] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="font-bold text-lg text-[#191c1e]">Select Product to Restock</h3>
              <button onClick={() => setShowCatalogModal(false)} className="text-gray-500 hover:text-black">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {AVAILABLE_CATALOG.map((catItem) => (
                <div
                  key={catItem.id}
                  className="flex items-center justify-between p-3 border rounded-xl hover:bg-[#f7f9fb] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img src={catItem.image} alt={catItem.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-semibold text-sm text-[#191c1e]">{catItem.name}</h4>
                      <p className="text-xs text-[#707881]">{catItem.sku} • Stock: {catItem.stockLabel}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => addItemToPO(catItem)}
                    className="px-3 py-1.5 bg-[#006194] text-white text-xs font-semibold rounded-lg hover:bg-[#007bb9] cursor-pointer"
                  >
                    + Add to PO
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PO Generated Success Modal */}
      {poGenerated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-[#bfc7d2] text-center animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-[#191c1e] mb-1">Purchase Order Created!</h3>
            <p className="text-sm font-semibold text-[#006194] mb-3">{poGenerated.poNum}</p>
            <p className="text-xs text-[#707881] mb-6">
              A purchase order for ₹{poGenerated.total.toFixed(2)} has been issued to {poGenerated.supplier}. Delivery scheduled by {poGenerated.deliveryDate}.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#191c1e] rounded-xl text-xs font-bold"
              >
                Print PO
              </button>
              <button
                onClick={() => navigate("/sales")}
                className="flex-1 py-2.5 bg-[#006194] hover:bg-[#007bb9] text-white rounded-xl text-xs font-bold"
              >
                View in Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
