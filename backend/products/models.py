from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.
class Category(models.Model):
     category_name=models.CharField(max_length=100,unique=True)
     created_at=models.DateTimeField(auto_now_add=True)

     def __str__(self):
         return self.category_name



class Product(models.Model):
    product_name=models.CharField(max_length=100)
    product_price=models.FloatField()
    stock=models.IntegerField()
    product_description=models.TextField()
    product_image = models.FileField(upload_to='uploads/', null=True) 
    created_at=models.DateTimeField(auto_now_add=True)
    category=models.ForeignKey(Category,on_delete=models.CASCADE,null=True)

    def __str__(self):
         return self.product_name
 
    
class   Review(models.Model):
    product = models.ForeignKey(
        Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    comment = models.TextField()
    date_added = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Review by {self.user.username} for {self.product.product_name}"