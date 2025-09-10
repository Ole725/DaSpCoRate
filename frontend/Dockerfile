# /DaSpCoRate/frontend/Dockerfile

# 1. Start-Image für Node.js (Vite benötigt eine aktuelle Version)
FROM node:20-alpine

# 2. Arbeitsverzeichnis im Container
WORKDIR /app

# 3. Kopiere package.json und yarn.lock
COPY package*.json ./

# 4.Lösche den node_modules Ordner und den Vite-Cache, falls vorhanden
RUN rm -rf node_modules .vite

# 5. Installiere die Frontend-Abhängigkeiten mit yarn
RUN npm install

# 6. Kopiere den gesamten Frontend-Code
COPY . .

# 7. Exponiere den Port, auf dem Vite läuft
EXPOSE 5173

# 8. Der Startbefehl, der den Vite-Dev-Server für das Netzwerk zugänglich macht
CMD ["npm", "run", "dev"]