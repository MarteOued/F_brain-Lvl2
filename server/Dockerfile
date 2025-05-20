FROM python:3.9-slim

# 2. Dossier de travail
WORKDIR /app

# 3. Installer poetry
RUN pip install poetry
RUN pip install django-cors-headers
# 4. Copier fichiers
COPY pyproject.toml ./

# 5. Installer dépendances
RUN poetry config virtualenvs.create false \
    && poetry install --no-root

# 6. Copier tout le reste
COPY . .

# 7. Port Django
EXPOSE 8000

# 8. Lancer le serveur
CMD ["poetry", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]
