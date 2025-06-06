from .views import TagViewSet, DepenseViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views
from .views import get_csrf

router = DefaultRouter()
router.register(r'depenses', views.DepenseViewSet, basename='depense')  # Ajout de basename
router.register(r'tags', views.TagViewSet, basename='tag')

urlpatterns = [
    path('', include(router.urls)),
    path('csrf/', get_csrf, name='get-csrf'),
]

# urls.py (en bas du fichier)
from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)