from django.contrib import admin
from .models import Project


class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "status", "assigned_to", "created_by")
    list_filter = ("status", "assigned_to", "created_by")
    search_fields = ("name",)


admin.site.register(Project, ProjectAdmin)
