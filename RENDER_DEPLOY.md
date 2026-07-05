# 🚀 Hosting Inkwell Notes on Render.com

Your full-stack application (Django + React + SQLite + WhiteNoise) is **100% production-ready** for [Render.com](https://render.com)!

Because Django is configured with **WhiteNoise**, Render will serve your entire backend API and React frontend together from a single unified web service!

---

## ⭐ Method 1: The Super Fast 1-Click Blueprint (Recommended!)

1. **Push your code to GitHub**:
   ```powershell
   git add .
   git commit -m "Configure project for Render.com deployment"
   git push
   ```
2. Log into your **[Render Dashboard](https://dashboard.render.com)**.
3. Click the **New +** button at the top right and select **Blueprint**.
4. Connect your GitHub repository (`inkwell-notes-app`).
5. Render will automatically detect the `render.yaml` file, set up `gunicorn`, generate a secure `SECRET_KEY`, and build your React UI!
6. Click **Apply** and wait about 2-3 minutes for the build to finish.

---

## 🛠️ Method 2: Manual Web Service Setup

If you prefer setting it up manually instead of using the Blueprint:
1. In your Render Dashboard, click **New +** ➔ **Web Service**.
2. Connect your GitHub repository.
3. Use the following settings:
   - **Name**: `inkwell-notes` (or anything you like)
   - **Region**: Choose the closest to you
   - **Branch**: `main`
   - **Runtime**: `Python 3`
   - **Build Command**: `chmod +x render_build.sh && ./render_build.sh`
   - **Start Command**: `cd backend && gunicorn notesapp_config.wsgi:application`
4. Under **Environment Variables**, add:
   - `DEBUG` = `False`
   - `ALLOWED_HOSTS` = `*`
   - `SECRET_KEY` = *(click 'Generate' or enter a random string)*
5. Click **Create Web Service**!

---

## 🔑 How to Create Your Admin Superuser on Render
Once your app is live on Render:
1. In your Render Dashboard, click on your `inkwell-notes` web service.
2. Click on the **Shell** tab on the left menu.
3. In the terminal that opens, run:
   ```bash
   cd backend
   python manage.py createsuperuser
   ```
4. Follow the prompts to create your admin username and password.
5. Visit `https://your-app-name.onrender.com/admin/` to log in!

---

### ⚠️ Important Note on Render Free Tier
Render's free web services go to sleep after 15 minutes of inactivity (the first request after waking up takes ~30 seconds). Also, the free filesystem is ephemeral—if you want your SQLite database notes to persist permanently without resetting across server restarts, you can attach a free **Render Persistent Disk** in your Web Service settings under the "Disks" tab!
