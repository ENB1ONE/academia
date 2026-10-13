import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/image';
import { MODALITIES } from '@/lib/data';
import { Check, ArrowRight, Sparkles, Activity } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Modalidades de Performance | FORMCLUB Vila Galvão',
  description:
    'Conheça as 6 modalidades integradas da FORMCLUB: Musculação, Treino Híbrido, Condicionamento Funcional, Core, Mobilidade e Futebol de Velocidade em Guarulhos.',
};

export default function ModalidadesPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-obsidian">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-bronze/10 border border-bronze/20 text-bronze text-xs font-mono tracking-widest uppercase mb-4">
            <Activity className="w-3.5 h-3.5" />
            <span>Engenharia do Movimento</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            Os 6 Pilares de Performance da <span className="text-gradient-gold">FORMCLUB</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Nossa metodologia elimina a fragmentação do treino convencional. Cada sessão integra força, resistência, mobilidade e controle articular para resultados sustentáveis.
          </p>
        </div>

        {/* Detailed Modalities List */}
        <div className="space-y-16">
          {MODALITIES.map((mod, idx) => (
            <div
              key={mod.id}
              id={mod.slug}
              className={`glass-surface rounded-3xl p-6 sm:p-10 border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div className="lg:col-span-6 relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src={mod.image}
                  alt={mod.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-bronze text-obsidian uppercase">
                    Pilar 0{idx + 1}
                  </span>
                </div>
              </div>

              {/* Text Information */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-bronze mb-1 block">
                    {mod.categoryLabel}
                  </span>
                  <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-2">
                    {mod.title}
                  </h2>
                  <p className="text-xs sm:text-sm font-mono text-zinc-400 mb-4">
                    {mod.subtitle}
                  </p>
                  <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                    {mod.description}
                  </p>

                  <div className="space-y-2.5 mb-6">
                    {mod.features.map((item, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-200">
                        <Check className="w-4 h-4 text-bronze shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-charcoal border border-white/5 mb-8 text-xs text-zinc-400">
                    <strong className="text-white block mb-1 font-mono uppercase">Para quem é recomendado:</strong>
                    {mod.idealFor}
                  </div>
                </div>

                <div>
                  <a
                    href={`/agendar?objetivo=${encodeURIComponent(mod.title)}`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-bronze hover:bg-bronze-light text-obsidian text-xs font-bold transition-all shadow-lg shadow-bronze/10"
                  >
                    <span>Agendar Sessão de {mod.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
