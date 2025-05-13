FROM python:3.9-slim

# 2. Dossier de travail
WORKDIR /app

# 3. Installer poetry
RUN pip install poetry

# 4. Copier fichiers
COPY pyproject.toml poetry.lock ./

# 5. Installer dépendances
RUN poetry config virtualenvs.create false \
    && poetry install --no-root

# 6. Copier tout le reste
COPY . .

# 7. Port Django
EXPOSE 8000

# 8. Lancer le serveur
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
