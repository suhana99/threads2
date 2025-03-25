from django.db import models
from products.models import Product
from django.contrib.auth.models import User
from django.core.validators import *
from django.core import validators
from django.core.validators import MinValueValidator


# Create your models here.
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1,validators=[MinValueValidator(1)])

    def get_total_price(self):
        return self.product.product_price * self.quantity



class Order(models.Model):
    PAYMENT = (
        ('Cash on Delivery', 'Cash on delivery'),
        ('Esewa', 'Esewa'),
        ('Stripe', 'Stripe')
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_price = models.IntegerField()
    delivery_status = models.CharField(default='Pending', max_length=100)
    payment_method = models.CharField(max_length=100, choices=PAYMENT)
    payment_status = models.BooleanField(default=False, null=True)
    contact_no = models.CharField(validators=[MinLengthValidator(9), MaxLengthValidator(10)], max_length=10)
    address = models.CharField(max_length=200)
    created_date = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.IntegerField()  # Store product price at the time of order

