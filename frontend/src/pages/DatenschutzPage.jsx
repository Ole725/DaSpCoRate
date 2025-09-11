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
              <strong>[Vollständiger Name]</strong>
              <br />
              [Anschrift – Straße, PLZ, Ort]
              <br />
              E-Mail:{" "}
              <a href="mailto:[email@example.com]" className="text-blue-600 dark:text-blue-400">
                [email@example.com]
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
            </ul>
          </div>
          
          <div>
            <h2>3. Zweck und Rechtsgrundlage</h2>
            <p>
              Die Daten werden ausschließlich zur Organisation des Tanztrainings und
              zur Kommunikation innerhalb der App verarbeitet. Rechtsgrundlage
              ist die von der betroffenen Person erteilte Einwilligung gemäß Art. 6 Abs. 1
              lit. a DSGVO.
            </p>
          </div>

          <div>
            <h2>4. Empfänger der Daten</h2>
            <p>
              Die Daten werden nur innerhalb der App verwendet und sind nur für den jeweils zugehörigen Trainer und das Paar selbst einsehbar. Eine Weitergabe
              an externe Dritte erfolgt nicht.
            </p>
          </div>

          <div>
            <h2>5. Speicherdauer</h2>
            <p>
              Die Daten werden gelöscht, sobald sie für die Organisation nicht mehr
              erforderlich sind oder Sie Ihre Einwilligung widerrufen und Ihr Konto löschen.
            </p>
          </div>

          <div>
            <h2>6. Rechte der Betroffenen</h2>
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
            <h2>7. Änderungen dieser Erklärung</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an
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