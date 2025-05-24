from django.db import models
from django.contrib.auth.models import User


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default='#FF0000')
    def __str__(self):
        return self.name

class Depense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    date = models.DateField(auto_now_add=True)
    tags = models.ManyToManyField(Tag)
    def __str__(self):
        return f"{self.description} - {self.amount} €"
