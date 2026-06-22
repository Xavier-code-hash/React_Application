from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
  ProductViewSet,
  OrderViewSet,
  ExpenseViewSet,
  RegisterAPIView,
  LoginAPIView,
  UserAPIView,
  LogoutAPIView,
  OrderStatusAPIView,
  DashboardAPIView,
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'expenses', ExpenseViewSet, basename='expense')

urlpatterns = [
	path('auth/register/', RegisterAPIView.as_view(), name='register'),
	path('auth/login/', LoginAPIView.as_view(), name='login'),
	path('auth/user/', UserAPIView.as_view(), name='user'),
	path('auth/logout/', LogoutAPIView.as_view(), name='logout'),
	path('orders/check/', OrderStatusAPIView.as_view(), name='order-check'),
	path('dashboard/', DashboardAPIView.as_view(), name='dashboard'),
]

urlpatterns += router.urls