from rest_framework import serializers
from .models import Depense, Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'color']

class DepenseSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = Depense
        fields = ['id', 'amount', 'description', 'date', 'tags']
        extra_kwargs = {
            'description': {'required': True},
            'amount': {'min_value': 0.01}
        }

    def validate_description(self, value):
        if not value.strip():
            raise serializers.ValidationError("La description ne peut pas être vide")
        return value