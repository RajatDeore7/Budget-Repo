from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework import viewsets
from django.contrib.auth.models import User, Group

from user.serializers import UserSerializer, ProfileSerializer

from djoser.compat import get_user_email
from djoser.conf import settings


@api_view(['GET'])
def get_profile(request):
    return Response(UserSerializer(request.user).data)

@api_view(['POST'])
@permission_classes([])
def register(request):
    data = request.data
    # check duplicate email 
    email = data['email']
    _user = User.objects.filter(email=email).first()
    if _user:
        return Response([["Email already exist, please choose another one!"]], status=status.HTTP_400_BAD_REQUEST)

    user_serializer = UserSerializer(data=data)
    if user_serializer.is_valid():
        user = user_serializer.save()
        user.set_password(data['password'])
        user.is_active = False
        
        #add default group permission
        group = Group.objects.filter(name="default").first()
        if group:
            user.groups.add(group)
            
        user.save()
        data['user'] = user.id
        profile_serializer = ProfileSerializer(data=data)
        if profile_serializer.is_valid():
            profile_serializer.save()
        else:
            print(profile_serializer.errors)

        context = {"user": user}
        to = [get_user_email(user)]
        if settings.SEND_ACTIVATION_EMAIL:
            settings.EMAIL.activation(request, context).send(to)
        elif settings.SEND_CONFIRMATION_EMAIL:
            settings.EMAIL.confirmation(request, context).send(to)

        return Response(user_serializer.data, status=status.HTTP_200_OK)
    else:
        print (user_serializer.errors)

    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
