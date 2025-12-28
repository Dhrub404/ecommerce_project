from django.urls import path
from . import views
from .views import (
    ProductListView,
    ProductDetailView,
    CategoryListView,
    ProductCreateView,
    ProductUpdateView,
    ProductDeleteView,
)

urlpatterns = [
    # Public
    path('products/', ProductListView.as_view()),
    path('products/<int:pk>/', ProductDetailView.as_view()),
    path('products/<int:pk>/reviews/', views.createProductReview, name='create-review'),
    path('categories/', CategoryListView.as_view()),

    # Admin
    path('admin/products/create/', ProductCreateView.as_view()),
    path('admin/products/update/<int:pk>/', ProductUpdateView.as_view()),
    path('admin/products/delete/<int:pk>/', ProductDeleteView.as_view()),
]
