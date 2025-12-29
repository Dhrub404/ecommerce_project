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
        data = request.data

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
            total_price=total_price,
            address=data.get('address'),
            city=data.get('city'),
            postal_code=data.get('postal_code'),
            country=data.get('country')
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


class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
            data = request.data
            if 'status' in data:
                order.status = data['status']
                order.save()
                serializer = OrderSerializer(order)
                return Response(serializer.data)
            return Response({"detail": "Status required"}, status=status.HTTP_400_BAD_REQUEST)
        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )


from .models import ShippingAddress
from .serializers import ShippingAddressSerializer

class ShippingAddressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        addresses = ShippingAddress.objects.filter(user=request.user)
        serializer = ShippingAddressSerializer(addresses, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        data = request.data

        # If this is the first address, make it default
        is_first = not ShippingAddress.objects.filter(user=user).exists()
        
        address = ShippingAddress.objects.create(
            user=user,
            address=data['address'],
            city=data['city'],
            postal_code=data['postal_code'],
            country=data['country'],
            is_default=data.get('is_default', is_first)
        )
        
        serializer = ShippingAddressSerializer(address)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
