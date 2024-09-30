from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, UserListView, RegisterView

router = DefaultRouter()
router.register(r"projects", ProjectViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path('users/', UserListView.as_view(), name='user-list'),
    path ("register/",RegisterView.as_view(), name='register'),
]
