import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check, QrCode, Smartphone, ExternalLink, RefreshCw } from 'lucide-react';
import api from '../../services/api';

export default function MonitoringInvitePage() {
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Gera ou resgata token da organização
  useEffect(() => {
    // Usamos um token fixo derivado da organização do treinador ou um default 'formclub-org'
    const stored = localStorage.getItem('monitoring_invite_token') || 'formclub-hub';
    setToken(stored);
    setLoading(false);
  }, []);

  const isCustomDomain = window.location.hostname.includes('formclub.com.br');
  const basePath = isCustomDomain ? '' : (window.location.pathname.startsWith('/academia') ? '/academia' : '');
  const fullUrl = `${window.location.origin}${basePath}/#/checkin/${token}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Share2 className="h-7 w-7 text-primary" /> Central de Convite de Monitoramento
        </h1>
        <p className="text-sm text-gray-400">
          Envie o link exclusivo para seus atletas responderem ao check-in diário de Bem-Estar e Pré-Treino sem precisar digitar e-mail ou senha.
        </p>
      </div>

      {/* Card do Link de Convite */}
      <div className="bg-surface border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-primary">
            Link Rápido Sem Senha (Zero Friction)
          </span>
          <h2 className="text-xl font-bold text-white">
            Compartilhe via WhatsApp com seus Atletas
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Ao abrir este link, o atleta apenas seleciona sua data de nascimento para confirmar sua identidade e já cai diretamente no questionário diário.
          </p>
        </div>

        {/* Input e Botão Copiar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            readOnly
            value={fullUrl}
            className="w-full px-4 py-3 bg-background border border-gray-700 rounded-xl text-white font-mono text-sm focus:outline-none select-all"
          />
          <button
            onClick={handleCopy}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 shrink-0 ${
              copied
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Link Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copiar Link
              </>
            )}
          </button>
        </div>

        {/* QR Code e Ações Auxiliares */}
        <div className="pt-6 border-t border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-background/50 border border-gray-800 rounded-2xl flex items-center gap-4">
            <Smartphone className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">PWA / Tela Inicial</h4>
              <p className="text-xs text-gray-400">
                O atleta pode salvar na tela de início do celular com 1 toque.
              </p>
            </div>
          </div>

          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-background/50 border border-gray-800 hover:border-gray-700 rounded-2xl flex items-center justify-between group transition"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-primary transition" />
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-primary transition">
                  Testar Visão do Atleta
                </h4>
                <p className="text-xs text-gray-400">Abrir tela de check-in em nova aba</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
