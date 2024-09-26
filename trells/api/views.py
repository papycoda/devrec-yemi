from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Project
from .serializers import ProjectSerializer


class IsAdminOrAssignedUser(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        """
        Checks if the user has permission to access the object.

        Parameters:
            request (Request): The incoming request.
            view (View): The view being accessed.
            obj (Object): The object being accessed.

        Returns:
            bool: True if the user has permission, False otherwise.
        """
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_staff or obj.assigned_to == request.user


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrAssignedUser]

    def get_queryset(self):
        """
        Retrieves a queryset of Project objects based on the current user's authentication status.

        If the user is authenticated, returns all projects if the user is staff, otherwise returns projects assigned to the user.
        If the user is not authenticated, returns an empty queryset.

        Parameters:
            self (ProjectViewSet): The viewset instance.

        Returns:
            QuerySet: A queryset of Project objects.
        """
        user = self.request.user
        if self.request.user.is_authenticated:
            if user.is_staff:
                return Project.objects.all()
            return Project.objects.filter(assigned_to=user)
        return Project.objects.none()

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
        """
        Checks if the user has permission to perform an action on the given object.

        Parameters:
            request (Request): The incoming request.
            obj (Object): The object being accessed.

        Raises:
            PermissionDenied: If the user does not have permission to perform the action.
        """
        if self.action in ["update", "partial_update", "destroy"]:
            if not request.user.is_staff and obj.assigned_to != request.user:
                raise PermissionDenied(
                    "You do not have permission to perform this action."
                )
        super().check_object_permissions(request, obj)
