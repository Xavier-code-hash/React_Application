from django.db import models

class Product(models.Model):
  name = models.CharField(max_length=100)
  description = models.TextField()
  price = models.DecimalField(max_digits=16, decimal_places=2)
  image = models.ImageField(upload_to='product/', null=True, blank=True)
  created_at = models.DateField(auto_now_add=True)

  def __str__(self):
    return self.name


class Order(models.Model):
  STATUS_PENDING = 'PENDING'
  STATUS_CONFIRMED = 'CONFIRMED'
  STATUS_SHIPPED = 'SHIPPED'
  STATUS_DELIVERED = 'DELIVERED'
  STATUS_CANCELLED = 'CANCELLED'

  STATUS_CHOICES = [
    (STATUS_PENDING, 'Pending'),
    (STATUS_CONFIRMED, 'Confirmed'),
    (STATUS_SHIPPED, 'Shipped'),
    (STATUS_DELIVERED, 'Delivered'),
    (STATUS_CANCELLED, 'Cancelled'),
  ]

  product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='orders')
  quantity = models.PositiveIntegerField(default=1)
  customer_name = models.CharField(max_length=120)
  customer_email = models.EmailField()
  total_price = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def save(self, *args, **kwargs):
    if self.product and self.quantity and not self.total_price:
      self.total_price = self.product.price * self.quantity
    super().save(*args, **kwargs)

  def __str__(self):
    return f"Order #{self.id} - {self.product.name} x{self.quantity}"


class Expense(models.Model):
  CATEGORY_PURCHASE = 'PURCHASE'
  CATEGORY_SHIPPING = 'SHIPPING'
  CATEGORY_STAFF = 'STAFF'
  CATEGORY_OTHER = 'OTHER'

  CATEGORY_CHOICES = [
    (CATEGORY_PURCHASE, 'Product Purchase'),
    (CATEGORY_SHIPPING, 'Shipping'),
    (CATEGORY_STAFF, 'Staff'),
    (CATEGORY_OTHER, 'Other'),
  ]

  title = models.CharField(max_length=120)
  category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default=CATEGORY_OTHER)
  amount = models.DecimalField(max_digits=16, decimal_places=2)
  description = models.TextField(blank=True)
  related_order = models.ForeignKey(Order, null=True, blank=True, on_delete=models.SET_NULL, related_name='expenses')
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"{self.title} ({self.category}) - {self.amount}"
