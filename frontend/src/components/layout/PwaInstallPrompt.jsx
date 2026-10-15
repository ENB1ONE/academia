import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed/standalone
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(isStandaloneMode);

    if (isStandaloneMode) return;

    // Apenas mostrar em dispositivos m�veis
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobileDevice) {
      return;
    }

    // Handle Android (Chrome/Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Auto-show after a slight delay
      const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!hasDismissed) {
        setTimeout(() => setShowPrompt(true), 2000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Handle iOS
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    if (isIOSDevice) {
      setIsIOS(true);
      const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!hasDismissed) {
        setTimeout(() => setShowPrompt(true), 2000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-surface border border-gray-800 rounded-xl p-4 shadow-2xl flex flex-col gap-3 relative">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <img src="./pwa/icon-192x192.png" alt="Formclub" className="w-12 h-12 rounded-xl bg-background p-1 border border-primary/30" />
          <div className="flex-1">
            <h3 className="font-semibold text-white">Instalar o Aplicativo</h3>
            <p className="text-sm text-gray-400">Tenha uma experiência mais rápida e fácil diretamente no seu celular.</p>
          </div>
        </div>

        {isIOS ? (
          <div className="bg-background rounded-lg p-3 text-sm text-gray-300 mt-1 border border-gray-800">
            Para instalar no iOS:
            <ol className="list-decimal ml-4 mt-2 space-y-1">
              <li>Toque em <Share className="inline w-4 h-4 mx-1" /> (Compartilhar) na barra inferior do Safari</li>
              <li>Role para baixo e selecione <strong>Adicionar à Tela de Início</strong> <span className="inline-block bg-gray-800 rounded p-0.5 text-xs">➕</span></li>
            </ol>
          </div>
        ) : (
          <button 
            onClick={handleInstallClick}
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 rounded-lg mt-1 flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Instalar Agora
          </button>
        )}
      </div>
    </div>
  );
};

export default PwaInstallPrompt;
