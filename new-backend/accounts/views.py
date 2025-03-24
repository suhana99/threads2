from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.contrib import messages
from .forms import LoginForm
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def api_register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Parse JSON data from frontend
            form = UserCreationForm({
                "username": data.get("username"),
                "password1": data.get("password1"),
                "password2": data.get("password2"),
            })

            if form.is_valid():
                form.save()
                return JsonResponse({"message": "Account Created Successfully!"}, status=200)
            else:
                return JsonResponse({"error": form.errors}, status=400)  # Return form errors

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


import json
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(["POST"])
@permission_classes([AllowAny])  # Allows anyone to access this view (no auth required)
def front_login(request):
    try:
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)  # Generate JWT tokens
            return Response({
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "is_admin": user.is_superuser
                },
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            })
        else:
            return Response({"error": "Invalid credentials"}, status=400)

    except Exception as e:
        return Response({"error": str(e)}, status=500)




# Create your views here.
def register_user(request):
    if request.method=='POST':
        form=UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.add_message(request,messages.SUCCESS,'Account Created.')
            return redirect('/register')
        else:
            messages.add_message(request,messages.ERROR,'failed to create account ')
            return render(request,'accounts/register.html',{'form':form})
    context={
        'form': UserCreationForm
    }
    return render(request,'accounts/register.html',context)

@csrf_exempt
def login_form(request):
    if request.method=='POST':
        form=LoginForm(request.POST)
        if form.is_valid():
            data=form.cleaned_data
            user=authenticate(request,username=data['username'],password=data['password'])
            if user is not None:
                login(request,user)
                if user.is_staff:
                    return redirect('/admins/dashboard')
                else:
                    return redirect('/')
            else:
                messages.add_message(request,messages.ERROR,'please provide valid credentials')
                return  render(request,'accounts/login.html',{'form':form})
    context={
        'form':LoginForm
    }
    return render(request,'accounts/login.html',context)

def logout_user(request):
    logout(request)
    return redirect('/login')