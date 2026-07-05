#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "📦 [1/4] Installing dependencies & building React UI..."
cd frontend
npm install
npm run build
cd ..

echo "🐍 [2/4] Installing Python backend dependencies..."
pip install -r backend/requirements.txt

echo "🎨 [3/4] Collecting Django static files..."
python backend/manage.py collectstatic --noinput

echo "🗄️ [4/4] Running database migrations..."
python backend/manage.py migrate

echo "✅ Render build completed successfully!"
