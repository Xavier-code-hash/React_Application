from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Count, Sum
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.authtoken.models import Token
from .models import Product, Order, Expense
from .serializers import (
  ProductSerializer,
  OrderSerializer,
  ExpenseSerializer,
  RegisterSerializer,
  LoginSerializer,
  UserSerializer,
)


class ProductViewSet(viewsets.ModelViewSet):
  queryset = Product.objects.all()
  serializer_class = ProductSerializer
  parser_classes = [MultiPartParser, FormParser]


class OrderViewSet(viewsets.ModelViewSet):
  queryset = Order.objects.select_related('product').all().order_by('-created_at')
  serializer_class = OrderSerializer

  def perform_create(self, serializer):
    order = serializer.save()
    if not order.total_price:
      order.total_price = order.product.price * order.quantity
      order.save()


class ExpenseViewSet(viewsets.ModelViewSet):
  queryset = Expense.objects.select_related('related_order').all().order_by('-created_at')
  serializer_class = ExpenseSerializer


class RegisterAPIView(APIView):
  def post(self, request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
      user = serializer.save()
      token, _ = Token.objects.get_or_create(user=user)
      user_data = UserSerializer(user).data
      response = Response({"user": user_data}, status=status.HTTP_201_CREATED)
      response.set_cookie('auth_token', token.key, httponly=True, samesite='Lax')
      return response

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
  def post(self, request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data.get('email')
    password = serializer.validated_data.get('password')

    user = authenticate(username=email, password=password)
    if user is None:
      return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    user_data = UserSerializer(user).data
    response = Response({"user": user_data}, status=status.HTTP_200_OK)
    response.set_cookie('auth_token', token.key, httponly=True, samesite='Lax')
    return response


class UserAPIView(APIView):
  def get(self, request):
    token_key = request.COOKIES.get('auth_token')
    if not token_key:
      return Response({"detail": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
      token = Token.objects.get(key=token_key)
      user = token.user
      user_data = UserSerializer(user).data
      return Response({"user": user_data}, status=status.HTTP_200_OK)
    except Token.DoesNotExist:
      return Response({"detail": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutAPIView(APIView):
  def post(self, request):
    token_key = request.COOKIES.get('auth_token')
    response = Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
    if token_key:
      Token.objects.filter(key=token_key).delete()
    # remove cookie
    response.delete_cookie('auth_token')
    return response


class OrderStatusAPIView(APIView):
  def get(self, request):
    order_id = request.query_params.get('order_id')
    if not order_id:
      return Response({"detail": "order_id query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
      order = Order.objects.select_related('product').get(pk=order_id)
      serializer = OrderSerializer(order)
      return Response(serializer.data, status=status.HTTP_200_OK)
    except Order.DoesNotExist:
      return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)


class DashboardAPIView(APIView):
  def get(self, request):
    order_stats = Order.objects.aggregate(
      total_orders=Sum('quantity'),
      total_revenue=Sum('total_price'),
    )
    expense_stats = Expense.objects.aggregate(total_expenses=Sum('amount'))

    totals = {
      'total_products': Product.objects.count(),
      'total_orders': order_stats['total_orders'] or 0,
      'total_revenue': float(order_stats['total_revenue'] or 0),
      'total_expenses': float(expense_stats['total_expenses'] or 0),
      'pending_orders': Order.objects.filter(status=Order.STATUS_PENDING).count(),
      'confirmed_orders': Order.objects.filter(status=Order.STATUS_CONFIRMED).count(),
      'shipped_orders': Order.objects.filter(status=Order.STATUS_SHIPPED).count(),
      'delivered_orders': Order.objects.filter(status=Order.STATUS_DELIVERED).count(),
    }
    return Response(totals, status=status.HTTP_200_OK)
