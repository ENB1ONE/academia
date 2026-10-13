'use client';

import { Check, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import BookingWizard from './BookingWizard';

export default function PlansSection() {
  const plans = [
    {
      name: 'Plano Performance',
      period: 'Adesão Mensal Flexível',
      tag: 'Mais Dinâmico',
      desc: 'Ideal para quem busca flexibilidade máxima sem fidelidade, com acesso total à metodologia FORMCLUB.',
      features: [
        'Agendamento garantido em todas as 6 modalidades',
        'Supervisão técnica contínua e correção biomecânica',
        'Acesso livre aos vestiários com amenities e duchas',
        'Avaliação e ajuste de intensidade quinzenal',
      ],
      isPopular: false,
    },
    {
      name: 'Plano Evolução',
      period: 'Semestral / Anual',
      tag: 'Recomendado',
      desc: 'O compromisso com a transformação sólida e consistente do seu físico e saúde a longo prazo.',
      features: [
        'Prioridade máxima na reserva de faixas horárias',
        'Planejamento de periodização personalizada',
        'Todos os benefícios do plano mensal inclusos',
        'Condições especiais para renovação e congelamento',
      ],
      isPopular: true,
    },
    {
      name: 'Membro Wellhub',
      period: 'A partir do Plano Silver+',
      tag: 'Corporativo',
      desc: 'Utilize o benefício corporativo da sua empresa com toda a sofisticação e qualidade do nosso clube.',
      features: [
        'Check-in diário no app Wellhub (Silver+ e superior)',
        'Reserva prévia obrigatória de horário via WhatsApp',
        'Supervisão completa de nossos treinadores',
        'Acesso a todas as áreas e equipamentos high-tech',
      ],
      isPopular: false,
    },
  ];

  return (
    <section id="planos" className="py-24 relative overflow-hidden bg-obsidian border-t border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-bronze/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-bronze/10 border border-bronze/20 text-bronze text-xs font-mono tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Formatos de Adesão Sob Medida</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight mb-4">
            Consultoria e acompanhamento que se adaptam à{' '}
            <span className="text-gradient-gold">sua rotina.</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Assim como os estúdios mais exclusivos do país, trabalhamos com atendimento consultivo e número restrito de alunos por período para garantir padrão máximo em cada sessão.
          </p>
        </div>

        {/* 3 Membership Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                plan.isPopular
                  ? 'glass-surface border-2 border-bronze shadow-2xl shadow-bronze/10 scale-100 lg:scale-105 z-10'
                  : 'glass-surface border border-white/10 hover:border-white/20'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-bronze text-obsidian font-mono text-[10px] uppercase tracking-wider font-extrabold shadow-md">
                  Mais Escolhido
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-bronze">
                    {plan.tag}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">{plan.period}</span>
                </div>

                <h3 className="font-heading font-bold text-2xl text-white mb-3">
                  {plan.name}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  {plan.desc}
                </p>

                <div className="space-y-3 mb-8 pt-4 border-t border-white/5">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <Check className="w-4 h-4 text-bronze shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <a
                  href="#agendamento-direto"
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-xs tracking-wide transition-all ${
                    plan.isPopular
                      ? 'bg-bronze hover:bg-bronze-light text-obsidian shadow-lg shadow-bronze/20'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  <span>Consultar Condições &amp; Agendar</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Embedded 3-Step Booking Wizard */}
        <div id="agendamento-direto" className="max-w-3xl mx-auto scroll-mt-24">
          <div className="text-center mb-8">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-volt/10 text-volt border border-volt/20">
              Vagas Limitadas por Faixa Horária
            </span>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mt-3 mb-2">
              Pré-Agende sua Sessão em 3 Cliques
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Escolha seu objetivo e turno preferido. Entraremos em contato com a grade de horários disponíveis.
            </p>
          </div>

          <BookingWizard />
        </div>
      </div>
    </section>
  );
}
