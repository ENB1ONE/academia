'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, CheckCircle2, Award, ArrowRight, Sparkles } from 'lucide-react';
import BookingModal from '@/components/ui/BookingModal';

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-[92vh] flex items-center justify-center pt-32 sm:pt-36 pb-16 sm:pb-20 overflow-hidden">
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop"
            alt="Ambiente FORMCLUB Centro de Treinamento e Performance"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-20 filter brightness-75 scale-105"
          />
          {/* Gradients with obsidian and official gold glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/75 to-obsidian" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(229,169,16,0.14),transparent_65%)]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/5 border border-gold/30 shadow-lg shadow-black/40 mb-6 backdrop-blur-md max-w-[95%] mx-auto">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.14em] sm:tracking-[0.18em] text-gold font-semibold truncate">
              CENTRO DE TREINAMENTO &amp; PERFORMANCE • VILA GALVÃO
            </span>
          </div>

          {/* H1 Principal */}
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white leading-[1.12] sm:leading-[1.08] mb-6">
            Onde a ciência da performance encontra a{' '}
            <span className="text-gradient-gold">exclusividade de um clube.</span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-3xl mx-auto text-sm sm:text-lg md:text-xl text-zinc-300 font-normal leading-relaxed mb-8 sm:mb-10 px-2">
            Esqueça as academias superlotadas. Na <strong className="text-white font-semibold">FORMCLUB</strong>, você treina com hora marcada, equipamentos de alta tecnologia e acompanhamento técnico próximo para transformar seu físico, sua performance e sua qualidade de vida.
          </p>

          {/* CTAs Duplos */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-12 sm:mb-16 w-full max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 sm:px-9 py-4 rounded-full bg-gold hover:bg-gold-light text-obsidian font-bold text-sm tracking-wide transition-all shadow-xl shadow-gold/25 hover:shadow-gold/40 hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-obsidian fill-obsidian" />
              <span>Agendar Sessão Experimental</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/#estrutura"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full glass-surface hover:bg-white/10 text-white font-semibold text-sm transition-all border border-white/10 hover:border-gold/40 active:scale-95"
            >
              Conhecer a Estrutura
            </Link>
          </div>

          {/* Trust Bar (Rodapé do Hero) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto pt-6 border-t border-white/10">
            <div className="glass-surface p-3 sm:p-3.5 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-gold mb-1">
                <Star className="w-3.5 h-3.5 fill-gold" />
                <span className="font-heading font-bold text-xs sm:text-sm text-white">5.0 no Google</span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 font-mono">72+ avaliações 5★</span>
            </div>

            <div className="glass-surface p-3 sm:p-3.5 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 text-gold mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-heading font-bold text-xs sm:text-sm text-white">Hora Marcada</span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 font-mono">100% vagas controladas</span>
            </div>

            <div className="glass-surface p-3 sm:p-3.5 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                <Award className="w-3.5 h-3.5" />
                <span className="font-heading font-bold text-xs sm:text-sm text-white">Wellhub Silver+</span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 font-mono">Parceiro Oficial</span>
            </div>

            <div className="glass-surface p-3 sm:p-3.5 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 text-zinc-200 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                <span className="font-heading font-bold text-xs sm:text-sm text-white">Vestiários &amp; Bar</span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 font-mono">Amenities &amp; Duchas</span>
            </div>
          </div>
        </div>
      </section>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
