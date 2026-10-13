import { COMPARISON_POINTS } from '@/lib/data';
import { XCircle, CheckCircle2, ShieldCheck, Flame, Compass } from 'lucide-react';

export default function ManifestoComparison() {
  return (
    <section id="conceito" className="py-24 relative overflow-hidden bg-obsidian-900 border-t border-white/5">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-bronze/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-bronze/10 border border-bronze/20 text-bronze text-xs font-mono tracking-widest uppercase mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Por que a FORMCLUB é diferente</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight mb-5">
            Projetada para quem valoriza tempo, privacidade e{' '}
            <span className="text-gradient-gold">resultado real.</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Inspirada nos mais exclusivos centros de treinamento boutique do país, a FORMCLUB nasceu para eliminar os atritos do treino convencional. Sem filas para revezar aparelhos, sem treinos genéricos e sem ambientes caóticos. Cada sessão é agendada e acompanhada por especialistas focados na sua biomecânica e evolução.
          </p>
        </div>

        {/* Comparison Table / Cards */}
        <div className="space-y-4 max-w-5xl mx-auto">
          {/* Header row for desktop */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 text-xs font-mono uppercase tracking-wider text-zinc-500">
            <div className="col-span-3">Pilar de Experiência</div>
            <div className="col-span-4 text-zinc-400">Academias Convencionais</div>
            <div className="col-span-5 text-bronze font-semibold">Experiência FORMCLUB</div>
          </div>

          {COMPARISON_POINTS.map((item, idx) => (
            <div
              key={idx}
              className="glass-surface p-5 sm:p-6 rounded-2xl border border-white/10 hover:border-bronze/30 transition-all duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-4 items-center">
                {/* Feature Name */}
                <div className="md:col-span-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-bronze/80 block mb-1">
                    Critério 0{idx + 1}
                  </span>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                    {item.feature}
                  </h3>
                  <span className="text-[11px] text-zinc-500 font-mono hidden md:block mt-1">
                    {item.advantage}
                  </span>
                </div>

                {/* Conventional Gym */}
                <div className="md:col-span-4 p-3.5 rounded-xl bg-red-950/20 border border-red-500/20 text-xs text-zinc-400 flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-red-400/80 block mb-0.5 md:hidden">
                      Rede Convencional
                    </span>
                    <span>{item.conventional}</span>
                  </div>
                </div>

                {/* FORMCLUB */}
                <div className="md:col-span-5 p-4 rounded-xl bg-gradient-to-r from-bronze/15 to-transparent border border-bronze/30 text-xs sm:text-sm text-zinc-200 flex items-start gap-3 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-bronze shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-bronze font-bold block mb-0.5 md:hidden">
                      Padrão FORMCLUB
                    </span>
                    <strong className="text-white font-medium">{item.formclub}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Assurance Banner */}
        <div className="mt-12 max-w-4xl mx-auto p-5 rounded-2xl bg-gradient-to-r from-charcoal via-charcoal-hover to-charcoal border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-volt/10 text-volt border border-volt/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm text-white">
                Compromisso com o seu tempo
              </h4>
              <p className="text-xs text-zinc-400">
                Seu horário reservado é sagrado. Você treina sem fila e conclui sua sessão no tempo planejado.
              </p>
            </div>
          </div>
          <a
            href="/agendar"
            className="shrink-0 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-xs font-semibold text-white transition-colors"
          >
            Garantir Minha Vaga
          </a>
        </div>
      </div>
    </section>
  );
}
