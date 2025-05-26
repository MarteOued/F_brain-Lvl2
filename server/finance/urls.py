from .views import TagViewSet, DepenseViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()
router.register(r'tags', views.TagViewSet, basename='tag')
router.register(r'depenses', views.DepenseViewSet, basename='depense')  # Ajout de basename

urlpatterns = [
    path('', include(router.urls)),
]