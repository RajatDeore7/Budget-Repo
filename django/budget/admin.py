from django.contrib import admin

from budget.models import Budget, Category, CategoryItem, \
  AnnualIncome, NetAsset, Liability
    
admin.site.register(Budget)
admin.site.register(Category)
admin.site.register(CategoryItem)
admin.site.register(AnnualIncome)
admin.site.register(NetAsset)
admin.site.register(Liability)