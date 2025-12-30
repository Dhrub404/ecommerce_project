from rest_framework import serializers
from .models import Category, Product, Review


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    category = CategorySerializer(read_only=True)
    image_url = serializers.SerializerMethodField(read_only=True)
    reviews = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'price',
            'stock',
            'image',
            'image_url',
            'is_active',
            'created_at',
            'category',
            'category_id',
            'rating',
            'numReviews',
            'reviews',
        ]

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data



