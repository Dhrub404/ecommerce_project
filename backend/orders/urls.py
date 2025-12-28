from django.urls import path
from .views import CreateOrderView, MyOrdersView

urlpatterns = [
    path("create/", CreateOrderView.as_view(), name="create-order"),
    path("", MyOrdersView.as_view(), name="my-orders"),
]
