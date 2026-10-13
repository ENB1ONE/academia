'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import BookingWizard from '@/components/sections/BookingWizard';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGoal?: string;
  initialAccessType?: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  initialGoal,
  initialAccessType,
}: BookingModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl glass-surface p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl z-10 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          aria-label="Fechar modal de agendamento"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-bronze/10 text-bronze border border-bronze/20">
            Atendimento com Hora Marcada
          </span>
        </div>

        <BookingWizard
          isModal={true}
          initialGoal={initialGoal}
          initialAccessType={initialAccessType}
          onSuccess={onClose}
        />
      </div>
    </div>
  );
}
