// /DaSpCoRate/frontend/src/pages/ConsentPage.jsx (FINALE, ROBUSTE VERSION)

import React, { useEffect, useState, useRef } from 'react'; // useRef importieren
import { useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

function ConsentPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('Die App überprüft Euren Link...');

    // Dieser Ref stellt sicher, dass der Effekt-Code nur einmal ausgeführt wird.
    const effectRan = useRef(false);

    useEffect(() => {
        // Nur ausführen, wenn der Wächter es erlaubt
        if (effectRan.current === false) {
            const confirmConsent = async () => {
                if (!token) {
                    setStatus('error');
                    setMessage('Kein gültiger Link gefunden. Bitte überprüfe die URL.');
                    return;
                }

                try {
                    // Der Code bleibt gleich: Erst verifizieren, dann bestätigen
                    const verifyRes = await apiClient.get(`/consent/verify/${token}`);
                    setMessage(`Hallo ${verifyRes.data.couple_name}, Eure Einwilligung wird verarbeitet...`);
                    
                    const confirmRes = await apiClient.post(`/consent/confirm/${token}`);
                    setStatus('success');
                    setMessage(confirmRes.data.message);

                    setTimeout(() => navigate('/login'), 10000);

                } catch (error) {
                    setStatus('error');
                    setMessage(error.response?.data?.detail || 'Ein Fehler ist aufgetreten. Der Link ist möglicherweise ungültig oder abgelaufen.');
                }
            };

            confirmConsent();
        }

        // Am Ende des Effekts setzen wir den Wächter, damit er beim nächsten Mal blockiert
        return () => {
            effectRan.current = true;
        };
    }, [token, navigate]); // Die Abhängigkeiten bleiben wichtig

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
                {status === 'loading' && <p className="text-gray-700">{message}</p>}
                {status === 'success' && <p className="text-green-600 font-bold">{message}</p>}
                {status === 'error' && <p className="text-red-600 font-bold">{message}</p>}
                
                {status === 'success' && <p className="mt-4 text-sm text-gray-500">Sie werden in 10 Sekunden zum Login weitergeleitet...</p>}
            </div>
        </div>
    );
}

export default ConsentPage;