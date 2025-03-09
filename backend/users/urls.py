from django.urls import path
from .views import *
urlpatterns=[
    path("carts/add/<int:product_id>/", AddToCartView.as_view(), name="add_to_cart"),
    path('carts/',show_cart_items_front),
    path("carts/<int:cart_id>/", RemoveCartItemView.as_view(), name="remove_cart_item"),
    path('orderform/<int:product_id>/<int:cart_id>',order_form),
    path('esewaform/',EsewaView.as_view(),name='esewaform'),
    path('esewaverify/<int:order_id>/<int:cart_id>',esewa_verify),
    path('myorder/',my_order),
    path('cart/update/<int:cart_id>/', UpdateCartView.as_view(), name='update-cart'),
    path('checkout/', checkout, name='checkout'),
    path("stripe-webhook/", stripe_webhook, name="stripe_webhook"),
]

