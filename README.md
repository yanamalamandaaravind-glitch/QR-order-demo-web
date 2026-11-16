# Spice Route - QR-Based Restaurant Ordering & Management System

A full-stack, enterprise-grade demo QR restaurant ordering system featuring:
- **Customer Experience**: QR table scan with splash reveal, 3D perspective depth-scroll menu tunnel along the Z-axis, quick-commerce add-on suggestions, mobile OTP login, Cashfree Sandbox & Mock Pay gateway, and live 3-second order tracking with Web Audio synthesizer chimes, haptics, and confetti.
- **Kitchen Display System (KDS)**: Real-time 4-column Kanban board (*New, Accepted, Preparing, Ready*) with sound alerts upon ticket arrival and strict one-way status progression (no financials displayed).
- **Admin Executive Suite**: Financial analytics (*Sales, Orders, AOV, GST, Net Profit*), Recharts trend charts, live order drill-down, customer loyalty directory, full menu CRUD & availability toggles, dynamic GST settings, PDF & CSV report generation (jsPDF + autoTable), and printable table QR stand generator.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8 + JavaScript (no TypeScript)
- **Routing**: React Router 7
- **Styling**: Tailwind CSS v4 (Warm Dark Obsidian & Saffron palette)
- **Animations**: Framer Motion
- **HTTP Client**: Axios with JWT Interceptors
- **Data Visualization**: Recharts (AreaChart & BarChart)
- **Document Export**: jsPDF + jspdf-autotable (PDF) & CSV Blob export
- **QR Codes**: qrcode.react (high-resolution SVG rendering)
- **Audio Synthesizer**: Web Audio API oscillator harmonics (zero external audio file dependency)

### Backend
- **Framework**: Spring Boot 3.3.4 (Java 17/21 compatible)
- **Security**: Spring Security 6 with stateless JWT authentication
- **Architecture**: Decoupled Controller &rarr; Service &rarr; Repository layers with in-memory concurrent thread-safe storage, ready to swap to Spring Data JPA without modifying controllers.
- **Payment Gateway**: Cashfree Payment Gateway (Sandbox mode with automatic graceful Mock Pay fallback when using placeholder keys)
- **CORS**: Configured for `http://localhost:5173`

---

## 🔑 Demo Credentials

A small **"Demo credentials"** box with a **"1-Click Fill"** button is built directly into every login page.

| Role | Login URL | Username / Mobile | Password / OTP | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | `/login` | Any 10-digit number (e.g. `9876543210`) | OTP: `123456` | QR Menu, Cart, Checkout, Order Tracking, Order History |
| **Kitchen** | `/kitchen/login` | `kitchen` | `Kitchen@123` | Kitchen Orders Board only (`/kitchen`) |
| **Admin** | `/admin/login` | `admin` | `Admin@123` | Full access: Overview, Orders, Menu CRUD, Customers, Reports, Settings, QR Generator, and Kitchen Board |

*Customer sessions persist for 2 hours in localStorage so patrons are not repeatedly prompted for OTP during dining.*

---

## 🚀 How to Run the System

### Prerequisites
- **Java 17+** (JDK 17, 21, or 26)
- **Apache Maven 3.8+**
- **Node.js 18+** & **npm**

---

### Step 1: Start the Backend (Spring Boot)

Open a terminal and run:
```powershell
cd d:\demorest\backend
mvn spring-boot:run
```
- The backend will start on **`http://localhost:8080`**.
- At startup, `DataSeeder` automatically populates:
  - Default Admin (`admin`) and Kitchen (`kitchen`) accounts.
  - **27 realistic menu items** across 9 categories (*Biryani, Starters, Chicken, Puffs, Lollipops, Main Course, Drinks, Desserts, Ice Creams*) with selling prices, cost prices, veg/non-veg flags, and preparation times.
  - **60 simulated past orders** across 15 customers over the last 45 days for realistic analytics, peak hour graphs, and PDF reports on day one.

To run the automated backend test suite:
```powershell
mvn test -f d:\demorest\backend\pom.xml
```

---

### Step 2: Start the Frontend (React + Vite)

Open a second terminal and run:
```powershell
cd d:\demorest\frontend
npm run dev
```
- The frontend will start on **`http://localhost:5173`**.

To verify the production build:
```powershell
cd d:\demorest\frontend
npm run build
```

---

## 🧭 Feature Walkthrough & Testing Guide

### 1. Customer QR Entry & Splash Animation
- Open `http://localhost:5173/menu?table=5` (or any table number in the URL).
- Experience the 2.5-second intro animation with the glowing saffron logo, table indicator (*"Dining at Table 5"*), and ambient audio unlocking.
- The table parameter is automatically bound to the patron's session.

### 2. 3D Perspective Depth-Scroll Menu
- **3D Tunnel Navigation**: Use your **mouse wheel**, **touch swipe**, **arrow keys**, or on-screen buttons to travel forward and backward through the menu cards arranged along the Z-axis.
- Distant cards are scaled down and softly blurred (`blur(offset * 3px)`), while the active card is sharp and interactive.
- **Accessibility Switch**: Click the **"List View"** toggle at the top right to switch to a classic responsive grid.
- **Filters**: Instant category filtering, live keyword search, and Veg / Non-Veg toggles.

