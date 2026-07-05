# 🚀 Hosting Inkwell Notes on Render.com (Free Tier & No Card Required!)

Your full-stack application (Django + React + SQLite + WhiteNoise) is configured specifically for **Render.com's Free Tier**—meaning **no credit card is required** and **no interactive SSH/Shell is needed**!

---

## 🔑 Automated Admin Login (No Shell Needed!)
Because Render's Free Tier disables interactive Shell access, I built an automated script (`backend/create_admin.py`) that runs automatically during deployment!

Every time Render deploys your app, it will automatically create or sync your Admin login with these credentials:
- **Username:** `admin`
- **Password:** `admin12345`

*(💡 Want a custom password? Simply add an environment variable called `ADMIN_PASSWORD` in your Render Web Service settings, and the script will automatically set your admin password to whatever you type!)*

---

## 🛠️ How to Deploy for Free Without a Credit Card

To deploy without Render asking for a credit card, you must create a **Manual Web Service** on the Free Tier (do NOT select "Blueprint" or add Disks/Databases!).

### Step 1: Push Your Code to GitHub
Open your PC terminal and run:
```powershell
git add .
git commit -m "Add automated superuser script for Render Free Tier"
git push
```

### Step 2: Create a Manual Web Service on Render
1. Go to **[https://dashboard.render.com](https://dashboard.render.com)** and click **New +** ➔ **Web Service** *(do NOT select Blueprint)*.
2. Connect your GitHub repository (`inkwell-notes-app`).
3. Fill in these exact settings:
   - **Name**: `inkwell-notes` (or anything you like)
   - **Region**: Choose any region
   - **Branch**: `main`
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     chmod +x render_build.sh && ./render_build.sh
     ```
   - **Start Command**:
     ```bash
     cd backend && gunicorn notesapp_config.wsgi:application
     ```
4. **Instance Type**: Select the **Free** tier ($0/month - 512 MB RAM)! *(Do NOT select Starter/Pro or attach any Disks under Advanced)*.

### Step 3: Add Your Environment Variables
Under **Environment Variables**, click **Add Environment Variable** and add:
- `DEBUG` = `False`
- `ALLOWED_HOSTS` = `*`
- `SECRET_KEY` = `my-super-secret-production-key-inkwell-2026`
- `PYTHON_VERSION` = `3.10.0`
- `ADMIN_PASSWORD` = `your-custom-admin-password-here` *(optional, defaults to `admin12345`)*

### Step 4: Click 'Create Web Service'!
Render will now build and host your site completely for free without asking for a credit card! 

Once live, visit `https://your-app-name.onrender.com/admin/` and log in with username **`admin`** and password **`admin12345`**! 🎉🪶✨
