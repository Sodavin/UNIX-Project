from django.contrib import admin
from .models import History, HistoryItem, Product, Wishlist, Order, OrderItem


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


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'updated_at')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('created_at', 'updated_at')
    filter_horizontal = ('products',)


@admin.register(History)
class HistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'updated_at')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(HistoryItem)
class HistoryItemAdmin(admin.ModelAdmin):
    list_display = ('history', 'product', 'viewed_at')
    search_fields = ('history__user__username', 'product__name')
    readonly_fields = ('viewed_at',)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('product', 'quantity', 'price', 'color', 'size')
    search_fields = ('product__name',)
    readonly_fields = ('id',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'user__email', 'full_name', 'email')
    readonly_fields = ('created_at', 'updated_at')
    filter_horizontal = ('items',)

    fieldsets = (
        ('Order Info', {
            'fields': ('user', 'status', 'total_price', 'created_at', 'updated_at')
        }),
        ('Shipping Address', {
            'fields': ('full_name', 'email', 'phone', 'address', 'city', 'state', 'zip_code', 'country')
        }),
        ('Payment', {
            'fields': ('payment_method',)
        }),
        ('Items', {
            'fields': ('items',)
        }),
    )
