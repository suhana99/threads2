from django.urls import path
# from .views import test
# from .import test 
from .views import *
from . import views

urlpatterns = [
    path('',index),
    path('addproduct/',post_product),
    path('updateproduct/<int:product_id>',update_product),
    path('deleteproduct/<int:product_id>',delete_product),
    path('addcategory/',post_category),
    path('categories/',show_category),
    path('updatecategory/<int:category_id>',update_category),
    path('deletecategory/<int:category_id>',delete_category),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/create/', CreateProductView.as_view(), name='create-product'),
    path('products/recommend/',ProductDetailAPIView.as_view(),name='product_filter'),
    path('products/<int:product_id>/reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('products/<int:product_id>/reviews/<int:pk>/', ReviewDetailView.as_view(), name='product-reviews-detail'),
    path('products/categories/', CategoryListView.as_view(), name='category-list'),
]