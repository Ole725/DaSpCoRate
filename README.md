# DaSpCoRate - Dance Sport Competition Rating

Willkommen bei **DaSpCoRate**, einer modernen Webanwendung zur Digitalisierung von Trainingswettkämpfen im Tanzsport. Dieses Projekt wurde entwickelt, um Trainern ein Werkzeug für die Echtzeit-Bewertung zu geben und Tanzpaaren eine detaillierte Einsicht in ihre Leistungsentwicklung zu ermöglichen.

## Über das Projekt

**DaSpCoRate** ersetzt die traditionelle Zettelwirtschaft bei Trainingswettkämpfen durch eine dynamische, mobile-first Webanwendung. Trainer können Paare verwalten, Trainingseinheiten (Sessions) erstellen und Bewertungen über mehrere Runden hinweg live erfassen. Paare können sich nach dem Training einloggen, um ihre detaillierte Bewertungshistorie einzusehen und ihren Fortschritt zu verfolgen.

Dieses Projekt wurde in enger Zusammenarbeit zwischen **Ole725** und der **KI-Assistenz Gemini von Google** entwickelt. Bernhard war für die Konzeption, das Projektmanagement und die finale Implementierung verantwortlich, während Gemini als beratender Partner, Code-Generator und Debugging-Assistent fungierte.

## Features

### Trainer-Ansicht
*   **Benutzer-Authentifizierung:** Sicherer Login für Trainer.
*   **Dashboard:** Zentrale Übersicht über alle Funktionen.
*   **Paar-Verwaltung:** Vollständige CRUD-Operationen (Erstellen, Lesen, Aktualisieren, Löschen) für Tanzpaare.
*   **Session-Management:** Erstellen und Verwalten von Trainingseinheiten.
*   **Live-Bewertung:** Interaktive Bewertungstabelle zur Notenvergabe in Echtzeit über mehrere Runden.
*   **Ergebnisübersicht:** Finale Auswertung nach Abschluss eines Trainings.
*   **Profilverwaltung:** Möglichkeit, das eigene Passwort zu ändern.

### Paar-Ansicht
*   **Benutzer-Authentifizierung:** Sichere Registrierung und Login für Paare.
*   **Dashboard:** Persönliche Startseite.
*   **Bewertungshistorie:** Detaillierte Ansicht aller erhaltenen Bewertungen, gruppiert nach Trainingseinheiten.
*   **Profilverwaltung:** Möglichkeit, eigene Profildaten (z.B. Startklasse) und das Passwort zu ändern.

## Technologien

Die Anwendung ist als robustes 3-Container-Setup mit Docker konzipiert.

*   **Frontend:** **React**
    *   **Routing:** `react-router-dom`
    *   **State Management:** React Context API (`AuthContext`)
    *   **Styling:** **Tailwind CSS**
    *   **UI-Feedback:** `react-hot-toast` für Benachrichtigungen & eine wiederverwendbare Modal-Komponente.

*   **Backend:** **FastAPI (Python)**
    *   **API-Design:** Robuste REST-API mit Pydantic-Datenvalidierung.
    *   **Authentifizierung:** JWT-basierte Authentifizierung mit rollenbasiertem Zugriff (Trainer & Paare).
    *   **Datenbank-Interaktion:** SQLAlchemy ORM.

*   **Datenbank:** **MySQL**

*   **Infrastruktur:** **Docker & Docker Compose**
    *   Vollständig containerisierte Anwendung für eine einfache Installation und konsistente Entwicklungsumgebung.

## Installation & Start

Dank Docker ist die Installation und das Starten der gesamten Anwendung sehr einfach.

**Voraussetzungen:**
*   [Docker](https://www.docker.com/products/docker-desktop/) muss installiert und gestartet sein.
*   Git muss installiert sein.

**Anleitung:**

1.  **Repository klonen:**
    ```bash
    git clone https://github.com/Ole725/DaSpCoRate.git
    cd DaSpCoRate
    ```

2.  **Umgebungsvariablen konfigurieren:**
    Im Verzeichnis `backend/` befindet sich eine Datei `.env`. Passe hier bei Bedarf die `SECRET_KEY` und die Datenbank-Passwörter an. Die Standardwerte sind für den lokalen Betrieb vorkonfiguriert.

3.  **Anwendung mit Docker Compose starten:**
    Führe im Hauptverzeichnis des Projekts den folgenden Befehl aus. Docker wird die Images bauen, die Container herunterladen und die gesamte Anwendung starten.
    ```bash
    docker-compose up --build
    ```

4.  **Anwendung aufrufen:**
    *   Das **Frontend** ist jetzt unter [http://localhost:5173](http://localhost:5173) erreichbar.
    *   Die **Backend-API-Dokumentation** (Swagger UI) findest du unter [http://localhost:8000/docs](http://localhost:8000/docs).


## Danksagung & Genutzte Technologien

DaSpCoRate wurde mit Hilfe fantastischer Open-Source-Technologien entwickelt. Wir danken den Entwicklern und Communitys der folgenden Projekte:

*   **Frontend:** [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
*   **Backend:** [FastAPI](https://fastapi.tiangolo.com/), [Pydantic](https://pydantic-docs.helpmanual.io/), [SQLAlchemy](https://www.sqlalchemy.org/)
*   **Containerisierung:** [Docker](https://www.docker.com/)
*   **Deployment:** [Google Cloud Platform](https://cloud.google.com/)

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz.