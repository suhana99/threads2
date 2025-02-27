from rest_framework import serializers
from .models import Cart, Product, Order

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'product_name', 'product_image', 'product_price','stock']

class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer()  # Nested serializer

    class Meta:
        model = Cart
        fields = ['id', 'product','quantity']

class OrderSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'products', 'quantity', 'total_price', 'delivery_status',
            'payment_method', 'payment_status', 'contact_no', 'address', 'created_date'
        ]
        read_only_fields = ['id', 'total_price', 'delivery_status', 'payment_status', 'created_date']

    def create(self, validated_data):
        products_data = validated_data.pop('products')
        order = Order.objects.create(**validated_data)
        
        for product in products_data:
            order.products.add(product)  # Assuming a ManyToMany relationship
        return order
