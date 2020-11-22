from rest_framework.views import Response
from rest_framework import viewsets
from rest_framework import permissions
from .models import Tasks, Project
from .serializers import TasksSerializer, ProjectSerializer
from django.contrib.auth.decorators import permission_required
from django.utils.decorators import method_decorator
from rest_framework.decorators import action


@method_decorator(permission_required('common.list_tasks', raise_exception=True), name='list')
@method_decorator(permission_required('common.add_tasks', raise_exception=True), name='create')
@method_decorator(permission_required('common.change_tasks', raise_exception=True), name='update')
@method_decorator(permission_required('common.delete_tasks', raise_exception=True), name='destroy')
class TasksViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Tasks.objects.all()
    serializer_class = TasksSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        response = super(TasksViewSet, self).create(request=request, *args, **kwargs)
        projects_data = Project.objects.get(id=response.data['project'])
        task_updated = projects_data.tasks
        if task_updated is not None:
            tasks_to_add = task_updated.split(',')
        else:
            tasks_to_add = []
        tasks_to_add.append(response.data['id'])
        add_on = ','.join(map(str, tasks_to_add))
        projects_data.tasks = add_on
        projects_data.save()
        return Response(response.data)

    def list(self, request, *args, **kwargs):
        records = self.serializer_class(self.queryset, context={'request': request}, many=True).data
        total_records = self.queryset.count()
        for record in records:
            projects = Project.objects.get(id=record['project'])
            a = ProjectSerializer(projects).data
            record['project'] = a
        return Response({'records': records, 'totalRecords': total_records})

    @action(methods=['get'], url_path='usertask', detail=False)
    def usertask(self, request):
        tasks = self.queryset.filter(assignedTo=request.user.id)
        records = self.serializer_class(tasks, context={'request': request}, many=True).data
        total_records = tasks.count()
        for record in records:
            projects = Project.objects.get(id=record['project'])
            a = ProjectSerializer(projects).data
            record['project'] = a
        return Response({'records': records, 'totalRecords': total_records})

    @action(methods=['post'], url_path='update-status', detail=False)
    def update_status(self, request):

        update_data = request.data
        task = self.queryset.get(id=update_data['task_id'])
        task.status =update_data['status']
        task.save()
        return Response(True)


@method_decorator(permission_required('common.list_project', raise_exception=True), name='list')
@method_decorator(permission_required('common.add_project', raise_exception=True), name='create')
@method_decorator(permission_required('common.change_project', raise_exception=True), name='update')
@method_decorator(permission_required('common.delete_project', raise_exception=True), name='destroy')
class ProjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    # permission_classes = [permissions.IsAuthenticated]


    def list(self, request, *args, **kwargs):
        records = self.serializer_class(self.queryset, context={'request': request}, many=True).data
        total_records = self.queryset.count()

        for record in records:
            tasks = Tasks.objects.filter(project=record['id'])
            final_task = []
            if tasks.count() != 0:
                for task in tasks:
                    a = TasksSerializer(task).data
                    final_task.append(a)
            else:
                final_task = None
            record['tasks'] = final_task
        return Response({'records': records, 'totalRecords': total_records})