#!/usr/bin/env bash
# ==============================================================================
# Inkwell Notes Suite - PythonAnywhere Automated Update & Build Script
# ==============================================================================
# Run this script in your PythonAnywhere Bash Console whenever you push new updates!
# Command to run: bash pythonanywhere_update.sh

echo "=================================================="
echo " 1. Finding Inkwell Project & Pulling Code..."
echo "=================================================="

# Check common project folder names on PythonAnywhere
if [ -d ~/Inkwell ]; then
    cd ~/Inkwell
elif [ -d ~/inkwell ]; then
    cd ~/inkwell
elif [ -d ~/notesapp ]; then
    cd ~/notesapp
else
    # If already inside the project folder
    if [ -d frontend ] && [ -d backend ]; then
        echo "Running inside current directory ($PWD)..."
    else
        echo "Error: Could not find Inkwell project directory (checked ~/Inkwell, ~/inkwell, ~/notesapp)."
        exit 1
    fi
fi

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
if [ -f ~/.virtualenvs/inkwell-env/bin/activate ]; then
    source ~/.virtualenvs/inkwell-env/bin/activate
elif [ -f ~/.virtualenvs/Inkwell-env/bin/activate ]; then
    source ~/.virtualenvs/Inkwell-env/bin/activate
elif [ -f ~/.virtualenvs/notesapp-env/bin/activate ]; then
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
