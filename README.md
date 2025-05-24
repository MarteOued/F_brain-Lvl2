
# 💰 F_brain-Lvl2 - Gestion Budgétaire 

Une application Django pour la gestion de finances personnelles, permettant de catégoriser et suivre les dépenses via une API REST.

---

##  Objectif du projet

Ce projet fait partie du niveau 2 de la série **F_Brain**, visant à construire un back-end pour une application de gestion budgétaire.  
L'objectif est de permettre à un utilisateur de :

- Créer des **catégories (Tags)** de dépenses (ex. : Alimentation, Transport ...)
- Enregistrer des **dépenses (Depense)** associées à ces catégories
- Gérer ces données via une **interface admin** et une **API REST**

---

##  Stack utilisée

- **Django** (framework principal)
- **PostgreSQL** (base de données)
- **Django REST Framework** (pour exposer l'API)
- **Docker** + **Docker Compose**
- **Poetry** (gestion des dépendances Python)

---

##  Ce qui a été fait

###  Setup initial

- Initialisation du projet avec `poetry` et `docker-compose`
- Création de l'app `finance`

###  Modélisation

Deux modèles principaux ont été créés :

#### `Tag`
- `nom` (charfield) : nom de la catégorie

#### `Depense`
- `nom` (charfield) : description de la dépense
- `montant` (decimal) : montant en €
- `date` (date) : date de la dépense
- `tag` (foreign key) : lien vers un `Tag`

### Migrations

- `makemigrations` puis `migrate` appliqués sans erreurs
- L’interface admin affiche correctement `Tag` et `Depense`

###  Tests admin

- Création d’un superutilisateur
- Connexion à `/admin/` confirmée
- Ajout et visualisation de dépenses/tags testés via l’admin

---

##  Étapes suivantes

### 1. Création de l’API REST
- Mise en place des **serializers** pour Tag et Depense
- Création des **viewsets** via `ModelViewSet`
- Configuration des **routes** avec `DefaultRouter`

### 2. Points d’accès REST à tester :
- `GET /api/tags/`
- `GET /api/depenses/`
- (et POST, PUT, DELETE selon les droits)

---

##  Partie Frontend (React)

Une fois l’API prête, on pourra attaquer la **partie React** (dans un dossier séparé `/client/`) :

### Objectif :
Créer une interface utilisateur simple pour :

- 📋 Afficher la liste des dépenses
- ➕ Ajouter une nouvelle dépense
- 🏷️ Gérer les tags/catégories
- 📊 Voir un aperçu (ex: total des dépenses par mois)

### Stack côté client :
- React (via Vite ou Create React App)
- Tailwind CSS (UI rapide et responsive)
- Axios (pour communiquer avec l’API)
- React Router (navigation)

### Étapes React :
1. Setup de l’app avec `npm create vite@latest client`
2. Création de composants : `DepenseList`, `DepenseForm`, `TagSelector`
3. Appels API avec Axios (`GET`, `POST`, `DELETE`)
4. Ajout du routing, chargement, formulaires

---

##  Lancement du projet

```bash
# Lancer l'environnement de dev
docker-compose up

# Appliquer les migrations
docker-compose exec server poetry run python manage.py migrate

# Accéder à l'admin : http://localhost:8000/admin
# Accéder à l’API : http://localhost:8000/api/
