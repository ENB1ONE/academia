'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/utils';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);

  const defaultLink = generateWhatsAppLink({
    customMessage: 'Olá, equipe FORMCLUB! Vim pelo site oficial e gostaria de agendar uma sessão experimental.',
  });

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip */}
      <div
        className={`hidden sm:block glass-surface px-4 py-2 rounded-full text-xs font-medium text-alabaster border border-bronze/30 shadow-lg shadow-black/40 transition-all duration-300 pointer-events-none ${
          showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          Agende sua sessão experimental
        </span>
      </div>

      {/* Floating CTA Button */}
      <a
        href={defaultLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com consultor FORMCLUB no WhatsApp (11) 98996-0961"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white shadow-xl shadow-emerald-950/50 hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
      >
        {/* Pulsing ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/40 animate-pulse pointer-events-none" />
        <MessageCircle className="w-7 h-7 fill-white/10 stroke-[2.2]" />
      </a>
    </div>
  );
}
