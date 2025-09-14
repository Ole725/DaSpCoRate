// DaSpCoRate/frontend/src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { sendContactForm } from '../api/client';
import toast from 'react-hot-toast';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendContactForm(formData);
      toast.success('Vielen Dank! Deine Nachricht wurde versendet.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Senden fehlgeschlagen. Bitte versuche es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    'shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white bg-white dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <>
      <Helmet>
        <title>Kontakt - DaSpCoRate</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Kontakt & Feedback
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Hast du Fragen, Anregungen oder Feedback zur DanSCoR App? Ich freue mich auf deine Nachricht!
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                E-Mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="subject" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Betreff
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Nachricht
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className={inputClasses}
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow disabled:opacity-60"
              >
                {loading ? 'Sende...' : 'Nachricht senden'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ContactPage;