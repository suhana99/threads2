from django.urls import path
from .views import *
urlpatterns=[
    path('',index),
    path('productlist/',products),
    path('productdetail/<int:product_id>',productdetail),
    path('mens/',mens),
    path('accessories/',accessories),
    path('women/',women),
    path('kids/',kids),
    path('shoes/',shoes),
    path('addtocart/<int:product_id>',add_to_cart),
    path("carts/add/<int:product_id>/", AddToCartView.as_view(), name="add_to_cart"),
    path('carts/',show_cart_items_front),
    path('cart/',show_cart_items),
    path('removecart/<int:cart_id>',remove_cart_item),
    path("carts/<int:cart_id>/", RemoveCartItemView.as_view(), name="remove_cart_item"),
    path('orderform/<int:product_id>/<int:cart_id>',order_form),
    path('esewaform/',EsewaView.as_view(),name='esewaform'),
    path('esewaverify/<int:order_id>/<int:cart_id>',esewa_verify),
    path('myorder/',my_order),

    path('cart/update/<int:cart_id>/', UpdateCartView.as_view(), name='update-cart'),
    path('checkout/', checkout, name='checkout'),

    path("stripe-webhook/", stripe_webhook, name="stripe_webhook"),
]

