<<<<<<< HEAD
# CampusPool — Smart College Transport Pooling Management System

CampusPool is a production-ready, full-stack college-specific transport pooling and mobility management platform built on the **MERN** stack (MongoDB, Express, React, Node.js). It enables verified students and faculty to coordinate shared commutes, split fuel expenses server-side, track official college bus timetables, utilize emergency SOS alerts, and contribute to campus-wide carbon abatement analytics.

---

## 🌟 Key Highlights

- 🎓 **Verified College Community**: Institutional role enforcement (`STUDENT`, `FACULTY`, `TRANSPORT_ADMIN`, `SUPER_ADMIN`). No unverified outsiders.
- 🍪 **Bulletproof Authentication**: JWT session stored strictly in **HTTP-only, Secure SameSite Cookies** (zero access token storage in localStorage).
- 📍 **Smart Route Matching**: Matches commuters within configurable departure windows (`MATCH_TIME_TOLERANCE_MINUTES=30`) and matching origin neighborhoods.
- 💰 **Server-Side Cost Sharing**: Fair passenger fuel split calculation with voluntary driver contribution (`(Total - Driver) / Passengers`).
- 🚨 **Campus Safety & SOS Module**: One-click emergency route dispatch with campus security hotlines and conduct incident reporting.
- 🚌 **College Bus Fleet Management**: Official campus shuttle timetables, intermediate boarding stops, and delay updates.
- 📊 **Administrative Intelligence**: Deep demand heatmaps, peak travel hours, most frequented pickup gathering points, and green carbon offset tracking.

---

## 🏗️ Project Architecture

```
DT_project/
├── client/                      # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/         # UI Primitives, Navbar, Footer, Modals, ProtectedRoute
│   │   ├── context/            # AuthContext (HTTP-only session) & NotificationContext
│   │   ├── pages/              # 16+ Connected React Views (Student, Faculty & Admin)
│   │   │   ├── Admin/          # Dashboard, Users, Pools, Pickup Points, Buses, Reports, Analytics
│   │   │   ├── Dashboard.jsx   # Dynamic greeting, KPI cards, quick actions
│   │   │   ├── FindTransport.jsx # Algorithm-based route & time matcher
│   │   │   ├── Pools.jsx & PoolDetails.jsx # Complete pool lifecycle
│   │   │   ├── Trips.jsx & TripDetails.jsx # Live rides & rating submissions
│   │   │   └── ...
│   │   ├── services/           # Centralized Axios API client (withCredentials: true)
│   │   ├── App.jsx             # Main Router with Role-Based Access Control
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                      # Node.js + Express + Mongoose REST API
│   ├── src/
│   │   ├── config/             # MongoDB connection with graceful shutdown
│   │   ├── controllers/        # Auth, User, Match, Pool, Trip, Bus, Safety, Admin
│   │   ├── middleware/         # Auth, Role, Rate Limiter, Error Handler, Validators
│   │   ├── models/             # User, Pool, Trip, Bus, PickupPoint, Report, Rating...
│   │   ├── routes/             # REST API routes mounted under /api/*
│   │   ├── services/           # Route matching, cost sharing, analytics, notifications
│   │   ├── utils/              # Seed data script & JWT cookie helpers
│   │   ├── validators/         # Input sanitization and express-validators
│   │   └── server.js           # Express App, Helmet, CORS, Morgan
│   ├── tests/                  # Unit tests for cost sharing, matching, and JWT
│   ├── .env                    # Local MongoDB configuration
│   ├── .env.example            # Atlas and Local template
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json                 # Monorepo concurrency scripts
```

---

## ⚙️ Environment Configuration

### Backend (`server/.env`):
```env
PORT=5000
NODE_ENV=development

# LOCAL MONGODB (Default):
MONGODB_URI=mongodb://127.0.0.1:27017/campus_pool

# MONGODB ATLAS (When ready to deploy/switch to cloud):
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/campus_pool?retryWrites=true&w=majority

JWT_SECRET=campus_pool_super_secret_jwt_key_2026_dev_env_only!
JWT_EXPIRES_IN=7d
COLLEGE_EMAIL_DOMAIN=college.edu
CLIENT_URL=http://localhost:5173
COOKIE_NAME=campus_pool_auth
MATCH_TIME_TOLERANCE_MINUTES=30
```

