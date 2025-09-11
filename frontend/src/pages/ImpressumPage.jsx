// /DaSpCoRate/frontend/src/pages/ImpressumPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async'; 

function ImpressumPage() {
  return (
    <>
      <Helmet>
        <title>Impressum</title>
        <meta name="description" content="Impressum der DaSpCoRate App" />
      </Helmet>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Impressum</h1>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
            <div>
            <h3>Angaben gemäß § 5 TMG</h3>
            <p>
              [Dein Name]<br />
              [Deine Straße und Hausnummer]<br />
              [Deine PLZ und Stadt]
            </p>
          </div>
          
          <div>
            <h2>Kontakt</h2>
            <p>
              Telefon: [Deine Telefonnummer]<br />
              E-Mail: [Deine E-Mail-Adresse]
            </p>
          </div>
          
          <div>
            <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>
              [Dein Name]<br />
              [Deine Straße und Hausnummer]<br />
              [Deine PLZ und Stadt]
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default ImpressumPage;