'use client';

import { useState } from 'react';
import { Check, ArrowRight, ArrowLeft, Loader2, Sparkles, Shield, Clock, Phone, User } from 'lucide-react';
import { formatWhatsAppNumber } from '@/lib/utils';

interface BookingWizardProps {
  isModal?: boolean;
  initialGoal?: string;
  initialAccessType?: string;
  onSuccess?: () => void;
}

const GOALS = [
  { id: 'hipertrofia', title: 'Hipertrofia & Estética', desc: 'Ganho de massa magra, força e definição' },
  { id: 'condicionamento', title: 'Condicionamento & Emagrecimento', desc: 'Queima de gordura e capacidade metabólica' },
  { id: 'hibrido', title: 'Treino Híbrido', desc: 'Força aliada a resistência cardiovascular' },
  { id: 'futebol', title: 'Performance Esportiva / Futebol', desc: 'Aceleração, agilidade e prevenção de lesões' },
  { id: 'mobilidade', title: 'Saúde, Mobilidade & Qualidade de Vida', desc: 'Alívio de dores, postura e longevidade' },
];

const ACCESS_TYPES = [
  {
    id: 'planos',
    title: 'Quero conhecer os Planos FORMCLUB',
    badge: 'Exclusivo',
    desc: 'Planos Mensal ou Semestral com acompanhamento técnico contínuo.',
  },
  {
    id: 'wellhub',
    title: 'Sou membro Wellhub Silver+',
    badge: 'Parceiro Oficial',
    desc: 'Utilize seu benefício corporativo Silver, Gold, Platinum ou Diamond.',
  },
  {
    id: 'personal',
    title: 'Busco Personal Trainer Individual',
    badge: '1 a 1',
    desc: 'Atenção 100% exclusiva para metas específicas e alta performance.',
  },
];

const SHIFTS = [
  { id: 'Manhã', label: 'Manhã', time: '07h00 às 12h00', desc: 'Inicie o dia com energia' },
  { id: 'Tarde', label: 'Tarde', time: '12h00 às 17h00', desc: 'Horários flexíveis' },
  { id: 'Noite', label: 'Noite', time: '17h00 às 22h00', desc: 'Desconecte e supere limites' },
];

