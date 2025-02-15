from rest_framework import serializers
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
    class Meta:
        model=Product
        fields='__all__'