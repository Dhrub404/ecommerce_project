from django.urls import path
from .views import CreateOrderView, MyOrdersView, ShippingAddressView, OrderDetailView, ShippingAddressDetailView

urlpatterns = [
    path("add/", CreateOrderView.as_view(), name="order-add"),
    path("myorders/", MyOrdersView.as_view(), name="myorders"),
    path("<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
    path("addresses/", ShippingAddressView.as_view(), name="addresses"),
    path("addresses/<int:pk>/", ShippingAddressDetailView.as_view(), name="address-detail"),
]
