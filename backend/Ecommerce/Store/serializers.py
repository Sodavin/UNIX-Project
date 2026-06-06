from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    image_urls = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'category',
            'subcategory',
            'description',
            'price',
            'is_bestseller',
            'is_featured',
            'is_new_arrival',
            'is_under_ten',
            'available',
            'colors',
            'sizes',
            'image1',
            'image2',
            'image3',
            'image_urls',
            'created_at',
            'updated_at',
        ]

    def get_image_urls(self, obj):
        return [url for url in obj.image_urls if url]
