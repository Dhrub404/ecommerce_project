from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404

from .models import Cart, CartItem
from products.models import Product
from .serializers import CartSerializer


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        if not product_id:
            return Response(
                {"error": "product_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        product = get_object_or_404(Product, id=product_id)
        cart, created = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product
        )

        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity

        cart_item.save()
        return Response({"message": "Product added to cart"})


class UpdateCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity', 1))

        cart_item = get_object_or_404(
            CartItem,
            id=item_id,
            cart__user=request.user
        )

        if quantity <= 0:
            cart_item.delete()
            return Response({"message": "Item removed from cart"})

        cart_item.quantity = quantity
        cart_item.save()
        return Response({"message": "Cart item updated"})


class RemoveFromCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        item_id = request.data.get('item_id')

        cart_item = get_object_or_404(
            CartItem,
            id=item_id,
            cart__user=request.user
        )

        cart_item.delete()
        return Response({"message": "Item removed from cart"})
