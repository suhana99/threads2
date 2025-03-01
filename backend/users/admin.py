from django.contrib import admin

from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'quantity', 'total_price', 'payment_method', 'contact_no', 'address', 'created_date')
    search_fields = ('user__username', 'product__name', 'payment_method', 'contact_no', 'address')
    list_filter = ('payment_method', 'created_date')


# Register your models here.
