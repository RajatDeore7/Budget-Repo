from django.urls import path, include
from rest_framework import routers
from django.conf.urls import url, include

from budget import views

router = routers.SimpleRouter()
router.register(r'budgets', views.BudgetViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'category_items', views.CategoryItemViewSet)
router.register(r'annual_incomes', views.AnnualIncomeViewSet)
router.register(r'netassets', views.NetAssetViewSet)
router.register(r'liabilities', views.LiabilityViewSet)

urlpatterns = router.urls + [
    
]
