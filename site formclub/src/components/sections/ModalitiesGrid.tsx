'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MODALITIES } from '@/lib/data';
import { Modality } from '@/lib/types';
import { ArrowRight, Check, Activity, Dumbbell, Zap, Sparkles } from 'lucide-react';
import BookingModal from '@/components/ui/BookingModal';

export default function ModalitiesGrid() {
  const [activeTab, setActiveTab] = useState<'all' | 'strength' | 'performance' | 'mobility'>('all');
  const [selectedModalityForModal, setSelectedModalityForModal] = useState<Modality | null>(null);

  const tabs = [
    { id: 'all', label: 'Todos os Pilares' },
    { id: 'strength', label: 'Força & Hipertrofia' },
    { id: 'performance', label: 'Performance & Endurance' },
    { id: 'mobility', label: 'Mobilidade & Core' },
  ];

  const filteredModalities = activeTab === 'all'
    ? MODALITIES
    : MODALITIES.filter((m) => m.category === activeTab);

  return (
    <>
      <section id="modalidades" className="py-24 relative overflow-hidden bg-obsidian border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-bronze/10 border border-bronze/20 text-bronze text-xs font-mono tracking-widest uppercase mb-4">
              <Activity className="w-3.5 h-3.5" />
              <span>Treinamento Integrado</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight mb-4">
              Seis pilares de movimento para construir sua{' '}
              <span className="text-gradient-gold">melhor forma.</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Cada modalidade foi desenhada para se complementar com precisão biomecânica. Escolha seu foco e treine com supervisão dedicada.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-bronze text-obsidian shadow-lg shadow-bronze/20 scale-105'
                      : 'glass-surface text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Modalities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredModalities.map((modality) => (
              <div
                key={modality.id}
                className="group glass-card-hover rounded-3xl overflow-hidden flex flex-col border border-white/10 hover:border-bronze/40"
              >
                {/* Image Container with Badges */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={modality.image}
                    alt={modality.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {modality.badge && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase font-bold bg-bronze text-obsidian shadow-md">
                        {modality.badge}
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-black/60 backdrop-blur-md text-zinc-300 border border-white/10">
                      {modality.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-white group-hover:text-bronze transition-colors mb-1.5">
                      {modality.title}
                    </h3>
                    <p className="text-xs font-mono text-zinc-400 mb-4">
                      {modality.subtitle}
                    </p>
                    <p className="text-xs text-zinc-300 leading-relaxed mb-6">
                      {modality.description}
                    </p>

                    {/* Features list */}
                    <div className="space-y-2 mb-6 pt-4 border-t border-white/5">
                      {modality.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-bronze shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Ideal for */}
                    <div className="p-3 rounded-xl bg-white/5 text-[11px] text-zinc-400 mb-6 border border-white/5">
                      <strong className="text-zinc-200 block mb-0.5 font-mono uppercase tracking-wider">
                        Ideal para:
                      </strong>
                      {modality.idealFor}
                    </div>
                  </div>

                  {/* Card CTA */}
                  <button
                    onClick={() => setSelectedModalityForModal(modality)}
                    className="w-full flex items-center justify-between px-5 py-3 rounded-2xl bg-white/5 group-hover:bg-bronze text-zinc-200 group-hover:text-obsidian font-semibold text-xs transition-all duration-300"
                  >
                    <span>Agendar esta modalidade</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal with preselected modality */}
      <BookingModal
        isOpen={!!selectedModalityForModal}
        onClose={() => setSelectedModalityForModal(null)}
        initialGoal={selectedModalityForModal?.title}
      />
    </>
  );
}
