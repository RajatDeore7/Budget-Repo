from django.db import models
from rest_framework import serializers
from django.contrib.auth.models import User, Permission, Group
from .models import Profile

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)

    class Meta:
        model = Group 
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    gender = serializers.IntegerField(source='profile.gender',read_only=True)
    city = serializers.CharField(source='profile.city',read_only=True)
    country = serializers.CharField(source='profile.country',read_only=True)
    groups = GroupSerializer(many=True, read_only=True)
    user_permissions = PermissionSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'is_superuser', 'groups', 'user_permissions', 'name', 'gender', 'city', 'country']

    def get_name(self, obj):
        return '%s %s'%(obj.last_name, obj.first_name) if obj.first_name else obj.username


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = '__all__'