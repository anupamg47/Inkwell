import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'notesapp_config.settings')
django.setup()

from django.contrib.auth import get_user_model

def create_admin():
    User = get_user_model()
    username = os.getenv('ADMIN_USERNAME', 'admin')
    email = os.getenv('ADMIN_EMAIL', 'admin@inkwellnotes.com')
    password = os.getenv('ADMIN_PASSWORD', 'admin12345')

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f'[SUCCESS] Superuser "{username}" created successfully!')
    else:
        # Update password if provided in env to ensure access
        user = User.objects.get(username=username)
        user.set_password(password)
        user.save()
        print(f'[INFO] Superuser "{username}" already exists. Password synced.')


if __name__ == '__main__':
    create_admin()
