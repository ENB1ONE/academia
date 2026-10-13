'use client';

import { Star, CheckCircle, Quote, Sparkles } from 'lucide-react';
import { REVIEWS } from '@/lib/data';

export default function ReviewsCarousel() {
  return (
    <section className="py-24 relative overflow-hidden bg-obsidian-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-bronze/10 border border-bronze/20 text-bronze text-xs font-mono tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reconhecimento Real</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight mb-4">
            Avaliação máxima{' '}
            <span className="text-gradient-gold">5.0 estrelas</span> por quem treina conosco.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            A satisfação dos nossos alunos reflete nossa obsessão pelo atendimento técnico individualizado, pontualidade e infraestrutura de ponta.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
          <div className="glass-surface p-6 rounded-2xl text-center border border-white/10">
            <div className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-1 flex items-center justify-center gap-1">
              5.0 <Star className="w-6 h-6 fill-amber-400 text-amber-400 inline" />
            </div>
            <div className="text-xs text-zinc-400 font-mono">Nota no Google Maps</div>
          </div>

          <div className="glass-surface p-6 rounded-2xl text-center border border-white/10">
            <div className="font-heading font-extrabold text-3xl sm:text-4xl text-bronze mb-1">
              +72
            </div>
            <div className="text-xs text-zinc-400 font-mono">Avaliações 5 Estrelas</div>
          </div>

          <div className="glass-surface p-6 rounded-2xl text-center border border-white/10">
            <div className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-1">
              6
            </div>
            <div className="text-xs text-zinc-400 font-mono">Modalidades de Alta Performance</div>
          </div>

          <div className="glass-surface p-6 rounded-2xl text-center border border-white/10">
            <div className="font-heading font-extrabold text-3xl sm:text-4xl text-volt mb-1">
              100%
            </div>
            <div className="text-xs text-zinc-400 font-mono">Treino com Hora Marcada</div>
          </div>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="glass-card-hover p-6 sm:p-7 rounded-3xl border border-white/10 flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars & Source */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                    {rev.source}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic mb-6">
                  &ldquo;{rev.content}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-bronze/10 border border-bronze/30 flex items-center justify-center text-bronze font-bold text-xs">
                  {rev.author[0]}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    {rev.author}
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">{rev.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
