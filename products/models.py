from django.db import models

# Create your models here.
class Product(models.Model):
  name = models.CharField(max_length=100)
  description = models.TextField()
  price = models.DecimalField(max_digits=16, decimal_places=2)
  image = models.ImageField(upload_to='product/', null=True,blank=True)
  created_at = models.DateField(auto_now_add=True)

  def __str__(self):
    return self.name