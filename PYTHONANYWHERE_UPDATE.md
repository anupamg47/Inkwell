# 🐍 Why PythonAnywhere Has Glitches & How to Fix Them

Unlike **Render.com** (which automatically pulls your GitHub code and rebuilds your site whenever you push), **PythonAnywhere Free Tier does not automatically update** when you push to GitHub!

If you push updates to GitHub, PythonAnywhere will continue serving **old, outdated files** until you manually tell it to update. This mismatch between old frontend files and new backend code is what causes glitches and bugs on PythonAnywhere.

---

## 🚀 How to Fix Glitches & Update PythonAnywhere in 30 Seconds

Whenever you push new changes to GitHub, do the following on PythonAnywhere:

### Step 1: Open PythonAnywhere Console
1. Go to your [PythonAnywhere Dashboard](https://www.pythonanywhere.com/).
2. Click on **Consoles** and open your **Bash Console**.

### Step 2: Run the Automated Update Script
Copy and paste this single command into your Bash Console and press **Enter**:
```bash
cd ~/notesapp && bash pythonanywhere_update.sh
```
*This script will automatically pull your latest code from GitHub, rebuild the React frontend, run database migrations, and collect Django static files.*

### Step 3: Reload Your Web App
1. Go to your **Web** tab in PythonAnywhere.
2. Click the big green **Reload inkwellnotes.pythonanywhere.com** button.

---

## 🛡️ What We Just Fixed on the Backend for PythonAnywhere:
We also updated `settings.py` with special Django security settings tailored for PythonAnywhere:
- Added **`CSRF_TRUSTED_ORIGINS`** for all `*.pythonanywhere.com` domains (prevents CSRF verification failures during login and note saving).
- Added **`CORS_ALLOW_CREDENTIALS = True`** and **`SESSION_COOKIE_SAMESITE = 'Lax'`** (ensures session cookies and passkey authentication work without being blocked by browser cookie policies).
