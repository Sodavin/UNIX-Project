from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Sum, Count, F
from django.db.models.functions import TruncMonth

from .models import Address, History, HistoryItem, Product, Wishlist, Order, OrderItem, StoreSettings
from .serializers import (
    AddressSerializer,
    ProductSerializer,
    UserSerializer,
    WishlistSerializer,
    HistorySerializer,
    OrderSerializer,
    AccountSummarySerializer,
    StoreSettingsSerializer,
    AdminCustomerSerializer,
)


def home(request):
    return JsonResponse({
        "status": "ok"
    })


class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDetail(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """
    Register a new user account.

    Expected POST data:
    {
        "username": "user123",
        "email": "user@example.com",
        "password": "securepassword",
        "first_name": "John",
        "last_name": "Doe"
    }
    """
    username = request.data.get('username', '').strip()
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')

    if not username or not email or not password:
        return Response(
            {"detail": "Username, email, and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"detail": "Username already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {"detail": "Email already registered."},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )

    token, _ = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)
    return Response({
        "token": token.key,
        "user": serializer.data,
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login user and return token.

    Expected POST data:
    {
        "username": "user123",
        "password": "securepassword"
    }
    """
    identifier = request.data.get('username', '').strip()
    password = request.data.get('password', '')

    if not identifier or not password:
        return Response(
            {"detail": "Username/email and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=identifier, password=password)
    if user is None and '@' in identifier:
        try:
            email_user = User.objects.get(email=identifier.lower())
            user = authenticate(
                username=email_user.username, password=password)
        except User.DoesNotExist:
            user = None

    if user is None:
        return Response(
            {"detail": "Invalid username or password."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    token, _ = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)

    return Response({
        "token": token.key,
        "user": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Get authenticated user's profile.
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_account_summary(request):
    """
    Get authenticated user's consolidated account data.
    """
    Wishlist.objects.get_or_create(user=request.user)
    History.objects.get_or_create(user=request.user)
    serializer = AccountSummarySerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update authenticated user's profile.
    """
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_addresses(request):
    """
    List or create authenticated user's saved addresses.
    """
    if request.method == 'GET':
        addresses = Address.objects.filter(user=request.user)
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)

    serializer = AddressSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_address(request, address_id):
    """
    Delete a saved address for the authenticated user.
    """
    address = get_object_or_404(Address, id=address_id, user=request.user)
    address.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Logout user by deleting token.
    """
    request.user.auth_token.delete()
    return Response(
        {"detail": "Successfully logged out."},
        status=status.HTTP_200_OK
    )


class WishlistDetail(generics.RetrieveUpdateAPIView):
    """
    Get or update user's wishlist.
    """
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        wishlist, _ = Wishlist.objects.get_or_create(user=self.request.user)
        return wishlist


class HistoryDetail(generics.RetrieveAPIView):
    """
    Get authenticated user's view history.
    """
    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        history, _ = History.objects.get_or_create(user=self.request.user)
        return history


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_history(request, product_id):
    """
    Add or update a product view record for the authenticated user.
    """
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(
            {"detail": "Product not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    history, _ = History.objects.get_or_create(user=request.user)
    history_item, created = HistoryItem.objects.update_or_create(
        history=history,
        product=product,
        defaults={'viewed_at': timezone.now()},
    )

    return Response(
        {"detail": "History updated.", "viewed_at": history_item.viewed_at},
        status=status.HTTP_200_OK
    )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_history(request):
    """
    Clear authenticated user's product view history.
    """
    history, _ = History.objects.get_or_create(user=request.user)
    history.items.all().delete()
    return Response(
        {"detail": "History cleared."},
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request, product_id):
    """
    Add a product to user's wishlist.
    """
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(
            {"detail": "Product not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
    wishlist.products.add(product)

    return Response(
        {"detail": "Product added to wishlist."},
        status=status.HTTP_200_OK
    )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_wishlist(request, product_id):
    """
    Remove a product from user's wishlist.
    """
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(
            {"detail": "Product not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
    wishlist.products.remove(product)

    return Response(
        {"detail": "Product removed from wishlist."},
        status=status.HTTP_200_OK
    )


class UserOrderList(generics.ListAPIView):
    """
    Get all orders for authenticated user.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderDetail(generics.RetrieveAPIView):
    """
    Get details of a specific order.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    """
    Create a new order.

    Expected POST data:
    {
        "items": [
            {
                "product_id": 1,
                "quantity": 2,
                "price": 19.99,
                "color": "Red",
                "size": "M"
            }
        ],
        "total_price": 39.98,
        "full_name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "address": "123 Main St",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62701",
        "country": "USA",
        "payment_method": "credit_card"
    }
    """
    items_data = request.data.get('items', [])

    if not items_data:
        return Response(
            {"detail": "Order must contain at least one item."},
            status=status.HTTP_400_BAD_REQUEST
        )

    order = Order.objects.create(
        user=request.user,
        total_price=request.data.get('total_price', 0),
        full_name=request.data.get('full_name', ''),
        email=request.data.get('email', ''),
        phone=request.data.get('phone', ''),
        address=request.data.get('address', ''),
        city=request.data.get('city', ''),
        state=request.data.get('state', ''),
        zip_code=request.data.get('zip_code', ''),
        country=request.data.get('country', ''),
        payment_method=request.data.get('payment_method', ''),
    )

    for item_data in items_data:
        try:
            product = Product.objects.get(id=item_data.get('product_id'))
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item_data.get('quantity', 1),
                price=item_data.get('price', 0),
                color=item_data.get('color', ''),
                size=item_data.get('size', '')
            )
        except Product.DoesNotExist:
            order.delete()
            return Response(
                {"detail": f"Product {item_data.get('product_id')} not found."},
                status=status.HTTP_404_NOT_FOUND
            )

    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_overview(request):
    total_products = Product.objects.count()
    total_orders = Order.objects.count()
    total_customers = User.objects.filter(is_active=True).count()
    total_revenue = Order.objects.aggregate(
        total=Sum('total_price'))['total'] or 0

    orders_by_month = (
        Order.objects
        .annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(total_revenue=Sum('total_price'), orders=Count('id'))
        .order_by('month')
    )

    revenue_trend = [
        {
            'month': row['month'].strftime('%Y-%m') if row['month'] else '',
            'revenue': float(row['total_revenue'] or 0),
            'orders': row['orders'],
        }
        for row in orders_by_month
    ]

    top_products = [
        {
            'product_id': row['product__id'],
            'name': row['product__name'],
            'sold': row['quantity'] or 0,
            'revenue': float(row['revenue'] or 0),
        }
        for row in OrderItem.objects.values('product__id', 'product__name')
        .annotate(quantity=Sum('quantity'), revenue=Sum(F('price') * F('quantity')))
        .order_by('-quantity')[:5]
    ]

    recent_orders = [
        {
            'id': order.id,
            'customer_name': order.full_name or order.user.username,
            'date': order.created_at.isoformat(),
            'total_price': float(order.total_price),
            'status': order.status,
        }
        for order in Order.objects.order_by('-created_at')[:5]
    ]

    recent_activity = [
        {
            'message': f"Order #{order.id} moved to {order.status.title()}",
            'time': order.updated_at.isoformat(),
        }
        for order in Order.objects.order_by('-updated_at')[:6]
    ]

    return Response({
        'total_products': total_products,
        'total_orders': total_orders,
        'total_customers': total_customers,
        'total_revenue': float(total_revenue),
        'revenue_trend': revenue_trend,
        'top_products': top_products,
        'recent_orders': recent_orders,
        'recent_activity': recent_activity,
    })


class AdminProductList(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminOrderList(generics.ListAPIView):
    queryset = Order.objects.order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminOrderDetail(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminCustomerList(generics.ListAPIView):
    queryset = User.objects.order_by('-date_joined')
    serializer_class = AdminCustomerSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_store_settings(request):
    settings_obj, _ = StoreSettings.objects.get_or_create(id=1)

    if request.method == 'GET':
        serializer = StoreSettingsSerializer(settings_obj)
        return Response(serializer.data)

    serializer = StoreSettingsSerializer(
        settings_obj, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
