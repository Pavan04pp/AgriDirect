# Agridirect — Agricultural Demand & Logistics Clearinghouse

> **A modern, demand-first agricultural procurement platform connecting commercial institutional buyers, verified farmgate producers, and consolidated cold-chain logistics with real-time market intelligence.**

---

## 🌟 Overview

**Agridirect** is an end-to-end B2B agricultural trading and supply orchestration exchange designed to address India's post-harvest transit losses and market volatility. Unlike traditional push-based mandi auctions where farmers harvest speculatively, Agridirect operates on a **demand-first aggregation model**:

1. **Commercial Buyers** (cloud kitchens, supermarket chains, food processors) publish forward procurement contracts specifying volume, grade requirements, delivery schedules, and price tolerance.
2. **Farmers** review active procurement demands, submit farmgate lot commitments, and run optical AI quality pre-screenings with camera capture.
3. **Automated Batch Aggregation & 30-Minute Locked Confirmation**: Supplies from multiple smallholders are aggregated to satisfy large commercial orders, with a strict 30-minute owner review timer.
4. **Logistics Fleet Sequencing**: Multi-point farmgate pickups are automatically sequenced into consolidated routes with temperature monitoring and ±5% standard damage transit allowances.
5. **Direct Clearing & Escrow Settlements**: Guaranteed payouts deposited straight to farmer bank accounts upon verified delivery acceptance.

---

## 🎨 Glassmorphic Design System & Centered Navigation

Agridirect features a **Centered Horizontal Glassmorphism Navigation Bar** with smooth Framer Motion layout springs:
- **Sticky Frosted Glass Navbar**: `backdrop-filter: blur(20px)` with layered semi-transparent white tones (`bg-white/80` to `bg-white/95`) and subtle hairline borders (`border-white/60`).
- **Interactive Gliding Motion Pill**: Smooth spring animation as you switch between the Command Dashboard, Role Workspace Desk, Public Demands Board, and Architecture guide.
- **Direct Live Trends & Crop AI Triggers**: Real-time access to interactive Recharts mandi spot analytics and ML crop advisory directly from the navigation bar.
- **Nature-Inspired Palette**: Forest greens (`#2F5233`, `#25401F`), warm earthen amber (`#C77B2E`), fleet blue (`#3B6FA0`), and muted sage accents.
- **Harmonic Radius & Spatial Rhythm**: Soft, generous borders (`rounded-[20px]`, `rounded-[28px]`) with balanced negative space and fluid transitions.
- **Fully Responsive**: Adapts automatically from centered desktop views down to a slide-out glass drawer on mobile devices.

---

## 🚀 Key Features

### 1. 🌾 Demand-First Procurement Engine
- Commercial buyers broadcast required quantities and delivery deadlines.
- Real-time aggregation combining smaller harvest allocations into full commercial lots.
- 30-minute owner confirmation protocol ensuring price and volume lock-in.

### 2. 📊 Market Trends & Interactive Analytics
- **Live Mandi Price Feeds**: Comparative tracking between Mandi Spot Prices vs. Agridirect Contract Rates.
- **Historical Peak Price Analysis**: Visual indicators for commodities trading near peak selling thresholds (e.g., G4 Green Chillies at 94% peak) vs. off-peak commodities requiring staggered harvest.
- **Glut & Zero Demand Warnings**: Proactive market alerts warning growers against harvesting crops experiencing regional oversupply.
- **Interactive Recharts Visualizations**: 7-day spot price and arrival volume charts.

### 3. 🤖 Machine Learning Crop Advisory
- Algorithmic crop recommendations based on buyer forward demand contracts and regional soil suitability.
- Confidence scoring and projected ROI calculations for farmers planning next season's sowings.

### 4. 🚚 Consolidated Freight Sequencing
- Multi-stop route planning consolidating pickups across neighboring farm clusters.
- Temperature and transit condition monitoring (e.g., ventilated, refrigerated).
- Transparent transit loss allowances (±5% buffer).

### 5. 🔐 Dual-Mode Authentication
- **Google OAuth Login**: One-click Google sign-in via OAuth 2.0 popup that securely retrieves user profile details without manual password entry.
- **Fallback Email/Password**: Instant fallback mechanism if OAuth is closed, blocked by pop-up blockers, or unconfigured.
- **Role-Based Feature Gating**:
  - **Buyer**: Create demands, review aggregations, manage procurement desk.
  - **Farmer**: Sell produce, submit harvest lots, run optical scan, view ML crop advice.
  - **Logistics**: Manage fleet dispatches, inspect route manifests, track deliveries.
  - **Admin**: Oversee dispute resolutions, liquidity escrow, and audit logs.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Motion (framer-motion)
- **Visuals & Charts**: Recharts, Lucide React icons
- **Backend & Middleware**: Express.js server, Node.js, `tsx`
- **Build & Bundle**: `esbuild` CommonJS backend bundler + Vite static asset pipeline

---

## 📂 Project Structure

```
├── server.ts                       # Express backend proxy & Google OAuth callback endpoints
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthModal.tsx       # Glassmorphic auth dialog with Google OAuth popup & fallback
│   │   ├── buyer/
│   │   │   ├── CreateDemandModal.tsx
│   │   │   └── MatchingReviewModal.tsx
│   │   ├── common/
│   │   │   └── Header.tsx          # Centered horizontal glassmorphic navbar with motion animations
│   │   ├── dashboard/
│   │   │   └── ExecutiveDashboard.tsx # Glassmorphic Command Center
│   │   ├── farmer/
│   │   │   ├── FarmerApplicationModal.tsx
│   │   │   └── QualityScanModal.tsx
│   │   ├── public/
│   │   │   ├── HowItWorksPage.tsx
│   │   │   └── LandingPage.tsx     # Public portal with glassmorphic market intelligence
│   │   └── trends/
│   │       └── MarketTrendsModal.tsx # Recharts trend analysis & ML recommendations
│   ├── context/
│   │   └── AppContext.tsx          # Central state, mock escrow, timers, translations
│   ├── data/                       # Seed market trends, APMC rates, initial contracts
│   ├── index.css                   # Glassmorphism utility classes & design tokens
│   ├── main.tsx                    # React entry point
│   └── types.ts                    # Global TypeScript interfaces
├── .env.example                    # Documented environment secrets
├── package.json
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone <your-github-repo-url>
cd agridirect
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set the following keys in `.env` (optional for local testing; email/password fallback works out of the box):
```env
# Gemini AI Key (Optional for AI features)
GEMINI_API_KEY="your_gemini_api_key"

# App URL
APP_URL="http://localhost:3000"

# Google OAuth Credentials (Optional for Google Sign-In)
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 3. Start Development Server
```bash
npm run dev
```
The server will boot at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📄 License
MIT License. Built for modern agricultural transparency and fair farmgate pricing.
