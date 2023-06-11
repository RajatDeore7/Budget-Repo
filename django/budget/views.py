from django.shortcuts import render
from django.db.models import Q
from datetime import datetime, date

import django_filters 
from django_filters import BaseInFilter, NumberFilter
from django_filters.rest_framework import FilterSet
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response 
from rest_framework.decorators import api_view
from rest_framework import status 
from rest_framework.decorators import detail_route, action, permission_classes
from rest_framework.permissions import DjangoModelPermissions


from budget.models import Budget, CategoryItem, Category, \
    AnnualIncome, NetAsset, Liability
from budget.serializers import Budget, BudgetSerializer, DetailBudgetSerializer, \
    CategorySerializer, DetailCategorySerializer, \
    CategoryItemSerializer, DetailCategoryItemSerializer, \
    AnnualIncomeSerializer, NetAssetSerializer, LiabilitySerializer


class BudgetViewSet(viewsets.ModelViewSet):
    queryset =  Budget.objects.all()
    permission_classes = [DjangoModelPermissions]

    def get_queryset(self):
        return Budget.objects.filter(created_by=self.request.user).order_by('order')

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return DetailBudgetSerializer
        return BudgetSerializer

    @action(detail=True, methods=['post'])
    def copy(self, request, pk=None):
        c_mapping = {}
        obj = self.get_object()
        if obj.created_by != request.user:
            obj = Budget.objects.filter(created_by=request.user).last()
        if not obj: # there is no budget 
            obj = Budget.init_budget(request.user)
            serializer  = DetailBudgetSerializer(obj)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        #else there is a budget to copy 
        obj.name = obj.name + ' copy'
        categories = obj.categories.all()
        obj.pk = None
        # obj.name = "Budget {}".format(date.today().year)
        obj.save()
        
        #copy categories 
        for c in categories:
            items = c.items.all()
            print('items:', items)
            _old_pk = c.pk
            c.pk = None 
            c.budget = obj 
            c.save()
            c_mapping[_old_pk] = c.pk
            if c.c_type==1:
                obj.income = c
            elif c.c_type==2:
                obj.expense = c

            for item in items:  
                item.pk = None
                item.category = c
                item.save()
                print('{} -> {}'.format(item.name,c.name))
        obj.save()
        for c in obj.categories.all():
            for item in c.items.all():
                if item.ref_category:
                    item.ref_category = c_mapping[item.ref_category]
                    item.save()
        
        serializer  = DetailBudgetSerializer(obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset =  Category.objects.all()
    permission_classes = [DjangoModelPermissions]

    def get_queryset(self):
        return Category.objects.filter(budget__created_by=self.request.user).order_by('order')

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return DetailCategorySerializer
        return CategorySerializer

class CategoryItemViewSet(viewsets.ModelViewSet):
    queryset =  CategoryItem.objects.all()
    permission_classes = [DjangoModelPermissions]
    
    def get_queryset(self):
        return CategoryItem.objects.filter(category__budget__created_by=self.request.user).order_by('order')

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return DetailCategoryItemSerializer
        return CategoryItemSerializer

    @action(detail=True, methods=["post"])
    def move_up(self, request, pk=None):
        obj = self.get_object()
        obj.up()
        return Response({'success': True}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def move_down(self, request, pk=None):
        obj = self.get_object()
        obj.down()
        return Response({'success': True}, status=status.HTTP_200_OK)

class AnnualIncomeViewSet(viewsets.ModelViewSet):
    queryset =  AnnualIncome.objects.all()
    serializer_class = AnnualIncomeSerializer
    permission_classes = [DjangoModelPermissions]

    def get_queryset(self):
        return AnnualIncome.objects.filter(budget__created_by=self.request.user).order_by('order')
    
    def create(self, request, *args, **kwargs):
        # validate buddget 
        if 'budget' not in request.data:
            return Response('BUDGET_MISSING', status=status.HTTP_400_BAD_REQUEST)
        budget_id = request.data['budget']
        try:
            budget = Budget.objects.get(id=budget_id)
        except Budget.DoesNotExist:
            return Response('BUDGET_NOT_FOUND', status=status.HTTP_400_BAD_REQUEST)
        if budget.created_by.id != request.user.pk:
            return Response('FORBIDDEN', status=status.HTTP_403_FORBIDDEN)

        return super().create(request, args, kwargs)

    @action(detail=True, methods=["post"])
    def move_up(self, request, pk=None):
        obj = self.get_object()
        obj.up()
        return Response({'success': True}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def move_down(self, request, pk=None):
        obj = self.get_object()
        obj.down()
        return Response({'success': True}, status=status.HTTP_200_OK)

class NetAssetViewSet(viewsets.ModelViewSet):
    queryset =  NetAsset.objects.all()
    serializer_class = NetAssetSerializer
    permission_classes = [DjangoModelPermissions]

    def get_queryset(self):
        return NetAsset.objects.filter(budget__created_by=self.request.user).order_by('order')
    
    def create(self, request, *args, **kwargs):
        # validate buddget 
        if 'budget' not in request.data:
            return Response('BUDGET_MISSING', status=status.HTTP_400_BAD_REQUEST)
        budget_id = request.data['budget']
        try:
            budget = Budget.objects.get(id=budget_id)
        except Budget.DoesNotExist:
            return Response('BUDGET_NOT_FOUND', status=status.HTTP_400_BAD_REQUEST)
        if budget.created_by.id != request.user.pk:
            return Response('FORBIDDEN', status=status.HTTP_403_FORBIDDEN)

        return super().create(request, args, kwargs)

    @action(detail=True, methods=["post"])
    def move_up(self, request, pk=None):
        obj = self.get_object()
        obj.up()
        return Response({'success': True}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def move_down(self, request, pk=None):
        obj = self.get_object()
        obj.down()
        return Response({'success': True}, status=status.HTTP_200_OK)

class LiabilityViewSet(viewsets.ModelViewSet):
    queryset =  Liability.objects.all()
    serializer_class = LiabilitySerializer
    permission_classes = [DjangoModelPermissions]

    def get_queryset(self):
        return Liability.objects.filter(budget__created_by=self.request.user).order_by('order')
    
    def create(self, request, *args, **kwargs):
        # validate buddget 
        if 'budget' not in request.data:
            return Response('BUDGET_MISSING', status=status.HTTP_400_BAD_REQUEST)
        budget_id = request.data['budget']
        try:
            budget = Budget.objects.get(id=budget_id)
        except Budget.DoesNotExist:
            return Response('BUDGET_NOT_FOUND', status=status.HTTP_400_BAD_REQUEST)
        if budget.created_by.id != request.user.pk:
            return Response('FORBIDDEN', status=status.HTTP_403_FORBIDDEN)

        return super().create(request, args, kwargs)
        
    @action(detail=True, methods=["post"])
    def move_up(self, request, pk=None):
        obj = self.get_object()
        obj.up()
        return Response({'success': True}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def move_down(self, request, pk=None):
        obj = self.get_object()
        obj.down()
        return Response({'success': True}, status=status.HTTP_200_OK)