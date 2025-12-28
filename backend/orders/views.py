from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db import transaction

from .models import Order, OrderItem
from cart.models import Cart, CartItem
from .serializers import OrderSerializer


class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        user = request.user

        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            return Response(
                {"detail": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_items = CartItem.objects.filter(cart=cart)

        if not cart_items.exists():
            return Response(
                {"detail": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        total_price = sum(
            item.product.price * item.quantity
            for item in cart_items
        )

        order = Order.objects.create(
            user=user,
            total_price=total_price
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                price=item.product.price,
                quantity=item.quantity
            )

        # 🔥 Clear cart after order creation
        cart_items.delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MyOrdersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
