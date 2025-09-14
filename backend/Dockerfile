# /DaSpCoRate/backend/Dockerfile (Final und Korrekt)

# 1. Basis-Image
FROM python:3.9-slim

# 2. Umgebungsvariablen setzen
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 3. Arbeitsverzeichnis im Container setzen
# DIES IST DER ENTSCHEIDENDE PUNKT
WORKDIR /code

# 4. Requirements kopieren und installieren
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 5. Den gesamten App-Code kopieren (wird durch Volume Mount im Dev-Modus überschrieben)
COPY . /code/

# 6. Den Befehl zum Starten der Anwendung definieren
# FastAPI wird auf allen Netzwerk-Interfaces innerhalb des Containers lauschen
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}