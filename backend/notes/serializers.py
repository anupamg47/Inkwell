from rest_framework import serializers
from .models import Note, Category


class CategorySerializer(serializers.ModelSerializer):
    note_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'note_count', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_note_count(self, obj):
        return obj.notes.count()


class NoteSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(source='category', read_only=True)
    word_count = serializers.ReadOnlyField()
    char_count = serializers.ReadOnlyField()

    class Meta:
        model = Note
        fields = [
            'id', 'title', 'content', 'category', 'category_detail',
            'is_pinned', 'color', 'word_count', 'char_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
