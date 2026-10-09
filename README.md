# ♻️ EcoCycle Campus — Campus E-Waste Collection, Repair, Reuse & Recycling Platform

**EcoCycle Campus** is a production-grade full-stack web platform designed for colleges and universities to manage electronic waste through a complete circular lifecycle:

`Report → Collect → Assess → Repair → Refurbish → Reuse → Recycle → Measure Impact`

---

## 🚀 Key Features & Modules

- **Public Sustainability Landing Page**: Interactive circular lifecycle diagram (`Collect → Repair → Reuse → Recycle`), live campus impact counters, and collection point maps.
- **5-Step Animated E-Waste Submission Wizard**: Device specification, physical condition triage, drag-and-drop image upload, collection drop-box selection, and instant QR code generation.
- **Visual Device Lifecycle Tracking (`/device/:assetNumber`)**: Asset QR code lookup with live step timeline, responsible technician/volunteer, current location, and audit history.
- **Refurbished Device Reuse Marketplace**: Product catalog with search, category filters, condition badges, and one-click student/department device allocation requests.
- **Role-Based Dashboards**:
  - **Student / User**: Personal submitted devices, collection status, waste diverted (kg).
  - **Volunteer**: Pickup schedule, drop-box load meters, one-tap pickup confirmation.
  - **Technician Workbench**: Assigned repair tickets, assessment tool, maintenance log updates, and parts inventory usage.
  - **Admin Command Center**: Recharts analytics (Lifecycle Donut, Monthly Weight Line, Category Bar, Department breakdown), device table, and CSV audit log exporter.
- **Certified E-Waste Recycling**: Zero-landfill certificate manager with government registration IDs and precious metal recovery tracking.
- **Campus Sustainability Engine**: Automated real-time calculations for Landfill Diversion Rate (%), Repair Success Rate (%), Reuse Rate (%), and CO2 Offset (kg).

---

## 🔑 Demo Account Credentials

Use these pre-seeded demo accounts to test role-based permissions immediately or use the **One-Click Quick Demo Login Pill** in the top navigation bar:

| Role | Email | Password | Name |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@ecocycle.local` | `Admin@123` | Dr. Aris Thorne |
| **Technician** | `technician@ecocycle.local` | `Tech@123` | Suresh Kumar (Hardware Spec) |
| **Volunteer** | `volunteer@ecocycle.local` | `Vol@123` | Ananya Roy (Eco Club Lead) |
| **Student** | `student@ecocycle.local` | `Student@123` | Rohan Gupta (CSE Final Year) |

---

## 🛠 Tech Stack

- **Frontend**: Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, TanStack Query, Sonner.
- **Backend**: Node.js, Express.js, TypeScript, REST API, Zod Validation, JWT Auth, bcryptjs, Helmet, CORS.
- **Database**: PostgreSQL with Prisma ORM (17 normalized relational entities).

---

## ⚡ Quick Start Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Database Generation & Seeding
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Run Development Servers
```bash
# Run both Frontend & Backend concurrently
npm run dev:api
npm run dev:web
```

- **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Interactive API Documentation**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
