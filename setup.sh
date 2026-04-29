#!/bin/bash
echo "🛵 SPEEDO — Setup Script"
echo "========================"

# Backend
echo ""
echo "📦 Installing backend dependencies..."
cd backend && npm install

echo ""
echo "⚙️  Generating Prisma client..."
npx prisma generate

echo ""
echo "🗄️  Running database migrations..."
npx prisma migrate dev --name init

echo ""
echo "🌱 Seeding database..."
node prisma/seed.js

cd ..

# PWA
echo ""
echo "📱 Installing PWA dependencies..."
cd pwa && npm install
cd ..

# Admin
echo ""
echo "🖥️  Installing Admin dependencies..."
cd admin && npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  Backend:  cd backend && npm run dev    (port 4000)"
echo "  PWA:      cd pwa && npm run dev        (port 5173)"
echo "  Admin:    cd admin && npm run dev      (port 3001)"
echo ""
echo "Admin login: 03001234567 / Admin@123"
echo "Test user:   03111234567 / Test@123"
