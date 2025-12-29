from django.contrib import admin
from django.urls import path, include
from users.views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT auth
    path('api/auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User registration
    path('api/auth/', include('users.urls')),

    # Products
    path('api/', include('products.urls')),

    #cart
    path('api/', include('cart.urls')),

    #orders
    path("api/orders/", include("orders.urls")),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
