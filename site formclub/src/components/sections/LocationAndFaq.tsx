'use client';

import { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  ChevronDown,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { FAQ_ITEMS } from '@/lib/data';
import {
  OFFICIAL_ADDRESS,
  OFFICIAL_PHONE,
  GOOGLE_MAPS_URL,
  WAZE_URL,
  generateWhatsAppLink,
} from '@/lib/utils';

export default function LocationAndFaq() {
  const [activeHoursTab, setActiveHoursTab] = useState<'geral' | 'wellhub'>('geral');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="localizacao" className="py-24 relative overflow-hidden bg-obsidian-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-bronze/10 border border-bronze/20 text-bronze text-xs font-mono tracking-widest uppercase mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>Localização &amp; Informações Práticas</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight mb-4">
            Venha nos conhecer na{' '}
            <span className="text-gradient-gold">Vila Galvão, Guarulhos.</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Localização privilegiada na Avenida Dr. Timóteo Penteado com acesso facilitado e horários pensados para conciliar com sua agenda executiva.
          </p>
        </div>

        {/* Location & Hours Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Left Column: Location Card & Navigation Buttons (7 cols) */}
          <div className="lg:col-span-7 glass-surface p-7 sm:p-9 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-bronze mb-3">
                <span className="w-2 h-2 rounded-full bg-bronze" />
                Edifício Comercial Timóteo Penteado
              </div>

              <h3 className="font-heading font-bold text-2xl text-white mb-3">
                Av. Dr. Timóteo Penteado, 3738
              </h3>

              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                1º andar — Salas 7 e 8 • Vila Galvão, Guarulhos - SP • CEP 07061-002
              </p>

              <div className="p-4 rounded-2xl bg-charcoal border border-white/5 mb-6 text-xs text-zinc-400 space-y-1.5">
                <div className="text-white font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Pontos de Referência Notáveis:
                </div>
                <p>• Em frente à tradicional <strong>Cantina Giovanni</strong></p>
                <p>• A poucos metros do <strong>McDonald&apos;s da Vila Galvão</strong></p>
                <p>• Acesso rápido pela Rodovia Fernão Dias e Anel Viário</p>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-3">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-bronze" />
                <span>Google Maps</span>
              </a>

              <a
                href={WAZE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Abrir no Waze</span>
              </a>

              <a
                href={generateWhatsAppLink({ customMessage: 'Olá! Estou a caminho da FORMCLUB na Vila Galvão e gostaria de confirmar meu agendamento.' })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-md shadow-emerald-950/40"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Recepção</span>
              </a>
            </div>
          </div>

          {/* Right Column: Toggleable Operating Hours Table (5 cols) */}
          <div className="lg:col-span-5 glass-surface p-7 sm:p-9 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-bronze" />
                  Quadro de Horários
                </h3>
              </div>

              {/* Tabs */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-charcoal border border-white/5 mb-6">
                <button
                  onClick={() => setActiveHoursTab('geral')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeHoursTab === 'geral'
                      ? 'bg-bronze text-obsidian shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Horário do Clube
                </button>
                <button
                  onClick={() => setActiveHoursTab('wellhub')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeHoursTab === 'wellhub'
                      ? 'bg-emerald-500 text-obsidian shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Wellhub Silver+
                </button>
              </div>

              {/* Tab 1: Horário Geral */}
              {activeHoursTab === 'geral' && (
                <div className="space-y-3.5 text-xs animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-xl bg-white/5 flex items-center justify-between border border-white/5">
                    <span className="text-zinc-300 font-medium">Segunda a Sexta-feira</span>
                    <span className="font-mono text-white font-bold">09h00 às 22h00</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 flex items-center justify-between border border-white/5">
                    <span className="text-zinc-300 font-medium">Sábados</span>
                    <span className="font-mono text-white font-bold">08h00 às 13h00</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 flex items-center justify-between border border-white/5 text-zinc-500">
                    <span>Domingos e Feriados</span>
                    <span className="font-mono">Fechado para Manutenção</span>
                  </div>
                </div>
              )}

              {/* Tab 2: Janela Wellhub */}
              {activeHoursTab === 'wellhub' && (
                <div className="space-y-3.5 text-xs animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-xl bg-white/5 flex items-center justify-between border border-emerald-500/20">
                    <span className="text-zinc-300 font-medium">Segunda a Quinta</span>
                    <span className="font-mono text-emerald-400 font-bold">07h00 às 20h00</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 flex items-center justify-between border border-emerald-500/20">
                    <span className="text-zinc-300 font-medium">Sexta-feira</span>
                    <span className="font-mono text-emerald-400 font-bold">07h00 às 19h00</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 flex items-center justify-between border border-emerald-500/20">
                    <span className="text-zinc-300 font-medium">Sábados</span>
                    <span className="font-mono text-emerald-400 font-bold">08h00 às 11h00</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 flex items-center justify-between border border-white/5 text-zinc-500">
                    <span>Domingos</span>
                    <span className="font-mono">Fechado</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/5 text-[11px] text-zinc-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-volt" />
              Agendamento de horário obrigatório com antecedência.
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div id="faq" className="max-w-4xl mx-auto scroll-mt-24">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-zinc-300 text-xs font-mono uppercase tracking-widest mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-bronze" />
              <span>Dúvidas Frequentes</span>
            </div>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Tudo o que você precisa saber antes da sua sessão
            </h3>
          </div>

          <div className="space-y-3.5">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="glass-surface rounded-2xl border border-white/10 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-heading font-semibold text-sm sm:text-base text-white">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-bronze shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-4 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
