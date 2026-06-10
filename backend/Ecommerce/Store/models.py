from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


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
    discount_price = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        blank=True,
        null=True,
        default=None,
    )
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


class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    province_city = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    address_details = models.TextField(blank=True)

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profiles"

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Address(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='addresses')
    recipient_name = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    province_city = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    address_details = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Address"
        verbose_name_plural = "Addresses"

    def __str__(self):
        return f"{self.user.username} address ({self.province_city})"


@receiver(post_save, sender=User)
def create_user_related_records(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        Wishlist.objects.create(user=instance)
        History.objects.create(user=instance)


class Wishlist(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='wishlist')
    products = models.ManyToManyField(
        Product, related_name='wishlisted_by', blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Wishlist"
        verbose_name_plural = "Wishlists"

    def __str__(self):
        return f"{self.user.username}'s Wishlist"


class History(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='history')
    products = models.ManyToManyField(
        Product, through='HistoryItem', related_name='viewed_by', blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "History"
        verbose_name_plural = "Histories"

    def __str__(self):
        return f"{self.user.username}'s History"


class HistoryItem(models.Model):
    history = models.ForeignKey(
        History, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='history_items')
    viewed_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-viewed_at']
        unique_together = ('history', 'product')

    def __str__(self):
        return f"{self.history.user.username} viewed {self.product.name} at {self.viewed_at}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        'Order', on_delete=models.CASCADE, related_name='items', null=True, blank=True)
    product = models.ForeignKey(
        Product, on_delete=models.SET_NULL, null=True, related_name='order_items')
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    color = models.CharField(max_length=50, blank=True, null=True)
    size = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        verbose_name = "Order Item"
        verbose_name_plural = "Order Items"

    def __str__(self):
        if self.product:
            return f"{self.product.name} x {self.quantity}"
        return f"OrderItem {self.id} x {self.quantity}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='orders')
    total_price = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending')

    # Shipping and billing address
    full_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)

    # Payment info
    payment_method = models.CharField(max_length=50, blank=True)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Order"
        verbose_name_plural = "Orders"

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"
