# /DaSpCoRate/backend/Dockerfile

# Start-Image
FROM python:3.9-slim

# Arbeitsverzeichnis im Container
WORKDIR /code

# Abhängigkeiten kopieren & installieren
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Den gesamten App-Code kopieren
COPY ./app ./app

# Der korrekte Startbefehl für deine Struktur
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]