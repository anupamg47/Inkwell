from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Note, Category
from .serializers import NoteSerializer, CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Categories.
    Endpoints:
      GET    /api/categories/         - list all categories
      POST   /api/categories/         - create category
      GET    /api/categories/{id}/    - retrieve category
      PUT    /api/categories/{id}/    - update category
      DELETE /api/categories/{id}/    - delete category
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Detach notes from this category before deleting
        instance.notes.update(category=None)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class NoteViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Notes.
    Endpoints:
      GET    /api/notes/              - list all notes (supports ?search=, ?category=)
      POST   /api/notes/             - create note
      GET    /api/notes/{id}/        - retrieve note
      PUT    /api/notes/{id}/        - update note
      PATCH  /api/notes/{id}/        - partial update (e.g., toggle pin)
      DELETE /api/notes/{id}/        - delete note
    """
    serializer_class = NoteSerializer

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

