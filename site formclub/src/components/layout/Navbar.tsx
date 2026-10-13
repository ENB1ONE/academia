'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Calendar, ArrowRight, Instagram } from 'lucide-react';
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
            ? 'bg-obsidian/85 backdrop-blur-md py-3.5 border-b border-white/10 shadow-lg shadow-black/30'
            : 'bg-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2 focus:outline-none"
            aria-label="FORMCLUB - Human Performance Center"
          >
            <div className="relative h-10 w-44 sm:h-12 sm:w-52">
              <img
                src="/formclub.com.br/images/formclub-logo.png"
                alt="FORMCLUB - Human Performance Center"
                className="w-full h-full object-contain filter brightness-105"
              />
            </div>
            <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase bg-white/5 border border-white/10 text-zinc-400">
              Vila Galvão
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-medium uppercase tracking-wider text-zinc-300 hover:text-bronze transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={OFFICIAL_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              aria-label="Instagram Oficial FORMCLUB @form.club"
            >
              <Instagram className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsModalOpen(true)}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-bronze hover:bg-bronze-light text-obsidian text-xs font-semibold tracking-wide transition-all shadow-md shadow-bronze/15 hover:shadow-bronze/30 hover:scale-[1.02] active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendar Experiência</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 rounded-full bg-bronze text-obsidian text-xs font-semibold"
            >
              Agendar
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 text-zinc-300 hover:text-white"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden glass-surface border-t border-white/10 mt-3 px-6 py-6 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-zinc-200 hover:text-bronze py-1"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-bronze text-obsidian font-semibold text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Agendar Sessão Experimental
                </button>

                <a
                  href={OFFICIAL_INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/5 text-zinc-300 text-xs"
                >
                  <Instagram className="w-4 h-4" />
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
