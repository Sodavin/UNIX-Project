from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'category',
        'subcategory',
        'price',
        'is_featured',
        'is_new_arrival',
        'is_under_ten',
        'available',
    )
    list_filter = ('category', 'subcategory', 'is_featured',
                   'is_new_arrival', 'is_under_ten')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')
