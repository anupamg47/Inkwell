# ==============================================================================
# PYTHONANYWHERE WSGI CONFIGURATION
# ==============================================================================
# Copy and paste the contents of this file into your PythonAnywhere WSGI
# configuration file (found under the 'Web' tab -> 'WSGI configuration file').
#
# IMPORTANT: Replace 'yourusername' with your actual PythonAnywhere username!
# ==============================================================================

import os
import sys

# 1. Add your project backend directory to the sys.path
# REPLACE 'yourusername' below with your actual PythonAnywhere username!
path = '/home/yourusername/notesapp/backend'
if path not in sys.path:
    sys.path.append(path)

# 2. Tell Django where your settings module is located
os.environ['DJANGO_SETTINGS_MODULE'] = 'notesapp_config.settings'

# 3. Initialize the Django WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
