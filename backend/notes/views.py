import os
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, BasePermission
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.db.models import Q
from .models import Note, Category
from .serializers import NoteSerializer, CategorySerializer
from .authentication import CsrfExemptSessionAuthentication


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def ping_health(request):
    """
    Ultra-lightweight 2-byte health check endpoint for Cron-job.org / Uptime monitors.
    Returns plain text 'ok' so it never triggers 'output too large' or memory limits.
    """
    return HttpResponse('ok', content_type='text/plain')


class IsAuthenticatedOrSiteUnlocked(BasePermission):
    """
    Allows access if user is logged in via Django auth or session flag,
    OR if SITE_PASSWORD is set to empty string / 'false' / 'none'.
    """
    def has_permission(self, request, view):
        site_pwd = os.getenv('SITE_PASSWORD', 'admin12345').strip()
        if site_pwd.lower() in ('', 'false', 'none', 'disabled', '0'):
            return True
        if request.user and request.user.is_authenticated:
            return True
        if request.session.get('site_unlocked', False):
            return True
        return False


@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication, BasicAuthentication])
@permission_classes([AllowAny])
def site_login(request):
    password = request.data.get('password', '').strip()
    username = request.data.get('username', 'admin').strip()
    
    site_pwd = os.getenv('SITE_PASSWORD', 'admin12345').strip()
    
    # Check against SITE_PASSWORD or Django superuser password
    if password == site_pwd:
        request.session['site_unlocked'] = True
        return Response({'success': True, 'message': 'Desk ledger unlocked!'})
    
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        request.session['site_unlocked'] = True
        return Response({'success': True, 'message': 'Welcome back, Executive!'})
        
    return Response({'success': False, 'message': 'Invalid password. Access denied.'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication, BasicAuthentication])
@permission_classes([AllowAny])
def site_logout(request):
    logout(request)
    request.session['site_unlocked'] = False
    return Response({'success': True, 'message': 'Desk locked securely.'})


@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication, BasicAuthentication])
@permission_classes([AllowAny])
def site_status(request):
    site_pwd = os.getenv('SITE_PASSWORD', 'admin12345').strip()
    is_protected = site_pwd.lower() not in ('', 'false', 'none', 'disabled', '0')
    is_unlocked = not is_protected or (request.user and request.user.is_authenticated) or request.session.get('site_unlocked', False)
    return Response({
        'is_protected': is_protected,
        'is_unlocked': is_unlocked,
        'username': request.user.username if (request.user and request.user.is_authenticated) else 'Executive'
    })


class CategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Categories (Protected by Site Password).
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticatedOrSiteUnlocked]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Detach notes from this category before deleting
        instance.notes.update(category=None)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class NoteViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Notes (Protected by Site Password).
    """
    serializer_class = NoteSerializer
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticatedOrSiteUnlocked]

    def get_queryset(self):
        queryset = Note.objects.select_related('category').all()

        # Filter by search query
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(content__icontains=search)
            )

        # Filter by category
        category_id = self.request.query_params.get('category', None)
        if category_id:
            if category_id == 'uncategorized':
                queryset = queryset.filter(category__isnull=True)
            else:
                queryset = queryset.filter(category_id=category_id)

        # Filter pinned only
        pinned = self.request.query_params.get('pinned', None)
        if pinned == 'true':
            queryset = queryset.filter(is_pinned=True)

        return queryset

    @action(detail=True, methods=['patch'], url_path='toggle-pin')
    def toggle_pin(self, request, pk=None):
        """Toggle the pinned state of a note."""
        note = self.get_object()
        note.is_pinned = not note.is_pinned
        note.save()
        serializer = self.get_serializer(note)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """Return exact global counts for notes."""
        total_count = Note.objects.count()
        pinned_count = Note.objects.filter(is_pinned=True).count()
        uncategorized_count = Note.objects.filter(category__isnull=True).count()
        return Response({
            'total_count': total_count,
            'pinned_count': pinned_count,
            'uncategorized_count': uncategorized_count,
        })
