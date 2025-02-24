from django.db import models
from products.models import Product
from django.contrib.auth.models import User
from django.core.validators import *
from django.core import validators

# Create your models here.
class Cart(models.Model):
    product=models.ForeignKey(Product,on_delete=models.CASCADE)
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    created_date=models.DateTimeField(auto_now_add=True)

class Order(models.Model):
    PAYMENT=(
        ('Cash on Delivery', 'Cash on delivery'),
        ('Esewa','Esewa'), #one for user, one for database
        ('Stripe','Stripe')
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True) 
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    quantity=models.IntegerField(default=1)
    total_price=models.IntegerField()
    delivery_status=models.CharField(default='Pending', max_length=100)
    payment_method=models.CharField(max_length=100,choices=PAYMENT)
    payment_status=models.BooleanField(default=False,null=True)
    contact_no=models.CharField(validators=[MinLengthValidator(9),MaxLengthValidator(10)], max_length=10)
    address=models.CharField(max_length=200)
    created_date=models.DateTimeField(auto_now_add=True)

