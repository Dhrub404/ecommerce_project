from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# ... existing imports ...
from .models import Product, Category, Review

# ... existing views ...

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(id=pk)

    # 1. Check if user already reviewed
    alreadyExists = product.review_set.filter(user=user).exists()
    if alreadyExists:
        return Response({'detail': 'Product already reviewed'}, status=status.HTTP_400_BAD_REQUEST)

    # 2. Check if rating is provided
    data = request.data
    rating = data.get('rating', 0) 
    if rating == 0:
        return Response({'detail': 'Please select a rating'}, status=status.HTTP_400_BAD_REQUEST)

    # 3. Create review
    review = Review.objects.create(
        user=user,
        product=product,
        name=user.username,
        rating=rating,
        comment=data.get('comment', '')
    )

    # 4. Update Product stats
    reviews = product.review_set.all()
    product.numReviews = len(reviews)

    total = 0
    for i in reviews:
        total += i.rating

    product.rating = total / len(reviews)
    product.save()

    return Response('Review Added')

from .serializers import ProductSerializer, CategorySerializer
from rest_framework import permissions
from .permissions import IsAdminUserCustom
from rest_framework.permissions import AllowAny
from .pagination import StandardResultsSetPagination


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    pagination_class = StandardResultsSetPagination
    authentication_classes = []

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        keyword = self.request.query_params.get('keyword')
        if keyword:
            queryset = queryset.filter(name__icontains=keyword)
        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    authentication_classes = []


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    authentication_classes = []


class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]   #[IsAdminUserCustom]


class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]   #[IsAdminUserCustom]


class ProductDeleteView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]   #[IsAdminUserCustom]
