# 🌐 Hosting Inkwell Notes on PythonAnywhere (100% FREE - NO CREDIT CARD REQUIRED!)

If you do not have a credit card or debit card, **[PythonAnywhere](https://www.pythonanywhere.com)** is the #1 best cloud hosting platform because **they never ask for payment details or card verification for free accounts!**

Because we already fixed your codebase (added **WhiteNoise**, enabled **SQLite**, and included your compiled React UI in Git), your app will run flawlessly on PythonAnywhere without any 500 or 400 errors!

---

### Step 1: Push Your Code to GitHub
Open your Windows PC terminal (PowerShell or Command Prompt) and run:
```powershell
cd C:\Users\admin\.gemini\antigravity\scratch\notesapp
git add .
git commit -m "Restore PythonAnywhere no-card deployment setup"
git push
```

---

### Step 2: Download & Setup on PythonAnywhere
1. Log into your **[PythonAnywhere](https://www.pythonanywhere.com)** account (no card needed!).
2. Open a **Bash Console** from the Consoles tab.
3. Download your repository and set up your virtual environment:
   ```bash
   # Clone your repository (if you haven't already, or run 'git pull' inside it)
   git clone https://github.com/yourusername/inkwell-notes-app.git notesapp
   cd /home/yourusername/notesapp
   git pull

   # Create virtual environment and install dependencies (including WhiteNoise!)
   mkvirtualenv --python=/usr/bin/python3.10 notesapp-env
   pip install -r backend/requirements.txt
   ```

---

### Step 3: Run Database Migrations & Collect Assets
In your PythonAnywhere Bash Console, initialize your SQLite database and static files:
```bash
cd /home/yourusername/notesapp/backend

# Create your production .env file
cp .env.example .env

# Run SQLite migrations
python manage.py migrate

# Collect static assets via WhiteNoise
python manage.py collectstatic --noinput

# Create your Admin login credentials
python manage.py createsuperuser
```

---

### Step 4: Configure the 'Web' Tab on PythonAnywhere
Go to the **Web** tab on PythonAnywhere and click **Add a new web app**:
1. Select **Manual Configuration** ➔ **Python 3.10**.
2. **Virtualenv Section**:
   - Enter path: `/home/yourusername/.virtualenvs/notesapp-env`
3. **Code Section**:
   - Source code: `/home/yourusername/notesapp/backend`
   - Working directory: `/home/yourusername/notesapp/backend`
4. **WSGI Configuration File**:
   - Click on your WSGI configuration file link (e.g. `/var/www/yourusername_pythonanywhere_com_wsgi.py`).
   - Delete everything inside it and replace it with this exact code:
     ```python
     import os
     import sys

     # REPLACE 'yourusername' below with your actual PythonAnywhere username!
     path = '/home/yourusername/notesapp/backend'
     if path not in sys.path:
         sys.path.append(path)

     os.environ['DJANGO_SETTINGS_MODULE'] = 'notesapp_config.settings'

     from django.core.wsgi import get_wsgi_application
     application = get_wsgi_application()
     ```
   - Click **Save**.

---

### Step 5: Reload & Go Live! 🌐
Click the big green **Reload** button at the very top of your PythonAnywhere Web tab!

Open **`https://yourusername.pythonanywhere.com`** in your browser—your executive stationery notes desk is now live on the internet completely for free without ever entering a credit card! 🪶📔✨
