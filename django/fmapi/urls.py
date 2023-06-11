"""assetmanagement URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token
from django.conf import settings
from django.conf.urls.static import static
from fmapi.serializers import CustomAuthToken

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    # path('sync/', include('sync.urls')),
    # path('docs/', include_docs_urls(title='API docs')),
    path('api/v1/', include([
        path('auth/', include([
            #path('exlogin/', CustomAuthToken.as_view()),
            path('login/',  CustomAuthToken.as_view()),
            path('refresh/', refresh_jwt_token),
            path('verify/', verify_jwt_token)
        ])),
        path('djoser/', include('djoser.urls')),
        path('user/', include('user.urls')),
        path('budget/', include('budget.urls')),
        # path('debt/', include('debt.urls')),
        # path('stock/', include('stock.urls')),
        # path('bank/', include('bank.urls')),
    ]))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)