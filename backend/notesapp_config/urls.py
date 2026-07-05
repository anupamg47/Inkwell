from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('notes.urls')),
    re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': settings.BASE_DIR.parent / 'frontend' / 'dist' / 'assets'}),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='home'),
]