### 3. Cart & Quick-Commerce Checkout
- Add items to the plate with fly-to-cart feedback.
- The bottom floating cart bar displays the total item count and running total in ₹.
- On `/checkout`:
  - Adjust portion quantities or write special kitchen instructions.
  - Browse the **"Frequently Added"** carousel (drinks, desserts, puffs) and add extras with a single tap.
  - View real-time GST (5%) and grand total calculations.
  - Click **"Proceed to Pay"**: Unauthenticated guests are seamlessly redirected to `/login` with their cart preserved.

### 4. Cashfree Sandbox & Mock Payment Gateway
- The Cashfree payment modal appears supporting UPI, Cards, and NetBanking.
- Click **"Simulate Successful Payment"** to confirm authorization (or test failure handling with cart preservation).

### 5. Live Order Tracking & Audio Chime
- After payment, the customer is routed to `/order/:id`.
- The page polls every 3 seconds:
  $$\text{Placed} \longrightarrow \text{Accepted} \longrightarrow \text{Preparing} \longrightarrow \text{Ready to Serve}$$
- Use the **"Interactive Demo Controls"** on the page or the Kitchen Board to advance the order.
- When the order becomes **READY**:
  - The Web Audio synthesizer rings a harmonic bell chime.
  - Confetti explodes across the screen.
  - The alert banner prompts the customer to collect the meal or wait for table delivery.

### 6. Kitchen Display System (KDS)
- Log in at `http://localhost:5173/kitchen/login` (`kitchen` / `Kitchen@123`).
- Pure kitchen interface: **zero financial data**.
- 4 Kanban columns: *New, Accepted, Preparing, Ready*.
- Newly arriving customer orders trigger an audio double-beep and glowing tag.
- One-touch progression moves tickets forward and triggers the customer's live alert.

### 7. Admin Back Office Suite
- Log in at `http://localhost:5173/admin/login` (`admin` / `Admin@123`).
- **Overview**: Filter by Today, Week, Month. View 5 KPIs (Sales, Orders, AOV, GST, Net Profit) and Recharts graphs.
- **All Orders**: Search by ID, customer, or phone, inspect itemized tickets, and see net profit per order.
- **Menu Management**: Add, edit, delete dishes, update prices & cost prices, and toggle in-stock availability.
- **Customers**: Review customer order frequencies and lifetime spend.
- **PDF & CSV Reports**: Select month/year, preview metrics, and download branded multi-page PDFs or CSV files.
- **Table QR Generator**: Select any table number and generate high-res QR tent cards ready for printing.

---

## 📁 Project Structure

```
demorest/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/spiceroute/
│   │   │   │   ├── SpiceRouteApplication.java
│   │   │   │   ├── config/              # Security, CORS, GlobalExceptionHandler, DataSeeder
│   │   │   │   ├── controller/          # Auth, Menu, Order, Payment, Settings, Admin
│   │   │   │   ├── dto/                 # Auth, Menu, Order, Payment, Admin DTOs
│   │   │   │   ├── model/               # User, MenuItem, Order, OrderItem, RestaurantSettings
│   │   │   │   ├── repository/          # Decoupled Interfaces & In-Memory Implementations
│   │   │   │   ├── security/            # JwtTokenProvider, JwtAuthenticationFilter, UserPrincipal
│   │   │   │   └── service/             # Auth, Menu, Order, Payment, Admin Services
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                        # Integration and unit tests
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── api/                         # Axios client with JWT interceptor
│   │   ├── components/
│   │   │   ├── admin/                   # MenuTab, SettingsTab, ReportsTab, QrGeneratorTab
│   │   │   ├── DepthScrollTunnel.jsx    # 3D perspective depth-scroll carousel
│   │   │   ├── FloatingCartBar.jsx      # Bottom floating cart summary
│   │   │   ├── ListViewMenu.jsx         # Accessibility grid fallback
│   │   │   ├── Navbar.jsx               # Universal header
│   │   │   ├── PaymentModal.jsx         # Cashfree Sandbox & Mock Pay dialog
│   │   │   ├── ProtectedRoute.jsx       # Role-based route guard
│   │   │   └── SplashScreen.jsx         # Logo reveal intro
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # User, role, 2-hour customer session
│   │   │   └── CartContext.jsx          # LocalStorage persistent cart
│   │   ├── pages/
│   │   │   ├── admin/                   # AdminLogin, AdminDashboard
│   │   │   ├── customer/                # MenuPage, CustomerLogin, CheckoutPage, OrderTrackingPage, MyOrdersPage
│   │   │   └── kitchen/                 # KitchenLogin, KitchenDashboard
│   │   ├── utils/
│   │   │   └── audioAlert.js            # Web Audio API chime and kitchen beeps
│   │   ├── App.jsx                      # Router & Route hierarchy
│   │   ├── index.css                    # Tailwind CSS v4 & theme variables
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```
