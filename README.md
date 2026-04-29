# 🛵 SPEEDO — Hyperlocal Delivery App

**Full-stack PWA + Backend + Admin Dashboard**

---

## 📁 Project Structure

```
speedo/
├── backend/          ← Node.js + Express + PostgreSQL + Prisma
├── pwa/              ← React PWA (customer app)
└── admin/            ← React admin dashboard
```

---

## ⚡ Quick Start

### 1. Requirements
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

---

### 2. Backend Setup

```bash
cd backend
npm install

# Configure database in .env
# Edit DATABASE_URL to your PostgreSQL connection string
# Default: postgresql://postgres:password@localhost:5432/speedo_db

# Generate Prisma client
npx prisma generate

# Run migrations (creates all tables)
npx prisma migrate dev --name init

# Seed database (admin user + 50 products + categories)
node prisma/seed.js

# Start backend
npm run dev
# Runs on http://localhost:4000
```

**Seeded credentials:**
- Admin: `03001234567` / `Admin@123`
- Customer: `03111234567` / `Test@123`

---

### 3. PWA Setup (Customer App)

```bash
cd pwa
npm install
npm run dev
# Runs on http://localhost:5173
```

**Build for production:**
```bash
npm run build
# Output in dist/ — deploy to any static host (Vercel, Netlify, etc.)
```

---

### 4. Admin Dashboard

```bash
cd admin
npm install
npm run dev
# Runs on http://localhost:3001
```

**Build for production:**
```bash
npm run build
```

---

## 🌐 Environment Variables (Backend)

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/speedo_db"
JWT_SECRET="your-secret-key-change-this"
JWT_REFRESH_SECRET="your-refresh-secret-change-this"
PORT=4000
NODE_ENV=production
UPLOAD_DIR="src/uploads"
MAX_FILE_SIZE=5242880
```

---

## 🚀 Production Deployment

### Option A: VPS (Recommended)

**Backend on VPS:**
```bash
# Install PM2
npm install -g pm2

cd backend
npm install
npx prisma generate
npx prisma migrate deploy
node prisma/seed.js

# Start with PM2
pm2 start src/server.js --name speedo-api
pm2 save
pm2 startup
```

**Nginx config (backend API):**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /uploads/ {
        alias /path/to/speedo/backend/src/uploads/;
        expires 30d;
    }
}
```

**PWA on Vercel:**
1. Push `pwa/` folder to GitHub
2. Import in Vercel
3. Set environment variable: `VITE_API_URL=https://api.yourdomain.com`
4. Update `vite.config.js` proxy to point to your API URL

**Admin on Vercel:**
1. Push `admin/` folder to GitHub
2. Import in Vercel  
3. Same API URL env var

### Option B: Shared Hosting
- Backend: Deploy on Railway / Render / Heroku
- Frontend: Deploy on Netlify / Vercel

---

## 📱 PWA Installation

**Android:**
1. Open PWA in Chrome
2. Tap browser menu → "Add to Home Screen"
3. App installs with Speedo icon

**iOS:**
1. Open PWA in Safari
2. Tap Share button → "Add to Home Screen"
3. App installs in standalone mode

---

## 💳 Payment Flow

1. Customer places order → order saved → WhatsApp redirect
2. Customer makes payment externally (JazzCash/EasyPaisa/Bank)
3. Customer uploads payment screenshot + transaction ID
4. Admin reviews in dashboard → Approve or Reject
5. Order proceeds only after approval

**WhatsApp Number:** +923337339009

---

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register |
| POST | /api/auth/login | — | Login |
| POST | /api/auth/verify-otp | — | Verify OTP |
| GET | /api/products | — | List products |
| GET | /api/categories | — | List categories |
| GET | /api/banners | — | List banners |
| POST | /api/orders | Customer | Create order |
| GET | /api/orders | Customer | My orders |
| POST | /api/orders/:id/payment-proof | Customer | Upload payment |
| GET | /api/admin/dashboard | Admin | Dashboard stats |
| GET | /api/admin/orders | Admin | All orders |
| PUT | /api/admin/orders/:id/status | Admin | Update status |
| PUT | /api/admin/orders/:id/payment | Admin | Approve/reject payment |

---

## 🛵 Order Types

| Type | Description |
|------|-------------|
| SPEEDMART | Grocery shopping |
| PHARMACY | Medicine delivery |
| SPEEDSEND | Parcel delivery |
| CUSTOM | Custom requests |

---

## 📊 Order Status Flow

```
SUBMITTED → WAITING_FOR_ESTIMATE → AWAITING_PAYMENT → 
PAYMENT_UNDER_REVIEW → PAYMENT_VERIFIED → RIDER_ASSIGNED → 
PURCHASING_ITEMS → OUT_FOR_DELIVERY → DELIVERED
                                      ↓ (any stage)
                                   CANCELLED
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, Prisma, PostgreSQL |
| PWA | React 18, Vite, Tailwind CSS, vite-plugin-pwa |
| Admin | React 18, Vite, Tailwind CSS |
| Auth | JWT (access + refresh tokens) |
| Uploads | Multer (local storage) |
| Payments | Manual (JazzCash, EasyPaisa, Bank) |

---

## 📞 Support

WhatsApp: +923337339009  
Business: Dipalpur, Pakistan
