from django.urls import path
from .views import (
    home, ProductList, ProductDetail,
    signup, login, logout, user_profile, user_account_summary, update_profile,
    user_addresses, delete_address,
    WishlistDetail, add_to_wishlist, remove_from_wishlist,
    HistoryDetail, add_to_history, clear_history,
    UserOrderList, OrderDetail, create_order,
    admin_overview, AdminProductList, AdminProductDetail,
    AdminOrderList, AdminOrderDetail, AdminCustomerList,
    admin_store_settings,
)

urlpatterns = [
    path('', home),

    # Product endpoints
    path('products/', ProductList.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetail.as_view(), name='product-detail'),

    # Authentication endpoints
    path('auth/signup/', signup, name='signup'),
    path('auth/login/', login, name='login'),
    path('auth/logout/', logout, name='logout'),

    # User profile endpoints
    path('user/profile/', user_profile, name='user-profile'),
    path('user/account/summary/', user_account_summary,
         name='user-account-summary'),
    path('user/profile/update/', update_profile, name='update-profile'),
    path('user/addresses/', user_addresses, name='user-addresses'),
    path('user/addresses/<int:address_id>/',
         delete_address, name='delete-address'),

    # Wishlist endpoints
    path('user/wishlist/', WishlistDetail.as_view(), name='wishlist-detail'),
    path('user/wishlist/add/<int:product_id>/',
         add_to_wishlist, name='add-to-wishlist'),
    path('user/wishlist/remove/<int:product_id>/',
         remove_from_wishlist, name='remove-from-wishlist'),

    # History endpoints
    path('user/history/', HistoryDetail.as_view(), name='history-detail'),
    path('user/history/add/<int:product_id>/',
         add_to_history, name='add-to-history'),
    path('user/history/clear/', clear_history, name='clear-history'),

    # Order endpoints
    path('user/orders/', UserOrderList.as_view(), name='user-orders'),
    path('user/orders/<int:pk>/', OrderDetail.as_view(), name='order-detail'),
    path('user/orders/create/', create_order, name='create-order'),

    path('admin/overview/', admin_overview, name='admin-overview'),
    path('admin/products/', AdminProductList.as_view(), name='admin-product-list'),
    path('admin/products/<int:pk>/', AdminProductDetail.as_view(),
         name='admin-product-detail'),
    path('admin/orders/', AdminOrderList.as_view(), name='admin-order-list'),
    path('admin/orders/<int:pk>/', AdminOrderDetail.as_view(),
         name='admin-order-detail'),
    path('admin/customers/', AdminCustomerList.as_view(),
         name='admin-customer-list'),
    path('admin/settings/', admin_store_settings, name='admin-store-settings'),
]
