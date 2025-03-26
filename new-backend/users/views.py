from django.shortcuts import render,redirect
from products.models import *
from django.contrib.auth.decorators import login_required
from .models import Cart, Order, OrderItem,  CartItem
from django.contrib import messages
from  .forms import OrderForm
from django.urls import reverse
from django.views import View
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer
from django.shortcuts import get_object_or_404

from django.conf import settings
import stripe
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]  

    def post(self, request, product_id):
        """ Add a product to the user's cart """
        user = request.user
        product = get_object_or_404(Product, id=product_id)

        # Get or create a cart for the user
        cart, _ = Cart.objects.get_or_create(user=user)

        # Get or create cart item
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not created:
            return Response({"error": "Product is already in the cart."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Product added to the cart successfully!"}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def show_cart_items_front(request):
    """ Show all cart items for the logged-in user """
    user = request.user
    cart = Cart.objects.filter(user=user).first()

    if not cart or not cart.items.exists():
        return Response({"message": "Your cart is empty"}, status=status.HTTP_200_OK)

    cart_items = cart.items.select_related('product')  # Optimize query
    serializer = CartItemSerializer(cart_items, many=True)  

    return Response({"items": serializer.data})


class RemoveCartItemView(APIView):
    permission_classes = [IsAuthenticated]  

    def delete(self, request, cart_item_id):
        """ Remove an item from the cart """
        cart_item = get_object_or_404(CartItem, id=cart_item_id, cart__user=request.user)
        cart_item.delete()
        return Response({"message": "Item removed successfully"}, status=status.HTTP_200_OK)


class UpdateCartView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, cart_item_id):
        """ Update the quantity of a cart item """
        cart_item = get_object_or_404(CartItem, id=cart_item_id, cart__user=request.user)
        new_quantity = request.data.get('quantity')

        if new_quantity and int(new_quantity) > 0:
            cart_item.quantity = int(new_quantity)
            cart_item.save()
            return Response({"message": "Quantity updated", "quantity": cart_item.quantity}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid quantity"}, status=status.HTTP_400_BAD_REQUEST)


from django.db import transaction

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkout(request):
    """ Handle order checkout """
    user = request.user
    # Get products and quantities from the request data
    products = request.data.get('products')
    quantities = request.data.get('quantities')

    # Ensure products and quantities are provided and match
    if not products or not quantities or len(products) != len(quantities):
        return Response({"error": "Invalid data. Products and quantities must be provided and match."}, status=status.HTTP_400_BAD_REQUEST)

    # Calculate total price
    total_price = 0
    order_items = []
    cart_items_to_remove = []

    for product_id, quantity in zip(products, quantities):
        product = get_object_or_404(Product, id=product_id)
        if quantity <= 0:
            return Response({"error": "Quantity must be greater than 0"}, status=status.HTTP_400_BAD_REQUEST)
        
        product_price = product.product_price
        total_price += product_price * quantity
        order_price = quantity * product_price
        # Add order items for the order
        order_items.append({
            'product': product,
            'quantity': quantity,
            'unit_price': product_price,
            'order_price': order_price
        })

        # Add the cart item to the removal list
        cart_item = CartItem.objects.filter(cart__user=user, product=product).first()
        if cart_item:
            cart_items_to_remove.append(cart_item)

    payment_method = request.data.get('payment_method')
    contact_no = request.data.get('contact_no')
    address = request.data.get('address')

    # Create Order
    order = Order.objects.create(
        user=user,
        total_price=total_price,
        payment_method=payment_method,
        contact_no=contact_no,
        address=address
    )

    # Create Order Items from the order items data
    order_item_objects = [
        OrderItem(
            order=order,
            product=order_item['product'],
            quantity=order_item['quantity'],
            unit_price=order_item['unit_price'],
            order_price=order_item['order_price']
        )
        for order_item in order_items
    ]
    OrderItem.objects.bulk_create(order_item_objects)  # Bulk insert

    # Update product stock
    for order_item in order_items:
        product = order_item['product']
        new_stock = product.stock - order_item['quantity']
        if new_stock < 0:
            return Response({"error": f"Not enough stock for {product.product_name}"}, status=status.HTTP_400_BAD_REQUEST)
        
        product.stock = new_stock
        product.save()

    # Remove cart items that were ordered
    if cart_items_to_remove:
        CartItem.objects.filter(id__in=[item.id for item in cart_items_to_remove]).delete()

    return Response({
        "message": "Order placed successfully",
        "order_id": order.id,
        "total_price": total_price
    }, status=status.HTTP_201_CREATED)


import hmac
import hashlib
import uuid #to generate random string
import base64

class EsewaView(View):
    def get(self,request,*args,**kwargs):
        o_id=request.GET.get('o_id')
        c_id=request.GET.get('c_id')
        cart=Cart.objects.get(id=c_id)
        order=Order.objects.get(id=o_id)

        uuid_val=uuid.uuid4()

        def genSha256(key,message):
            key=key.encode('utf-8')
            message=message.encode('utf-8')
            hmac_sha256=hmac.new(key,message,hashlib.sha256)

            digest=hmac_sha256.digest()

            signature=base64.b64encode(digest).decode('utf-8')
            return signature
        
        secret_key='8gBm/:&EnhH.1/q'
        data_to_assign=f"total_amount={order.total_price},transaction_uuid={uuid_val},product_code=EPAYTEST"

        result=genSha256(secret_key,data_to_assign)

        data={
            'amount':order.product.product_price,
            'total_amount':order.total_price,
            'transaction_uuid':uuid_val,
            'product_code':'EPAYTEST',
            'signature':result
        }
        context={
            'order':order,
            'data':data,
            'cart':cart
        }
        return render(request,'users/esewaform.html',context)
    

import json
@login_required
def esewa_verify(request,order_id,cart_id):
    if request.method=="GET":
        data=request.GET.get('data')
        decoded_data=base64.b64decode(data).decode()
        map_data=json.loads(decoded_data)
        order=Order.objects.get(id=order_id)
        cart=Cart.objects.get(id=cart_id)

        if map_data.get('status')=='COMPLETE':
            order.payment_status=True
            order.save()
            cart.delete()
            messages.add_message(request,messages.SUCCESS,'Payment successful.')
            return redirect('/myorder')
        
        else:
            messages.add_message(request,messages.ERROR,'Failed to make payment')
            return redirect('/myorder')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_order_api(request):
    user = request.user
    orders = Order.objects.filter(user=user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)



import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import stripe
import logging
from .models import Order, Product  # Ensure your models are imported

stripe.api_key = settings.STRIPE_SECRET_KEY




@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.headers.get("Stripe-Signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        return JsonResponse({"error": str(e)}, status=400)
    except stripe.error.SignatureVerificationError as e:
        return JsonResponse({"error": str(e)}, status=400)

    # Handle the checkout.session.completed event
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        order_id = session["metadata"].get("order_id")
        if order_id:
            order = Order.objects.get(id=order_id)
            order.payment_status = True
            order.save()

    return JsonResponse({"status": "success"})