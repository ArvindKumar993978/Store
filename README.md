# 🏪 Krishna General Store — Smart Supermarket POS & Cloud Retail ERP

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase Firestore](https://img.shields.io/badge/Firebase_Firestore-Cloud_Sync-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Firebase Hosting](https://img.shields.io/badge/Firebase_Hosting-Live-FFA000?style=flat-square&logo=firebase&logoColor=black)](https://store-for-all-c42fa.web.app/)
[![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=flat-square&logo=netlify&logoColor=white)](https://storeforal.netlify.app/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://store-for-all-c42fa.web.app/)

A comprehensive, production-grade **Supermarket Billing POS, Cloud Inventory Management, Digital Khata Book, Staff Management & Online Grocery Storefront** built with **React 18**, **Tailwind CSS**, and **Firebase Cloud Firestore**.

Designed for seamless retail workflows with multi-role authentication, instant barcode scanning, real-time multi-device cloud synchronization, and offline-capable Progressive Web App (PWA) installation.

---

## 🌐 Live Deployments

- 🚀 **Firebase Hosting (Primary & Auto-Deployed):** [https://store-for-all-c42fa.web.app](https://store-for-all-c42fa.web.app)
- ⚡ **Netlify (Mirror):** [https://storeforal.netlify.app](https://storeforal.netlify.app)

---

## 🔐 Demo Credentials & Quick Access

The application features a unified multi-portal gateway with direct access and role-specific authentication:

| Portal | Authentication Method | Default Credentials / PIN | Access Link |
| :--- | :--- | :--- | :--- |
| **Store Admin** | 4-Digit Master PIN or Email | PIN: `1234`<br>Email: `admin@krishnastore.in`<br>Password: `admin123` | [Admin Dashboard](https://store-for-all-c42fa.web.app/admin) |
| **Staff / Cashier** | Quick Employee PIN or ID | PIN: `1111` (Priya Sharma - Cashier)<br>PIN: `2222` (Rahul Verma - Stock Manager)<br>*Supports dynamic staff added via Admin* | [Staff Portal](https://store-for-all-c42fa.web.app/staff) |
| **Customer** | Email & Password / Sign Up | Email: `customer@example.com`<br>Password: `customer123`<br>*Includes full Sign Up tab for new accounts* | [Storefront](https://store-for-all-c42fa.web.app/storefront) |

> 💡 **Direct Exploration**: The [Entrance Hub](https://store-for-all-c42fa.web.app/) provides direct action buttons to enter the Admin, Staff, or Storefront portals immediately without mandatory login barriers.

---

## ✨ Key Features & Modules

### 1. ⚡ High-Speed Point of Sale (POS) Counter
- **Live Camera Barcode Scanner**: Scan retail barcodes via laptop or smartphone camera using HTML5 video canvas detection.
- **Synthesized WebAudio Beep**: Realistic cash register audio feedback synthesized natively with the WebAudio API without external sound files.
- **Real-Time Stock Depletion**: Transactions automatically deduct quantities from the cloud inventory.
- **Promo Codes & Discount Engine**: Apply flat or percentage discounts on checkout with instant tax and margin recalculation.
- **Printable Thermal Invoices**: Generates 80mm thermal receipts with payment mode details, store GSTIN, and UPI payment QR codes.

### 2. ☁️ Real-Time Cloud Firestore Synchronization
- **Products & Stock**: Live sync between Admin adjustments and Storefront customer views.
- **POS Invoices & Sales**: Recorded sales immediately update analytics and revenue metrics across all devices.
- **Orders & Tracking**: Online orders placed by customers stream in real-time to the Admin order queue.
- **Customer CRM & Udhar Ledger**: Real-time balance calculations, credit limits, and purchase histories.
- **Staff Directory & Attendance**: Live synchronization of employee profiles, statuses, and attendance check-ins.
- **Zero-Friction Fallback**: Intelligent local fallback ensures the app remains fully functional even in offline environments.

### 3. 📖 Digital Khata Book (Customer Credit Ledger)
- **Udhar & Jama Tracking**: Record store credit transactions with balance tracking.
- **1-Click WhatsApp Invoices**: Send payment reminders and billing summaries directly to customers on WhatsApp.
- **Credit Limits & Settlements**: Set individualized credit ceilings per customer and log partial or complete settlements.

### 4. 👥 Comprehensive Staff & Employee Suite
- **Employee Portal (`/staff`)**: Dedicated staff workspace for viewing shifts, attendance history, payslips, leave balances, and profiles.
- **Staff Handler & Attendance Tracker (`/staff-handler`)**: Operational console to log daily clock-in records, mark Present/Late/Absent, and monitor attendance metrics.
- **Admin Staff Management (`/staff-management`)**: Add new employees, modify roles (Store Manager, Cashier, Inventory Clerk), toggle active status, and synchronize changes directly to Cloud Firestore.

### 5. 🛒 Customer Storefront & Online Ordering
- **Interactive Grocery Catalog**: Browse staples, personal care, dairy, beverages, and snacks with intuitive filters.
- **Instant Search & Sorting**: High-performance client-side search by item name, SKU, or category.
- **Shopping Cart & Checkout**: Persistent cart storage, promo code application, delivery address entry, and order submission.
- **Customer Account & History**: View previous order states (*Pending*, *Confirmed*, *In Transit*, *Delivered*).

### 6. 📊 Analytics, Reports & Data Export
- **Sales & Revenue KPIs**: Track daily, weekly, and monthly gross revenue and average order value.
- **Category Profit Margins**: Automated margin calculation and cost breakdown.
- **Data Portability**: Full JSON and CSV export/import for catalog backups, audit reports, and ledger archives.

### 7. 📱 Progressive Web App (PWA)
- **Installable Native Experience**: Install directly on Android, iOS, Windows, and macOS desktops and mobile devices.
- **Tailored Branding**: Brand icons (192px and 512px), launcher theme color `#006194`, and standalone display mode.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: [React.js 18](https://react.dev/), [React Router v6](https://reactrouter.com/)
- **State Management**: React Context API (`StoreContext`, `AuthContext`, `CartContext`)
- **Backend & Cloud Database**: [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore), [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons & Typography**: Google Fonts (`Inter`), Google [Material Symbols Outlined](https://fonts.google.com/icons), and [Lucide React](https://lucide.dev/)
- **Barcode Recognition**: HTML5 Canvas / `navigator.mediaDevices` Web API
- **Audio Feedback**: Native WebAudio API synthesizer
- **Hosting & CI/CD**: [Firebase Hosting](https://firebase.google.com/products/hosting) via GitHub Actions, [Netlify](https://www.netlify.com/)

---

## 📁 Project Directory Structure

```text
Store/
├── .github/
│   └── workflows/
│       ├── firebase-hosting-merge.yml         # CI/CD auto-deploy on push to main
│       └── firebase-hosting-pull-request.yml   # PR preview deployment
├── public/
│   ├── favicon.ico                           # Multi-size tab icon
│   ├── favicon.svg                           # High-DPI SVG store logo
│   ├── logo192.png                           # PWA mobile launcher icon
│   ├── logo512.png                           # PWA splash icon
│   ├── manifest.json                         # Web App Manifest
│   └── index.html                            # App shell with global font imports
├── src/
│   ├── admin/                                # Store Admin & Operations
│   │   ├── AdminDashboard.jsx                # Analytics KPIs & quick actions
│   │   ├── Billing.jsx                       # POS barcode billing counter
│   │   ├── KhataBook.jsx                     # Customer credit/udhar ledger
│   │   ├── Product.jsx                       # Inventory catalog & stock tracker
│   │   ├── AddNewProductPage.jsx             # New product creation form
│   │   ├── Customer.jsx                      # Customer CRM & credit limits
│   │   ├── CustomerProfilePage.jsx           # Individual customer ledger view
│   │   ├── StaffManagement.jsx               # Employee directory & role config
│   │   ├── CreatePurchaseOrder.jsx           # Supplier PO generator
│   │   ├── Reports.jsx                       # Revenue & margin analytics
│   │   ├── BackupData.jsx                    # JSON data backup & restore
│   │   ├── SubscriptionPlans.jsx             # Software tier management
│   │   └── SettingsPage.jsx                  # Store profile, GSTIN & tax config
│   ├── auth/
│   │   └── LoginPage.jsx                     # Multi-role authentication hub
│   ├── context/
│   │   ├── AuthContext.jsx                   # Role-based auth provider (Admin, Staff, Customer)
│   │   └── StoreContext.jsx                  # Central store database & cloud sync engine
│   ├── customer/                             # Customer Online Storefront
│   │   ├── StorefrontPage.jsx                # Grocery catalog & filtering
│   │   ├── ShoppingCart.jsx                  # Cart modal & slideout
│   │   ├── CheckoutPage.jsx                  # Address & order placement
│   │   └── OrderHistoryPage.jsx              # Customer order tracking
│   ├── staff/
│   │   ├── employedashboard/                 # Staff Employee Workspace
│   │   │   ├── Employe.jsx                   # Main workspace container
│   │   │   ├── components/AppShell.jsx       # Staff navigation shell
│   │   │   └── pages/                        # Overview, Payslips, Leave, Profile
│   │   └── employehandler/                   # Staff Operations & Attendance
│   │       ├── EmployeHandler.jsx            # Operational container
│   │       └── components/                   # StaffTable, Attendance, Payroll, Profile
│   ├── services/
│   │   └── firebaseService.js                # Cloud Firestore sync & real-time listeners
│   ├── firebase.js                           # Firebase SDK initialization
│   ├── main/
│   │   ├── entrance.jsx                      # Multi-role portal entrance screen
│   │   └── help.jsx                          # Help, documentation & FAQ page
│   ├── component/                            # Shared UI components
│   │   ├── Sidebar.jsx                       # Admin navigation bar
│   │   ├── StorefrontNavbar.jsx              # Customer header with cart badge
│   │   └── CartContext.jsx                   # Shopping cart context
│   ├── App.js                                # Application router configuration
│   ├── index.css                             # Global styles & Material Symbols font setup
│   └── index.js                              # React application root
├── firebase.json                             # Firebase Hosting configuration & SPA rewrites
├── .firebaserc                               # Firebase project binding
└── package.json                              # Project dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or v20+ LTS recommended)
- [Git](https://git-scm.com/)

### Installation & Local Setup

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

## 🔄 Automated CI/CD Pipeline

This project is integrated with **GitHub Actions** for continuous deployment to **Firebase Hosting**:

- **Every push to the `main` branch** triggers `.github/workflows/firebase-hosting-merge.yml`:
  1. Spins up a clean Node.js 20 LTS runner.
  2. Runs `npm ci` to ensure reproducible dependencies.
  3. Executes `npm run build` to verify code integrity and generate production assets.
  4. Deploys live to [store-for-all-c42fa.web.app](https://store-for-all-c42fa.web.app).

---

## 👨‍💻 Author

**Arvind Kumar**
- GitHub: [@ArvindKumar993978](https://github.com/ArvindKumar993978)
- Repository: [ArvindKumar993978/Store](https://github.com/ArvindKumar993978/Store)

---

## 📄 License

This project is licensed under the **MIT License** — free to use and adapt for educational, retail, and commercial deployments.
