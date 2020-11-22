from rest_framework import serializers
from .models import Tasks, Project


class TasksSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tasks
        fields = ['task', 'id', 'assignedTo', 'status', 'project']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name','tasks']