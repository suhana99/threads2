from django.shortcuts import render,redirect
from products.models import *
from django.contrib.auth.decorators import login_required
from .models import Cart, Order
from django.contrib import messages
from  .forms import OrderForm
from django.urls import reverse
from django.views import View
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import CartSerializer, OrderSerializer
from django.shortcuts import get_object_or_404

from django.conf import settings
import stripe
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]  # ✅ Allow only authenticated users

    def post(self, request, product_id):
        user = request.user
        product = get_object_or_404(Product, id=product_id)

        # Check if the product is already in the cart
        if Cart.objects.filter(user=user, product=product).exists():
            return Response({"error": "Product is already in the cart."}, status=status.HTTP_400_BAD_REQUEST)

        # Add product to cart
        cart = Cart.objects.create(user=user, product=product)
        return Response({"message": "Product added to the cart successfully!"}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure only logged-in users access this
def show_cart_items_front(request):
    user = request.user
    items = Cart.objects.filter(user=user)
    
    serializer = CartSerializer(items, many=True)  # Serialize cart items
    return Response({"items": serializer.data})  # Return JSON response


class RemoveCartItemView(APIView):
    permission_classes = [IsAuthenticated]  

    def delete(self, request, cart_id):
        try:
            cart_item = Cart.objects.get(id=cart_id, user=request.user)
            cart_item.delete()
            return Response({"message": "Item removed successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Cart.DoesNotExist:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)


class UpdateCartView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, cart_id):
        """Update the quantity of a cart item"""
        cart_item = get_object_or_404(Cart, id=cart_id, user=request.user)
        new_quantity = request.data.get('quantity')

        if new_quantity and int(new_quantity) > 0:
            cart_item.quantity = int(new_quantity)
            cart_item.save()
            return Response({"message": "Quantity updated", "quantity": cart_item.quantity}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid quantity"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def checkout(request):
    user = request.user
    cart_items = Cart.objects.filter(user=user)

    if not cart_items:
        return Response({"error": "Your cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

    payment_method = request.data.get('payment_method')
    contact_no = request.data.get('contact_no')
    address = request.data.get('address')

    total_price = sum(item.product.product_price * item.quantity for item in cart_items)

    for cart_item in cart_items:
        Order.objects.create(
            product=cart_item.product,
            user=user,
            quantity=cart_item.quantity,
            total_price=cart_item.product.product_price * cart_item.quantity,
            payment_method=payment_method,
            contact_no=contact_no,
            address=address
        )
    
    cart_items.delete()  # Clear cart after checkout
    return Response({"message": "Order placed successfully", "total_price": total_price}, status=status.HTTP_201_CREATED)
      

@login_required
def order_form(request,product_id,cart_id):
    user=request.user
    product=Product.objects.get(id=product_id)
    cart_items=Cart.objects.get(id=cart_id)

    if request.method=="POST":
        form=OrderForm(request.POST)
        if form.is_valid():
            # quantity=request.POST.get('quantity')
            price=product.product_price
            # total_price=int(quantity)*int(price)
            contact_no=request.POST.get('contact_no')
            address=request.POST.get('address')
            payment_method=request.POST.get('payment_method')
            payment_status=request.POST.get('payment_status')


            #esma chai form create garera matra save garna milyo
            order=Order.objects.create(
                product=product,
                user=user,
                # quantity=quantity,
                # total_price=total_price,
                contact_no=contact_no,
                payment_method=payment_method,
                payment_status=payment_status
            )
            #models ma j cha tei naam
            if order.payment_method=='Cash on Delivery':
                cart_items.delete()
                messages.add_message(request,messages.SUCCESS,'order placed successfully')
                return redirect('/myorder')
            elif order.payment_method=='Esewa':
                return redirect(reverse('esewaform')+"?o_id="+str(order.id)+"&c_id="+str(cart_items.id))
            else:
                messages.add_message(request,messages.ERROR,'Failed to place order')
                return render(request,'users/orderform.html',{'form':form})

    context={
        'form':OrderForm
    }
    return render(request,'users/orderform.html',context)

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

@login_required
def my_order(request):
    user=request.user
    items=Order.objects.filter(user=user)
    context={
        'items':items
    }
    return render(request,'users/myorder.html',context)

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