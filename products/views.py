from .models import Product
from .serializers import ProductSerializer
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from django.contrib.auth.models import User


class ProductViewSet(viewsets.ModelViewSet):
  queryset = Product.objects.all()
  serializer_class = ProductSerializer
  parser_classes = [MultiPartParser, FormParser]


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