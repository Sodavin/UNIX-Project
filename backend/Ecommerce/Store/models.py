from django.db import models
from django.utils import timezone


class Product(models.Model):
    CATEGORY_MEN = "men"
    CATEGORY_WOMEN = "women"
    CATEGORY_CHOICES = [
        (CATEGORY_MEN, "Men"),
        (CATEGORY_WOMEN, "Women"),
    ]

    SUBCATEGORY_CHOICES = [
        ("shirts", "Shirts"),
        ("t-shirts", "T-Shirts"),
        ("pants", "Pants"),
        ("hoodies", "Hoodies"),
        ("suits", "Suits"),
        ("sportwears", "Sportwears"),
        ("tops", "Tops"),
        ("dresses", "Dresses"),
        ("skirts", "Skirts"),
        ("jeans", "Jeans"),
    ]

    name = models.CharField(max_length=200)
    category = models.CharField(
        max_length=10, choices=CATEGORY_CHOICES, default=CATEGORY_MEN)
    subcategory = models.CharField(
        max_length=20, choices=SUBCATEGORY_CHOICES, default="shirts")
    description = models.TextField(blank=True, default="")
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    is_featured = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=False)
    is_under_ten = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    available = models.BooleanField(default=True)
    colors = models.JSONField(default=list, blank=True)
    sizes = models.JSONField(default=list, blank=True)
    image1 = models.ImageField(upload_to="products/", blank=True, null=True)
    image2 = models.ImageField(upload_to="products/", blank=True, null=True)
    image3 = models.ImageField(upload_to="products/", blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-is_featured", "-is_new_arrival", "name"]

    def __str__(self):
        return self.name

    @property
    def image_urls(self):
        return [
            self.image1.url if self.image1 else None,
            self.image2.url if self.image2 else None,
            self.image3.url if self.image3 else None,
        ]