### Frontend (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
In the root directory, run:
```bash
npm run install:all
```
*(Or install manually: `npm install` in root, `cd server && npm install`, `cd ../client && npm install`)*

### 2. Seed Demo Data
To populate demo students, faculty, transport admins, pools, pickup points, and college buses:
```bash
npm run seed
```

#### Demo Credentials:
| Role | Email | Password | Details |
|---|---|---|---|
| **Student** | `student@college.edu` | `password123` | Rahul Sharma (3rd Year CSE) |
| **Faculty** | `faculty@college.edu` | `password123` | Dr. Ananya Roy (ECE Dept) |
| **Transport Admin** | `admin@college.edu` | `password123` | Vikram Rathore (Transport Desk) |
| **Super Admin** | `superadmin@college.edu` | `password123` | Prof. K. Venkatesh (Dean) |

*(Quick-login buttons are also provided directly on the `/login` screen for fast testing!)*

### 3. Run Development Servers
Run frontend and backend simultaneously:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

---

## 🧪 Running Automated Tests

Run backend unit tests for cost calculation, time tolerance conversion, and JWT tokens:
```bash
npm test
```

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register student or faculty with college credentials
- `POST /api/auth/login` — Authenticate and receive HTTP-only cookie
- `POST /api/auth/logout` — Clear auth cookie
- `GET /api/auth/me` — Read cookie and return safe user profile + commute preferences

### Matching & Pools (`/api/matches`, `/api/pools`)
- `POST /api/matches/search` — Search pools and commuting peers based on origin, destination, time tolerance, and seats
- `GET /api/matches/recommendations` — Automatic recommendations based on saved user profile
- `GET /api/pools` — List pools with status, route, and tab filters (`created`, `joined`)
- `POST /api/pools` — Create pool (driver assigns departure time, seats, and pickup point)
- `POST /api/pools/:id/join` — Join pool (updates available seats, recalculates cost, notifies driver)
- `POST /api/pools/:id/leave` — Leave pool
- `POST /api/pools/:id/cancel` — Cancel pool

### Trips & Cost Sharing (`/api/trips`)
- `POST /api/trips/start` — Driver initiates trip from confirmed pool
- `GET /api/trips` — Commuter's ongoing and past trip history
- `PATCH /api/trips/:id/status` — Mark trip as `COMPLETED` or `CANCELLED`
- `POST /api/trips/:id/cost` — Server-side cost calculator:
  ```json
  {
    "totalCost": 200,
    "driverContribution": 50
  }
  ```
  Returns `costPerPerson = 50` for 3 passengers.

### Safety & Incident Reports (`/api/safety`, `/api/reports`)
- `POST /api/safety/sos` — Trigger emergency broadcast to campus security and admins
- `POST /api/reports` — Submit conduct or driving complaint
- `GET /api/reports` — Admin view of all reports
- `PATCH /api/reports/:id` — Admin resolution & disciplinary notes

### Admin & Analytics (`/api/admin`)
- `GET /api/admin/stats` — High-level dashboard counters (users, pools, trips, buses, reports)
- `GET /api/admin/analytics` — Hourly departure demand histograms, popular pickup points, and carbon metrics
- `GET /api/admin/users` — Campus user roster with search and role filters
- `PATCH /api/admin/users/:id/role` — Super admin role modification
- `PATCH /api/admin/users/:id/status` — Approve/revoke college verification

---

## 🔒 Security Best Practices Implemented

1. **No Tokens in LocalStorage**: JWT is strictly kept inside an `httpOnly`, `sameSite`, `secure` cookie.
2. **Password Protection**: Passwords hashed with `bcryptjs` with salt rounds = 10, excluded from API projections (`select: false`).
3. **HTTP Hardening**: Configured `Helmet` security headers and `CORS` with explicit origin whitelist.
4. **Rate Limiting**: `express-rate-limit` protects against brute-force attacks on auth and API routes.
5. **Privacy Safeguard**: Exact residential street addresses are never rendered publicly—only approximate localities and official pickup points.
=======
# DT_project
>>>>>>> fd714839fb1a0279e0cee9dce4fe16d797f61bc8
