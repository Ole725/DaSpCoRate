# /DaSpCoRate/frontend/Dockerfile

# 1. Start-Image für Node.js (Vite benötigt eine aktuelle Version)
FROM node:20-alpine

# 2. Arbeitsverzeichnis im Container
WORKDIR /app

# 3. Kopiere package.json und yarn.lock
COPY package.json yarn.lock ./

# 4. Installiere die Frontend-Abhängigkeiten mit yarn
RUN yarn install

# 5. Kopiere den gesamten Frontend-Code
COPY . .

# 6. Exponiere den Port, auf dem Vite läuft
EXPOSE 5173

# 7. Der Startbefehl, der den Vite-Dev-Server für das Netzwerk zugänglich macht
CMD ["yarn", "dev", "--host", "0.0.0.0"]