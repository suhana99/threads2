from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):  # Inline for OrderItem
    model = OrderItem
    extra = 1  # Allows adding additional items in the order admin
    fields = ('product', 'quantity', 'price')
    readonly_fields = ('price',)  # Ensure price stays unchanged

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'payment_method', 'contact_no', 'address', 'created_date', 'delivery_status')
    search_fields = ('user__username', 'payment_method', 'contact_no', 'address')
    list_filter = ('payment_method', 'created_date', 'delivery_status')
    inlines = [OrderItemInline]  # Embed OrderItems in OrderAdmin

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')
    search_fields = ('order__user__username', 'product__name')

