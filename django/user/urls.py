from django.urls import path, include
from rest_framework import routers
from django.conf.urls import url, include

from user import views

router = routers.SimpleRouter()

urlpatterns = router.urls + [
    path('profile/', views.get_profile),
    path('register/', views.register),
]
