from rest_framework import serializers
from .models import Cart, Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'product_name', 'product_image', 'product_price']

class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer()  # Nested serializer

    class Meta:
        model = Cart
        fields = ['id', 'product']
