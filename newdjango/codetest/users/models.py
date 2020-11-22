from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from django.conf import settings

# Create your models here.
USER_TYPE_CHOICES = (
    ('AA', 'AppAdin'),
    ('A', 'Admin'),
    ('D', 'Developer'),
    ('M', 'Manager'),
)

class AppUser(AbstractUser):
    pass


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name='profile', on_delete=models.CASCADE)
    user_type = models.CharField(max_length=5, choices=USER_TYPE_CHOICES)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='created_by', on_delete=models.CASCADE)


class Roles(models.Model):
    group = models.OneToOneField(Group, related_name='details', on_delete=models.CASCADE)
    alias = models.CharField(max_length=50)
    created_by = models.ForeignKey(AppUser, to_field='id', null=True, on_delete=models.CASCADE)
    accesses = models.TextField(null=True)
    description = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    is_active=models.BooleanField(default=1)


