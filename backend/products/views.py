from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Product,Category
from .forms import ProductForm,CategoryForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from users.auth import admin_only
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework import generics, status,serializers
from rest_framework.filters import SearchFilter,OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import *
from .filters import *
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAdminUser,IsAuthenticatedOrReadOnly


class ProductPagination(PageNumberPagination):
    page_size = 4  # Number of items per page
    page_size_query_param = 'page_size'  # Allow clients to set the page size via query parameter
    max_page_size = 100  # Set a maximum limit for page size


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(stock__gt=1)
    serializer_class = ProductSerializer
    filter_backends = [SearchFilter,OrderingFilter,DjangoFilterBackend]
    filterset_class=ProductFilter
    search_fields = ['id','max_price','min_price','category'] 
    print("list",Product.objects.all())


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get(self, request, *args, **kwargs):
        print("Fetching product:", kwargs['pk'])
        return super().get(request, *args, **kwargs)

class CreateProductView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]


from rest_framework.response import Response

class ProductDetailAPIView(APIView):
    """
    This view handles POST requests to fetch a product by its ID.
    """

    def post(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')  # Expecting 'product_id' in the POST body
        if not product_id:
            return Response({'error': 'product ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the product or return 404 if not found
        product = get_object_or_404(Product, id=product_id, availability=True)
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Review Views
class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return Review.objects.filter(product_id=product_id)

    def perform_create(self, serializer):
        product = Product.objects.get(id=self.kwargs['product_id'])
        serializer.save(product=product, user=self.request.user)


class ProductReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Allow read-only for non-authenticated users

    def get_queryset(self):
        product = self.kwargs['product_id']
        return Review.objects.filter(product_id=product)

    def perform_create(self, serializer):
        product = Product.objects.get(id=self.kwargs['product_id'])
        # Automatically assign the logged-in user to the review and the product
        serializer.save(user=self.request.user, product_id=product)

class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Ensure that only the review posted by the logged-in user is editable or deletable
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied("You are not allowed to edit or delete this review.")
        return obj

    def perform_update(self, serializer):
        # Allow updating the review
        serializer.save()

    def perform_destroy(self, instance):
        # Allow deleting the review
        instance.delete()

@login_required
@admin_only
def index(request):
    #fetch data from the table
    products=Product.objects.all()
    context={
        'products':products
    }
    return render(request,'products/products.html',context)

@login_required
@admin_only
def post_product(request):
    if request.method=="POST":
        form=ProductForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.add_message(request,messages.SUCCESS,'Product added successfully.')
            return redirect('/products/addproduct')
        else:
            messages.add_message(request,messages.ERROR,'failed to add product.')
            return render(request,'/products/addproduct.html',{'form':form})
    context={
        'form':ProductForm
    }
    return render(request,'products/addproduct.html',context)

@login_required
@admin_only
def update_product(request,product_id):
    instance=Product.objects.get(id=product_id)

    if request.method=="POST":
        form=ProductForm(request.POST, request.FILES,instance=instance)
        if form.is_valid():
            form.save()
            messages.add_message(request,messages.SUCCESS,'Product updated successfully.')
            return redirect('/products/')
        else:
            messages.add_message(request,messages.ERROR,'failed to update product.')
            return render(request,'/products/updateproduct.html',{'form':form})
    context={
        'form':ProductForm(instance=instance)
    }
    return render(request,'products/updateproduct.html',context)

@login_required
@admin_only
def delete_product(request,product_id):
    product=Product.objects.get(id=product_id)
    product.delete()
    messages.add_message(request,messages.SUCCESS,'Products deleted.')
    return redirect('/products')

@login_required
@admin_only
def post_category(request):
    if request.method=="POST":
        form=CategoryForm(request.POST)
        if form.is_valid():
            form.save()
            messages.add_message(request,messages.SUCCESS,'Category added successfully.')
            return redirect('/products/addcategory')
        else:
            messages.add_message(request,messages.ERROR,'failed to add category.')
            return render(request,'products/addcategory.html',{'form':form})
    context={
        'form':CategoryForm
    }
    return render(request,'products/addcategory.html',context)

@login_required
@admin_only
def show_category(request):
    #fetch data from the table
    categories=Category.objects.all()
    context={
        'categories':categories
    }
    return render(request,'products/category.html',context)

@login_required
@admin_only
def update_category(request,category_id):
    instance=Category.objects.get(id=category_id)

    if request.method=="POST":
        form=CategoryForm(request.POST,instance=instance)
        if form.is_valid():
            form.save()
            messages.add_message(request,messages.SUCCESS,'Category updated successfully.')
            return redirect('/products/categories')
        else:
            messages.add_message(request,messages.ERROR,'failed to update category.')
            return render(request,'products/updatecategory.html',{'form':form})
    context={
        'form':CategoryForm(instance=instance)
    }
    return render(request,'products/updatecategory.html',context)

@login_required
@admin_only
def delete_category(request,category_id):
    category=Category.objects.get(id=category_id)
    category.delete()
    messages.add_message(request,messages.SUCCESS,'Category deleted.')
    return redirect('/products/categories')
