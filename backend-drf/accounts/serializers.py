from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    class Meta:
        model = User
        fields = ["username", "email", "password"]
        

    def create(self, validated_data):
        # User.objects.create = save the password in a plain text
        # User.objects.create_user = automatically hash the password
        # the ** only can be used when the fields are default in default modal
        user = User.objects.create_user(**validated_data)
        # fields = ["username", "email", "password", "billing"]
        # user = User.objects.create_user({
        #    validate_data["username"],
        #    validate_data["email"],
        #    validate_date["billing"],
        #    validate_date["password"]
        # })
        
        return user
