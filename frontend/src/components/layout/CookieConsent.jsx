import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('formclub_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (type) => {
    const consentData = {
      necessary: true,
      analytics: type === 'all',
      marketing: type === 'all',
      timestamp: new Date().toISOString()
    };
    
    if (type === 'reject') {
      consentData.analytics = false;
      consentData.marketing = false;
    }

    localStorage.setItem('formclub_cookie_consent', JSON.stringify(consentData));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-fade-in-up">
      <div className="max-w-4xl mx-auto bg-surface border border-gray-700 rounded-2xl shadow-2xl overflow-hidden p-6 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-primary w-6 h-6" />
              <h3 className="text-lg font-bold text-text">Sua Privacidade � Importante</h3>
            </div>
            <p className="text-sm text-gray-300">
              Utilizamos cookies e tecnologias semelhantes para garantir o funcionamento da plataforma, 
              melhorar sua experi�ncia e analisar nosso tr�fego. Em conformidade com a LGPD, voc� pode 
              escolher quais cookies deseja permitir.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => handleConsent('reject')}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors bg-background rounded-lg border border-gray-700 hover:bg-gray-800 w-full md:w-auto"
            >
              Recusar
            </button>
            <button
              onClick={() => handleConsent('necessary')}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors bg-background rounded-lg border border-gray-700 hover:bg-gray-800 w-full md:w-auto"
            >
              Apenas Necess�rios
            </button>
            <button
              onClick={() => handleConsent('all')}
              className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark transition-colors rounded-lg w-full md:w-auto"
            >
              Aceitar Todos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