export default function BookingWizard({
  isModal = false,
  initialGoal,
  initialAccessType,
  onSuccess,
}: BookingWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedGoal, setSelectedGoal] = useState<string>(initialGoal || GOALS[0].title);
  const [selectedAccess, setSelectedAccess] = useState<string>(
    initialAccessType || ACCESS_TYPES[0].title
  );
  const [selectedShift, setSelectedShift] = useState<'Manhã' | 'Tarde' | 'Noite'>('Manhã');

  const [fullName, setFullName] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [lgpdConsent, setLgpdConsent] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ whatsappUrl: string } | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsapp(formatWhatsAppNumber(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (fullName.trim().length < 3) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }

    const rawDigits = whatsapp.replace(/\D/g, '');
    if (rawDigits.length < 10 || rawDigits.length > 11) {
      setErrorMessage('Confira seu número de WhatsApp com DDD para garantirmos o seu agendamento.');
      return;
    }

    if (!lgpdConsent) {
      setErrorMessage('É necessário concordar com os termos de agendamento (LGPD).');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          whatsapp,
          goal: selectedGoal,
          accessType: selectedAccess,
          preferredShift: selectedShift,
          lgpdConsent: true,
          utmSource: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') || 'website' : 'website',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao processar agendamento.');
      }

      setSuccessData({ whatsappUrl: data.whatsappUrl });
      if (onSuccess) {
        onSuccess();
      }

      // Automatically redirect to WhatsApp after 1.5 seconds or let user click
      setTimeout(() => {
        window.open(data.whatsappUrl, '_blank');
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocorreu um erro ao enviar. Tente novamente ou chame no WhatsApp.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative w-full ${
        isModal
          ? 'p-0'
          : 'glass-surface p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl'
      }`}
    >
      {/* Step Indicator Header */}
      {!successData && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-widest text-zinc-400 font-mono">
            <span>Passo {step} de 3</span>
            <span className="text-bronze font-medium">
              {step === 1 && 'Seu Objetivo'}
              {step === 2 && 'Tipo de Acesso'}
              {step === 3 && 'Horário & Confirmação'}
            </span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-bronze to-volt transition-all duration-500 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Success State */}
      {successData ? (
        <div className="text-center py-8 px-4 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-white mb-2">
            Solicitação Recebida com Sucesso!
          </h3>
          <p className="text-sm text-zinc-300 max-w-md mx-auto mb-6 leading-relaxed">
            Seu pré-agendamento para o período da <strong className="text-white">{selectedShift}</strong> com foco em <strong className="text-bronze">{selectedGoal}</strong> foi registrado em nosso sistema.
          </p>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-md mx-auto mb-6 text-xs text-zinc-400 text-left">
            <p className="flex items-center gap-2 mb-1 text-zinc-200 font-medium">
              <Sparkles className="w-4 h-4 text-bronze" /> Redirecionando para o WhatsApp...
            </p>
            Caso a conversa não abra automaticamente, clique no botão dourado abaixo:
          </div>
          <a
            href={successData.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-bronze hover:bg-bronze-light text-obsidian font-semibold text-sm transition-all shadow-lg shadow-bronze/20 hover:scale-[1.02]"
          >
            Abrir WhatsApp Oficial (11) 98996-0961
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      ) : (
        <div>
          {/* STEP 1: OBJETIVO */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2">
                  Qual é o seu objetivo prioritário hoje?
                </h3>
                <p className="text-sm text-zinc-400">
                  Nossos treinadores estruturam a metodologia baseando-se na sua necessidade física individual.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {GOALS.map((goal) => {
                  const isSelected = selectedGoal === goal.title;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setSelectedGoal(goal.title)}
                      className={`text-left p-4 rounded-2xl border transition-all flex items-start justify-between group ${
                        isSelected
                          ? 'bg-bronze/10 border-bronze shadow-md shadow-bronze/10'
                          : 'bg-charcoal/50 border-white/5 hover:border-white/20 hover:bg-charcoal'
                      }`}
                    >
                      <div>
                        <div className="font-heading font-semibold text-sm text-white flex items-center gap-2">
                          {goal.title}
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">{goal.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 transition-colors ${
                          isSelected
                            ? 'bg-bronze border-bronze text-obsidian'
                            : 'border-white/20 group-hover:border-white/40'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-bronze hover:bg-bronze-light text-obsidian font-semibold text-sm transition-all"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: TIPO DE ACESSO */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2">
                  Como você prefere treinar conosco?
                </h3>
                <p className="text-sm text-zinc-400">
                  Temos opções particulares sob medida e parceria oficial com o plano Wellhub Silver+.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {ACCESS_TYPES.map((access) => {
                  const isSelected = selectedAccess === access.title;
                  return (
                    <button
                      key={access.id}
                      type="button"
                      onClick={() => setSelectedAccess(access.title)}
                      className={`text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between group ${
                        isSelected
                          ? 'bg-bronze/10 border-bronze shadow-md shadow-bronze/10'
                          : 'bg-charcoal/50 border-white/5 hover:border-white/20 hover:bg-charcoal'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2.5 mb-1">
                          <span className="font-heading font-semibold text-sm text-white">
                            {access.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-white/10 text-zinc-300">
                            {access.badge}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">{access.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1 transition-colors ${
                          isSelected
                            ? 'bg-bronze border-bronze text-obsidian'
                            : 'border-white/20 group-hover:border-white/40'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 text-sm font-medium transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-bronze hover:bg-bronze-light text-obsidian font-semibold text-sm transition-all"
                >
                  Próximo Passo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONTATO E TURNO */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2">
                  Seus dados e melhor período para treinar
                </h3>
                <p className="text-sm text-zinc-400">
                  Enviaremos a confirmação dos horários livres diretamente no seu WhatsApp oficial.
                </p>
              </div>

              {/* Turno Preferido */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-bronze" /> Período de Treino Desejado
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {SHIFTS.map((shift) => {
                    const isSelected = selectedShift === shift.id;
                    return (
                      <button
                        key={shift.id}
                        type="button"
                        onClick={() => setSelectedShift(shift.id as 'Manhã' | 'Tarde' | 'Noite')}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-bronze/15 border-bronze text-white font-medium'
                            : 'bg-charcoal/40 border-white/5 text-zinc-400 hover:border-white/20'
                        }`}
                      >
                        <div className="text-sm font-semibold">{shift.label}</div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{shift.time}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Campos de Nome e WhatsApp */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-bronze" /> Nome Completo
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Silveira"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-charcoal/80 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-bronze" /> WhatsApp com DDD
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={handlePhoneChange}
                    placeholder="(11) 98996-0961"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-charcoal/80 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze transition-all font-mono"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Enviaremos a confirmação de horário disponível por este número.
                  </p>
                </div>
              </div>

              {/* Consentimento LGPD */}
              <div className="pt-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={lgpdConsent}
                    onChange={(e) => setLgpdConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-zinc-700 text-bronze bg-charcoal focus:ring-bronze"
                  />
                  <span className="text-xs text-zinc-400 leading-relaxed group-hover:text-zinc-300">
                    Concordo em receber o contato da FORMCLUB para agendamento e informações via WhatsApp, de acordo com a{' '}
                    <a href="/privacidade" target="_blank" className="text-bronze underline">
                      Política de Privacidade (LGPD)
                    </a>.
                  </span>
                </label>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="flex items-center justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 text-sm font-medium transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-bronze hover:bg-bronze-light text-obsidian font-semibold text-sm transition-all shadow-lg shadow-bronze/20 hover:scale-[1.02] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Confirmar Pré-Agendamento
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-mono">
                <Shield className="w-3.5 h-3.5 text-zinc-400" />
                Seus dados estão protegidos sob a LGPD • Zero spam
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
