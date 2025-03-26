from rest_framework import serializers
from .models import Cart, Product, Order, CartItem, OrderItem

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'product_name', 'product_image', 'product_price','stock']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()  # Nest product details inside each cart item
    product_id = serializers.IntegerField(source='product.id', read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)  # Serialize cart items

    class Meta:
        model = Cart
        fields = ['id', 'items']  # Return cart with list of items

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()  # Nest product details inside each order item
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    product_image = serializers.ImageField(source='product.product_image', read_only=True)
    product_id = serializers.IntegerField(source='product.id', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product','product_id', 'quantity', 'unit_price','product_name','product_image']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)  # Serialize order items

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'items', 'total_price', 'delivery_status',
            'payment_method', 'payment_status', 'contact_no', 'address', 'created_date'
        ]
        read_only_fields = ['id', 'total_price', 'delivery_status', 'payment_status', 'created_date']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order