'use client';

import { useState } from 'react';
import { Award, Calendar, Smartphone, Trophy, ArrowRight, ExternalLink } from 'lucide-react';
import BookingModal from '@/components/ui/BookingModal';
import { OFFICIAL_WELLHUB } from '@/lib/utils';

export default function WellhubSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const steps = [
    {
      number: '01',
      title: 'Agende seu Horário com Antecedência',
      desc: 'Como operamos com vagas controladas por horário para garantir que você treine sem fila, reserve seu horário desejado pelo WhatsApp oficial ou formulário.',
      detail: 'Janela Wellhub: Seg a Qui 07h-20h | Sex 07h-19h | Sáb 08h-11h',
      icon: Calendar,
    },
    {
      number: '02',
      title: 'Realize o Check-in no App Wellhub',
      desc: 'No dia da sua sessão agendada, abra o aplicativo do Wellhub em seu celular e faça o check-in selecionando a unidade FORMCLUB - Vila Galvão.',
      detail: 'Planos aceitos: Silver, Silver+, Gold, Platinum e Diamond',
      icon: Smartphone,
    },
    {
      number: '03',
      title: 'Evolua com Suporte Técnico Integral',
      desc: 'Apresente o check-in validado na recepção e treine com suporte dedicado da nossa equipe de treinadores, aproveitando todos os vestiários e comodidades.',
      detail: 'Treino assistido, equipamentos de ponta e vestiários privativos',
      icon: Trophy,
    },
  ];

  return (
    <>
      <section id="wellhub" className="py-24 relative overflow-hidden bg-obsidian border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-surface p-8 sm:p-12 lg:p-16 rounded-3xl border border-white/10 relative overflow-hidden">
            {/* Background luxury gradient banner */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest uppercase mb-4">
                <Award className="w-3.5 h-3.5" />
                <span>Benefício Corporativo Premium</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight mb-4">
                Treine na FORMCLUB com o seu plano{' '}
                <span className="text-emerald-400">Wellhub Silver+.</span>
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                Somos parceiros oficiais credenciados do Wellhub (antigo Gympass). Se você possui o benefício Silver+ ou superior pela sua empresa, pode desfrutar de toda a nossa estrutura boutique e atendimento próximo mediante agendamento prévio.
              </p>
            </div>

            {/* 3 Step Visual Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-charcoal/60 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <span className="font-mono text-2xl font-bold text-emerald-400/80">
                          {step.number}
                        </span>
                        <div className="p-2.5 rounded-xl bg-white/5 text-emerald-400 border border-white/5">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                      <h3 className="font-heading font-bold text-base sm:text-lg text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                        {step.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-emerald-400/90">
                      {step.detail}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
              <div className="text-xs text-zinc-400 text-center sm:text-left">
                Vagas exclusivas reservadas para usuários Wellhub por faixa de horário.
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-obsidian font-bold text-xs tracking-wide transition-all shadow-lg shadow-emerald-950/40"
                >
                  <span>Agendar com Wellhub Silver+</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={OFFICIAL_WELLHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-zinc-200 text-xs font-medium border border-white/10 transition-colors"
                >
                  <span>Página Oficial no Wellhub</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialAccessType="Sou membro Wellhub Silver+"
      />
    </>
  );
}
