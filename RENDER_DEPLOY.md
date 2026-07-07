# 🚀 Hosting Inkwell Notes on Render.com (Free Tier & No Card Required!)

Your full-stack application (Django + React + WhiteNoise + Dynamic SQL) is configured specifically for **Render.com's Free Tier**—meaning **no credit card is required** and **no interactive SSH/Shell is needed**!

---

## 🛡️ IMPORTANT: How to Prevent Data Loss on Render (Why SQLite Wipes Data)

Unlike PythonAnywhere (which gave you a permanent disk folder), **Render.com's Free Tier Web Services use ephemeral container storage!**
This means whenever you:
- Change an environment variable (like `ADMIN_PASSWORD` or `SITE_PASSWORD`),
- Push new code to GitHub, or
- Render restarts your free server after inactivity...

**Render destroys the old container and creates a brand new one!** Because `db.sqlite3` is a file stored inside the container, **using SQLite on Render causes all your notes to be wiped out whenever the server restarts or variables change!**

### ✨ The Solution: Add a Free PostgreSQL Database (Takes 60 Seconds!)
We have upgraded your Django backend to automatically connect to a **Free PostgreSQL Database** whenever you provide a `DATABASE_URL`! Because PostgreSQL runs on a dedicated database server, **your notes and categories will be 100% permanent and will NEVER wipe out again when you change passwords or update code!**

Here is how to connect a permanent Free Database:

#### Option A: Render Free PostgreSQL (Directly in Render)
1. In your [Render Dashboard](https://dashboard.render.com/), click **New +** ➔ **PostgreSQL**.
2. Give it a name (e.g., `inkwell-db`) and select the **Free** tier ($0/month - No credit card needed!).
3. Click **Create Database**.
4. Once created, look under **Connections** and copy the **Internal Database URL** (looks like `postgres://user:password@hostname/dbname`).
5. Go to your **`inkwell-notes` Web Service** ➔ **Environment** tab.
6. Click **Add Environment Variable**:
   - **Key:** `DATABASE_URL`
   - **Value:** *(Paste the Internal Database URL you copied)*
7. Click **Save Changes**! Render will automatically redeploy, migrate your permanent database, and your data will never be lost again!

#### Option B: Supabase / Neon.tech (Free Forever PostgreSQL)
If you prefer an external free Postgres database like [Supabase.com](https://supabase.com/) or [Neon.tech](https://neon.tech/):
1. Create a free Postgres database on their site and copy your connection string (`postgres://...`).
2. Add it as an environment variable in your Render Web Service called **`DATABASE_URL`**. That's it!

---

## 🔑 Automated Admin Login (No Shell Needed!)
Because Render's Free Tier disables interactive Shell access, I built an automated script (`backend/create_admin.py`) that runs automatically during deployment!

Every time Render deploys your app, it will automatically create or sync your Admin login in your permanent database with these credentials:
- **Username:** `admin`
- **Password:** `admin12345`

*(💡 Want a custom password? Simply add an environment variable called `ADMIN_PASSWORD` in your Render Web Service settings, and the script will automatically set your admin password to whatever you type!)*

---

## 🛠️ How to Deploy for Free Without a Credit Card

To deploy without Render asking for a credit card, you must create a **Manual Web Service** on the Free Tier (do NOT select "Blueprint" or attach Disks!).

### Step 1: Push Your Code to GitHub
Open your PC terminal and run:
```powershell
git add .
git commit -m "Add PostgreSQL DATABASE_URL support for permanent data on Render"
git push
```

### Step 2: Create a Manual Web Service on Render
1. Go to **[https://dashboard.render.com](https://dashboard.render.com)** and click **New +** ➔ **Web Service** *(do NOT select Blueprint)*.
2. Connect your GitHub repository (`inkwell-notes-app`).
3. Fill in these exact settings:
   - **Name**: `inkwell-notes`
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
4. **Instance Type**: Select the **Free** tier ($0/month - 512 MB RAM)!

### Step 3: Add Your Environment Variables
Under **Environment Variables**, click **Add Environment Variable** and add:
- `DEBUG` = `False`
- `ALLOWED_HOSTS` = `*`
- `SECRET_KEY` = `my-super-secret-production-key-inkwell-2026`
- `PYTHON_VERSION` = `3.10.0`
- `DATABASE_URL` = `your-postgres-database-url-here` *(CRITICAL for preventing data loss!)*
- `ADMIN_PASSWORD` = `your-custom-admin-password-here` *(optional, defaults to `admin12345`)*
- `SITE_PASSWORD` = `your-custom-site-password-here` *(optional, defaults to `admin12345`)*

### Step 4: Click 'Create Web Service'!
Render will now build and host your site completely for free! Because you added `DATABASE_URL`, your data is 100% permanent! 🎉🪶✨

---

## ⚡ Why Does the Site Sometimes Say "Rendering..." or Delay Loading? (Cold Starts)

On **Render.com's Free Tier ($0/month)**, if your website receives **no web traffic for 15 minutes**, Render automatically puts your server to **sleep (spins down to zero instances)** to conserve server memory!

When you (or anyone else) open your app after it has been asleep for 15+ minutes, Render has to **wake up your container and boot Python from scratch!** This wake-up process is called a **"Cold Start"** and takes roughly **30 to 50 seconds**. While waking up, you might see a brief loading pause or a message saying *"Spinning up service..."* or *"Rendering..."*. Once awake, your site runs lightning fast!

### 🚀 How to Keep Your Site Awake 24/7 for Free (No Cold Starts!):
You can easily prevent your site from sleeping by using a free uptime ping service:
1. Go to a free monitor like **[Cron-job.org](https://cron-job.org/)** or **[UptimeRobot.com](https://uptimerobot.com/)** (no credit card required).
2. Create a free account and click **Add New Monitor / Job**.
3. Enter your lightweight ping URL: `https://your-app-name.onrender.com/api/ping/` *(This special endpoint returns a tiny 2-byte response `ok` so it will NEVER trigger 'Failed: output too large' or memory errors!)*
4. Set the schedule / execution interval to **every 10 minutes** or **every 14 minutes**.
5. *(Optional for Cron-job.org)* Under **Advanced settings**, uncheck **Save response body** (so it doesn't log history text).

Because the monitoring service visits your lightweight `/api/ping/` endpoint every 10 to 14 minutes, **Render never sees 15 minutes of inactivity!** Your Inkwell Notes Suite will stay awake 24/7/365 and will load instantly every single time without any delay! ⚡🪶✨
