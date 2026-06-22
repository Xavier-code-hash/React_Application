from rest_framework import serializers
from .models import Product
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
      username=full_name,
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