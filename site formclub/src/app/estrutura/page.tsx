import { Metadata } from 'next';
import Image from 'next/image';
import { AMENITIES } from '@/lib/data';
import { Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Estrutura & Hospitalidade Boutique | FORMCLUB Guarulhos',
  description:
    'Conheça a infraestrutura de alto padrão da FORMCLUB na Vila Galvão: equipamentos biomecânicos de ponta, vestiários privativos com chuveiros aquecidos, lockers e mini bar.',
};

export default function EstruturaPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-obsidian">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-bronze/10 border border-bronze/20 text-bronze text-xs font-mono tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Infraestrutura de Alto Padrão</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            Estrutura &amp; Hospitalidade <span className="text-gradient-gold">Boutique</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Inspirada nos melhores centros de treinamento internacionais, a FORMCLUB oferece conforto integral para você treinar com máxima eficiência e transitar direto para seus compromissos profissionais.
          </p>
        </div>

        {/* Amenity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {AMENITIES.map((amenity) => (
            <div
              key={amenity.id}
              className="glass-card-hover rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={amenity.image}
                  alt={amenity.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase font-bold bg-white/10 backdrop-blur-md text-zinc-200 border border-white/10">
                    {amenity.badge}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-white mb-2">
                    {amenity.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {amenity.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-2 text-xs text-bronze font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Padrão verificado e mantido diariamente
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="glass-surface p-8 sm:p-12 rounded-3xl border border-bronze/20 text-center max-w-4xl mx-auto">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-bronze/10 text-bronze border border-bronze/20 mb-3 inline-block">
            Conheça Pessoalmente
          </span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-3">
            Agende uma visita guiada com nossos consultores
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto mb-8">
            Venha tomar um café em nosso mini bar, conhecer os vestiários e sentir a energia do clube na Av. Dr. Timóteo Penteado, 3738.
          </p>
          <a
            href="/agendar"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-bronze hover:bg-bronze-light text-obsidian font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-bronze/20"
          >
            <span>Agendar Minha Visita Guiada</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
