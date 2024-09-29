from django.contrib import admin
from .models import Project

# class ProjectAdmin(admin.ModelAdmin):
#     list_display = 

admin.site.register(Project)

