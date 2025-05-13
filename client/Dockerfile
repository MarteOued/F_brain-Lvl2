# Utilise l'image officielle Node avec Yarn
FROM node:18

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json yarn.lock ./

# Installer les dépendances avec Yarn
RUN yarn install

# Copier le reste du projet
COPY . .

# Exposer le port Vite
EXPOSE 5134

# Lancer Vite en mode développement (accessible depuis l'extérieur du conteneur)
CMD ["yarn", "dev", "--host", "--port", "5134"]

