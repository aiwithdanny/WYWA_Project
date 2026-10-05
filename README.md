# WYWA — Waziristan Youth Welfare Association (Official Website)

Full-stack website: **Next.js 14** frontend + **Express** backend + **Prisma / PostgreSQL**.

## Project structure

```
WYWA_Project/
├── frontend/          # Next.js 14 app (public site + admin panel)
├── backend/           # Express API — single entry point: server.js
├── prisma/            # Prisma schema + seed
├── start.bat          # Windows dev launcher
└── start.sh           # macOS/Linux dev launcher
```

## Prerequisites

- Node.js **>= 18.18**
- A PostgreSQL database (e.g. [Neon.tech](https://neon.tech))

## Setup

```bash
# 1. Install everything (from repo root)
npm run install:all

# 2. Backend env
cp backend/.env.example backend/.env
# → fill DATABASE_URL, JWT_SECRET, Cloudinary keys

# 3. Frontend env
cp frontend/.env.example frontend/.env.local
# → NEXT_PUBLIC_API_URL must match backend PORT (default http://localhost:8000)

# 4. Database
npm run prisma:migrate   # creates tables
npm run prisma:seed      # optional seed data (from backend/)

# 5. Run
npm run dev:backend      # http://localhost:8000
npm run dev:frontend     # http://localhost:3000
```

Or on Windows just double-click **`start.bat`** (macOS/Linux: `./start.sh`).

## Deployment notes

- **Frontend → Vercel.** `vercel.json` sits at the repo root; set the Vercel project's
  Root Directory to `frontend/` or deploy the `frontend/` folder.
- **Backend → Render/Railway.** Start command: `node server.js`. Set all `backend/.env`
  variables in the host dashboard. `JWT_SECRET` is required in production.
