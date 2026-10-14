'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Calendar, ArrowRight, Instagram, MapPin } from 'lucide-react';
import BookingModal from '@/components/ui/BookingModal';
import { OFFICIAL_INSTAGRAM } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'O Conceito', href: '/#conceito' },
    { label: 'Modalidades', href: '/#modalidades' },
    { label: 'Estrutura & Amenities', href: '/#estrutura' },
    { label: 'Wellhub Silver+', href: '/#wellhub' },
    { label: 'Localização', href: '/#localizacao' },
    { label: 'FAQ', href: '/#faq' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-obsidian/90 backdrop-blur-xl py-3 border-b border-white/10 shadow-2xl shadow-black/60'
            : 'bg-obsidian/60 backdrop-blur-md py-4 sm:py-5 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center shrink-0 focus:outline-none"
            aria-label="FORMCLUB - Human Performance Center"
          >
            <div className="relative h-9 w-40 sm:h-10 sm:w-48 lg:h-11 lg:w-52">
              <img
                src="/formclub.com.br/images/formclub-logo.png"
                alt="FORMCLUB - Human Performance Center"
                className="w-full h-full object-contain filter brightness-110 drop-shadow-md"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-gold transition-colors py-1 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <a
              href={OFFICIAL_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-gold border border-white/5 hover:border-gold/30 transition-all"
              aria-label="Instagram Oficial FORMCLUB @form.club"
            >
              <Instagram className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsModalOpen(true)}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold hover:bg-gold-light text-obsidian text-xs font-bold tracking-wide transition-all shadow-lg shadow-gold/25 hover:shadow-gold/40 hover:scale-[1.02] active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendar Experiência</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-2 rounded-full bg-gold text-obsidian text-xs font-bold tracking-wide shadow-md shadow-gold/20"
            >
              Agendar
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-200 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-gold" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Full-Screen/Floating Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-obsidian/95 backdrop-blur-2xl border-t border-white/10 mt-3 px-6 py-8 shadow-2xl animate-in slide-in-from-top duration-300 max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[11px] font-mono uppercase tracking-widest text-gold font-bold">
                  Navegação do Clube
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  Vila Galvão, Guarulhos
                </span>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-zinc-100 hover:text-gold py-2 border-b border-white/5 flex items-center justify-between transition-colors"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-zinc-500" />
                </Link>
              ))}

              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-gold hover:bg-gold-light text-obsidian font-bold text-sm tracking-wide shadow-xl shadow-gold/30 transition-all active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  Agendar Sessão Experimental
                </button>

                <a
                  href={OFFICIAL_INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white/5 border border-white/10 hover:border-gold/30 text-zinc-200 hover:text-gold text-xs font-semibold transition-all"
                >
                  <Instagram className="w-4 h-4 text-gold" />
                  Seguir @form.club no Instagram
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Booking Modal */}
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
