import { Metadata } from 'next';
import { Award, CheckCircle2, Clock, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import BookingWizard from '@/components/sections/BookingWizard';
import { OFFICIAL_WELLHUB } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Treine na FORMCLUB com Wellhub Silver+ | Guarulhos',
  description:
    'Aproveite seu benefício Wellhub (Gympass) Silver+ no melhor centro de treinamento de Guarulhos. Acesso com hora marcada, vestiários com duchas e atendimento próximo.',
};

export default function WellhubPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-obsidian">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest uppercase mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>Parceiro Oficial Credenciado</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            Sua Experiência <span className="text-emerald-400">Wellhub Silver+</span> na FORMCLUB
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Se sua empresa disponibiliza o benefício corporativo do Wellhub (antigo Gympass), você pode treinar em nosso centro de performance com toda a exclusividade e supervisão técnica.
          </p>
        </div>

        {/* Benefits & Schedule Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <div className="lg:col-span-7 glass-surface p-7 sm:p-10 rounded-3xl border border-white/10 space-y-6">
            <h2 className="font-heading font-bold text-2xl text-white">
              Como funciona o acesso via Wellhub
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-charcoal border border-white/5 flex items-start gap-3.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-white">Planos Elegíveis</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Aceitamos membros com plano <strong>Silver+</strong>, Gold, Platinum e Diamond ativos.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-charcoal border border-white/5 flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-white">Horários de Check-in para Usuários Wellhub</h3>
                  <div className="text-xs text-zinc-400 mt-1 space-y-0.5 font-mono">
                    <p>• Segunda a Quinta-feira: <strong>07h00 às 20h00</strong></p>
                    <p>• Sexta-feira: <strong>07h00 às 19h00</strong></p>
                    <p>• Sábado: <strong>08h00 às 11h00</strong></p>
                    <p>• Domingo: Fechado</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-charcoal border border-white/5 flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-white">Regra de Hora Marcada</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Diferente de academias massificadas, limitamos a quantidade de alunos por horário. Por isso, <strong>o pré-agendamento via WhatsApp ou formulário é indispensável</strong> antes de se dirigir à unidade.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={OFFICIAL_WELLHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline"
              >
                <span>Ver página da unidade FORMCLUB no aplicativo Wellhub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Form container */}
          <div className="lg:col-span-5">
            <div className="mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block mb-1">
                Agendamento Rápido
              </span>
              <h2 className="font-heading font-bold text-xl text-white">
                Reserve sua sessão pelo benefício
              </h2>
            </div>
            <BookingWizard initialAccessType="Sou membro Wellhub Silver+" />
          </div>
        </div>
      </div>
    </div>
  );
}
