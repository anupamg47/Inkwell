from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, CategoryViewSet, site_login, site_logout, site_status

router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('auth/login/', site_login, name='site-login'),
    path('auth/logout/', site_logout, name='site-logout'),
    path('auth/status/', site_status, name='site-status'),
    path('', include(router.urls)),
]
