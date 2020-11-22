from django.db import models
from users.models import AppUser

# Create your models here.
from django.core.validators import validate_comma_separated_integer_list

status = (

    ('Assigned', 'Assigned'),
    ('started', 'Started'),
    ('Ended', 'Ended'),
    ('In Review', 'In Review'),
    ('Completed', 'Completed'),
    ('Not Completed', 'Not Completed'),
)

class Project(models.Model):
    name = models.CharField(max_length=30)
    tasks= models.CharField(max_length=255, validators=[validate_comma_separated_integer_list], null=True,
                     default=None)



class Tasks(models.Model):
    task = models.CharField(max_length=30)
    assignedTo = models.ForeignKey(AppUser, related_name='+', on_delete=models.CASCADE)
    project = models.ForeignKey(Project, related_name='+', on_delete=models.CASCADE, default=None, null=True, unique=False)
    status = models.CharField(default=False, max_length=128, choices=status)
