from django.contrib import admin
from .models import Tag, Depense

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'color')  # Correspond exactement à vos champs
    list_editable = ('color',)  # Permet de modifier la couleur directement dans la liste
    search_fields = ('name',)  # Ajout de la recherche par nom

@admin.register(Depense)
class DepenseAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'amount', 'short_description', 'tags_list')
    list_filter = ('user', 'date', 'tags')  # Filtres pratiques
    search_fields = ('description', 'user__username')  # Recherche par description ou nom d'utilisateur
    date_hierarchy = 'date'  # Navigation hiérarchique par date
    raw_id_fields = ('user',)  # Meilleur widget pour les utilisateurs

    # Méthode personnalisée pour afficher une description raccourcie
    def short_description(self, obj):
        return obj.description[:50] + '...' if len(obj.description) > 50 else obj.description
    short_description.short_description = 'Description'

    # Méthode pour afficher les tags sous forme de liste
    def tags_list(self, obj):
        return ", ".join([tag.name for tag in obj.tags.all()])
    tags_list.short_description = 'Tags'