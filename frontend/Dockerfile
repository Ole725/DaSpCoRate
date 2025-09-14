# /DaSpCoRate/frontend/Dockerfile (NEUE PRODUKTIONSVERSION)

# --- STUFE 1: Die Bau-Werkstatt (Build Stage) ---
FROM node:20-alpine AS builder

ARG VITE_API_URL

WORKDIR /app

# Nur package.json kopieren, um den Docker-Cache zu nutzen
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install

# Den gesamten restlichen Code kopieren
COPY . .

# Die React-App für die Produktion bauen.
# Vite packt alles in den /app/dist Ordner.
RUN VITE_API_URL=${VITE_API_URL} npm run build


# --- STUFE 2: Der Auslieferungs-Server (Production Stage) ---
FROM nginx:1.25-alpine

# Kopiere die fertigen, statischen Dateien aus der Bau-Werkstatt (Stufe 1)
# in das Verzeichnis, aus dem Nginx Webseiten ausliefert.
COPY --from=builder /app/dist /usr/share/nginx/html

# (Optional, aber empfohlen) Kopiere eine eigene Nginx-Konfiguration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx lauscht standardmäßig auf Port 80
EXPOSE 80

# Starte den Nginx-Server
CMD ["nginx", "-g", "daemon off;"]