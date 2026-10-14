import React, { useState } from 'react';
import { Droplets, Check, X } from 'lucide-react';
import Modal from '../ui/Modal';

// Armstrong Urine Color Chart (1 to 8)
export const URINE_COLORS = [
  { level: 1, label: 'Ótima', desc: 'Perfeitamente hidratado', hex: '#FEF9C3', textColor: 'text-gray-900', bgBorder: 'border-yellow-200' },
  { level: 2, label: 'Boa', desc: 'Hidratação normal e adequada', hex: '#FEF08A', textColor: 'text-gray-900', bgBorder: 'border-yellow-300' },
  { level: 3, label: 'Aceitável', desc: 'Leve necessidade de água', hex: '#FDE047', textColor: 'text-gray-900', bgBorder: 'border-yellow-400' },
  { level: 4, label: 'Desidratação Leve', desc: 'Beber 250-500ml de água', hex: '#FACC15', textColor: 'text-gray-900', bgBorder: 'border-yellow-500' },
  { level: 5, label: 'Desidratação Moderada', desc: 'Beber 500-750ml com eletrólitos', hex: '#EAB308', textColor: 'text-gray-900', bgBorder: 'border-yellow-600' },
  { level: 6, label: 'Desidratação Acentuada', desc: 'Ingerir líquidos imediatamente', hex: '#CA8A04', textColor: 'text-white', bgBorder: 'border-yellow-700' },
  { level: 7, label: 'Desidratação Severa', desc: 'Atenção médica/recovery', hex: '#A16207', textColor: 'text-white', bgBorder: 'border-yellow-800' },
  { level: 8, label: 'Desidratação Crítica', desc: 'Risco grave à saúde', hex: '#713F12', textColor: 'text-white', bgBorder: 'border-amber-950' },
];

const UrineHydrationModal = ({ isOpen, onClose, selectedLevel, onSelect }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Escala de Hidratação (Cor da Urina)">
      <div className="space-y-3">
        <p className="text-xs text-gray-400">
          Compare a coloração da sua primeira urina matinal com a escala abaixo (Armstrong et al.):
        </p>
        
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {URINE_COLORS.map((item) => {
            const isSelected = selectedLevel === item.level;
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => {
                  onSelect(item.level);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl flex items-center justify-between transition-all border ${
                  isSelected ? 'ring-2 ring-primary border-primary scale-[1.01]' : 'border-gray-800 hover:border-gray-700'
                }`}
                style={{ backgroundColor: `${item.hex}18` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg shadow-inner flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ backgroundColor: item.hex, color: item.level >= 6 ? '#ffffff' : '#1f2937' }}
                  >
                    {item.level}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-text">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="bg-primary text-white p-1 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UrineHydrationModal;
