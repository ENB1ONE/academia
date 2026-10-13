import Image from 'next/image';
import { AMENITIES } from '@/lib/data';
import { Sparkles, Dumbbell, Zap, Coffee, ShowerHead, ShieldCheck, MapPin } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Dumbbell,
  Zap,
  Coffee,
  ShowerHead,
  ShieldCheck,
  MapPin,
};

export default function AmenitiesBento() {
  return (
    <section id="estrutura" className="py-24 relative overflow-hidden bg-obsidian-900 border-t border-white/5">
      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-bronze/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-bronze/10 border border-bronze/20 text-bronze text-xs font-mono tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hospitalidade &amp; Conforto</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight mb-4">
            Cada detalhe pensado para o seu{' '}
            <span className="text-gradient-gold">pré e pós-treino.</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Inspirada na hospitalidade dos clubes de alto luxo, a FORMCLUB oferece uma infraestrutura completa para você treinar com foco e seguir seu dia com praticidade impecável.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AMENITIES.map((amenity) => {
            const Icon = iconMap[amenity.iconName] || Sparkles;
            const isWide = amenity.span?.includes('col-span-2');

            return (
              <div
                key={amenity.id}
                className={`group relative rounded-3xl overflow-hidden glass-card-hover border border-white/10 ${
                  amenity.span || 'col-span-1'
                } min-h-[300px] flex flex-col justify-end p-6 sm:p-8`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={amenity.image}
                    alt={amenity.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-[0.4] group-hover:brightness-[0.45]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-bronze/20 backdrop-blur-md border border-bronze/30 text-bronze-light">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase font-semibold bg-white/10 text-zinc-200 border border-white/10">
                      {amenity.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mb-2 group-hover:text-bronze transition-colors">
                    {amenity.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
                    {amenity.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
