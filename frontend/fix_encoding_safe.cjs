const fs = require('fs');

const modalText = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import { Shield, Key, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CompleteSetupModal = () => {
  const { user, setUser } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedConfidentiality, setAcceptedConfidentiality] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const needsPasswordChange = user?.force_password_change;
  const needsTerms = !user?.terms_accepted_at;

  if (!needsPasswordChange && !needsTerms) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (needsPasswordChange && password.length < 6) {
      setError('A nova senha deve ter no m\u00ednimo 6 caracteres.');
      return;
    }

    if (needsPasswordChange && password !== confirmPassword) {
      setError('As senhas n\u00e3o coincidem.');
      return;
    }

    if (needsTerms && !acceptedTerms) {
      setError('Voc\u00ea precisa aceitar os Termos de Uso e Pol\u00edtica de Privacidade.');
      return;
    }
    if (user?.role === 'treinador' && !acceptedConfidentiality) {
      setError('Voc\u00ea precisa aceitar o Termo de Confidencialidade e Sigilo.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/complete-setup', {
        new_password: password || 'placeholder123',
        accepted_terms: acceptedTerms || !needsTerms,
        accepted_confidentiality: acceptedConfidentiality
      });

      const updatedUser = { ...user, force_password_change: false, terms_accepted_at: new Date().toISOString() };
      setUser(updatedUser);
      
      toast.success('Configura\u00e7\u00e3o conclu\u00edda com sucesso!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao salvar configura\u00e7\u00f5es.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-surface border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo(a)!</h2>
          <p className="text-gray-400 text-sm">
            Para continuar, precisamos que voc\u00ea conclua a configura\u00e7\u00e3o da sua conta.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {needsPasswordChange && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Criar Nova Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 bg-background border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-primary focus:border-primary sm:text-sm px-3 py-2"
                    placeholder="M\u00ednimo 6 caracteres"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 bg-background border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-primary focus:border-primary sm:text-sm px-3 py-2"
                    placeholder="Repita a nova senha"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {needsTerms && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-600 bg-background text-primary focus:ring-primary focus:ring-offset-background"
                    />
                  </div>
                  <div className="text-sm text-gray-400">
                    Li e concordo com a <a href="#" className="text-primary hover:underline">Pol\u00edtica de Privacidade</a> e autorizo o tratamento dos meus dados sens\u00edveis (f\u00edsicos e de sa\u00fade) conforme a LGPD.
                  </div>
                </label>
              </div>

              {user?.role === "treinador" && (
                <div className="pt-4 border-t border-gray-700/50">
                  <label className="flex items-start gap-3 cursor-pointer group mt-2">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={acceptedConfidentiality}
                        onChange={(e) => setAcceptedConfidentiality(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-600 bg-background text-red-500 focus:ring-red-500 focus:ring-offset-background"
                      />
                    </div>
                    <div className="text-sm text-gray-400">
                      <span className="font-bold text-gray-300">Termo de Confidencialidade:</span> Declaro sob as penas da lei que manterei sigilo absoluto sobre os dados m\u00e9dicos, f\u00edsicos e de sa\u00fade dos atletas acessados nesta plataforma, n\u00e3o os compartilhando com terceiros.
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors mt-6 disabled:opacity-50"
          >
            {isLoading ? "Salvando..." : "Concluir Configura\u00e7\u00e3o"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteSetupModal;
`;

const cookieText = `import React, { useState, useEffect } from 'react';
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
              <h3 className="text-lg font-bold text-text">Sua Privacidade \u00e9 Importante</h3>
            </div>
            <p className="text-sm text-gray-300">
              Utilizamos cookies e tecnologias semelhantes para garantir o funcionamento da plataforma, 
              melhorar sua experi\u00eancia e analisar nosso tr\u00e1fego. Em conformidade com a LGPD, voc\u00ea pode 
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
              Apenas Necess\u00e1rios
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
`;

fs.writeFileSync('src/components/layout/CompleteSetupModal.jsx', modalText, { encoding: 'utf8' });
fs.writeFileSync('src/components/layout/CookieConsent.jsx', cookieText, { encoding: 'utf8' });

console.log('Files rewritten using safe unicode escapes');
