# ==============================================================================
# PYTHONANYWHERE WSGI CONFIGURATION TEMPLATE
# ==============================================================================
# On PythonAnywhere, go to your 'Web' tab, click on the WSGI configuration file link
# (e.g., /var/www/yourusername_pythonanywhere_com_wsgi.py), delete everything inside it,
# and paste the code below! Make sure to replace 'yourusername' with your actual username!
# ==============================================================================

import os
import sys

# 1. Add your Django project backend directory to the Python path
#    REPLACE 'yourusername' with your actual PythonAnywhere username!
path = '/home/yourusername/notesapp/backend'
if path not in sys.path:
    sys.path.append(path)

# 2. Set the Django settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'notesapp_config.settings'

# 3. Initialize the Django WSGI application (WhiteNoise will automatically serve React static files!)
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
