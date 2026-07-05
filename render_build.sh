#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "📦 [1/5] Installing dependencies & building React UI..."
cd frontend
npm install
npm run build
cd ..

echo "🐍 [2/5] Installing Python backend dependencies..."
pip install -r backend/requirements.txt

echo "🎨 [3/5] Collecting Django static files..."
python backend/manage.py collectstatic --noinput

echo "🗄️ [4/5] Running database migrations..."
python backend/manage.py migrate

echo "👑 [5/5] Automatically creating Admin Superuser (for Render Free Tier)..."
python backend/create_admin.py

echo "✅ Render build completed successfully!"
