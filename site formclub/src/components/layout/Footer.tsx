import Link from 'next/link';
import { Instagram, Phone, MapPin, Clock, ShieldCheck, ExternalLink, ArrowUpRight } from 'lucide-react';
import {
  OFFICIAL_ADDRESS,
  OFFICIAL_INSTAGRAM,
  OFFICIAL_PHONE,
  OFFICIAL_WELLHUB,
  GOOGLE_MAPS_URL,
  generateWhatsAppLink,
} from '@/lib/utils';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-obsidian-950 border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-bronze/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-white/5">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <Link href="/" className="inline-block focus:outline-none">
              <div className="relative h-12 w-52 mb-2">
                <img
                  src="/formclub.com.br/images/formclub-logo.png"
                  alt="FORMCLUB - Human Performance Center"
                  className="w-full h-full object-contain filter brightness-110"
                />
              </div>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Centro de Treinamento e Performance de alto padrão na Vila Galvão, Guarulhos. A união entre ciência biomecânica, exclusividade de horário e hospitalidade boutique.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={OFFICIAL_INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-bronze text-xs font-mono transition-colors"
                aria-label="Instagram @form.club"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>@form.club</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-500" />
              </a>

              <a
                href={OFFICIAL_WELLHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-bronze text-xs font-mono transition-colors"
              >
                <span>Wellhub Silver+</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-500" />
              </a>
            </div>
          </div>

          {/* Col 2: Endereço & Localização */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm tracking-wider uppercase text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-bronze" /> Localização
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {OFFICIAL_ADDRESS}
            </p>
            <p className="text-[11px] text-zinc-500 font-mono">
              Ponto de referência: Em frente à Cantina Giovanni e próximo ao McDonald&apos;s da Timóteo Penteado.
            </p>
            <div className="pt-1">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-bronze hover:text-bronze-light font-medium"
              >
                Rotas no Google Maps <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Col 3: Horários de Operação */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm tracking-wider uppercase text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-bronze" /> Horários
            </h4>
            <div className="space-y-2 text-xs text-zinc-400">
              <div>
                <span className="text-white font-medium block">Horário Geral do Clube:</span>
                <span className="font-mono text-zinc-400">Seg a Sex: 09h00 às 22h00</span>
                <span className="block font-mono text-zinc-400">Sábado: 08h00 às 13h00</span>
              </div>
              <div className="pt-1">
                <span className="text-white font-medium block">Janela Wellhub Silver+:</span>
                <span className="font-mono text-zinc-400">Seg a Qui: 07h00 às 20h00</span>
                <span className="block font-mono text-zinc-400">Sexta: 07h00 às 19h00</span>
                <span className="block font-mono text-zinc-400">Sábado: 08h00 às 11h00</span>
              </div>
              <span className="text-[11px] text-volt block font-mono">
                *Atendimento exclusivo com hora marcada.
              </span>
            </div>
          </div>

          {/* Col 4: Links Rápidos & Contato */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm tracking-wider uppercase text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-bronze" /> Contato Direto
            </h4>
            <p className="text-xs text-zinc-400">
              Agendamento de sessões e consultas de vagas por faixa horária:
            </p>
            <a
              href={generateWhatsAppLink({ customMessage: 'Olá! Vim pelo rodapé do site e gostaria de informações sobre agendamento.' })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-bronze/10 border border-white/10 hover:border-bronze text-white text-xs font-mono transition-all"
            >
              <span>{OFFICIAL_PHONE}</span>
              <ExternalLink className="w-3.5 h-3.5 text-bronze" />
            </a>

            <div className="pt-2 flex flex-col space-y-1.5 text-xs text-zinc-400">
              <Link href="/modalidades" className="hover:text-bronze transition-colors">
                • Todas as 6 Modalidades
              </Link>
              <Link href="/estrutura" className="hover:text-bronze transition-colors">
                • Tour pela Estrutura & Vestiários
              </Link>
              <Link href="/wellhub" className="hover:text-bronze transition-colors">
                • Guia do Aluno Wellhub Silver+
              </Link>
              <Link href="/agendar" className="hover:text-bronze transition-colors">
                • Squeeze Page de Agendamento
              </Link>
              <Link href="/privacidade" className="hover:text-bronze transition-colors">
                • Política de Privacidade (LGPD)
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & LGPD Badge */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mono">
          <div>
            © {currentYear} FORMCLUB — Centro de Treinamento e Performance. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Conformidade LGPD
            </span>
            <span>•</span>
            <Link href="/privacidade" className="hover:text-zinc-300 underline">
              Termos & Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
