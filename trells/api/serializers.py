from rest_framework import serializers
from .models import Project
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class ProjectSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        allow_null=True,
        write_only=True,
        source="assigned_to",
    )

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "status",
            "priority",
            "assigned_to",
            "assigned_to_id",
            "created_by",
            "date_created",
        ]

    def create(self, validated_data):
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)
