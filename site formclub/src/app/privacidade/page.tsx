import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, FileText, ArrowLeft, Mail, Phone } from 'lucide-react';
import { OFFICIAL_PHONE, OFFICIAL_ADDRESS } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Política de Privacidade & LGPD | FORMCLUB',
  description:
    'Diretrizes de privacidade, proteção de dados e conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) da FORMCLUB.',
};

export default function PrivacidadePage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-obsidian">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao site
          </Link>
        </div>

        <div className="glass-surface p-8 sm:p-12 rounded-3xl border border-white/10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Conformidade Legal • Lei nº 13.709/2018</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white mb-3">
              Política de Privacidade e Proteção de Dados Pessoais
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              Última atualização: 13 de Outubro de 2026 • Versão 2.1
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/10 pt-6">
            <section className="space-y-2">
              <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
                1. Quem Somos e Nosso Compromisso
              </h2>
              <p>
                A <strong>FORMCLUB — Centro de Treinamento e Performance</strong>, sediada na {OFFICIAL_ADDRESS}, está comprometida em resguardar sua privacidade e proteger seus dados pessoais nos mais estritos padrões da <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
                2. Princípio da Minimização de Dados (Art. 6º, III)
              </h2>
              <p>
                Coletamos apenas as informações estritamente necessárias para viabilizar o agendamento da sua sessão experimental e o contato do nosso consultor via WhatsApp:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li><strong>Nome Completo:</strong> para identificação do visitante e reserva na recepção;</li>
                <li><strong>Número de WhatsApp:</strong> para envio de confirmação de horário e suporte;</li>
                <li><strong>Objetivo Principal &amp; Turno Preferido:</strong> para dimensionamento da vaga e preparação do treinador responsável.</li>
              </ul>
              <p className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300">
                <strong>Importante:</strong> Não coletamos laudos clínicos, dados sensíveis de saúde ou informações financeiras através deste website público.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
                3. Finalidade e Base Legal do Tratamento
              </h2>
              <p>
                O tratamento dos dados baseia-se no seu <strong>Consentimento Livre e Inequívoco (Art. 7º, I da LGPD)</strong> ao assinalar a caixa de confirmação no formulário e na <strong>Execução de Procedimentos Preliminares relacionados ao contrato de prestação de serviços (Art. 7º, V da LGPD)</strong>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
                4. Segurança da Informação &amp; NetSecOps
              </h2>
              <p>
                Implementamos controles técnicos rigorosos de segurança:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li>Criptografia de ponta a ponta (TLS 1.3 / HTTPS);</li>
                <li>Proteção contra ataques de negação de serviço e Rate Limiting em nossas APIs;</li>
                <li>Anonimização criptográfica (Hash SHA-256) de endereços IP para registro de auditoria sem exposição de dados brutos;</li>
                <li>Zero compartilhamento de dados com terceiros não autorizados para fins de marketing abusivo.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
                5. Seus Direitos como Titular de Dados (Art. 18 da LGPD)
              </h2>
              <p>
                Você possui total direito de, a qualquer momento e mediante solicitação simples e gratuita:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li>Confirmar a existência de tratamento dos seus dados;</li>
                <li>Acessar seus dados pessoais cadastrados;</li>
                <li>Solicitar a correção de dados incompletos ou inexatos;</li>
                <li>Solicitar a anonimização, bloqueio ou <strong>eliminação completa dos seus dados pessoais</strong>;</li>
                <li>Revogar o consentimento previamente fornecido.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
                6. Canal do Encarregado de Dados (DPO)
              </h2>
              <p>
                Para exercer qualquer um dos seus direitos ou esclarecer dúvidas sobre o tratamento de dados, entre em contato diretamente com nossa administração:
              </p>
              <div className="p-4 rounded-xl bg-charcoal border border-white/5 space-y-1 text-xs font-mono text-zinc-300">
                <p>• <strong>Encarregado de Proteção de Dados:</strong> DPO FORMCLUB</p>
                <p>• <strong>WhatsApp Direto:</strong> {OFFICIAL_PHONE}</p>
                <p>• <strong>Atendimento Presencial:</strong> {OFFICIAL_ADDRESS}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
