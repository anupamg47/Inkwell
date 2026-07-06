#!/usr/bin/env bash
# ==============================================================================
# Inkwell Notes Suite - PythonAnywhere Automated Update & Build Script
# ==============================================================================
# Run this script in your PythonAnywhere Bash Console whenever you push new updates!
# Command to run: bash pythonanywhere_update.sh

echo "=================================================="
echo " 1. Pulling latest code from GitHub..."
echo "=================================================="
cd ~/notesapp || { echo "Directory ~/notesapp not found!"; exit 1; }
git pull origin main || git pull

echo ""
echo "=================================================="
echo " 2. Building React Frontend Static Bundle..."
echo "=================================================="
cd frontend
npm install --silent
npm run build

echo ""
echo "=================================================="
echo " 3. Collecting Django Static Files & Migrating..."
echo "=================================================="
cd ../backend
# Ensure virtualenv is active if present
if [ -f ~/.virtualenvs/notesapp-env/bin/activate ]; then
    source ~/.virtualenvs/notesapp-env/bin/activate
fi
pip install -r requirements.txt --quiet
python manage.py migrate --noinput
python manage.py collectstatic --noinput

echo ""
echo "=================================================="
echo " SUCCESS! Your PythonAnywhere files are updated."
echo " IMPORTANT: Go to your PythonAnywhere 'Web' tab"
echo " and click the green 'Reload' button to go live!"
echo "=================================================="
