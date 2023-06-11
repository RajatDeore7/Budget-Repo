from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.core.exceptions import ValidationError

from django.contrib.auth.models import User

from budget.models import Budget, Category, CategoryItem, \
    AnnualIncome, NetAsset, Liability
from user.serializers import UserSerializer

class CategoryItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CategoryItem
        fields = '__all__'

class DetailCategoryItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CategoryItem
        fields = '__all__'
        

class CategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = '__all__'

class DetailCategorySerializer(serializers.ModelSerializer):
    items = DetailCategoryItemSerializer(many=True)

    class Meta:
        model = Category
        fields = '__all__'

class AnnualIncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnnualIncome
        fields = '__all__'

class NetAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = NetAsset
        fields = '__all__'

class LiabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Liability
        fields = '__all__'

class BudgetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Budget
        fields = '__all__'

class DetailBudgetSerializer(serializers.ModelSerializer):
    categories = DetailCategorySerializer(many=True, source="custom_categories")
    income = DetailCategorySerializer()
    expense = DetailCategorySerializer()
    annual_incomes = AnnualIncomeSerializer(many=True)
    netassets = NetAssetSerializer(many=True)
    liabilities = LiabilitySerializer(many=True)

    created_by = UserSerializer()
    
    class Meta:
        model = Budget
        fields = '__all__'

