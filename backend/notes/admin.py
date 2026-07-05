from django import forms
from django.contrib import admin
from django.utils.html import format_html
from .models import Note, Category


class CategoryAdminForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = '__all__'
        widgets = {
            'color': forms.TextInput(attrs={
                'type': 'color',
                'style': 'width: 65px; height: 38px; padding: 2px; border: 1px solid #ccc; border-radius: 6px; cursor: pointer; vertical-align: middle;'
            }),
        }


class NoteAdminForm(forms.ModelForm):
    class Meta:
        model = Note
        fields = '__all__'
        widgets = {
            'color': forms.TextInput(attrs={
                'type': 'color',
                'style': 'width: 65px; height: 38px; padding: 2px; border: 1px solid #ccc; border-radius: 6px; cursor: pointer; vertical-align: middle;'
            }),
        }


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    form = CategoryAdminForm
    list_display = ['name', 'color_swatch', 'color', 'created_at']
    search_fields = ['name']

    def color_swatch(self, obj):
        return format_html(
            '<div style="width: 24px; height: 24px; background-color: {}; border-radius: 50%; border: 1.5px solid #888; box-shadow: 0 1px 3px rgba(0,0,0,0.2);" title="{}"></div>',
            obj.color,
            obj.color
        )
    color_swatch.short_description = 'Swatch'


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    form = NoteAdminForm
    list_display = ['title', 'category', 'color_swatch', 'is_pinned', 'created_at', 'updated_at']
    list_filter = ['category', 'is_pinned']
    search_fields = ['title', 'content']
    readonly_fields = ['created_at', 'updated_at']

    def color_swatch(self, obj):
        return format_html(
            '<div style="width: 24px; height: 24px; background-color: {}; border-radius: 6px; border: 1.5px solid #888; box-shadow: 0 1px 3px rgba(0,0,0,0.2);" title="{}"></div>',
            obj.color,
            obj.color
        )
    color_swatch.short_description = 'Color'
