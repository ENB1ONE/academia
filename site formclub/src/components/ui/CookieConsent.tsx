'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('formclub_cookie_consent');
    if (!consent) {
      // Show banner after short delay for optimal UX
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('formclub_cookie_consent', 'all');
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('formclub_cookie_consent', 'essential');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="glass-surface p-5 rounded-2xl shadow-2xl border border-white/10 relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-zinc-400 hover:text-white transition-colors"
          aria-label="Fechar aviso de cookies"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 mb-3">
          <div className="p-2 rounded-xl bg-bronze/10 border border-bronze/20 text-bronze mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-white">Privacidade & Cookies (LGPD)</h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Utilizamos cookies para aprimorar sua experiência de navegação e personalizar o agendamento de sessões na FORMCLUB em total conformidade com a LGPD (Lei nº 13.709/2018).
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 pt-3 border-t border-white/5">
          <button
            onClick={handleAcceptAll}
            className="w-full sm:w-auto px-4 py-2 rounded-full bg-bronze hover:bg-bronze-light text-obsidian text-xs font-semibold transition-all"
          >
            Aceitar Todos
          </button>
          <button
            onClick={handleAcceptEssential}
            className="w-full sm:w-auto px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium transition-all"
          >
            Apenas Essenciais
          </button>
          <Link
            href="/privacidade"
            className="text-[11px] text-zinc-400 hover:text-bronze underline ml-auto py-1"
          >
            Saiba mais
          </Link>
        </div>
      </div>
    </div>
  );
}
