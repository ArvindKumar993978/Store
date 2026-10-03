# 🏪 Krishna General Store — Smart Supermarket & POS System

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase Hosting](https://img.shields.io/badge/Firebase_Hosting-Live-FFA000?style=flat-square&logo=firebase&logoColor=black)](https://store-for-all-c42fa.web.app/)
[![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=flat-square&logo=netlify&logoColor=white)](https://storeforal.netlify.app/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://store-for-all-c42fa.web.app/)

A comprehensive, production-ready **Supermarket Billing POS, Digital Khata Book & Retail Inventory Management System** built with **React 18** and **Tailwind CSS**. Designed for modern grocery and retail stores with responsive layouts, offline-ready PWA installation, and real-time inventory synchronization.

---

## 🌐 Live Deployments

- 🚀 **Firebase Hosting (Primary):** [https://store-for-all-c42fa.web.app](https://store-for-all-c42fa.web.app)
- ⚡ **Netlify (Mirror):** [https://storeforal.netlify.app](https://storeforal.netlify.app)

---

## ✨ Key Features & Modules

### 1. ⚡ High-Speed Point of Sale (POS) Counter
- **Live Camera Barcode Scanner**: Scan product barcodes directly with mobile or laptop camera using zero-lag canvas recognition.
- **WebAudio Audio Feedback**: Built-in cash register barcode beep sounds synthesized via WebAudio API (no audio files required).
- **Instant Stock Depletion**: Real-time inventory deduction upon transaction completion.
- **Promo Codes & Discount Engine**: Apply flat or percentage discounts on checkout.
- **Digital Thermal Invoice**: Generates printable thermal receipts with QR codes and detailed tax breakdowns.

### 2. 📖 Digital Khata Book (Customer Udhar Ledger)
- **Credit / Debit Balance Tracking**: Record customer credit accounts (*Jama/Udhar*) with real-time balance calculations.
- **1-Click WhatsApp Invoice Dispatch**: Send payment reminders and invoice summaries directly to customer WhatsApp with pre-filled billing messages.
- **Settlement History**: Log partial and full repayments with date-stamped records.

### 3. 📦 Inventory & Stock Management
- **Smart Low-Stock Alerts**: Automatic visual badges for critical inventory levels.
- **Purchase Order (PO) Generator**: Create restock purchase orders and export them.
- **Product Catalog Management**: Add, edit, categorise, and update grocery items with pricing, cost margins, and barcodes.

### 4. 🛒 Customer Storefront & Online Ordering
- **Responsive Grocery Catalog**: Filter by categories (Groceries, Dairy, Beverages, Snacks, Personal Care).
- **Live Search & Price Sorting**: Instant client-side search filtering.
- **Cart & Checkout Workflow**: Persistent shopping cart with address input and order summary.
- **Order Tracking & History**: View past orders and status.

### 5. 👥 Staff & Role Management
- **Role-Based Access**: Multi-portal system separating **Admin**, **Cashier / Staff**, and **Customer** experiences.
- **Staff Directory**: Add, update, and manage employee records with assigned roles and contact details.

### 6. 📊 Grocery Analytics & Margin Reports
- **Sales & Revenue Breakdown**: Daily, weekly, and monthly sales graphs and metrics.
- **Profit Margin Tracking**: Calculation of gross profit margin per category.
- **CSV & Data Backup**: Export sales reports and store configuration with one click.

### 7. 📱 Progressive Web App (PWA)
- **Full Home-Screen Installation**: Installable as a standalone native app on Android, iOS, Windows, and macOS.
- **Custom Store Branding**: Custom-designed SVG & PNG app launcher icons, store awning splash screen, and theme color `#006194`.

---

## 🛠️ Tech Stack

- **Frontend Core**: [React.js 18](https://react.dev/), [React Router v6](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/) & Google Material Symbols
- **Audio Synthesis**: Native WebAudio API (Zero-dependency register beeps)
- **Camera Scanning**: HTML5 `navigator.mediaDevices` Barcode Scanner
- **CI/CD & Hosting**: [Firebase Hosting](https://firebase.google.com/products/hosting) (automated via GitHub Actions), [Netlify](https://www.netlify.com/)

---

## 📁 Project Directory Structure

```text
Store/
├── .github/
│   └── workflows/
│       ├── firebase-hosting-merge.yml        # CI/CD auto-deploy on git push to main
│       └── firebase-hosting-pull-request.yml  # Preview deployment for pull requests
├── public/
│   ├── favicon.ico                          # Multi-size browser tab icon
│   ├── favicon.svg                          # High-DPI scalable store vector icon
│   ├── logo192.png                          # Mobile PWA launcher icon (192x192)
│   ├── logo512.png                          # PWA splash icon (512x512)
│   ├── manifest.json                        # PWA web manifest with store metadata
│   └── index.html                           # App shell & meta headers
├── src/
│   ├── admin/                               # Store Admin & Management pages
│   │   ├── AdminDashboard.jsx               # Store revenue, stats, and quick links
│   │   ├── Billing.jsx                      # POS billing counter & scanner
│   │   ├── KhataBook.jsx                    # Customer credit / udhar ledger
│   │   ├── Product.jsx                      # Inventory list & stock status
│   │   ├── AddNewProductPage.jsx            # Product creation form
│   │   ├── Reports.jsx                      # Sales analytics & margin graphs
│   │   ├── Customer.jsx                     # Customer CRM directory
│   │   ├── StaffManagement.jsx              # Employee & cashier management
│   │   └── SettingsPage.jsx                 # Store profile & tax configuration
│   ├── customer/                            # Customer storefront & shopping pages
│   │   ├── StorefrontPage.jsx               # Grocery browsing portal
│   │   ├── ShoppingCart.jsx                 # Cart manager
│   │   ├── CheckoutPage.jsx                 # Order placement
│   │   └── OrderHistoryPage.jsx             # Customer purchase records
│   ├── context/
│   │   └── StoreContext.jsx                 # Global store state (products, khata, sales)
│   ├── component/
│   │   └── CartContext.jsx                  # Shopping cart state provider
│   ├── main/
│   │   └── entrance.jsx                     # Interactive multi-role portal entrance
│   ├── App.js                               # Route registry
│   └── index.js                             # React root bootstrap
├── .firebaserc                              # Firebase project configuration
├── firebase.json                            # Firebase Hosting rules & SPA rewrites
└── package.json                             # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or v20+ recommended)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ArvindKumar993978/Store.git
   cd Store
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔄 Automated CI/CD Deployment

This repository is configured with **GitHub Actions** for automated continuous deployment to **Firebase Hosting**:

- **Every push to `main` branch** runs `.github/workflows/firebase-hosting-merge.yml`:
  1. Sets up Node.js 20 LTS.
  2. Runs `npm ci` for clean dependency installation.
  3. Executes `npm run build` to create optimized static assets.
  4. Deploys directly to live Firebase Hosting (`store-for-all-c42fa.web.app`).

---

## 👨‍💻 Author

**Arvind Kumar**
- GitHub: [@ArvindKumar993978](https://github.com/ArvindKumar993978)
- Repository: [ArvindKumar993978/Store](https://github.com/ArvindKumar993978/Store)

---

## 📄 License

This project is licensed under the MIT License — feel free to use and adapt it for learning and commercial store deployments.
