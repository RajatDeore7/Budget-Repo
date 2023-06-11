from rest_framework.response import Response
from rest_framework_jwt.views import ObtainJSONWebToken
from django.contrib.auth.models import Group
from rest_framework import status


def is_in_group(user, group_name="member"):
    try:
        return Group.objects.get(name=group_name).user_set.filter(id=user.id).exists()
    except Group.DoesNotExist:
        return None


class CustomAuthToken(ObtainJSONWebToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        is_member = is_in_group(user, "member")

        if is_member is True:
            response = super().post(request, *args, **kwargs)
            return response

        return Response({'messages':'Not in Member Group'}, status=status.HTTP_400_BAD_REQUEST)
