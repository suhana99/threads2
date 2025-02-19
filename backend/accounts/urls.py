from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *
urlpatterns=[
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("front-register/", api_register, name="api_register"),
    path("front-login/", api_login, name="api_login"),
    path('register/',register_user),
    path('login/',login_form),
    path('logout/',logout_user)
]