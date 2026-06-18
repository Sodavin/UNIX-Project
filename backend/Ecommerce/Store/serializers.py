from rest_framework import serializers
from django.contrib.auth.models import User
from django.db.models import Sum
from .models import Address, History, HistoryItem, Product, Wishlist, Order, OrderItem, Profile, StoreSettings


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'recipient_name', 'phone', 'province_city',
                  'district', 'address_details', 'created_at']
        read_only_fields = ['id', 'created_at']


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
            'discount_price',
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


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['phone', 'province_city', 'district', 'address_details']


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False, allow_null=True)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'is_staff', 'is_superuser', 'password', 'profile']
        read_only_fields = ['id']

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', None)
        password = validated_data.pop('password', None)
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        if profile_data:
            Profile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()

        if profile_data is not None:
            profile, _ = Profile.objects.get_or_create(user=instance)
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()

        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        try:
            profile_instance = instance.profile
        except Profile.DoesNotExist:
            profile_instance = None
        data['profile'] = ProfileSerializer(
            profile_instance).data if profile_instance else {}
        return data


class AdminCustomerSerializer(serializers.ModelSerializer):
    orders_count = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()
    registration_date = serializers.DateTimeField(source='date_joined')
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'registration_date',
            'orders_count',
            'total_spent',
            'profile',
        ]

    def get_orders_count(self, obj):
        return obj.orders.count()

    def get_total_spent(self, obj):
        return float(obj.orders.aggregate(total=Sum('total_price'))['total'] or 0)


class StoreSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreSettings
        fields = ['id', 'store_name', 'email', 'phone',
                  'currency', 'shipping_info', 'updated_at']
        read_only_fields = ['id', 'updated_at']


class WishlistSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    product_ids = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        many=True,
        write_only=True,
        source='products'
    )

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'products',
                  'product_ids', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        write_only=True,
        source='product'
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id',
                  'quantity', 'price', 'color', 'size']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'user',
            'items',
            'total_price',
            'status',
            'full_name',
            'email',
            'phone',
            'address',
            'city',
            'state',
            'zip_code',
            'country',
            'payment_method',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class HistoryItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        write_only=True,
        source='product'
    )

    class Meta:
        model = HistoryItem
        fields = ['id', 'product', 'product_id', 'viewed_at']
        read_only_fields = ['id', 'product', 'viewed_at']


class HistorySerializer(serializers.ModelSerializer):
    items = HistoryItemSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = History
        fields = ['id', 'user', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'items', 'created_at', 'updated_at']


class AccountSummarySerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    addresses = AddressSerializer(many=True, read_only=True)
    wishlist = WishlistSerializer(read_only=True)
    history = HistorySerializer(read_only=True)
    orders = OrderSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'profile',
            'addresses',
            'wishlist',
            'history',
            'orders',
        ]
