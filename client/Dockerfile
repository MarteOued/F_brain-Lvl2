# Utilise une image Node.js correspondant à votre version (v18.19.0)
FROM node:18.19.0-alpine

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances
COPY package.json yarn.lock ./

# Installe les dépendances (en mode production pour éviter les devDependencies inutiles)
RUN yarn install --frozen-lockfile --production=false

# Copie le reste des fichiers du projet
COPY . .

# Expose le port de Vite (5173 par défaut, ou 5174 dans votre cas)
EXPOSE 5174

# Commande pour lancer Vite en mode développement
CMD ["yarn", "dev", "--host"]