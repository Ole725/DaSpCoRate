Product Requirements Document: Tanzsport-App
1. Einführung
Dieses Dokument beschreibt die Anforderungen für die Entwicklung der Tanzsport-App, einer digitalen Lösung zur Unterstützung von Trainern und Paaren bei der Bewertung und dem Feedback im Tanzsport.
Problemstellung:
Im Tanztraining erfolgt die Bewertung und das Feedback oft manuell, was zu Ineffizienzen führt, insbesondere bei größeren Gruppen. Bewertungen sind oft nicht langfristig gespeichert, was die Nachverfolgung des Fortschritts erschwert. Paare haben keinen einfachen Zugang zu ihrer Bewertungshistorie.
Vision:
Eine intuitive und benutzerfreundliche App, die den Bewertungsprozess digitalisiert, die Kommunikation zwischen Trainer und Paaren verbessert und eine langfristige Fortschrittsanalyse ermöglicht.
2. Ziele
* Effizienz: Trainer können Paare schnell und einfach nach vordefinierten Kriterien bewerten.
* Transparenz: Paare können ihre individuellen Bewertungen einsehen, um ihren Fortschritt zu verstehen und zu verfolgen.
* Langfristige Analyse: Durch die Speicherung von Bewertungen in einer Datenbank kann die Leistung über die Zeit analysiert werden.
* Benutzerverwaltung: Paare können eigene Accounts verwalten und sich für Trainingseinheiten anmelden.
* Datensicherheit: Die App nutzt eine sichere Datenbank und Authentifizierung, um die Datenintegrität und den Datenschutz zu gewährleisten.
3. Zielgruppen
* Primär: Tanztrainer, die eine effiziente Methode zur Bewertung von Tänzern suchen.
* Sekundär: Tanzpaare, die strukturiertes Feedback und eine detaillierte Leistungshistorie erhalten möchten.
4. Funktionsanforderungen
4.1 Trainer-Ansicht
* Startseite:
   * Button "Trainer-Ansicht starten" zum Erstellen einer neuen Trainingssession.
   * Feld zur Eingabe einer Trainings-ID und Paar-Nummer, um Ergebnisse abzurufen.
   * Button zur Verwaltung der Paare.
* Session-Ansicht:
   * Anzeige der aktuellen Trainings-ID und Runden-Nummer.
   * Bewertungstabelle:
      * Eine Tabelle, die horizontal Paare und vertikal die Bewertungskriterien anzeigt.
      * Die Kriterien-Spalte bleibt beim horizontalen Scrollen fixiert.
      * Bewertungskriterien:
         * Hauptkategorien: Technical Quality, Movement to Music, Partnering Skill, Choreography and Presentation.
         * Unterkategorien: Posture & Balance, Start/Ending, Floorcraft, Stamina, Appearance (Erscheinung).
      * Bewertungssystem: Für jedes Kriterium kann der Trainer eine Punktzahl von 1, 2 oder 3 vergeben. Die ausgewählte Punktzahl wird optisch hervorgehoben (z.B. in einem grünen Kreis).
   * Buttons:
      * "Paar hinzufügen": Öffnet eine Liste der gespeicherten Paare zur Auswahl.
      * "Nächste Runde": Speichert die Bewertungen der aktuellen Runde und wechselt zur nächsten Runde.
      * "Training beenden": Beendet die Session und speichert alle finalen Bewertungen.
4.2 Paar-Ansicht
* Registrierung & Login: Paare können sich mit E-Mail und Passwort registrieren und anmelden.
* Historie: Nach dem Einloggen kann das Paar seine gesamte Bewertungshistorie einsehen.
* Anmeldung zur Session: Paare können sich mit ihrer Trainings-ID zu einer geplanten Session des Trainers anmelden.
4.3 Administration (Trainer)
* Paar-Verwaltung:
   * Eine separate Ansicht zum Hinzufügen, Bearbeiten und Löschen von Paaren.
   * Felder zum Speichern von Vorname Herr, Vorname Dame, Startgruppe und Klasse.
   * Jedes Paar erhält eine eindeutige ID.
5. Technische Anforderungen
* Frontend:
   * HTML, CSS (Tailwind CSS) und JavaScript.
   * Responsive Design, um die Nutzung auf mobilen und Desktop-Geräten zu ermöglichen.
   * Keine Verwendung von alert() oder confirm(). Stattdessen werden benutzerdefinierte Modal-Fenster für Benachrichtigungen verwendet.
* Backend & Datenbank:
   * Die Datenhaltung erfolgt in einer MySQL-Datenbank.
   * Eine RESTful-API wird zur Kommunikation zwischen Frontend und Datenbank entwickelt.
   * Sichere Benutzerauthentifizierung (gehashte Passwörter, JWT-Tokens).
   * Datenbankschema:
      * users Tabelle für Paare (Email, gehashtes Passwort, Namen, Klasse).
      * sessions Tabelle für Trainingssessions (Session-ID, Datum, Trainer-ID).
      * ratings Tabelle zur Speicherung der Bewertungen (Session-ID, Paar-ID, Runde, Kriterium, Punktzahl, Zeitstempel).
      * session_enrollment Tabelle zur Verknüpfung von Paaren mit Sessions.
* Firebase Integration: Firebase Firestore wurde als Prototyp verwendet und wird durch MySQL ersetzt.
6. Erfolgskriterien
* Die App kann erfolgreich in einer Live-Trainingsumgebung eingesetzt werden.
* Trainer können eine Session mit mindestens 20 Paaren ohne Leistungsprobleme bewerten.
* Paare können sich registrieren und ihre historischen Daten erfolgreich abrufen.