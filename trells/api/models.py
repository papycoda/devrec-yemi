from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Project(models.Model):
    STATUS_CHOICES = [
        ('IN_PROGRESS', 'In Progress'),
        ('DONE', 'Done'),
        ('ABANDONED', 'Abandoned'),
        ('CANCELED', 'Canceled'),
    ]
    
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MID', 'Mid'),
        ('HIGH', 'High'),
    ]
    
    name = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='IN_PROGRESS')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='MID')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_projects')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_projects')
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name