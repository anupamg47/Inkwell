# 🚀 PythonAnywhere Deployment Guide for Inkwell Notes

This project is 100% configured and ready to deploy as a full-stack web application on [PythonAnywhere](https://www.pythonanywhere.com).

Follow these exact steps to get your app live at `https://yourusername.pythonanywhere.com`:

---

### Step 1: Upload Your Code to PythonAnywhere
1. Open your PythonAnywhere account and go to the **Consoles** tab.
2. Open a **Bash Console**.
3. Clone or upload this repository into your home folder so that the structure looks like this:
   ```text
   /home/yourusername/notesapp/
   ├── backend/
   └── frontend/
   ```

---

### Step 2: Create Virtual Environment & Install Backend Dependencies
In your PythonAnywhere Bash console, run:
```bash
# Create a Python 3.10 virtual environment
mkvirtualenv --python=/usr/bin/python3.10 notesapp-env

# Install Django and PostgreSQL database drivers
pip install -r /home/yourusername/notesapp/backend/requirements.txt
```

---

### Step 3: The Frontend UI (No `npm` Needed on PythonAnywhere!)
**Best Practice / Recommended Option**:
Because PythonAnywhere servers often don't have Node.js/npm installed by default, **you do NOT need to run `npm` on PythonAnywhere!**
Instead, build the project **locally on your PC** before pushing to GitHub:
```powershell
# Run this on your local Windows PC terminal:
cd C:\Users\admin\.gemini\antigravity\scratch\notesapp\frontend
npm run build
git add .
git commit -m "Build production UI for PythonAnywhere"
git push
```
When you clone or `git pull` on PythonAnywhere, the compiled `frontend/dist` folder will already be there! You can skip directly to Step 4!

*(Optional Alternative: If you really want to install and run `npm` inside PythonAnywhere Bash, run these 3 commands first to install Node Version Manager:)*
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bashrc
nvm install 20
```


---

### Step 4: Configure the Database & Static Files
In your Bash console, migrate the database and collect all static assets:
```bash
cd /home/yourusername/notesapp/backend

# 1. Create your production .env file from the example template
cp .env.example .env

# 2. CRITICAL: Edit .env in PythonAnywhere's Files tab (or via nano) and ensure:
#    DEBUG=False
#    SECRET_KEY=your-secure-secret-key

# 3. Run database migrations (this automatically creates your db.sqlite3 database file!)
python manage.py migrate

# 4. Collect static files for production
python manage.py collectstatic --noinput

# 5. Create an Admin superuser account
python manage.py createsuperuser
```
*(This project is permanently configured to use SQLite, so zero database configuration or PostgreSQL setup is required!)*

---

### Step 5: Configure the 'Web' Tab on PythonAnywhere
Go to the **Web** tab on PythonAnywhere and create a new Web App (select **Manual Configuration** -> **Python 3.10**):

1. **Virtualenv Section**:
   - Enter path: `/home/yourusername/.virtualenvs/notesapp-env`
2. **Code Section**:
   - Source code: `/home/yourusername/notesapp/backend`
   - Working directory: `/home/yourusername/notesapp/backend`
3. **WSGI Configuration File**:
   - Click on the WSGI configuration file link in the Web tab.
   - Delete everything inside it and replace it with the contents of `/home/yourusername/notesapp/backend/wsgi_pythonanywhere.py` (make sure to replace `yourusername` with your actual username!).
4. **Static Files Section**:
   - Add two static file mappings so PythonAnywhere serves your assets at high speed:
     - URL: `/static/` -> Path: `/home/yourusername/notesapp/backend/staticfiles`
     - URL: `/assets/` -> Path: `/home/yourusername/notesapp/frontend/dist/assets`

---

### Step 6: Reload & Enjoy!
Click the green **Reload** button at the top of the Web tab.

Open **`https://yourusername.pythonanywhere.com`** in any browser—your full-stack executive stationery desk app is now live on the internet! 🌍✒️
