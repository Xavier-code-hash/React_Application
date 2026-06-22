from rest_framework import serializers
from .models import Product, Order, Expense
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['id', 'username', 'email', 'first_name']


class RegisterSerializer(serializers.Serializer):
  fullName = serializers.CharField(required=False, allow_blank=True)
  phoneNumber = serializers.CharField(required=False, allow_blank=True, max_length=12)
  email = serializers.EmailField()
  password = serializers.CharField(write_only=True)
  confirmPassword = serializers.CharField(write_only=True)

  def validate(self, data):
    if data.get('password') != data.get('confirmPassword'):
      raise serializers.ValidationError({
        'confirmPassword': 'Passwords do not match.'
      })
    return data

  def create(self, validated_data):
    full_name = validated_data.get('fullName') or validated_data['email']
    email = validated_data['email']
    password = validated_data['password']

    user = User.objects.create_user(
      username=email,
      email=email,
      password=password,
      first_name=full_name,
    )
    return user


class LoginSerializer(serializers.Serializer):
  email = serializers.EmailField()
  password = serializers.CharField(write_only=True)
  
class ProductSerializer(serializers.ModelSerializer):
  class Meta:
    model = Product
    fields = '__all__'
    read_only_fields = ['id', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
  product_name = serializers.CharField(source='product.name', read_only=True)

  class Meta:
    model = Order
    fields = [
      'id',
      'product',
      'product_name',
      'quantity',
      'customer_name',
      'customer_email',
      'total_price',
      'status',
      'created_at',
      'updated_at',
    ]
    read_only_fields = ['id', 'total_price', 'created_at', 'updated_at']


class ExpenseSerializer(serializers.ModelSerializer):
  related_order_id = serializers.IntegerField(source='related_order.id', read_only=True)

  class Meta:
    model = Expense
    fields = [
      'id',
      'title',
      'category',
      'amount',
      'description',
      'related_order',
      'related_order_id',
      'created_at',
    ]
    read_only_fields = ['id', 'created_at', 'related_order_id']