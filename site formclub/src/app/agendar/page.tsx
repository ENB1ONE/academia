'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Star, ShieldCheck, Clock, Award, MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import BookingWizard from '@/components/sections/BookingWizard';
import { OFFICIAL_PHONE, generateWhatsAppLink } from '@/lib/utils';

function AgendarContent() {
  const searchParams = useSearchParams();
  const initialGoal = searchParams.get('objetivo') || undefined;

  return (
    <div className="pt-28 pb-20 min-h-screen bg-obsidian flex flex-col justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        {/* Top Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao site principal
          </Link>
        </div>

        {/* Page Title & Squeeze Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-bronze/10 border border-bronze/20 text-bronze text-xs font-mono tracking-widest uppercase mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Vagas Limitadas por Faixa Horária</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-3">
            Agende sua Sessão Experimental na{' '}
            <span className="text-gradient-gold">FORMCLUB</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Treine com hora marcada, supervisão dedicada e zero espera por equipamentos. Preencha abaixo e receba a confirmação no WhatsApp.
          </p>

          {/* Micro trust row */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> 5.0 no Google (72+ avaliações)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Award className="w-3.5 h-3.5" /> Wellhub Silver+ Aceito
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-bronze" /> LGPD &amp; Zero Spam
            </span>
          </div>
        </div>

        {/* The Booking Wizard Card */}
        <div className="glass-surface p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <BookingWizard initialGoal={initialGoal} />
        </div>

        {/* WhatsApp Fast Track Fallback */}
        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-500 mb-2">Prefere falar imediatamente com um consultor?</p>
          <a
            href={generateWhatsAppLink({ customMessage: 'Olá! Estou na página de agendamento e gostaria de falar com um consultor da FORMCLUB.' })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-mono transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Chamar no WhatsApp direto: {OFFICIAL_PHONE}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AgendarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-obsidian flex items-center justify-center text-zinc-500">Carregando formulário...</div>}>
      <AgendarContent />
    </Suspense>
  );
}
