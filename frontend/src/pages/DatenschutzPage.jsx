// /DaSpCoRate/frontend/src/pages/DatenschutzPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

function DatenschutzPage() {
    const today = new Date().toLocaleDateString("de-DE");

  return (
    <>
      <Helmet>
        <title>Datenschutzerklärung</title>
        <meta name="description" content="Datenschutzerklärung der DaSpCoRate App" />
      </Helmet>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Datenschutzerklärung
          </h1>
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
          <p className="!mt-0 text-sm text-gray-500 dark:text-gray-400"> {/* !mt-0 hebt den space-y für dieses erste Element auf */}
            Gültig ab: {today}
          </p>

          <div> {/* H2 und P in ein div gruppiert für korrekten Abstand */}
            <h2>1. Verantwortlicher</h2>
            <p>
              Verantwortlich für die Datenverarbeitung im Sinne der DSGVO ist:
              <br />
              <strong>[Bernhard Wallenfels]</strong>
              <br />
              [Wulfsiepen 17, 44267 Dortmund]
              <br />
              E-Mail:{" "}
              <a href="mailto:daspcorate@gmail.com" className="text-blue-600 dark:text-blue-400">
                daspcorate@gmail.com
              </a>
            </p>
          </div>

          <div>
            <h2>2. Welche Daten werden verarbeitet?</h2>
            <ul>
              <li>
                <strong>Trainer:</strong> Vor- und Nachname, E-Mail-Adresse.
              </li>
              <li>
                <strong>Tanzpaare:</strong> Vornamen, E-Mail-Adresse, Startgruppe, Startklasse, Tanzstil.
              </li>
              <li>
                <strong>Bewertungsdaten:</strong> Daten, die im Rahmen von Trainingsbewertungen durch Trainer und Paare entstehen.
              </li>
              <li>
                <strong>Nutzungs- und Metadaten:</strong> IP-Adresse, Zugriffszeitpunkt, Browser-Informationen, die beim Zugriff auf unsere Anwendung technisch bedingt anfallen.
              </li>
            </ul>
          </div>
          
          <div>
            <h2>3. Zweck und Rechtsgrundlage der Verarbeitung</h2>
            <p>
              Die Verarbeitung Ihrer Daten erfolgt zu folgenden Zwecken und auf Basis der folgenden Rechtsgrundlagen:
            </p>
            <ul>
                <li>
                    <strong>Zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO):</strong> Die Verarbeitung der unter Punkt 2 genannten Daten ist erforderlich, um Ihnen die Kernfunktionen der App bereitzustellen, das Training zu organisieren und die Kommunikation zwischen den Nutzergruppen zu ermöglichen.
                </li>
                <li>
                    <strong>Aufgrund Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO):</strong> Für bestimmte Funktionen, wie z.B. den Versand von Benachrichtigungen, holen wir Ihre explizite Einwilligung ein.
                </li>
                <li>
                    <strong>Aufgrund unseres berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO):</strong> Wir verarbeiten Nutzungs- und Metadaten, um die Stabilität und Sicherheit unserer Anwendung zu gewährleisten und zu verbessern.
                </li>
            </ul>
          </div>

          <div>
            <h2>4. Hosting und externe Dienstleister</h2>
            <p>
              Um einen sicheren, zuverlässigen und effizienten Betrieb unserer Anwendung zu gewährleisten, setze ich auf die Dienste spezialisierter, externer Anbieter.
            </p>

            <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700 mt-4">
                <h3 className="!mt-0">4.1 Hosting der Anwendung</h3>
                <p>
                    <strong>Anbieter:</strong> Google Cloud Platform (GCP)
                    <br />
                    <strong>Betreiber:</strong> Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.
                    <br />
                    <strong>Serverstandort:</strong> Frankfurt am Main, Deutschland (Region europe-west3).
                </p>
                <p>
                    Im Rahmen des Hostings werden alle unter Punkt 2 genannten Daten sowie technische Server-Logfiles auf den Servern von Google verarbeitet und gespeichert. Rechtsgrundlage hierfür ist unser berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO) an einer professionellen und sicheren Zurverfügungstellung unseres Angebots. Wir haben mit Google einen <strong>Auftragsverarbeitungsvertrag (AVV)</strong> gemäß Art. 28 DSGVO abgeschlossen.
                </p>
            </div>

            <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700 mt-6">
                <h3 className="!mt-0">4.2 E-Mail-Versand</h3>
                <p>
                    Für den Versand von systemrelevanten E-Mails (sogenannte Transaktions-E-Mails), wie der Einholung Ihrer Einwilligung zur Datenverarbeitung oder Antworten auf Ihre Kontaktanfragen, nutze ich die Dienste des folgenden Anbieters:
                </p>
                <p>
                    <strong>Anbieter:</strong> Brevo (ehemals Sendinblue)
                    <br />
                    <strong>Betreiber:</strong> Brevo GmbH, Köpenicker Straße 126, 10179 Berlin, Deutschland.
                </p>
                <p>
                    Hierfür werden Ihre E-Mail-Adresse und Ihr Name sowie der Inhalt der jeweiligen Nachricht an Brevo übermittelt. Die Nutzung eines spezialisierten Dienstleisters ist notwendig, um eine zuverlässige Zustellung dieser wichtigen E-Mails sicherzustellen. Rechtsgrundlage ist die Erfüllung unserer vertraglichen Pflichten (Art. 6 Abs. 1 lit. b DSGVO) sowie unser berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO) an einer sicheren und effizienten Kommunikation. Wir haben mit Brevo ebenfalls einen <strong>Auftragsverarbeitungsvertrag (AVV)</strong> gemäß Art. 28 DSGVO abgeschlossen.
                </p>
            </div>
          </div>

          <div>
            <h2>5. Empfänger der Daten</h2>
            <p>
              Innerhalb der Anwendung sind Ihre Daten nur für die zur Erfüllung der 
              App-Funktionen notwendigen Parteien einsehbar (z.B. zugehöriger Trainer, das Paar selbst, Administratoren).
            </p>
            <p>
              Eine Weitergabe an externe Dritte erfolgt nicht, mit Ausnahme der unter Punkt 4 genannten Dienstleister (Google Cloud Platform, Brevo).
            </p>
          </div>


          <div>
            <h2>6. Speicherdauer</h2> {/* Nummerierung angepasst */}
            <p>
              Ihre personenbezogenen Daten werden gelöscht, sobald der Zweck der Speicherung entfällt, 
              Sie Ihr Konto löschen oder Ihre Einwilligung widerrufen.
            </p>
          </div>

          <div>
            <h2>7. Rechte der Betroffenen</h2> {/* Nummerierung angepasst */}
            <p>
                Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung, 
                Einschränkung der Verarbeitung, Widerspruch gegen die Verarbeitung 
                sowie das Recht auf Datenübertragbarkeit. Um diese Rechte auszuüben, 
                können Sie mich unter der in Punkt 1 genannten E-Mail-Adresse kontaktieren. 
                Ihnen steht zudem ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu.
            </p>
            <ul>
              <li>Auskunft (Art. 15 DSGVO)</li>
              <li>Berichtigung (Art. 16 DSGVO)</li>
              <li>Löschung (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              <li>Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)</li>
              <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
            </ul>
          </div>

          <div>
            <h2>8. Änderungen dieser Erklärung</h2>
            <p>
              Ich behalte mir vor, diese Datenschutzerklärung anzupassen, um sie an
              geänderte rechtliche Anforderungen oder Änderungen der App anzupassen.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default DatenschutzPage;