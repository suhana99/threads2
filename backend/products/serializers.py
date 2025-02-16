from rest_framework import serializers
from django.conf import settings
from .models import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields='__all__'



class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Review
        fields ='__all__'  # Only rating and comment will be submitted by the user
        read_only_fields = ['user','product']
        extra_kwargs = {'rating': {'required': True}, 'comment': {'required': True}}

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category_name', read_only=True)
    product_image = serializers.SerializerMethodField()

    class Meta:
        model=Product
        fields=['id', 'product_name', 'category', 'category_name','stock','product_price','product_description','product_image',]

    def get_product_image(self, obj):
        if obj.product_image:
            return f"{settings.MEDIA_URL}{obj.product_image}"
        return None