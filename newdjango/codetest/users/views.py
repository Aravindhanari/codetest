from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import UserSerializer, GroupSerializer
from .models import AppUser
from .defaults import AppDefaults
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import permission_required
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.decorators import action
from .models import USER_TYPE_CHOICES


def jwt_response_payload_handler(token, user=None, request=None):
    """ Modifying jwt login response details """
    user_details = UserSerializer(user, context={'request': request}).data

    """ Fetching assigned accesses for the use """
    user_details['accesses'] = list()
    user_details['customer_accesses'] = list()

    if user.is_superuser:
        user_details['accesses'] = AppDefaults.get_predefined_role_access_specifiers('Admin')
    else:
        access_joined = user.groups.all().values_list('details__accesses', flat=True)
        for string in access_joined:
            if string is not None:
                user_details['accesses'] += string.split(',')
        user_details['accesses'] = list(set(user_details['accesses']))

    # if user.profile.user_type == 'P' or user.is_superuser:
    #     user_details['customer_accesses'] = AppDefaults.get_predefined_role_access_specifiers('Portal_Customer')

    user_details['accesses'] = sorted(user_details['accesses'])
    user_details['customer_accesses'] = sorted(user_details['customer_accesses'])

    return {
        'token': token,
        'user': user_details
    }


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    # permission_classes = (permissions.IsAuthenticated,)
    queryset = AppUser.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = AppUser.objects.filter(is_active=True)

        if user.is_superuser == True or user.profile.user_type == 'A':
            query_set = queryset
            return query_set
        elif user.profile.user_type == 'M':
            query_set = queryset.filter(Q(profile__user_type__in=['D']))
            return query_set
        else:
            query_set = queryset.filter(profile__created_by=user)
            return query_set




    @method_decorator(permission_required('users.add_appuser', raise_exception=True), name='create')
    def create(self, request, *args, **kwargs):
        password = 'admintest'
        user = super(self.__class__, self).create(request)
        user_id = user.data['id']

        u = AppUser.objects.get(pk=user_id)
        u.set_password(password)
        u.save()
        return user

    def list(self, request, *args, **kwargs):
        query_params = request.query_params.dict()
        offset = int(query_params.pop('offset', 0))
        end = int(query_params.pop('end', 5))
        queryset = self.get_queryset().filter(is_active=1).exclude(username='AnonymousUser')
        order_by = query_params.pop('order_by', None)
        search_text = query_params.pop('searchText', None)
        query_set = queryset

        if search_text is not None:
            query_set = query_set.filter(
                Q(first_name__icontains=search_text) |
                Q(email__icontains=search_text) |
                Q(last_name__icontains=search_text))
        if order_by is not None:
            if order_by == 'full_name' or order_by == '-full_name':
                order_by = order_by.replace('full_name', 'first_name')
            query_set = query_set.order_by(order_by)
        total_records = query_set.filter(is_active=1).count()
        query_set = query_set[offset:end]
        serializer = UserSerializer(query_set, many=True, context={'request': request})
        data = serializer.data
        user_types = dict(USER_TYPE_CHOICES)
        for index, record in enumerate(data):
            if record['user_type']:
                data[index]['user_type'] = user_types[record['user_type']]
        return Response({'records': serializer.data, 'totalRecords': total_records})


    @action(methods=['get'], name='getuserroles', detail=False)
    def getuserroles(self,request):
        user = self.request.user
        queryset = Group.objects.filter((Q(details__created_by=user) | Q(details__created_by=None)))
        queryset = queryset.order_by('details__alias')
        return Response({'records':list(queryset.values())})



class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        user = self.request.user
        queryset = None
        if user.is_superuser:
            queryset = Group.objects.exclude(details__is_active=0).filter((Q(details__created_by__is_superuser=1)
                                                                      | Q(details__created_by=user) | Q(details__created_by=None) | Q(details__description='customer_user_role_creation')))
        else:
            queryset = Group.objects.exclude(details__is_active=0).filter(Q(details__created_by=user))
        return queryset.order_by('details__alias')

    @action(methods=['get'], url_path='delete_role', detail=False)
    def delete_role_check(self,request,**kwargs):
        id = kwargs["pk"]
        role_name = Group.objects.get(id=id)
        user_list= role_name.user_set.all()
        user = user_list.exists()
        predefined = AppDefaults.get_predefined_roles()
        predefined_value = role_name.name in predefined.values()
        if predefined_value:
            return Response(False)
        elif user:
            return Response("exists")
        else:
            return Response(True)

    def destroy(self, request, *args, **kwargs):
        id = kwargs["pk"]
        query = self.get_queryset().get(id=id)
        query.details.is_active=0
        query.details.save()
        queryset = self.get_queryset()
        serializer = GroupSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)
