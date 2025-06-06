FROM python:3.9-alpine

WORKDIR /app

# Installer les dépendances système
RUN apk add --no-cache --virtual .build-deps \
    gcc \
    musl-dev \
    postgresql-dev

# Installer les dépendances Python
RUN pip install --no-cache-dir poetry gunicorn django-cors-headers
RUN mkdir -p /app/staticfiles
# Copier et installer les dépendances du projet
COPY pyproject.toml poetry.lock ./
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-root

# Copier tout le code
COPY . .

# Configurer le bon PYTHONPATH
ENV PYTHONPATH=/app

# Commande corrigée pour utiliser server_conf au lieu de server_config
CMD ["sh", "-c", "python manage.py migrate && gunicorn server_conf.wsgi:application --bind 0.0.0.0:8000"]