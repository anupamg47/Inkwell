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

### Step 3: Build the React Frontend
In your Bash console, compile the React Vite application into production static assets:
```bash
cd /home/yourusername/notesapp/frontend
npm install
npm run build
```
*(This builds your production UI directly into `/home/yourusername/notesapp/frontend/dist` where Django is automatically configured to read it).*

---

### Step 4: Configure the Database & Static Files
In your Bash console, migrate the database and collect all static assets:
```bash
cd /home/yourusername/notesapp/backend

# Create your .env file (Optional: by default it will gracefully use SQLite if no PostgreSQL credentials are provided)
cp .env.example .env

# Run database migrations
python manage.py migrate

# Collect static files for production
python manage.py collectstatic --noinput

# Create an Admin superuser account
python manage.py createsuperuser
```

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
