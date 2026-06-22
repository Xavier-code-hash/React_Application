from rest_framework.routers import DefaultRouter
from .views import ProductViewSet
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
from .views import RegisterAPIView, LoginAPIView, UserAPIView, LogoutAPIView
from django.urls import path

urlpatterns = [
	path('auth/register/', RegisterAPIView.as_view(), name='register'),
	path('auth/login/', LoginAPIView.as_view(), name='login'),
	path('auth/user/', UserAPIView.as_view(), name='user'),
	path('auth/logout/', LogoutAPIView.as_view(), name='logout'),
]

urlpatterns += router.urls