from django.db import models


class Category(models.Model):
    """Represents a category/tag for organizing notes."""
    name = models.CharField(max_length=100, unique=True)
    color = models.CharField(max_length=7, default='#8B7355')  # hex color
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name


class Note(models.Model):
    """Represents an individual note."""
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True, default='')
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notes'
    )
    is_pinned = models.BooleanField(default=False)
    color = models.CharField(max_length=7, default='#FEFAE0')  # note background color
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_pinned', '-updated_at']

    def __str__(self):
        return self.title

    @property
    def word_count(self):
        if self.content:
            return len(self.content.split())
        return 0

    @property
    def char_count(self):
        return len(self.content)
