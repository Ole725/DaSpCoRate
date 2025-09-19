// /DaSpCoRate/frontend/src/pages/AdminConsentPage.jsx

import React, { useState, useEffect } from 'react';
import { getPendingConsentCouples, sendConsentEmails } from '../api/client';
import { toast } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

function AdminConsentPage() {
  const [pendingCouples, setPendingCouples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchPendingCouples = async () => {
    setLoading(true);
    try {
      const data = await getPendingConsentCouples();
      setPendingCouples(data);
    } catch (error) {
      toast.error("Fehler beim Laden der ausstehenden Einwilligungen.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCouples();
  }, []);

  const handleSendEmails = async () => {
    setSending(true);
    try {
      const response = await sendConsentEmails();
      toast.success(response.message || "E-Mails wurden erfolgreich versendet.");
      // Nach dem Senden die Liste neu laden, um sie zu leeren
      fetchPendingCouples(); 
    } catch (error) {
      toast.error(error.response?.data?.detail || "Fehler beim Versenden der E-Mails.");
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Einwilligungs-Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
            Verwalten Sie die DSGVO-Einwilligungen der Tanzpaare.
            </p>
        </div>
        <button
          onClick={handleSendEmails}
          disabled={sending || pendingCouples.length === 0}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
        >
          {sending ? (
            <ClipLoader color={"#fff"} size={20} className="mr-2" />
          ) : (
            'E-Mails jetzt senden'
          )}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Paare mit ausstehender Einwilligung ({pendingCouples.length})
        </h2>
        {loading ? (
          <div className="text-center py-8">
            <ClipLoader color={"#4f46e5"} size={40} />
          </div>
        ) : pendingCouples.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {pendingCouples.map((couple) => (
              <li key={couple.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {couple.mr_first_name} & {couple.mrs_first_name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{couple.email}</p>
                </div>
                <p className="text-sm text-amber-500 font-semibold">Ausstehend</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">
            🎉 Alle Paare haben ihre Einwilligung gegeben.
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminConsentPage;