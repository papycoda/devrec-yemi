from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Project
from django.db.models import Q 
from .serializers import ProjectSerializer, UserSerializer, RegisterSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            {
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
                "message": "User created successfully.",
            },
            status=status.HTTP_201_CREATED,
        )


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class IsAdminOrCreatorOrAssignee(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return (
                request.user.is_staff
                or obj.assigned_to == request.user
                or obj.created_by == request.user
            )
        return (
            request.user.is_staff
            or obj.assigned_to == request.user
            or obj.created_by == request.user
        )


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrCreatorOrAssignee]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Project.objects.all()
        return Project.objects.filter(
            Q(assigned_to=user) | Q(created_by=user)
        ).distinct()

    def perform_create(self, serializer):
        """
        Saves the serializer with the 'created_by' field set to the current user.

        Parameters:
            self (ProjectViewSet): The viewset instance.
            serializer (ProjectSerializer): The serializer instance.

        Returns:
            None
        """
        serializer.save(created_by=self.request.user)

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if self.action in ["update", "partial_update", "destroy"]:
            if not request.user.is_staff and obj.created_by != request.user:
                raise PermissionDenied(
                    "You do not have permission to modify this project."
                )
